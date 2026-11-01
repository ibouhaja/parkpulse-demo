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
- Demo persistence uses browser localStorage after hydration only; no server, authentication, payment or external data integrations are needed.
