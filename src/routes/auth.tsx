import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ArrowRight, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { useDemo } from '@/features/parkpulse/store';
import { PageHeading, pageHead } from '@/features/parkpulse/shared';

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
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
        if (error) throw new Error(error.message.includes('confirm') ? 'Bitte bestätige zuerst deine E-Mail-Adresse.' : 'E-Mail oder Passwort ist falsch.');
        navigate({ to: target });
      } else if (mode === 'signup') {
        if (password.length < 8) throw new Error('Das Passwort muss mindestens 8 Zeichen lang sein.');
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim().slice(0, 60) } } });
        if (error) throw new Error(error.message.toLowerCase().includes('registered') ? 'Diese E-Mail-Adresse ist bereits registriert.' : 'Registrierung fehlgeschlagen. Bitte prüfe deine Eingaben.');
        setMessage('Fast geschafft: Bitte bestätige deine E-Mail-Adresse über den Link in deinem Postfach. Danach kannst du dich anmelden.');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw new Error('Die E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut.');
        setMessage('Falls ein Konto existiert, haben wir dir einen Link zum Zurücksetzen gesendet.');
      }
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen.');
    } finally { setBusy(false); }
  };

  const google = async () => {
    setFailure('');
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
    if (result.error) { setFailure('Die Anmeldung mit Google ist fehlgeschlagen.'); return; }
    if (result.redirected) return;
    navigate({ to: target });
  };

  if (signedIn) return <><PageHeading title="Du bist angemeldet." subtitle={`Angemeldet als ${currentEmail}.`} eyebrow="KONTO"/><div className="session-page"><div className="active-panel"><Button asChild><Link to={target}>Weiter<ArrowRight/></Link></Button><Button asChild variant="outline"><Link to="/profil">Zum Profil</Link></Button></div></div></>;

  return <><PageHeading title={mode === 'signup' ? 'Konto erstellen.' : mode === 'forgot' ? 'Passwort vergessen?' : 'Willkommen zurück.'} subtitle="Deine Demo-Parksessions, Stempel und Gutscheine werden in deinem persönlichen Konto gespeichert." eyebrow="PARKPULSE-KONTO"/>
    <div className="session-page"><div className="active-panel text-left">
      <div className="grid grid-cols-3 gap-2 mb-5" role="tablist">
        {([['login', 'Anmelden'], ['signup', 'Registrieren'], ['forgot', 'Passwort vergessen']] as const).map(([m, l]) => <Button key={m} role="tab" aria-selected={mode === m} variant={mode === m ? 'default' : 'outline'} size="sm" onClick={() => { setMode(m); setMessage(''); setFailure(''); }}>{l}</Button>)}
      </div>
      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && <label className="block text-xs">Anzeigename<input className={input} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="z. B. Alex"/></label>}
        <label className="block text-xs">E-Mail-Adresse<input className={input} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}/></label>
        {mode !== 'forgot' && <label className="block text-xs">Passwort<input className={input} type="password" required minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)}/></label>}
        <Button type="submit" disabled={busy} className="w-full">{mode === 'login' ? <><LogIn/>Anmelden</> : mode === 'signup' ? 'Konto erstellen' : <><Mail/>Link senden</>}</Button>
      </form>
      {mode !== 'forgot' && <><div className="my-4 text-center text-xs text-muted-foreground">oder</div><Button variant="outline" className="w-full" onClick={google}>Weiter mit Google</Button></>}
      {message && <p role="status" className="mt-4 text-sm text-primary">{message}</p>}
      {failure && <p role="alert" className="mt-4 text-sm text-destructive">{failure}</p>}
      <div className="safe-note"><ShieldCheck size={13}/>Nur Demo-Parkdaten · keine echten Zahlungsdaten</div>
    </div></div></>;
}
