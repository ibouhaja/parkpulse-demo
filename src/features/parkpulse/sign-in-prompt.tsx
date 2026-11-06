import { useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from './i18n';

/** Friendly sign-in dialog for guests who tap an account-only action. */
export function SignInPrompt({ trigger, redirect }: { trigger: ReactNode; redirect: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return <>
    <span onClick={() => setOpen(true)} className="contents">{trigger}</span>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{t('Dafür brauchst du ein Konto')}</DialogTitle>
        <DialogDescription>{t('Reservierungen, Parksessions, Stempel und Gutscheine werden in deinem persönlichen Demo-Konto gespeichert. Die Anmeldung ist kostenlos und bleibt komplett simuliert.')}</DialogDescription>
        <div className="grid gap-3 mt-4">
          <Button asChild><Link to="/auth" search={{ redirect }}><LogIn />{t('Jetzt anmelden')}</Link></Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>{t('Weiter als Gast')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
