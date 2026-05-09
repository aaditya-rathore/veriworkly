# Public Portfolio Subdomains (Templates & Live Data)

Add support for user-defined portfolio websites on `[username].site.veriworkly.com`. Portfolios render full website templates using a user's selected resume data.

## User Review Required

> [!IMPORTANT]
> **Portfolio Templates**: These are distinct from resume templates. They represent a full website layout (Hero section, Projects, Skills, etc.).
> **Dual-Fetch Logic**: When a subdomain is visited, the app must fetch the user (to identify the owner), their selected template ID, and the resume data used to populate it.
> **Safe Namespace**: `[username].site.veriworkly.com` remains the recommended structure to avoid clashing with `blog` or `docs`.

## Proposed Changes

### [Component] Backend (Server)

Update the user model to support portfolio customization.

#### [MODIFY] [schema.prisma](file:///d:/veriworkly-resume/apps/server/prisma/schema.prisma)
- Add `portfolioSubdomain String? @unique` to `User`.
- Add `portfolioEnabled Boolean @default(false)` to `User`.
- Add `featuredResumeId String?` to `User`.
- Add `portfolioTemplateId String @default("default")` to `User`.

#### [NEW] [portfolioController.ts](file:///d:/veriworkly-resume/apps/server/src/controllers/portfolioController.ts)
- `getPortfolioContent`: Public endpoint that returns `{ templateId, resumeData }` for a given subdomain.

---

### [Component] Resume Builder (Frontend)

Implement the portfolio rendering engine.

#### [NEW] [middleware.ts](file:///d:/veriworkly-resume/apps/resume-builder/middleware.ts)
- Rewrite `[subdomain].site.veriworkly.com` to `/portfolio/[subdomain]`.

#### [NEW] [features/portfolio/templates/...]
- Create a set of "Portfolio Website" templates (e.g., `Developer`, `Creative`, `Minimal`).
- These templates will take `ResumeData` as input but render it as a full-page website.

#### [NEW] [app/portfolio/[subdomain]/page.tsx](file:///d:/veriworkly-resume/apps/resume-builder/app/portfolio/[subdomain]/page.tsx)
- Fetches portfolio data from the backend.
- Dynamically loads the selected `portfolioTemplateId`.
- Renders the website with the featured resume data.

#### [MODIFY] [Settings Page](file:///d:/veriworkly-resume/apps/resume-builder/app/(main)/(dashboard)/settings/page.tsx)
- Add "Portfolio Website" configuration:
    - **Subdomain**: Choice of name.
    - **Resume**: Select which resume provides the content.
    - **Template**: Visual picker for the website layout.

## Verification Plan

### Automated Tests
- Unit tests for the subdomain validation logic.
- Integration test for the middleware rewriting (using `NextRequest` and `NextResponse` mocks).

### Manual Verification
- Locally test by modifying the `hosts` file (e.g., adding `gautam.localhost`).
- Verify that navigating to `gautam.localhost:3000` serves the correct portfolio data.
- Verify that the main site `localhost:3000` still works as expected.
