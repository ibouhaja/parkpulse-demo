import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { initialState, type DemoState } from './data';
import { restoreState, STORAGE_KEY, transition, type Action } from './session';
import { applyAccountAction, declineLocalImport, getAccountState, importLocalState, arriveBooking } from './account.functions';
import { ParkingPlanProvider } from './parking-plan-provider';
import { ReservationsProvider } from './reservations-provider';

type Discount = 'none' | 'SHOP2' | 'voucher';
type Store = {
  state: DemoState; ready: boolean; authReady: boolean; signedIn: boolean; email: string; displayName: string;
  start: (id: string) => boolean; end: () => boolean;
  complete: (sessionId: string, payment: 'success' | 'failure' | 'free', method?: import('./data').PayMethod) => boolean;
  applyDiscount: (discount: Discount, voucherId?: string) => boolean; advance: (hours: 1 | 3) => void;
  saveLocation: (level: string, bay: string) => boolean; error: string;
  redeem: (points:number)=>boolean;
  arrive: (id:string)=>Promise<void>;
  importOffer: boolean; importLocal: () => Promise<void>; declineImport: () => Promise<void>; refreshProfile: () => Promise<void>;
};
const Context = createContext<Store | null>(null);

function readLocal(): string | null {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return null; restoreState(raw); return raw; } catch { return null; }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [state, setState] = useState(initialState);
  const current = useRef(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [importOffer, setImportOffer] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const pending = useRef(0);
  const fetchState = useServerFn(getAccountState);
  const applyAction = useServerFn(applyAccountAction);
  const importFn = useServerFn(importLocalState);
  const declineFn = useServerFn(declineLocalImport);
  const arriveFn=useServerFn(arriveBooking);

  const put = (s: DemoState) => { current.current = s; setState(s); };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setUser(u ? { id: u.id, email: u.email ?? '' } : null);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED') return;
      const u = session?.user;
      setUser((prev) => (prev?.id === u?.id ? prev : u ? { id: u.id, email: u.email ?? '' } : null));
      router.invalidate();
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle();
    setDisplayName(data?.display_name ?? '');
  }, [user]);

  const reload = useCallback(async () => {
    const r = await fetchState();
    put(r.state as DemoState);
    setImportOffer(r.canImport && readLocal() !== null);
  }, [fetchState]);

  useEffect(() => {
    if (!authReady) return;
    if (!user) { put(initialState); setImportOffer(false); setDisplayName(''); setReady(true); return; }
    let cancelled = false;
    setReady(false);
    reload().then(() => { if (!cancelled) { setReady(true); setError(''); } })
      .catch(() => { if (!cancelled) setError('Deine Parkdaten konnten nicht geladen werden. Bitte lade die Seite neu.'); });
    void refreshProfile();
    return () => { cancelled = true; };
  }, [authReady, user, reload, refreshProfile]);

  // Optimistic local transition for instant UI; the server re-applies the same rules and is authoritative.
  const commit = (action: Action) => {
    if (!user || !ready) return false;
    const next = transition(current.current, action);
    if (next === current.current) return false;
    put(next);
    pending.current++;
    queue.current = queue.current.then(async () => {
      try {
        const r = await applyAction({ data: { action } });
        if (pending.current === 1) put(r.state as DemoState);
        setError('');
      } catch {
        setError('Speichern fehlgeschlagen. Der zuletzt gespeicherte Stand wurde wiederhergestellt.');
        await reload().catch(() => undefined);
      } finally { pending.current--; }
    });
    return true;
  };

  const store: Store = {
    state, ready, authReady, signedIn: !!user, email: user?.email ?? '', displayName, error, importOffer, refreshProfile,
    redeem:(points)=>commit({type:'redeem',points,id:crypto.randomUUID(),now:Date.now()}),
    start: (facilityId) => commit({ type: 'start', facilityId, id: crypto.randomUUID(), now: Date.now() }),
    end: () => commit({ type: 'end', now: Date.now() }),
    complete: (sessionId, payment, method = 'card') => commit({ type: 'complete', sessionId, payment, method, now: Date.now() }),
    applyDiscount: (discount, voucherId) => commit({ type: 'discount', discount, voucherId }),
    advance: (hours) => { commit({ type: 'advance', hours, now: Date.now() }); },
    saveLocation: (level, bay) => commit({ type: 'location', level, bay, sessionId: current.current.session?.id }),
    arrive:async(id)=>{await queue.current;const r=await arriveFn({data:{id}});put(r.state as DemoState);},
    importLocal: async () => {
      const raw = readLocal();
      if (!raw) { setImportOffer(false); return; }
      try { const r = await importFn({ data: { raw } }); put(r.state as DemoState); setImportOffer(false); setError(''); }
      catch (e) { setError(e instanceof Error ? e.message : 'Übernahme fehlgeschlagen.'); }
    },
    declineImport: async () => { await declineFn(); setImportOffer(false); },
  };
  return <Context.Provider value={store}><ReservationsProvider signedIn={!!user} userId={user?.id??null}><ParkingPlanProvider session={state.session}>{children}</ParkingPlanProvider></ReservationsProvider></Context.Provider>;
}

export function useDemo() { const ctx = useContext(Context); if (!ctx) throw new Error('ParkPulse-Demo ist nicht verfügbar'); return ctx; }
