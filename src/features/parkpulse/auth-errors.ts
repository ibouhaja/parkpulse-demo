type AuthErr = { code?: string | undefined; message?: string; status?: number | undefined } | null | undefined;

/** Maps auth service errors to clear German messages. Never includes the password. */
export function authErrorText(error: AuthErr, fallback = 'Etwas ist schiefgelaufen. Bitte versuche es erneut.') {
  if (!error) return fallback;
  const code = error.code ?? '';
  const msg = (error.message ?? '').toLowerCase();
  if (code === 'weak_password' || msg.includes('weak') || msg.includes('pwned'))
    return 'Dieses Passwort ist zu unsicher oder taucht in bekannten Datenlecks auf. Bitte wähle ein anderes, einzigartiges Passwort (mindestens 8 Zeichen).';
  if (code === 'user_already_exists' || code === 'email_exists' || msg.includes('already registered'))
    return 'Diese E-Mail-Adresse ist bereits registriert. Melde dich an oder setze dein Passwort zurück.';
  if (code === 'email_address_invalid' || msg.includes('not allowed') || msg.includes('invalid email'))
    return 'Diese E-Mail-Adresse kann nicht verwendet werden. Bitte gib eine echte, erreichbare Adresse ein.';
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || error.status === 429)
    return 'Zu viele Versuche in kurzer Zeit. Bitte warte einige Minuten und versuche es dann erneut.';
  if (code === 'email_not_confirmed' || msg.includes('not confirmed'))
    return 'Bitte bestätige zuerst deine E-Mail-Adresse über den Link in deinem Postfach.';
  if (code === 'invalid_credentials' || msg.includes('invalid login'))
    return 'E-Mail oder Passwort ist falsch.';
  if (code === 'same_password') return 'Das neue Passwort muss sich vom bisherigen unterscheiden.';
  if (code === 'signup_disabled') return 'Registrierungen sind derzeit deaktiviert.';
  return fallback;
}
