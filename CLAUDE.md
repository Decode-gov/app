# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DECODE-GOV — data governance management system. Next.js 15 (App Router) + TypeScript + TailwindCSS 4 + shadcn/ui ("new-york" style), TanStack Query + TanStack Table, React Hook Form + Zod, Axios. UI and domain terms are in Portuguese.

## Commands

```bash
npm run dev              # next dev --turbopack
npm run build            # next build --turbopack
npm run start            # production server
npm run lint             # biome lint ./src
npm run format           # biome format --write ./src
npm run check            # biome check --write ./src (lint + format + organize imports)
npm run generate:api     # orval --config ./orval.config.ts (regenerate API client from OpenAPI spec)
npm run generate:api:watch
```

There is no test runner configured in this repo. Biome (not ESLint/Prettier) is the linter/formatter of record — always run `npm run check` before considering a change done.

`generate:api` fetches the OpenAPI spec from `ORVAL_INPUT` (env var) or `http://127.0.0.1:3333/json` by default — the backend API must be running locally to regenerate the client.

## Architecture

### API layer is fully generated — do not hand-write it

`src/api/generated/` is produced by Orval (`orval.config.ts`) from the backend's OpenAPI spec and must never be hand-edited:
- `src/api/generated/endpoints/<tag>/` — react-query hooks (`useGetX`, `usePostX`, `usePutXId`, `useDeleteXId`, `useDeleteXId`, plus `getGetXQueryKey` helpers), one folder per API tag, `tags-split` mode.
- `src/api/generated/model/` — Zod schemas and inferred types for request/response bodies (e.g. `PostEmpresasBody`, `PutEmpresasIdBody`, `GetEmpresas200`).
- `src/api/generated/zod/` — standalone Zod validators per endpoint.
- `src/lib/api-mutator.ts` (`customInstance`) is the Orval mutator; it delegates to the shared Axios instance in `src/lib/api.ts`.

There used to be a `src/hooks/api/` wrapper layer and a `src/services/` manual-service layer — both were deleted in favor of using the generated hooks directly in pages/components. Do not recreate either.

Endpoint folder/tag names mirror the OpenAPI tags **with Portuguese accents preserved** (e.g. `@/api/generated/endpoints/políticas-internas/políticas-internas`, `.../papéis/papéis`, `.../usuários/usuários`) — copy names exactly, don't ASCII-fold them. `orval/transform-spec.cjs` normalizes/aliases raw spec tags and sanitizes malformed union schemas before generation.

Non-obvious Orval naming quirks (verify against `src/api/generated/model` if a hook/type seems missing):
- `criticidade-regulatoria` tag → generated functions/types use `CriticidadesRegulatorias` (plural).
- `regulacao` tag → generated functions/types use `RegulacoesCompletas`.
- `tabelas` and `empresas` list hooks take no query params (spec doesn't declare any) even though other list hooks do.

### Forms: always validate with generated Zod schemas

Use the Zod schema exported from `@/api/generated/model` (e.g. `PostComitesAprovadoresBody`) as the `zodResolver` schema — do not write new schemas in `src/schemas/index.ts` for anything the generated client already covers; that file is a last resort for cases with no generated equivalent. Standard form shape (see `src/components/*/[-form].tsx`): shadcn `Dialog` + `Form`, `useForm` with `zodResolver`, separate `usePostX`/`usePutXId` mutations chosen by whether an entity prop is passed, `form.reset()` in a `useEffect` keyed on `open`/entity, manual `queryClient.invalidateQueries({ queryKey: [getGetXQueryKey] })` after mutate, `sonner` toast on error.

### Page/module structure

Each domain module (papeis, comites, empresas, kpis, dominios, ...) follows the same triplet:
- `src/app/(private)/<modulo>/page.tsx` — client component: fetches list via generated hook, renders stat `Card`s, a data table, and the create/edit dialog form; owns `formOpen`/`selectedX` state and the delete handler (`confirm()` + `useDeleteXId().mutateAsync`).
- `src/components/<modulo>/columns.tsx` + `<modulo>-data-table.tsx` — TanStack Table setup for that module.
- `src/components/<modulo>/<entity>-form.tsx` — the dialog form described above.

`src/types/api.ts` re-exports convenience row types (e.g. `PapelResponse = GetPapeis200["data"][number]`) — prefer these over indexing generated response types inline when adding a new module.

### Multi-tenant / admin "empresa" scoping

Admin users can act on behalf of a company (`empresa`) they don't own:
- `src/context/empresa-admin-context.tsx` (`EmpresaAdminProvider`, wraps the whole `(private)` layout) determines `isAdmin` from `useGetUsuariosPerfil()` and reads/writes the selected empresa as the `empresaId` URL search param.
- It pushes the selection into `src/lib/empresa-store.ts`, a module-level variable (**not React state**) read by an Axios request interceptor in `src/lib/api.ts`, which injects `empresaId` into every outgoing request (`params` for GET/DELETE/HEAD, `data` otherwise). This is how empresa scoping reaches Orval-generated calls without threading a prop through every hook.
- `src/hooks/use-empresa-id-param.ts` is the read-side helper pages use to pass `empresaId` into list-query params.

### Auth

`src/middleware.ts` gates all non-`/login` routes on an `authToken` cookie (redirects to `/login` if absent, redirects away from `/login` if present). `src/lib/auth.ts` is currently a stub (cookie-clearing logic commented out).

### Route groups

- `src/app/(private)/` — authenticated app shell (`layout.tsx`: sidebar + breadcrumb header + `EmpresaAdminProvider` + `Toaster`), one folder per domain module.
- `src/app/(public)/login/` — login page, outside the app shell.

### Git worktrees

`.claude/worktrees/<name>/` contains full checked-out worktrees for in-flight feature branches (each has its own `package.json`, `.git`, etc.) — these are separate working trees, not project source; don't edit files under there unless the task explicitly targets that worktree.
