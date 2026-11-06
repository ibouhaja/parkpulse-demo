import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { authErrorText } from '@/features/parkpulse/auth-errors';
import { PageHeading, pageHead } from '@/features/parkpulse/shared';
import { useI18n } from '@/features/parkpulse/i18n';

export const Route = createFileRoute('/reset-password')({
  head: () => pageHead('Neues Passwort', 'Lege ein neues Passwort für dein ParkPulse-Konto fest.'),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) setRecovery(true);
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') setRecovery(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setMessage(t('Das Passwort muss mindestens 8 Zeichen lang sein.')); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setMessage(authErrorText(error, t('Das Passwort konnte nicht geändert werden. Fordere bitte einen neuen Link an.'), lang)); return; }
    navigate({ to: '/parksession' });
  };
  return <><PageHeading title="Neues Passwort festlegen." subtitle="Wähle ein Passwort mit mindestens 8 Zeichen." eyebrow="KONTO"/>
    <div className="session-page"><div className="active-panel text-left">{!recovery ? <><p>{t('Dieser Link ist ungültig oder abgelaufen.')}</p><Button asChild className="mt-4"><Link to="/auth">{t('Neuen Link anfordern')}</Link></Button></> :
      <form onSubmit={submit} className="space-y-4"><label className="block text-xs">{t('Neues Passwort')}<input className="mt-2 w-full rounded-md border border-input bg-background p-3" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}/></label><Button type="submit" disabled={busy} className="w-full">{t('Passwort speichern')}</Button></form>}
      {message && <p role="alert" className="mt-4 text-sm text-destructive">{message}</p>}</div></div></>;
}
