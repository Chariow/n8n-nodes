# CLAUDE.md

Guidance for Claude Code and other AI agents working in this repository.

## Project overview

This repo is an n8n community node package (`@chariow/n8n-nodes-chariow`) that integrates Chariow — a digital-products platform for creators — into n8n workflows. It ships two nodes: a regular action node (`Chariow`) and a trigger/webhook node (`ChariowTrigger`). The built package is published to npm and installed by n8n users via the community nodes mechanism.

## Tech stack

- TypeScript 5.9, targeting ES2019 / CommonJS
- Node.js >=18.10, pnpm >=9.1 (packageManager: pnpm@9.1.4)
- n8n-workflow ^2.8.0 (peer dependency; types only at build time)
- @n8n/node-cli ^0.31.0 — provides `n8n-node` build/lint/dev/release commands
- ESLint 9 (via n8n-node lint wrapper) + Prettier 3.8 for formatting
- Chariow REST API v1 (`https://api.chariow.com/v1`), cursor-based pagination

## Getting started

```bash
pnpm install
pnpm build
```

To test locally with n8n:
```bash
pnpm test:local   # builds then starts n8n with the node loaded at http://localhost:5678
```

## Common commands

| Task | Command |
|---|---|
| Build | `pnpm build` |
| Build (watch) | `pnpm build:watch` |
| Dev (n8n + node) | `pnpm dev` |
| Lint | `pnpm lint` |
| Lint + fix | `pnpm lint:fix` |
| Format | `pnpm format` |
| Format check | `pnpm format:check` |
| Type check | `pnpm typecheck` |
| Local integration test | `pnpm test:local` |
| Release | `pnpm release` |

## Architecture

The package has two top-level source directories:

- `credentials/` — `ChariowApi.credentials.ts`: defines the `chariowApi` credential type. API key is sent as a Bearer token with `X-Platform-Source: n8n`. Credential validity is tested against `GET /store`.
- `nodes/Chariow/` — contains the two node entry points and shared helpers:
  - `Chariow.node.ts` — action node; dispatches to per-resource handler modules.
  - `ChariowTrigger.node.ts` — webhook trigger node; registers/deregisters n8n connections via `POST /connections/n8n` on the Chariow API.
  - `shared/` — `transport.ts` (authenticated HTTP helpers with cursor-based pagination), `constants.ts` (base URL + endpoint map), `utils.ts`, `descriptions.ts`.
  - `resources/` — one sub-directory per resource: `customer`, `product`, `sale`, `discount`, `licence`, `checkout`, `store`, `affiliate`, `pulse`. Each contains individual operation files (`get.ts`, `getAll.ts`, etc.) and an `index.ts` barrel.
- `icons/chariow.svg` — node icon referenced by both credential and node manifests.
- `dist/` — compiled output (CommonJS); this directory is what npm publishes.

CI (`ci.yml`) runs `build`, `lint`, `format:check`, and `typecheck` on Node 20 and 22. Publishing is handled by a separate `publish.yml` workflow.

## Conventions

- All source is strict TypeScript; `noImplicitAny`, `strictNullChecks`, and `noUnusedLocals` are enforced.
- Prettier config: single quotes, semicolons, trailing commas, tab indentation, print width 100.
- Each resource lives in its own directory under `resources/`; operations are individual files re-exported via `index.ts`.
- API responses are wrapped in `{ message, data, errors }` — always unwrap `response.data` before returning to n8n.
- No test framework is present; testing is done by running the node live in n8n via `pnpm test:local`.
- `n8n.strict: true` is set in `package.json`, meaning the node must pass n8n's strict validation checks on build.

## Git Conventions

### 1. Branch names

Enforced regex (`branch_name_pattern`):
```
^(feature|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/[a-z0-9._-]+$
```

- Lowercase only, kebab-case after the prefix, **max 50 characters** total.
- Use the full word `feature/` — **never** `feat/` (the short `feat` form is only for commit message types).
- Include the ticket id when relevant: `feature/AXA-123-add-stripe` (the ticket id is lowercased to satisfy the pattern — e.g. `feature/axa-123-add-stripe`).
- **Never** use a `claude/` prefix or any prefix outside the allowed set.
- `main`, `release`, `staging` are permanent protected branches — never push to them directly.
- If a branch is misnamed, rename it before pushing: `git branch -m <old> <new>`.

### 2. Commit messages
Enforced regex (`commit_message_pattern`), applied to **every** commit:
```
^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?: .+
```
- Lowercase type, optional scope in parens, optional `!` for breaking changes, subject after `: `.
- Subject starts with a lowercase letter and has no trailing period.
- Examples: `feat(checkout): add Apple Pay support`, `fix(api): handle expired tokens`, `chore(deps): bump axios from 1.7.2 to 1.15.2`, `refactor!: drop Node 18 support`.
- Do not rewrite Dependabot commits — `chore(deps): bump X from a to b` is already enforced via `.github/dependabot.yml`.

### 3. Files that are always rejected
Never stage or commit:
- `.env`, `.env.*` (only `.env.example` and `.env.sample` are allowed), `**/.env`, `**/.env.*`
- Private keys: `**/id_rsa{,.pub}`, `**/id_dsa`, `**/id_ecdsa`, `**/id_ed25519`, `**/.ssh/id_*`
- Credentials: `**/.aws/credentials`, `**/credentials.json`, `**/service-account.json`, `**/firebase-adminsdk-*.json`, `**/secrets.{yml,yaml}`
- Extensions: `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks`, `*.keystore`, `*.ppk`, `*.asc`, `*.gpg`
- Any file larger than 100 MB (use git LFS)
If a secret is needed, use `.env.example` for env vars and an external secret manager for credentials.

### Pull requests targeting `main`, `release`, `staging`
All three are protected — a PR is required (direct push blocked):
- 1 approval, all conversations resolved, **squash or rebase merge only** (linear history enforced — no merge commits).
- Commits must be GPG- or SSH-signed. Signing is required for `main` (`required-signatures-main` ruleset).
- The PR **title** becomes the squash commit message and must match the commit-message regex above (enforced on all three branches).

**Required workflows run on PRs whose base is `main` only** (not `release`/`staging`): `Branch naming convention`, `PR title — Conventional Commits`, and `PR size labeler`.
If a check shows `Waiting for workflow to run` for over a minute, the third-party action is likely missing from the enterprise allowlist.

When the branch-naming or PR-title check fails, the baseline bot auto-posts rename/title suggestions, following the enforced regex patterns.
If the bot's suggestions are incorrect, edit the PR title or branch name to match the required format.

### Pre-push checklist
Before running `git push`:
1. Branch name matches the regex.
2. Every commit in `origin/main..HEAD` matches the commit pattern (`git log --format=%s origin/main..HEAD`).
3. No staged file is in the blocked paths/extensions list.
4. Commits are signed if the target is `main`.

If any check fails, fix it locally rather than letting the server reject the push.
