# Server + Studio Rebuild Plan (Playwright Removal + React PDF + Scalable Product Architecture)

Date: 2026-05-09
Scope: apps/server and apps/studio only
Goal: remove Playwright-driven backend export complexity, move PDF generation to React PDF workflow, and establish a scalable architecture for resume, cover letter, portfolio, and link-in-bio.

## 1. Executive Outcome

This plan replaces the current server-side render/export pipeline (Playwright + queue + artifact storage) with a simpler architecture focused on:

1. Client-side document rendering/generation with React PDF.
2. JSON-first data model aligned with JSON Resume standard and extensible custom sections.
3. Clear domain boundaries for multiple product types.
4. Safe, efficient CRUD + sync with conflict protection.
5. Production-grade validation, migration, security, observability, and tests.

## 2. Current-State Findings (From Scan)

### 2.1 Backend (apps/server)

Playwright export stack is deeply integrated and backend-heavy:

1. Dependency and docs:

- apps/server/package.json includes playwright.
- apps/server/README.md documents Playwright-based rendering.

2. Runtime integration:

- apps/server/src/index.ts mounts export routes and starts export worker on boot.
- Shutdown path closes Playwright browser and artifact store.

3. Export flow:

- apps/server/src/routes/exports.ts exposes private/public job and direct export endpoints.
- apps/server/src/controllers/exportController.ts handles queue, status polling, artifact download, direct export cache.
- apps/server/src/services/exportService.ts launches Chromium, renders HTML/PDF/PNG/JPG.
- apps/server/src/services/exportQueueService.ts uses BullMQ + Redis queue for export jobs.
- apps/server/src/services/exportArtifactStore.ts stores artifacts locally or OCI (S3-compatible).
- apps/server/src/jobs/verifyLocalExportStorage.ts verifies artifact storage lifecycle.

4. Share route coupling:

- apps/server/src/routes/share.ts also exposes export job endpoints for public share token exports.

5. Data model notes:

- Resume content is JSON in Resume.content.
- Sync metadata duplicated across Resume and ResumeCloudSync.
- MasterProfile content is also JSON.

### 2.2 Studio (apps/studio)

Studio currently relies on server export pipeline for PDF/PNG/JPG and local generators for others:

1. Editor download behavior:

- apps/studio/app/(main)/editor/components/Toolbar.tsx calls exportResumeViaServer for pdf/png/jpg.
- apps/studio/app/(main)/editor/components/toolbar/ToolbarDownloadMenu.tsx lists pdf/png/jpg/docx/md/html/txt/json.

2. Export service coupling:

- apps/studio/features/resume/services/share-links.ts -> exportResumeViaServer calls /exports endpoints.
- apps/studio/features/resume/services/public-share.ts -> downloadPublicShareExport calls /share-links/:token/export/jobs endpoints.
- apps/studio/features/resume/utils/build-export-html.ts prepares cloned HTML payload for backend renderer.

3. Data model:

- Strong internal resume schema in apps/studio/types/resume.ts and apps/studio/features/resume/schemas/resume-storage-schema.ts.
- Good normalization and local-first persistence path exists.

4. Documentation/API references include export endpoints:

- apps/studio/public/llms.txt
- apps/studio/public/openapi.json

## 3. Problems To Solve

1. Export complexity is too high for the value delivered.
2. Backend exports introduce queueing, infra, caching, and artifact lifecycle overhead.
3. Data contracts are split between resume schema, master profile schema, and partial duplication.
4. Product scope is growing (resume + cover letter + portfolio + link-in-bio), but architecture is resume-centric.
5. Sync model is functional but not ideal for multi-document growth and versioning.

## 4. North-Star Architecture

### 4.1 Product Model

Define one unified Document Domain for all content types:

1. documentType enum:

- resume
- cover_letter
- portfolio
- link_in_bio

2. document object shape:

- id
- userId
- type
- title
- schemaVersion
- templateId
- content (JSON)
- status (draft, published, archived)
- visibility (private, unlisted, public)
- slug (optional, unique per user/type)
- createdAt, updatedAt
- deletedAt (soft delete)
- revision (integer optimistic concurrency)

### 4.2 Standards Strategy

Use JSON Resume as baseline for resume data, with extension namespaces:

1. Standard block stored under content.jsonResume.
2. Product-specific block under content.extensions.veriworkly.
3. Keep mapping adapters:

