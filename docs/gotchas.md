# Gotchas — what already cost us hours

Fixed format: **observable symptom → root cause → rule → the mechanism that now fails**. Written when
the cost is paid (`/lesson <incident>`). The `Mecanismo:` line is mandatory and the harness self-test
enforces the four lines; with no executable mechanism, write "ninguno ejecutable: <why>".

---

### GOTCHA: the landing shipped inside every self-host tarball

Síntoma: a studio-only install served `/es/landing`, its demo form and the pitch decks; the marketing
         copy, screenshots and OG images travelled in a release that is only the product (2026-10-05).
Causa:   the landing lived in doctiling-web `src/components/organisms/landing` + four `page.tsx`, so
         `next build` could not leave it out and `proxy.ts` sent `/` there.
Regla:   the landing is this package; the host mounts it only in the SaaS edition (`page.saas.tsx` via
         `pageExtensions`) and never reaches into it from product code.
Mecanismo: doctiling-web `scripts/self-host/assert-studio-build.mjs` (fails the release when a landing
         route or copy is in `.next`) and `tests/edition.test.ts`.
