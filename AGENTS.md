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
