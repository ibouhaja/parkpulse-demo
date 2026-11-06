import { DemoInfo } from './demo-info';
import { RewardsPopup } from './rewards-popup';
import { InstallAppButton } from './install-app';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, Search, CircleParking, Gift, History, ArrowUpRight, Leaf, LogOut, LogIn, Menu, X, CalendarDays, Map, MessageSquare, Bell, UserRound } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useDemo } from './store';
import { LanguageSwitch, useI18n } from './i18n';

const mobileNav = [{to:'/',label:'Karte',icon:Map},{to:'/suche',label:'Suche',icon:Search},{to:'/reservierungen',label:'Buchungen',icon:CalendarDays},{to:'/assistent',label:'AI Agent',icon:MessageSquare},{to:'/profil',label:'Profil',icon:UserRound}] as const;
const nav = [{to:'/',label:'Parkplatzkarte',icon:Map},{to:'/suche',label:'Parkplatz finden',icon:Search},{to:'/assistent',label:'AI Agent',icon:MessageSquare},{to:'/reservierungen',label:'Reservierungen',icon:CalendarDays},{to:'/parksession',label:'Meine Parksession',icon:CircleParking},{to:'/praemien',label:'Stempelkarte',icon:Gift},{to:'/verlauf',label:'Parkverlauf',icon:History},{to:'/benachrichtigungen',label:'Benachrichtigungen',icon:Bell}] as const;

export function ParkShell({children}:{children:ReactNode}){
 const path=useRouterState({select:s=>s.location.pathname});const [menu,setMenu]=useState(false);
 const {state,error,signedIn,authReady,displayName,email,importOffer,importLocal,declineImport,flush}=useDemo();
 const {t}=useI18n();
 const navigate=useNavigate();const qc=useQueryClient();
 const signOut=async()=>{await flush();await qc.cancelQueries();qc.clear();await supabase.auth.signOut();navigate({to:'/auth',replace:true});};
 const name=displayName||email.split('@')[0]||t('Konto');
 const breadcrumb=nav.find(n=>n.to===path)?.label || ({'/checkout':'Demo-Abschluss','/auth':'Anmelden','/profil':'Mein Profil','/reset-password':'Neues Passwort'} as Record<string,string>)[path] || 'Parkplatzdetails';
 return <div className={`app-shell ${path==='/'?'is-map-page':''} ${path.startsWith('/assistent')?'is-agent-page':''}`}>
 <aside className={`sidebar ${menu?'is-open':''}`}><Link to="/" className="brand" onClick={()=>setMenu(false)}><span className="brand-symbol">P<span/></span>ParkPulse<span className="brand-dot">.</span></Link><div className="sidebar-caption">{t('DEIN PARKEN. IM FLOW.')}</div><Button className="mobile-close" variant="nav" size="icon" aria-label={t('Menü schließen')} onClick={()=>setMenu(false)}><X/></Button><nav aria-label={t('Hauptnavigation')}>{nav.map(n=><Button key={n.to} asChild variant={path===n.to || (n.to==='/parksession'&&path==='/checkout') || (n.to==='/suche'&&path.startsWith('/parkplatz'))?'navActive':'nav'}><Link to={n.to} onClick={()=>setMenu(false)}><n.icon/>{t(n.label)}{n.to==='/parksession'&&state.session&&<span className="nav-live"/>}</Link></Button>)}</nav><div className="sidebar-bottom"><div className="eco-icon"><Leaf size={23}/></div><strong>{t('Kleiner Weg. Großer Unterschied.')}</strong><p>{t('Entspannter parken. Bewusster unterwegs sein.')}</p><Button asChild variant="nav"><Link to="/praemien">{t('Deine Stempelkarte ansehen')} <ArrowUpRight/></Link></Button><div className="sidebar-footer"><span className="status-dot"/> ParkPulse Demo <span>v1.0</span></div></div></aside>
 {menu&&<div className="menu-backdrop" onClick={()=>setMenu(false)}/>}<nav className="mobile-bottom-nav" aria-label={t('Mobile Navigation')}>{mobileNav.map(n=><Button asChild variant="ghost" key={n.to}><Link to={n.to} className={path===n.to || (n.to==='/assistent'&&path.startsWith('/assistent/'))?'is-current':''}><n.icon/>{t(n.label)}</Link></Button>)}</nav>
 <div className="app-main"><header className="topbar"><div className="topbar-left"><Link to="/" className="mobile-brand">ParkPulse<span>.</span></Link><Button variant="ghost" size="icon" className="mobile-menu" aria-label={t('Menü öffnen')} onClick={()=>setMenu(true)}><Menu/></Button><span className="topbar-breadcrumb">{t('Mein ParkPulse')} <span>/</span> <strong>{t(breadcrumb)}</strong></span></div><div className="topbar-profile"><LanguageSwitch/><InstallAppButton/><DemoInfo/>{!authReady?null:signedIn?<><RewardsPopup onSignOut={signOut}/><Button variant="ghost" size="sm" onClick={signOut} aria-label={t('Abmelden')}><LogOut/>{t('Abmelden')}</Button></>:<Button asChild size="sm"><Link to="/auth"><LogIn/>{t('Anmelden')}</Link></Button>}</div></header>{error&&<div role="alert" className="storage-error">{t(error)}</div>}{importOffer&&<div role="region" aria-label={t('Lokale Demo-Daten übernehmen')} className="storage-error"><strong>{t('Lokale Demo-Daten gefunden.')}</strong> {t('In diesem Browser gibt es eine frühere Demo (Parksession, Verlauf, Stempel). Möchtest du sie einmalig in dein Konto übernehmen? Die lokale Kopie bleibt unverändert erhalten.')} <Button size="sm" onClick={()=>void importLocal()}>{t('Übernehmen')}</Button> <Button size="sm" variant="outline" onClick={()=>void declineImport()}>{t('Nicht übernehmen')}</Button></div>}<main className="page-content">{children}</main><footer className="main-footer"><span>© 2026 ParkPulse</span><span>{t('Weniger suchen. Mehr ankommen.')}</span><span>{t('Alle Daten sind fiktiv.')}</span></footer></div></div>;
}
