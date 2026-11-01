import { createContext,useContext,useEffect,useState,type ReactNode } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useQuery } from '@tanstack/react-query';
import { getHeldPositions,getReservations } from './reservations.functions';
import type { HeldPosition,Reservation } from './reservation-rules';

const Context=createContext<{held:HeldPosition[];reservations:Reservation[];refresh:()=>Promise<void>;available:boolean}>({held:[],reservations:[],refresh:async()=>{},available:false});
export function ReservationsProvider({signedIn,children}:{signedIn:boolean;children:ReactNode}){
 const [hydrated,setHydrated]=useState(false);useEffect(()=>setHydrated(true),[]);
 const fetchHeld=useServerFn(getHeldPositions);const fetchMine=useServerFn(getReservations);
 const held=useQuery({queryKey:['demo-held'],queryFn:()=>fetchHeld(),enabled:hydrated,refetchInterval:15000});
 const mine=useQuery({queryKey:['demo-reservations'],queryFn:()=>fetchMine(),enabled:hydrated&&signedIn,refetchInterval:15000});
 return <Context.Provider value={{held:held.data??[],reservations:signedIn?(mine.data??[]) as Reservation[]:[],available:held.isSuccess,refresh:async()=>{await Promise.all([held.refetch(),...(signedIn?[mine.refetch()]:[])]);}}}>{children}</Context.Provider>;
}
export const useReservations=()=>useContext(Context);