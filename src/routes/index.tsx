import { createFileRoute } from '@tanstack/react-router';
import { MapHome } from '@/features/parkpulse/map-home';
import { pageHead } from '@/features/parkpulse/shared';
export const Route=createFileRoute('/')({head:()=>pageHead('Parkplatzkarte & Demo-Reservierung','ParkPulse: fiktive Parkplätze auf der Karte vergleichen, passende Stellplätze filtern und Demo-Reservierungen verwalten.'),component:MapHome});