- internal editor state -> JSON Resume
- JSON Resume -> internal editor state

For cover letter/portfolio/link-in-bio, define equivalent schema modules with strict Zod validators and versioned migration functions.

### 4.3 Export Strategy

1. Remove Playwright from backend entirely.
2. React PDF as first-class generator in studio.
3. Keep docx/json/md/html/txt exports in studio services (or modularize by type).
4. Deprioritize png/jpg unless explicitly needed later; if needed, add separate client-side image export pipeline after PDF stabilization.

## 5. Phase Plan (A to Z)

## Phase A - Freeze and Baseline

1. Freeze export-related feature changes.
2. Capture baseline metrics:

- Export success rate
- Average export latency
- Sync conflicts
- Resume CRUD latency

3. Inventory all current endpoints and UI actions for export.
4. Tag release baseline before migration branch.

## Phase B - Backend Playwright Removal (No Behavior Break for Core CRUD)

### B1. Remove Export Runtime Components

Delete or retire:

1. apps/server/src/services/exportService.ts
2. apps/server/src/services/exportQueueService.ts
3. apps/server/src/services/exportArtifactStore.ts
4. apps/server/src/controllers/exportController.ts
5. apps/server/src/routes/exports.ts
6. apps/server/src/jobs/verifyLocalExportStorage.ts
7. apps/server/tests/export/exportService.test.ts
8. apps/server/tests/export/exportArtifactStore.test.ts

### B2. Remove Runtime Wiring

Edit apps/server/src/index.ts:

1. Remove export route mount /api/v1/exports.
2. Remove startup call to start export worker.
3. Remove artifact store initialization.
4. Remove shutdown calls for export browser/artifact store/queue cleanup.

### B3. Remove Share Export Endpoints

Edit apps/server/src/routes/share.ts:

1. Remove /:token/export/jobs routes.
2. Keep public share viewing and verification only.

### B4. Remove Config and Dependencies

Edit apps/server/src/config.ts and apps/server/.env.example:

1. Remove exportQueue config block.
2. Remove exportArtifacts config block.
3. Remove EXPORT\_\* environment variables.

Edit apps/server/package.json:

1. Remove playwright dependency.
2. Remove verify:exports:local script.
3. Remove any export-only infra dependencies if no longer used.

### B5. Update Backend Docs

Edit apps/server/README.md:

1. Remove Playwright/BullMQ export claims.
2. Update architecture to sync/share/auth-focused backend.

## Phase C - DEPRECATED: PDF Export (Removed)

PDF export functionality has been fully removed from the studio. All export formats now focus on web-compatible and document formats (DOCX, HTML, Markdown, Text, JSON).

Edit:

1. apps/studio/public/llms.txt (remove export API docs).
2. apps/studio/public/openapi.json (remove export endpoints).
3. Any contract tests mentioning export APIs should be updated or removed.

_Note: Phase C has been completed. The React PDF strategy was pivoted to a more robust `iframe + window.print()` local export strategy to ensure 1:1 CSS/HTML template visual parity, successfully removing backend dependencies._

## Phase D - Data Model Redesign for Multi-Product Scale

### D1. Target Database Entities

Keep existing auth and roadmap models. Introduce or evolve document models:

1. Document (new canonical model)
2. DocumentRevision (optional but recommended)
3. ShareLink generalized to document-level (can evolve ResumeShareLink)
4. MasterProfile stays as profile seed; no longer resume-specific logic leakage

### D2. Migration Path From Current Schema

Current models involved:

1. Resume
2. ResumeCloudSync
3. ResumeShareLink

Migration strategy:

1. Add new Document model first (no destructive changes).
2. Backfill Resume rows -> Document(type=resume).
3. Backfill ResumeShareLink -> generalized ShareLink with documentId.
4. Keep old tables in compatibility mode for one release.
5. Switch reads/writes to Document APIs.
6. Remove ResumeCloudSync by folding sync fields into Document.
7. Remove old Resume table in final cleanup migration after stable window.

## Phase E - JSON Schema Governance

### E1. Resume Schema (Strict JSONResume Alignment)

1. Shift current `ResumeData` to strictly follow the JSON Resume standard under `content.jsonResume` where possible (Basics, Work, Volunteer, Education, Awards, Certificates, Publications, Skills, Languages, Interests, References, Projects).
2. Store UI-specific metadata and extended data blocks under `content.extensions.veriworkly`.
3. Version field required: `schemaVersion` integer.
4. Validate all writes via shared Zod schemas in both server and studio.

