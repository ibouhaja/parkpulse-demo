import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useI18n } from './i18n';

export function DemoInfo() {
  const { t } = useI18n();
  return <Dialog><DialogTrigger asChild><Button variant="ghost" size="sm" className="demo-info-entry" aria-label={t('Demo-Information')}><Info size={16}/>Demo</Button></DialogTrigger>
    <DialogContent><DialogTitle>{t('Über diese Demo')}</DialogTitle><DialogDescription>{t('Demo – fiktive Parkdaten, keine Live-Verfügbarkeit, keine echte Zahlung.')}</DialogDescription>
      <p>{t('ParkPulse ist ein MBA-Prototyp. Parkplatzbelegung, Reservierungen, Gebühren, Zahlungen und Erinnerungen sind simuliert. Es werden keine realen Stellplätze gebucht und keine Zahlungen ausgeführt.')}</p>
      <p>{t('Der KI-Assistent verwendet die gespeicherten Demo-Reservierungen deines Kontos. Die n8n-Anbindung dient ausschließlich der Demonstration.')}</p>
    </DialogContent></Dialog>;
}
