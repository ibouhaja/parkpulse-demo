<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- ParkPulse uses TanStack file routes with a shared shell and demo provider; keep parking data and local persistence in the feature module to share state consistently across views.
- Per-user parking state lives in Lovable Cloud as one JSON row per user; clients may only read it, and every change goes through authenticated server functions that re-apply the pure session rules with server time and a version check, so users cannot edit their own loyalty data.
- Old browser localStorage data is never written or deleted; it can be imported once into an untouched account.
- Account-only pages live under the _authenticated layout; auth errors are mapped to German text in one helper.
- Session state transitions are pure functions; the provider applies them optimistically, then the server result replaces local state, preserving pending checkout and upgrading older local records.

- Checkout records the completed session and receipt atomically with loyalty and benefit consumption; migration initializes new loyalty fields once without changing frozen legacy sessions.
- Fictional parking occupancy is a browser-safe feature provider shared across detail/session views, separate from account state; plan selections reuse authenticated location saves and never reserve spots or alter saved positions during simulation.
- Overlay the current account session position as occupied on every demo plan read, including checkout-pending sessions; occupancy simulation never changes session data and reload rebuilds the overlay from the authoritative account session.
- Vehicle suitability and user-selected needs are pure parking-plan predicates reused for filtering, selection and save guards; unknown occupancy is separate from occupied state and never selectable, while category/property data remains fictional and does not change account schemas.
- Charging is an independent spot capability that can coexist with family, women and accessibility categories; explicit wallbox filtering matches the capability regardless of vehicle preset while all dimension and weight guards remain enforced.
- The lazy client-only R3F parking viewer draws the existing provider state; shared selection and save guards stay in ParkingPlanView, and vehicle preview/animation never mutate occupancy or account data. Scene placement and animation math live in pure parking-3d-rules; licensed GLB vehicle geometry is dequantized, normalized, merged by material and instanced from asset pointers, tinting only paint to preserve glazing, tires and lamps. Trace licenses and quality limitations in model CREDITS. The wrapper signals data-scene-ready after assets draw.
- GarageArchitecture owns the reusable cutaway building surfaces and fixtures; camera targets are pure rules, and the demand-rendered camera interpolates until settled, respecting reduced motion and yielding immediately to manual controls.
- Map discovery reuses parking-plan suitability and provider occupancy; facility availability is calculated from actual matching free demo spots, never static facility counters.
- Demo reservations use owner-readable Cloud rows, service-only mutations and a unique held-position index; booking, arrival, reconciliation and cancellation share the database lock. The canonical lifecycle maps to legacy status for compatibility; terminal fee/status snapshots are trigger-immutable. Cancellation uses owner-scoped expiring persisted quotes and replay-safe explicit quote confirmation, while no-show reconciliation runs on account reads, booking inserts and one five-minute scheduled database job to release capacity without a browser. Neither flow mutates loyalty or account sessions.
- Tariff math lives in the browser-safe tariffs module in integer cents, with Berlin hourly evening boundaries and rolling 24-hour caps; sessions and reservations snapshot tariffs and missing snapshots retain legacy rates to preserve existing costs.
- Redeemable points use a separate balance and append-only ledger in account JSON; server-validated replay-safe transitions atomically award or redeem points alongside receipts and future-use vouchers, preserving existing stamps and historical non-redeemable bonuses.
- Owner-scoped profile JSON stores normalized vehicle preferences, initialized via the existing signup trigger; the shared store tags profile/state responses with account identity and resets guest filters to prevent cross-account races. Motorhome preferences reuse van suitability with independent dimensions, without adding a 3D vehicle model.
- The shell opens a read-only rewards dialog from the existing account state; it summarizes the ledger and voucher statuses without creating benefits or parking-hour conversions.
- AI threads are owner-readable Cloud JSON UIMessage records with dedicated file-route IDs; service-only transcript updates use versioned durable run locks. Gateway-native Responses events are adapted to AI Elements with full stored history; server tools reuse pure suitability/tariff/points rules and atomic reservation RPCs. Booking and cancellation authorization require their respective matching persisted offer or quote IDs from separate explicit confirmation clicks, never model-inferred consent; their UUIDs are replay keys.
- Smartphone presentation overrides live under max-width:720px and page-scoped shell classes; the mobile-only five-item nav and shared DemoInfo dialog preserve desktop navigation and avoid a permanent demo banner. Installability is manifest + icons with a beforeinstallprompt/iOS-hint button; no service worker, to keep previews free of stale caches.
- n8n integration: a DB trigger (plus demo_reschedule) writes reservation events to an outbox table; server code delivers them with HMAC-signed, retried webhooks (cron each minute + time-boxed kick after mutations) so reservations never depend on n8n. n8n reads status and writes demo reminders only through key-protected /api/public/n8n routes that return no personal data.
- UI copy is bilingual (de default, en): wrap UI text in useI18n().t(germanLiteral) with a dictionary entry in features/parkpulse/i18n.tsx; label maps have *En exports.
