type AuthErr = { code?: string | undefined; message?: string; status?: number | undefined } | null | undefined;

/** Maps auth service errors to clear German messages. Never includes the password. */
export function authErrorText(error: AuthErr, fallback = 'Etwas ist schiefgelaufen. Bitte versuche es erneut.', lang: 'de' | 'en' = 'de') {
  const en = lang === 'en';
  if (!error) return fallback;
  const code = error.code ?? '';
  const msg = (error.message ?? '').toLowerCase();
  if (code === 'weak_password' || msg.includes('weak') || msg.includes('pwned'))
    return en ? 'This password is too weak or appears in known data leaks. Please choose a different, unique password (at least 8 characters).' : 'Dieses Passwort ist zu unsicher oder taucht in bekannten Datenlecks auf. Bitte wähle ein anderes, einzigartiges Passwort (mindestens 8 Zeichen).';
  if (code === 'user_already_exists' || code === 'email_exists' || msg.includes('already registered'))
    return en ? 'This email address is already registered. Sign in or reset your password.' : 'Diese E-Mail-Adresse ist bereits registriert. Melde dich an oder setze dein Passwort zurück.';
  if (code === 'email_address_invalid' || msg.includes('not allowed') || msg.includes('invalid email'))
    return en ? 'This email address cannot be used. Please enter a real, reachable address.' : 'Diese E-Mail-Adresse kann nicht verwendet werden. Bitte gib eine echte, erreichbare Adresse ein.';
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || error.status === 429)
    return en ? 'Too many attempts in a short time. Please wait a few minutes and try again.' : 'Zu viele Versuche in kurzer Zeit. Bitte warte einige Minuten und versuche es dann erneut.';
  if (code === 'email_not_confirmed' || msg.includes('not confirmed'))
    return en ? 'Please confirm your email address first via the link in your inbox.' : 'Bitte bestätige zuerst deine E-Mail-Adresse über den Link in deinem Postfach.';
  if (code === 'invalid_credentials' || msg.includes('invalid login'))
    return en ? 'Email or password is incorrect.' : 'E-Mail oder Passwort ist falsch.';
  if (code === 'same_password') return en ? 'The new password must differ from the previous one.' : 'Das neue Passwort muss sich vom bisherigen unterscheiden.';
  if (code === 'signup_disabled') return en ? 'Registrations are currently disabled.' : 'Registrierungen sind derzeit deaktiviert.';
  return fallback;
}
