# KnwnLocal Design System

Reference for AI coding agents building UI for KnwnLocal. Follow these rules exactly. Deviations such as extra colors, violet primary buttons, gradients, or emoji break the brand. When in doubt, prefer restraint.

Stack context: Next.js, Tailwind, Sanity. Slide templates are React components in `slides/`.

## 1. Color

Four colors only. Never introduce a fifth.

```css
--ink: #000000;        /* text, primary buttons, dark backgrounds */
--violet: #8d71d6;     /* signature accent — highlights, secondary CTAs */
--violet-soft: #dbd7e7;/* light surfaces, soft fills */
--cream: #f8f5ea;      /* alternate light surface */
--paper: #ffffff;      /* base light surface */
```

### Violet Ramp

Use tints of `#8d71d6` for shadows, hover states, borders, and depth. Do not introduce new hues.

| Token | Value |
| --- | --- |
| `violet-50` | lightest |
| `violet-100` | tint |
| `violet-200` | tint |
| `violet-300` | tint |
| `violet-400` | tint |
| `violet-500` | base `#8d71d6` |
| `violet-600` | shade |
| `violet-700` | shade |
| `violet-800` | shade |
| `violet-900` | darkest |

### Semantic Surfaces

- On dark: near-black or dark-radial background, white text, violet pill highlight.
- On light: paper or violet-soft background, black text, violet pill highlight.

### Backgrounds

Use only these backgrounds. No other gradients.

- Paper-lavender (light)
- Cream
- Violet-soft
- Dark radial gradient (near-black, signature emphasis background)

## 2. Typography

- Font: `Poppins`, all weights, all surfaces.
- Tracking: `-0.02em` on every headline. Non-negotiable. This is what makes the brand read as premium.

### Weight Ladder

| Weight | Name |
| --- | --- |
| `300` | Light |
| `400` | Regular |
| `500` | Medium |
| `600` | SemiBold |
| `700` | Bold |
| `800` | ExtraBold |

### Type Scale

| Style | Size / Line Height | Weight | Use |
| --- | --- | --- | --- |
| Display XL | `96 / 800` | `800` | Hero "LEGACY" moments only |
| Display MD | `56 / 700` | `700` | Headlines |
| Body LG | `20 / 1.45` | `400` | Lead paragraphs |
| Body | `18 / 1.45` | `400` | Standard body copy |
| Body SM | `16 / 1.5` | `400` | Secondary body copy |
| Caption | `13` | `400-500` | Labels, metadata |

### Casing Rules

- `Title Case` for headlines.
- `Sentence case` for body copy.
- `ALL CAPS` reserved for thumbnails and the "LEGACY" hero moment only. Do not use for general emphasis.

## 3. Highlight Pattern

The violet pill or sharp-cornered block on the payoff word is the brand's most recognizable mark.

- Rule: every headline gets exactly one violet highlight.
- A headline without one is not finished.
- `Pill` = rounded, default treatment.
- `Block` = sharp corners, alternate treatment.
- Apply to the payoff word or phrase only. Not the whole headline. Not multiple phrases.

Examples:

- `How to [Scale Your Brand]` ← pill on payoff phrase
- `Build a [hyper-local] brand that owns the market.` ← block on payoff word

## 4. Spacing & Radius

### Spacing Scale (4pt Base)

| Token | Value |
| --- | --- |
| `s-1` | `4px` |
| `s-2` | `8px` |
| `s-3` | `12px` |
| `s-4` | `16px` |
| `s-5` | `20px` |
| `s-6` | `24px` |
| `s-7` | `32px` |
| `s-8` | `40px` |
| `s-9` | `56px` |
| `s-10` | `72px` |

### Corner Radii

| Token | Value |
| --- | --- |
| `xs` | `4px` |
| `sm` | `8px` |
| `md` | `14px` |
| `lg` | `20px` |
| `xl` | `28px` |
| `2xl` | `40px` |
| `pill` | `full / rounded` |

Cards specifically: `18-24px` radius.

## 5. Elevation & Shadows

Shadows are soft and violet-tinted. Never gray.

| Token | Use |
| --- | --- |
| `xs` | subtle press |
| `sm` | card resting state |
| `md` | hover lift |
| `lg` | modal |
| `pop` | "most popular" lifted card emphasis |

## 6. Components

### Buttons

- Primary CTA: black pill, paired with a circular arrow badge (`↗`). Always primary.
- Secondary CTA: violet pill. Violet is never primary.
- Tertiary: ghost or outline pill, no fill.

Examples:

- `[ Check Availability ↗ ]` ← primary (black)
- `( Get in Touch )` ← secondary (violet)
- `( Learn more )` ← tertiary (ghost)

