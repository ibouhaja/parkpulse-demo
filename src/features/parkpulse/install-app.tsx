import { useEffect, useState } from 'react';
import { Download, Share, SquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Home-screen installation: native prompt on Android/Chrome, step-by-step hint on iPhone. No offline caching. */
export function InstallAppButton() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(true);
  const [help, setHelp] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallPrompt); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); window.removeEventListener('appinstalled', onInstalled); };
  }, []);
  if (installed || (!prompt && !ios)) return null;
  const install = async () => {
    if (!prompt) { setHelp(true); return; }
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setPrompt(null);
  };
  return <>
    <Button variant="outline" size="sm" className="install-app" onClick={() => void install()} aria-label="ParkPulse als App installieren"><Download />App installieren</Button>
    <Dialog open={help} onOpenChange={setHelp}>
      <DialogContent className="install-help">
        <DialogTitle>ParkPulse auf dem iPhone installieren</DialogTitle>
        <DialogDescription>So legst du ParkPulse als App auf deinen Home-Bildschirm:</DialogDescription>
        <ol>
          <li><Share size={18} /> Tippe in Safari unten auf <strong>Teilen</strong>.</li>
          <li><SquarePlus size={18} /> Wähle <strong>Zum Home-Bildschirm</strong>.</li>
          <li>Bestätige mit <strong>Hinzufügen</strong>.</li>
        </ol>
        <Button size="lg" onClick={() => setHelp(false)}>Verstanden</Button>
      </DialogContent>
    </Dialog>
  </>;
}
