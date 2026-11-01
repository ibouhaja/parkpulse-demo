import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { facilities } from '@/features/parkpulse/data';
import { useDemo } from '@/features/parkpulse/store';
import { PageHeading, pageHead } from '@/features/parkpulse/shared';

export const Route = createFileRoute('/_authenticated/profil')({
  head: () => pageHead('Mein Profil', 'Anzeigename, fiktives Kennzeichen und bevorzugtes Parkhaus in deinem ParkPulse-Konto.'),
  component: Profile,
});

const input = 'mt-2 w-full rounded-md border border-input bg-background p-3';

function Profile() {
  const { email, refreshProfile } = useDemo();
  const [form, setForm] = useState({ display_name: '', license_plate: '', preferred_facility: '' });
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    supabase.from('profiles').select('display_name,license_plate,preferred_facility').maybeSingle().then(({ data }) => {
      if (data) setForm(data);
      setLoaded(true);
    });
  }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const patch = { display_name: form.display_name.trim().slice(0, 60), license_plate: form.license_plate.trim().toUpperCase().slice(0, 15), preferred_facility: facilities.some((f) => f.id === form.preferred_facility) ? form.preferred_facility : '' };
    const { error } = await supabase.from('profiles').update(patch).eq('id', u.user.id);
    setMessage(error ? 'Profil konnte nicht gespeichert werden.' : 'Profil gespeichert.');
    if (!error) void refreshProfile();
  };
  return <><PageHeading title="Dein Profil." subtitle="Nur du kannst diese Angaben sehen und bearbeiten. Bitte nur fiktive Kennzeichen eingeben." eyebrow="MEIN KONTO"/>
    <div className="session-page"><div className="active-panel text-left">{!loaded ? <p>Profil wird geladen …</p> :
      <form onSubmit={submit} className="space-y-4">
        <div className="booking-line"><span>E-Mail</span><strong>{email}</strong></div>
        <label className="block text-xs">Anzeigename<input className={input} maxLength={60} value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })}/></label>
        <label className="block text-xs">Kennzeichen (fiktiv)<input className={input} maxLength={15} placeholder="z. B. DS-PP 2026" value={form.license_plate} onChange={(e) => setForm({ ...form, license_plate: e.target.value })}/></label>
        <label className="block text-xs">Bevorzugtes Parkhaus<select className={input} value={form.preferred_facility} onChange={(e) => setForm({ ...form, preferred_facility: e.target.value })}><option value="">Keine Auswahl</option>{facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
        <Button type="submit"><Save/>Profil speichern</Button>
        {message && <p role="status" className="text-sm text-primary">{message}</p>}
      </form>}</div></div></>;
}
