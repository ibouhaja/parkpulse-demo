import { PreferencesForm } from '@/features/parkpulse/preferences-form';
import { defaultPreferences, normalizePreferences } from '@/features/parkpulse/preferences';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ArrowRight, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { authErrorText } from '@/features/parkpulse/auth-errors';
import { useDemo } from '@/features/parkpulse/store';
import { PageHeading, pageHead } from '@/features/parkpulse/shared';
import { useI18n } from '@/features/parkpulse/i18n';

export function safeRedirect(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/auth') ? value : '/parksession';
}

export const Route = createFileRoute('/auth')({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => (typeof s['redirect'] === 'string' ? { redirect: s['redirect'] } : {}),
  head: () => pageHead('Anmelden', 'Bei ParkPulse anmelden oder registrieren, um Demo-Parksessions, Stempel und Gutscheine im eigenen Konto zu speichern.'),
  component: AuthPage,
});

type Mode = 'login' | 'signup' | 'forgot';
const input = 'mt-2 w-full rounded-md border border-input bg-background p-3';

function AuthPage() {
  const { redirect } = Route.useSearch();
  const target = safeRedirect(redirect);
  const navigate = useNavigate();
  const { signedIn, email: currentEmail } = useDemo();
  const { t, lang } = useI18n();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [preferences,setPreferences]=useState(defaultPreferences);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failure, setFailure] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setMessage(''); setFailure('');
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(authErrorText(error, t('Anmeldung fehlgeschlagen. Bitte versuche es erneut.'), lang));
        navigate({ to: target });
      } else if (mode === 'signup') {
        if (password.length < 8) throw new Error(t('Das Passwort muss mindestens 8 Zeichen lang sein.'));
        const { data: signed, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim().slice(0, 60),parking_preferences:normalizePreferences(preferences) } } });
        if (error) throw new Error(authErrorText(error, t('Registrierung fehlgeschlagen. Bitte versuche es später erneut.'), lang));
        if (signed.user && (signed.user.identities?.length ?? 0) === 0) throw new Error(authErrorText({ code: 'user_already_exists' }, undefined, lang));
        setMessage(t('Fast geschafft: Bitte bestätige deine E-Mail-Adresse über den Link in deinem Postfach. Danach kannst du dich anmelden.'));
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw new Error(authErrorText(error, t('Die E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut.'), lang));
        setMessage(t('Falls ein Konto existiert, haben wir dir einen Link zum Zurücksetzen gesendet.'));
      }
    } catch (err) {
      setFailure(err instanceof Error ? err.message : t('Etwas ist schiefgelaufen.'));
    } finally { setBusy(false); }
  };

  const social = async (provider:'google'|'apple') => {
    setFailure('');
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) { setFailure(t(provider==='google'?'Die Anmeldung mit Google ist fehlgeschlagen.':'Die Anmeldung mit Apple ist fehlgeschlagen.')); return; }
    if (result.redirected) return;
    navigate({ to: target });
  };

  if (signedIn) return <><PageHeading title="Du bist angemeldet." subtitle={`${t('Angemeldet als ')}${currentEmail}.`} eyebrow="KONTO"/><div className="session-page"><div className="active-panel"><Button asChild><Link to={target}>{t('Weiter')}<ArrowRight/></Link></Button><Button asChild variant="outline"><Link to="/profil">{t('Zum Profil')}</Link></Button></div></div></>;

  return <><PageHeading title={mode === 'signup' ? 'Konto erstellen.' : mode === 'forgot' ? 'Passwort vergessen?' : 'Willkommen zurück.'} subtitle="Deine Demo-Parksessions, Stempel und Gutscheine werden in deinem persönlichen Konto gespeichert." eyebrow="PARKPULSE-KONTO"/>
    <div className="session-page"><div className="active-panel text-left">
      <div className="grid grid-cols-3 gap-2 mb-5" role="tablist">
        {([['login', 'Anmelden'], ['signup', 'Registrieren'], ['forgot', 'Passwort vergessen']] as const).map(([m, l]) => <Button key={m} role="tab" aria-selected={mode === m} variant={mode === m ? 'default' : 'outline'} size="sm" onClick={() => { setMode(m); setMessage(''); setFailure(''); }}>{t(l)}</Button>)}
      </div>
      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && <p className="text-xs text-muted-foreground">{t('Passwort: mindestens 8 Zeichen, einzigartig. Bekannte oder geleakte Passwörter werden aus Sicherheitsgründen abgelehnt.')}</p>}
        {mode === 'signup' && <label className="block text-xs">{t('Anzeigename')}<input className={input} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder={t('z. B. Alex')}/></label>}
        <label className="block text-xs">{t('E-Mail-Adresse')}<input className={input} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}/></label>
        {mode !== 'forgot' && <label className="block text-xs">{t('Passwort')}<input className={input} type="password" required minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)}/></label>}
        {mode==='signup'&&<PreferencesForm value={preferences} onChange={setPreferences}/>}
        <Button type="submit" disabled={busy} className="w-full">{mode === 'login' ? <><LogIn/>{t('Anmelden')}</> : mode === 'signup' ? t('Konto erstellen') : <><Mail/>{t('Link senden')}</>}</Button>
      </form>
      {mode !== 'forgot' && <><div className="my-4 text-center text-xs text-muted-foreground">{t('oder')}</div><Button variant="outline" className="w-full" onClick={()=>void social('google')}>{t('Weiter mit Google')}</Button><Button variant="outline" className="w-full mt-3" onClick={()=>void social('apple')}>{t('Weiter mit Apple')}</Button></>}
      {message && <p role="status" className="mt-4 text-sm text-primary">{message}</p>}
      {failure && <p role="alert" className="mt-4 text-sm text-destructive">{failure}</p>}
      <Button asChild variant="ghost" className="w-full mt-4"><Link to="/">{t('Als Gast fortfahren')}<ArrowRight/></Link></Button>
      <div className="safe-note"><ShieldCheck size={13}/>{t('Nur Demo-Parkdaten · keine echten Zahlungsdaten')}</div>
    </div></div></>;
}
