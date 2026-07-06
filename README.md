# Autonomous Self-Editing Web Architecture

An experimental, design-system-aware web application architecture that updates its live production site autonomously using Claude 3.5 Sonnet, Sanity CMS, and Vercel On-Demand Revalidation.

By using structured JSON documents instead of raw HTML blocks, Claude can optimize conversion metrics, update copy for promotions, or run localized iterations without fracturing the underlying design system or layouts.

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

- AI Engine: Claude 3.5 Sonnet (Anthropic API) parses requests against rigid schema definitions and a layout parameters markdown sheet.
- Content Engine: Sanity CMS manages content as decoupled structural data models.
- Hosting & Delivery Engine: Next.js deployed on Vercel utilizing Incremental Static Regeneration (ISR) via On-Demand Revalidation paths for instant caching switches.

---

## Getting Started

### 1. Prerequisites & Environment Setup

Clone this repository and assign the following keys to your deployment pipeline environment tokens or local `.env.local` block:

```bash
# Public Keys (Safe to bundle into frontend code)
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"

# Private Server-Side Keys (Keep Secure)
ANTHROPIC_API_KEY="sk-ant-..."
SANITY_WRITE_TOKEN="sk..." # Requires implicit "Write" access permissions
```

### 2. Sanity Content Schema Configuration

Register the landing schema layout within your studio configurations framework:

```typescript
// schemas/youtubePage.ts
export default {
  name: 'youtubePage',
  title: 'YouTube Landing Page',
  type: 'document',
  fields: [
    { name: 'heroTitle', title: 'Hero Title', type: 'string' },
    { name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text' },
    { name: 'ctaText', title: 'CTA Button Text', type: 'string' },
    { name: 'features', title: 'Features Checklist', type: 'array', of: [{ type: 'string' }] },
    { name: 'pricingPackages', title: 'Pricing Packages', type: 'array', of: [/* see source code */] }
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

### Automated Optimization Endpoint

To mutate content live, send a POST payload directly containing your content optimization request to the system route:

```bash
curl -X POST "https://your-domain.vercel.app/api/optimize" \
  -H "Content-Type: application/json" \
  -d '{"userInstruction": "Pivot the copywriting style across the pricing tiers to focus heavily on modern real estate teams looking to build hyper-local search dominance."}'
```

---

## Operational Safeguards

> [!WARNING]
> Schema Guardrails: To maximize consistency, the Claude optimization pipeline utilizes a low configuration temperature setting (`0.1`). This guarantees strict adherence to the keys returned from the database layer and eliminates creative structural hallucinations.

- Sanity Webhook Protection: Ensure that your revalidation path endpoints validate webhook signature tokens to protect against brute-force invalidation attacks on your Vercel caching endpoints.
- Data Serialization Check: Content parsed via the serverless controller functions is passed into native JavaScript objects before validation loops process mutation pushes to the cloud database engine.