### E2. Non-Resume Schemas

Create parallel schema modules to scale beyond resumes:

1. `coverLetterSchema`
2. `portfolioSchema`
3. `linkInBioSchema`

Each schema must have:

1. strict Zod validator
2. default factory
3. migration function by version
4. DTO mapper for API

## Phase F - API Redesign (Efficient Save/Update/Delete)

### F1. Replace Resume-Specific Sync Endpoints

Current endpoint:

- PUT /resumes/:resumeId/sync

Target endpoint family:

1. GET /documents?type=&updatedSince=
2. GET /documents/:documentId
3. POST /documents
4. PATCH /documents/:documentId
5. DELETE /documents/:documentId (soft delete)
6. POST /documents/:documentId/restore
7. POST /documents/:documentId/sync (optional if offline outbox remains)

### F2. Concurrency and Conflict Control

1. Require revision in update payload.
2. Reject stale writes with 409 conflict.
3. Return server version + diff hints if possible.
4. Keep force overwrite option only for explicit conflict resolution actions.

### F3. Efficiency Rules

1. Support partial PATCH by JSON merge patch for large documents.
2. Index userId + type + updatedAt for list performance.
3. Keep payload size caps and validation limits.
4. Cache list and document reads with clear invalidation keys.

## Phase G - Studio Architecture Restructure for Future Features

### G1. Move From Resume-Centric to Documents Domain

Current strong area: `features/resume`.
Target: `features/documents` plus product-specific modules.

Proposed structure:

1. `features/documents/core`

- types, schemas, adapters, api-client, sync-engine, storage-engine, universal local-export engine

2. `features/documents/resume`

- editor sections, template bindings

3. `features/documents/cover-letter`

- schema, editor, template bindings

4. `features/documents/portfolio`

- schema, editor, template, publishing config

### G2. Shared Engines

1. `storage-engine`: local-first persistence and migration
2. `sync-engine`: reusable outbox, retry, telemetry
3. `export-engine`: Universal iframe-based export. By injecting any document's HTML into a hidden iframe, we can trigger `iframe.contentWindow.print()` or `html-to-image`, creating a highly scalable, zero-backend export system for resumes, cover letters, and portfolios.

### G3. Template System Evolution

1. Keep the current dynamic `templateRegistry` pattern. _Note: Dynamic imports (`React.lazy` or Next dynamic) are already actively implemented in `templates/index.ts` allowing scalable template loading without bloating the editor bundle._
2. Add template capability metadata:

- `supportedDocumentTypes` (Resume vs Cover Letter)
- `supportedExportFormats`
- `atsMode` flag

## Phase H - Security and Safety

1. Keep strict server-side schema validation for all write paths.
2. Add payload size limits per document type.
3. Sanitize and validate all external URLs in content.
4. Retain existing auth middleware and API key protections.
5. Ensure public share endpoints never expose owner-private metadata.
6. Keep password hashing for protected shares.
7. Add audit events for document create/update/delete/share actions.

## Phase I - Testing Strategy

### I1. Backend

1. Unit tests for validators and conflict logic (existing pattern is good).
2. Integration tests for document CRUD + conflict + share flow.
3. Migration tests for Resume -> Document backfill.

### I2. Studio

1. Contract tests for document API client.
2. Renderer tests for each template and document type.
3. PDF snapshot parity tests for ATS-critical templates.
4. Offline sync/outbox tests across tab focus/online transitions.

### I3. Remove Obsolete Tests

1. Remove export queue/Playwright artifact tests from server.
2. Replace with React PDF generation tests in studio.

## Phase J - Rollout Strategy

1. Step 1: Ship backend without Playwright but keep existing resume CRUD/share stable.
2. Step 2: Ship studio local React PDF export for authenticated editor.
3. Step 3: Ship share-page local PDF export from fetched snapshot.
4. Step 4: Introduce Document model behind feature flag and dual-write.
5. Step 5: Migrate reads to Document model.
6. Step 6: Remove legacy ResumeCloudSync and old export API docs.

## Phase K - Detailed Delete/Add Checklist

### K1. Delete Candidates (Confirmed)

Server:

