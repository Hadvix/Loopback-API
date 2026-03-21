# Repository Guidelines

## Project Structure & Module Organization

This repository is a minimal Node.js/Express loopback utility for API prototyping. Its purpose is to let you send JSON from Postman or a similar client and receive it back unchanged, so validation logic and client-side endpoint behavior can be tested before the real endpoint exists.

- `loopback.js`: main application entrypoint and the temporary loopback endpoints.
- `package.json`: runtime dependency and npm scripts.
- `package-lock.json`: locked dependency versions.
- `node_modules/`: installed packages; do not edit or commit manual changes here.

If the utility grows, keep route handlers small and move reusable logic into focused modules such as `routes/`, `services/`, and `tests/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm start`: run the API with `node loopback.js`.

There is no build step yet. The app currently listens on `127.0.0.1:3000`.

Example local check:

```bash
npm start
curl http://127.0.0.1:3000/
curl -X POST http://127.0.0.1:3000/loopback -H "Content-Type: application/json" -d "{\"name\":\"Bilbo\"}"
```

Use `POST /loopback` as the main test endpoint when checking request/response contracts in Postman.

## Coding Style & Naming Conventions

Use plain JavaScript for backend code and keep logic explicit.

- Use 2-space indentation and semicolons.
- Prefer `const`; use `let` only when reassignment is needed.
- Use single quotes.
- Use descriptive uppercase names for top-level constants such as `HOST` and `PORT`.
- Use clear route names such as `'/loopback'`; avoid abbreviations in exported identifiers.

Keep files ASCII where practical. If non-ASCII text is needed, save files as UTF-8 without BOM.

## Testing Guidelines

No automated tests are configured yet. This repository is currently used mainly for manual API contract checks in Postman. For any behavior change that becomes stable, add a small automated test setup before expanding the API further. Prefer Node’s built-in test runner unless the project adopts another framework.

Name future test files `*.test.js` and place them in `tests/` or next to the module they cover. Until tests exist, verify changes manually with `curl`, Postman, or a similar HTTP client, especially for echo/validation scenarios on `POST /loopback`.

## Commit & Pull Request Guidelines

Recent commits are short and task-focused, for example `fix: naming to loopback` and `FIX - variable name`. Keep that pattern, but prefer a consistent imperative style such as:

- `fix: correct route response`
- `feat: add POST validation`

Pull requests should include:

- a short description of the behavior change
- sample request/response for API changes, especially Postman payload examples
- linked issue or task if one exists
- notes on manual testing performed
