# Upgrade Plan: Modernizing Remaining Dependencies

This document outlines the detailed steps required to update the remaining legacy packages (`mocha`, `chai`, and `jsdom`) to their absolute latest versions. These upgrades require significant architectural shifts, specifically migrating the project to **ECMAScript Modules (ESM)** and rewriting the JSDOM network mocking layer.

## Phase 1: Preparation & Configuration (Migrating to ESM) — Compact

Make an initial, non-invasive switch to ESM semantics required by latest test tooling.

- [x] Update `package.json`: add `"type": "module"` (done)
- [ ] Update `tsconfig.json`:
  - Set `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`.
- [ ] Update `.mocharc.yaml` test loader:
  - Replace `ts-node/register` with `loader: ts-node/esm` (or add `node-options: ["--loader=ts-node/esm"]`).

Notes: this phase is intentionally compact — it prepares Node/TS to resolve ESM imports. The codebase refactor (Phase 2) still follows and is more invasive.

## Phase 2: Refactoring Code for ESM
ESM has stricter rules for file paths and global variables compared to CommonJS.

- [ ] **Update Import Extensions in `src/` and `test/`**
  - All relative imports must include the `.js` extension, even inside TypeScript files.
  - Example: `import { Component } from './component';` must become `import { Component } from './component.js';`
  - Example: `import { noop } from '../../src/index';` must become `import { noop } from '../../src/index.js';`
- [ ] **Refactor Build Scripts (`.build/*.js`)**
  - Convert `.build/clean.js` and `.build/minify.js` to use `import`/`export` instead of `require()`.
  - If `__dirname` or `__filename` are used, replace them with:
    ```javascript
    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    ```

## Phase 3: Package Updates
Once the ESM infrastructure is in place, the packages can be safely upgraded.

- [ ] **Upgrade Test Framework**
  - Run: `npm install mocha@latest @types/mocha@latest chai@latest @types/chai@latest --save-dev`
- [ ] **Upgrade JSDOM**
  - Run: `npm install jsdom@latest @types/jsdom@latest undici --save-dev`

## Phase 4: Rewriting JSDOM Network Mocks
JSDOM v23+ removed the `ResourceLoader` class in favor of the newer `undici` HTTP client.

- [ ] **Refactor `test/core/children/crossWindow/childComponent.spec.ts`**
  - Remove the `CustomResourceLoader` class.
  - Import `MockAgent` and `setGlobalDispatcher` from `undici`.
  - Set up a mock agent to intercept requests previously handled by `CustomResourceLoader`:
    ```typescript
    import { MockAgent, setGlobalDispatcher } from 'undici';

    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);

    const mockPool = mockAgent.get('http://localhost:8080');

    // Mock successful requests
    mockPool.intercept({ path: '/' }).reply(200, '');
    
    // Mock error requests
    mockPool.intercept({ path: '/iframe-error.html' }).replyWithError(new Error('Some network error'));
    ```
  - Pass the agent or rely on the global dispatcher when initializing `new JSDOM()`. Note that `undici` is now baked into how JSDOM handles `runScripts: 'dangerously'`.

## Phase 5: Verification & Release
- [ ] **Run Linter**
  - Run `npm run lint` and fix any new rules or path resolution issues.
- [ ] **Run Build**
  - Run `npm run build` to ensure the TypeScript compiler successfully outputs the ESM bundles.
- [ ] **Run Tests**
  - Run `npm test` and verify all 212 tests continue to pass in the new environment.
- [ ] **SemVer Major Bump**
  - Because moving from CommonJS to ESM is a breaking change for anyone consuming the `@validide/u-front-ends` package, the `version` in `package.json` MUST be bumped to the next major version (e.g., `1.0.0`).
