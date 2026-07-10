# Autonomous Self-Editing Web Architecture

A design-system-aware Next.js site that rewrites its own structured content with Claude, stores published copy in Sanity, and can push live updates to Vercel.

The editing surface stays inside the site itself: turn on edit mode, click any editable field, prompt Claude for a rewrite, review the preview, then publish. Published changes are written to Sanity, the affected route is revalidated, and an optional Vercel deploy hook can trigger a fresh production deployment.

---

## Architecture Blueprint

```text
[ Frontend / Vercel ] ──(User Instruction)──> [ Claude API via Vercel Edge Serverless ]
        ▲                                                      │
        │ (On-Demand Revalidation / Milliseconds)             │ (Sanity Mutation API)
        │                                                      ▼
[ Vercel Deployment ] <───(Webhook Trigger)─────────── [ Sanity Dataset ]
```

### Core Components

- AI Engine: Claude Sonnet rewrites selected fields against the constraints in `design.md`.
- Content Engine: Sanity stores page content in `sitePage` documents keyed by `pageKey`.
- Hosting & Delivery Engine: Next.js on Vercel revalidates updated routes immediately and can also trigger a production deploy hook.

---

## Getting Started

### 1. Prerequisites & Environment Setup

Clone this repository and assign the following keys to local `.env.local` or your Vercel project environment variables:

```bash
# Frontend / read config
NEXT_PUBLIC_EDIT_MODE_ENABLED="true"
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"

# Server-side only
ANTHROPIC_API_KEY="sk-ant-..."
SANITY_API_TOKEN="sk..." # needs write access to the dataset
VERCEL_DEPLOY_HOOK_URL="https://api.vercel.com/v1/integrations/deploy/..."
```

### 2. Sanity Content Schema Configuration

This app writes page content into `sitePage` documents with a `fields` object. A minimal Studio schema looks like this:

```typescript
// schemas/sitePage.ts
export default {
  name: 'sitePage',
  title: 'Site Page',
  type: 'document',
  fields: [
    { name: 'pageKey', title: 'Page Key', type: 'string' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'path', title: 'Path', type: 'string' },
    { name: 'fields', title: 'Fields', type: 'object' },
    { name: 'createdAt', title: 'Created At', type: 'datetime' },
    { name: 'updatedAt', title: 'Updated At', type: 'datetime' },
  ]
}
```

### 3. Establish Layout Constraints (`design.md`)

Create a `design.md` file in the root of your project directory. This acts as the visual guardrail for the LLM model to protect against UI fragmentation or overflowing components:

```markdown
# UI Layout Guards & Boundaries

## Hero Block
- **heroTitle:** Maximum 8 words. Do not let text wrap beyond two display lines. Keep styling clean, punchy, and highly structural.
- **heroSubtitle:** Keep below 150 characters total.

## Pricing Cards
- **description:** Maximum 2 sentences per column card block to avoid visual layout asymmetry.
```

---

## Execution

### Editing Endpoint

To preview a Claude rewrite for a selected field:

```bash
curl -X POST "https://your-domain.vercel.app/api/edit" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "hero-headline",
    "current": "Turn One Weekly Video Into Market <highlight>Authority</highlight>.",
    "instruction": "Make this more direct and slightly more premium.",
    "currentContentObject": {
      "hero-headline": "Turn One Weekly Video Into Market <highlight>Authority</highlight>."
    }
  }'
```

To publish accepted changes live:

```bash
curl -X POST "https://your-domain.vercel.app/api/deploy" \
  -H "Content-Type: application/json" \
  -d '{
    "pageKey": "youtube",
    "changes": {
      "hero-headline": "Turn One Weekly Video Into Market <highlight>Authority</highlight>."
    }
  }'
```

---

## Operational Safeguards

> [!WARNING]
> Schema Guardrails: To maximize consistency, the Claude optimization pipeline utilizes a low configuration temperature setting (`0.1`). This guarantees strict adherence to the keys returned from the database layer and eliminates creative structural hallucinations.

- Only string fields are accepted for publish mutations.
- The app falls back to local defaults when Sanity env vars are missing, so the site can still build and deploy.
- `VERCEL_DEPLOY_HOOK_URL` is optional. If omitted, content still publishes to Sanity and the affected Next.js route is revalidated immediately.