1. apps/server/src/services/exportService.ts
2. apps/server/src/services/exportQueueService.ts
3. apps/server/src/services/exportArtifactStore.ts
4. apps/server/src/controllers/exportController.ts
5. apps/server/src/routes/exports.ts
6. apps/server/src/jobs/verifyLocalExportStorage.ts
7. apps/server/tests/export/exportService.test.ts
8. apps/server/tests/export/exportArtifactStore.test.ts

Studio:

1. apps/studio/features/resume/utils/build-export-html.ts (after call sites removed)
2. Export queue polling code inside:

- apps/studio/features/resume/services/share-links.ts
- apps/studio/features/resume/services/public-share.ts

### K2. Files To Edit

Server:

1. apps/server/src/index.ts
2. apps/server/src/routes/share.ts
3. apps/server/src/config.ts
4. apps/server/.env.example
5. apps/server/package.json
6. apps/server/README.md

Studio:

1. apps/studio/app/(main)/editor/components/Toolbar.tsx
2. apps/studio/app/(main)/editor/components/toolbar/ToolbarDownloadMenu.tsx
3. apps/studio/app/share/[token]/share-resume-client.tsx
4. apps/studio/features/resume/services/share-links.ts
5. apps/studio/features/resume/services/public-share.ts
6. apps/studio/public/llms.txt
7. apps/studio/public/openapi.json

### K3. Files To Add

Studio (initial):

1. features/documents/export/pdf/react-pdf-resume.tsx
2. features/documents/export/pdf/react-pdf-theme.ts
3. features/documents/export/pdf/export-pdf.ts
4. features/documents/export/contracts.ts

Server (later redesign):

1. prisma migrations for Document model introduction
2. new document controllers/routes/services/validators

## Phase L - Data Compatibility Rules

1. Never drop existing resume data during first migration.
2. Keep backward adapter for templateId faang -> ats during migration window.
3. Preserve existing sync status semantics until new sync engine is active.
4. Ensure master profile can still seed new resumes after schema transition.

## Phase M - Performance Targets

1. PDF generation under 2 seconds median on modern desktop.
2. Document save < 150ms local and < 500ms cloud median.
3. Sync conflict rate reduced by revision-based updates.
4. Remove Redis/BullMQ load from export path entirely.

## Phase N - Definition of Done

1. No Playwright dependency, code path, route, or env variable remains in server/studio.
2. PDF export works in editor and shared resume pages using React PDF.
3. Resume CRUD and sharing remain functional and covered by tests.
4. API docs and llms metadata contain no obsolete export endpoints.
5. Document-domain technical design is implemented or staged with migration-ready scaffolding.

## 6. Recommended Implementation Order (Practical)

1. Remove backend export routes/services/wiring first in a single focused PR.
2. Replace studio PDF flow with React PDF in second PR.
3. Remove PNG/JPG temporarily and communicate clearly in UI.
4. Update docs/openapi/llms in same PR as behavior changes.
5. Start Document model migration in dedicated schema/API PR.
6. Restructure studio into documents domain after migration scaffolding is in place.

## 7. Risk Register

1. Risk: Existing users expect PNG/JPG.

- Mitigation: Temporary deprecation notice, reintroduce with separate client image pipeline if needed.

2. Risk: Share-page download flow regression.

- Mitigation: Add targeted integration tests for share token + password + download.

3. Risk: Schema migration complexity.

- Mitigation: Dual-write and read fallback period before destructive cleanup.

4. Risk: Contract drift between studio and server.

- Mitigation: Shared DTO/schema package or mirrored validator tests in CI.

## 8. First Sprint Task List (Actionable)

1. Create branch feat/remove-playwright-export-stack.
2. Remove server export services/routes/controller/job/tests.
3. Remove export config/env/package script/dependency and update server bootstrap.
4. Build React PDF export module in studio and wire toolbar PDF action.
5. Remove server export polling logic from studio services.
6. Update share resume page to local PDF export from snapshot.
7. Update llms/openapi docs in studio.
8. Run tests and add new tests for updated flows.
9. Open PR with migration notes and rollback plan.

## 9. Rollback Plan

1. Keep pre-removal release tag.
2. If regression occurs, revert PR and restore previous export route mount and service wiring.
3. Keep DB unchanged during first Playwright-removal pass to allow quick rollback.

---

This plan is intentionally detailed and sequenced so you can execute safely without mixing too many moving parts in a single release.