### Pills, Tags, Name Badges

- Standard tags: rounded pill, black or violet-soft fill.
- Name badges: light-weight first name + bold last name in one pill. Example: `Chris Smith`.

### Stats Row

- Large violet numerals (Display-weight), black caption label beneath.
- No icons needed.

### Cards & Pricing

- Light tier cards: white or paper background, standard shadow.
- "Most Popular" or emphasis card: dark near-black background, lifted with a soft violet-tinted shadow. This is the signature elevated pattern.
- Pricing cards show price, cadence label, and a checklist (`✓` in violet).

### Quote Cards

- Dark background.
- Quote text in white or light text.
- One violet highlight on the key phrase, mirroring the headline highlight rule.
- Attribution: bold `KnwnLocal` + caption-style URL.

### The Dotted-Purple Motif

Dashed violet circles and dashed connector arrows replace conventional iconography on process and step flows. This is the deck's most-copied and most-important visual signature. Use it instead of icon sets whenever illustrating a sequence or process.

```text
( Step )  · · · ▸  ( Step )  · · · ▸  ( Step )
```

## 7. Logo

- Wordmark mixes weights: `Knwn` (`700`) + `Local` (`400`), no space, single word visually.
- Icon lockup: `Kn` monogram, either solid violet square or dashed-circle outline.
- Always spelled `K-N-W-N`. Never `Known`.

## 8. Voice & Content

Tone: plainspoken, direct, confident. Like a coach on a strategy call, not a SaaS landing page.

### Voice Rules

- Reader is always `you`.
- Agency is always `we`.
- Use short, declarative sentences.
- Lead with numbers over adjectives.
- Confidence: high but factual.
- Urgency: low.
- Humor: dry.
- Jargon is fine when real-estate-native: SOI, GCI, flex leads.

### The "Knwn" Pun

Always keep the `K-N-W-N` spelling in wordplay.

Examples:

- `Get Knwn.`
- `We make it Knwn.`
- `[Name] is Knwn.`

Never use `Known`.

### Do

- `You're Great at Real Estate. We make it Knwn.`
- `We wrote 11 contracts in January alone.`
- `Hyper-local content that attracts buyers and sellers.`

### Don't

- `Leverage synergies to unlock market penetration.` — jargon, no numbers
- `🚀 Ready to 10x your agent brand?? 🔥` — emoji, hype language, exclamation marks

### Avoid List

- Emoji, anywhere.
- Exclamation marks in body copy.
- Words: `unlock`, `leverage`, `10x`, `game-changing`.
- Bluish-purple gradients. Only the approved dark radial gradient is allowed.
- Violet as a primary button color.

## 9. Photography & Iconography

- Photography: warm, natural, shot in homes. High-key faces, dimmed surround.
- Color only. No black and white.
- Iconography: icon-minimal.
- If icons are unavoidable, use Lucide at `1.5px` stroke.
- No emoji, ever.

## 10. Animation

- Fade + `12px` rise, about `400ms`.
- No bounce easing.
- No parallax effects.
- Hover: darken `6%`.
- Press or active: scale to `0.98`.

## 11. Quick Reference Card

| Category | Rule |
| --- | --- |
| Color | `#000` ink, `#8d71d6` violet, `#dbd7e7` violet-soft, `#f8f5ea` cream. No other colors. |
| Type | `Poppins`. `700` headlines, `800` hero display, `400` body. `-0.02em` tracking on all headlines. |
| Buttons | Black pill = primary. Violet pill = secondary. Ghost = tertiary. Primary always has circular arrow badge. |
| Cards | `18-24px` radius. Soft violet-tinted shadow on lifted "most popular" cards. |
| Backgrounds | Paper-lavender, near-black, cream, violet-soft, or dark radial gradient only. |
| Photography | Warm, natural, home settings. Color only, no B&W. |
| Icons | Icon-minimal, Lucide `1.5px` stroke fallback. No emoji. |
| Animation | Fade + `12px` rise, about `400ms`. No bounce, no parallax. |
| Headlines | Exactly one violet highlight, pill or block, per headline. |
| Spelling | Always `Knwn`, never `Known`. |

## 12. Template Families

Five layouts cover about `85%` of sales-deck and marketing surfaces. Build these as reusable components first.

- `Title` — hero headline + highlight + subhead, light background
- `Stats` — `3-4` large violet numerals with captions, dark background
- `Process` — dotted-purple motif step flow, dark background
- `Testimonial` — quote card(s), dark background, one violet highlight per quote
- `Pricing` — light tier card(s) + dark "most popular" lifted card

Reuse these five patterns before inventing new layouts.
