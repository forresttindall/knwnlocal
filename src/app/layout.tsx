import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  display: "optional",
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://knwnlocal.com";
const SITE_OG_IMAGE = `${SITE_URL}/favicon.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KnwnLocal | Real Estate YouTube & Email Newsletter Platform",
    template: "%s · KnwnLocal",
  },
  description:
    "KnwnLocal helps real estate agents own their market through weekly YouTube video platforms and high-performing email newsletters. One hour filming per week. We handle the rest — scripts, thumbnails, edits, newsletters, delivery, and metrics that turn views into listings.",
  applicationName: "KnwnLocal",
  keywords: [
    "real estate YouTube",
    "real estate email newsletter",
    "real estate content agency",
    "weekly newsletter for agents",
    "real estate video editing",
    "agent branding",
    "KnwnLocal",
    "real estate SEO",
    "YouTube for realtors",
    "email marketing real estate",
  ],
  authors: [{ name: "KnwnLocal", url: SITE_URL }],
  creator: "KnwnLocal",
  publisher: "KnwnLocal",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Real Estate Marketing",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "KnwnLocal",
    title: "KnwnLocal | Real Estate YouTube & Email Newsletter Platform",
    description:
      "Real estate agents work one hour per week filming on camera. We ship quarterly YouTube slates, weekly local newsletters, scripts, thumbnails, edits, and delivery that consistently drives listings, referrals, and SOI conversations.",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "KnwnLocal",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "KnwnLocal | Real Estate YouTube & Email Newsletter Platform",
    description:
      "One hour filming per week. Real estate YouTube + weekly newsletter delivery that compounds your SOI into listings, referrals, and repeat conversations.",
    images: [SITE_OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const hardCssInline = `
:root{
--ink:#000000;--violet:#8d71d6;--violet-soft:#dbd7e7;--cream:#f8f5ea;--paper:#ffffff;--background:var(--cream);--foreground:var(--ink);--dark-radial:radial-gradient(ellipse at 30% 40%, #1a1530 0%, #0d0b1a 100%);
--spacing-s1:4px;--spacing-s2:8px;--spacing-s3:12px;--spacing-s4:16px;--spacing-s5:20px;--spacing-s6:24px;--spacing-s7:32px;--spacing-s8:40px;--spacing-s9:56px;--spacing-s10:72px;
--radius-xs:4px;--radius-sm:8px;--radius-block:6px;--radius-md:14px;--radius-lg:20px;--radius-xl:28px;--radius-2xl:40px;--radius-pill:9999px;
--shadow-xs:0 1px 3px rgba(141,113,214,.10);--shadow-sm:0 2px 8px rgba(141,113,214,.14);--shadow-md:0 4px 16px rgba(141,113,214,.18);--shadow-lg:0 8px 32px rgba(141,113,214,.22);--shadow-pop:0 16px 48px rgba(141,113,214,.32);
}
html,body{margin:0;padding:0;background:var(--background);color:var(--foreground)}
*,*::before,*::after{box-sizing:border-box}
body{min-height:100vh;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-family:var(--font-poppins), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif}
a{color:inherit;text-decoration:none}
img,svg,iframe{max-width:100%;display:block}
button{font-family:inherit;background:transparent;border:0;color:inherit;cursor:pointer;padding:0}
input,textarea,select{font-family:inherit;color:inherit}
ul,ol,li{list-style:none;margin:0;padding:0}
blockquote{margin:0}
/* Palette + themed backgrounds */
.bg-cream{background:var(--cream);color:var(--ink)}
.bg-paper{background:var(--paper);color:var(--ink)}
.bg-ink{background:#000;color:#fff}
.bg-violet{background:var(--violet);color:#fff}
.bg-violet-soft{background:var(--violet-soft);color:var(--ink)}
.bg-dark-radial{background-image:var(--dark-radial);background-repeat:no-repeat;background-size:cover;color:#fff}
.bg-violet\\/10{background:rgba(141,113,214,.10)}
.bg-violet\\/15{background:rgba(141,113,214,.15)}
.bg-violet\\/90{background:rgba(141,113,214,.90)}
.bg-ink\\/5{background:rgba(0,0,0,.05)}
.bg-ink\\/10{background:rgba(0,0,0,.10)}
.bg-ink\\/20{background:rgba(0,0,0,.20)}
.bg-ink\\/30{background:rgba(0,0,0,.30)}
.bg-ink\\/40{background:rgba(0,0,0,.40)}
.bg-ink\\/55{background:rgba(0,0,0,.55)}
.bg-ink\\/80{background:rgba(0,0,0,.80)}
.bg-black\\/30{background:rgba(0,0,0,.30)}
.bg-black\\/40{background:rgba(0,0,0,.40)}
.bg-black\\/55{background:rgba(0,0,0,.55)}
.bg-paper\\/60{background:rgba(255,255,255,.60)}
.bg-paper\\/90{background:rgba(255,255,255,.90)}
.bg-paper\\/95{background:rgba(255,255,255,.95)}
/* Text colors + opacity */
.text-paper{color:#fff}
.text-ink{color:var(--ink)}
.text-violet{color:var(--violet)}
.text-paper\\/60{color:rgba(255,255,255,.60)}
.text-paper\\/65{color:rgba(255,255,255,.65)}
.text-paper\\/70{color:rgba(255,255,255,.70)}
.text-paper\\/80{color:rgba(255,255,255,.80)}
.text-paper\\/90{color:rgba(255,255,255,.90)}
.text-ink\\/55{color:rgba(0,0,0,.55)}
.text-ink\\/60{color:rgba(0,0,0,.60)}
.text-ink\\/65{color:rgba(0,0,0,.65)}
.text-ink\\/70{color:rgba(0,0,0,.70)}
.text-ink\\/75{color:rgba(0,0,0,.75)}
.text-ink\\/80{color:rgba(0,0,0,.80)}
.text-violet\\/70{color:rgba(141,113,214,.70)}
.text-violet\\/80{color:rgba(141,113,214,.80)}
.text-violet\\/85{color:rgba(141,113,214,.85)}
/* Layout/display primitives */
.hidden{display:none}
.block{display:block}
.inline-block{display:inline-block}
.flex{display:flex}
.inline-flex{display:inline-flex}
.grid{display:grid}
.flex-col{flex-direction:column}
.flex-row{flex-direction:row}
.items-start{align-items:flex-start}
.items-center{align-items:center}
.items-end{align-items:flex-end}
.content-start{align-content:flex-start}
.justify-start{justify-content:flex-start}
.justify-center{justify-content:center}
.justify-between{justify-content:space-between}
.justify-end{justify-content:flex-end}
.justify-items-center{justify-items:center}
.flex-1{flex:1 1 0%}
.shrink-0{flex-shrink:0}
.min-w-0{min-width:0}
.max-w-full{max-width:100%}
.min-h-screen{min-height:100vh}
.w-full{width:100%}
.w-auto{width:auto}
.h-full{height:100%}
.h-auto{height:auto}
.aspect-video{aspect-ratio:16/9}
.relative{position:relative}
.absolute{position:absolute}
.fixed{position:fixed}
.sticky{position:sticky}
.inset-0{inset:0}
.top-0{top:0}
.right-0{right:0}
.left-0{left:0}
.bottom-0{bottom:0}
.z-10{z-index:10}
.z-40{z-index:40}
.z-50{z-index:50}
.z-100{z-index:100}
.overflow-hidden{overflow:hidden}
.overflow-y-auto{overflow-y:auto}
.pointer-events-none{pointer-events:none}
.pointer-events-auto{pointer-events:auto}
.select-none{user-select:none}
.opacity-60{opacity:.6}
.opacity-90{opacity:.9}
/* Max widths */
.max-w-\\[520px\\]{max-width:520px}
.max-w-\\[560px\\]{max-width:560px}
.max-w-\\[640px\\]{max-width:640px}
.max-w-\\[820px\\]{max-width:820px}
.max-w-\\[960px\\]{max-width:960px}
.max-w-\\[1000px\\]{max-width:1000px}
.max-w-\\[1040px\\]{max-width:1040px}
.max-w-\\[1120px\\]{max-width:1120px}
/* Grid columns */
.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.grid-flow-row-dense{grid-auto-flow:row dense}
.col-start-1{grid-column-start:1}
.col-start-2{grid-column-start:2}
.col-start-3{grid-column-start:3}
.col-end-2{grid-column-end:2}
.col-end-3{grid-column-end:3}
.col-end-4{grid-column-end:4}
.row-start-3{grid-row-start:3}
/* Containers + centering */
.mx-auto{margin-left:auto;margin-right:auto}
/* S-scale padding (p/px/py/pt/pb/pl/pr) */
.p-s1{padding:var(--spacing-s1)} .p-s2{padding:var(--spacing-s2)} .p-s3{padding:var(--spacing-s3)} .p-s4{padding:var(--spacing-s4)} .p-s5{padding:var(--spacing-s5)} .p-s6{padding:var(--spacing-s6)}
.px-s1{padding-left:var(--spacing-s1);padding-right:var(--spacing-s1)}
.px-s2{padding-left:var(--spacing-s2);padding-right:var(--spacing-s2)}
.px-s3{padding-left:var(--spacing-s3);padding-right:var(--spacing-s3)}
.px-s4{padding-left:var(--spacing-s4);padding-right:var(--spacing-s4)}
.px-s5{padding-left:var(--spacing-s5);padding-right:var(--spacing-s5)}
.px-s6{padding-left:var(--spacing-s6);padding-right:var(--spacing-s6)}
.px-s7{padding-left:var(--spacing-s7);padding-right:var(--spacing-s7)}
.px-s8{padding-left:var(--spacing-s8);padding-right:var(--spacing-s8)}
.py-s1{padding-top:var(--spacing-s1);padding-bottom:var(--spacing-s1)}
.py-s2{padding-top:var(--spacing-s2);padding-bottom:var(--spacing-s2)}
.py-s3{padding-top:var(--spacing-s3);padding-bottom:var(--spacing-s3)}
.py-s4{padding-top:var(--spacing-s4);padding-bottom:var(--spacing-s4)}
.py-s5{padding-top:var(--spacing-s5);padding-bottom:var(--spacing-s5)}
.py-s6{padding-top:var(--spacing-s6);padding-bottom:var(--spacing-s6)}
.py-s7{padding-top:var(--spacing-s7);padding-bottom:var(--spacing-s7)}
.py-s8{padding-top:var(--spacing-s8);padding-bottom:var(--spacing-s8)}
.pt-s1{padding-top:var(--spacing-s1)} .pt-s3{padding-top:var(--spacing-s3)} .pt-s4{padding-top:var(--spacing-s4)}
.pb-s1{padding-bottom:var(--spacing-s1)} .pb-s4{padding-bottom:var(--spacing-s4)}
.pl-s3{padding-left:var(--spacing-s3)} .pl-s4{padding-left:var(--spacing-s4)}
.pr-s3{padding-right:var(--spacing-s3)} .pr-s4{padding-right:var(--spacing-s4)}
/* S-scale margin (mt/mb/ml/mr/ma + gap) */
.mt-s1{margin-top:var(--spacing-s1)}
.mt-s2{margin-top:var(--spacing-s2)}
.mt-s3{margin-top:var(--spacing-s3)}
.mt-s4{margin-top:var(--spacing-s4)}
.mt-s5{margin-top:var(--spacing-s5)}
.mt-s6{margin-top:var(--spacing-s6)}
.mt-s7{margin-top:var(--spacing-s7)}
.mb-s4{margin-bottom:var(--spacing-s4)}
.ml-s3{margin-left:var(--spacing-s3)}
.mr-s3{margin-right:var(--spacing-s3)}
.ml-\\[2px\\]{margin-left:2px}
/* Gaps — flex/grid s-scale + arbitrary */
.gap-s1{gap:var(--spacing-s1)}
.gap-s2{gap:var(--spacing-s2)}
.gap-s3{gap:var(--spacing-s3)}
.gap-s4{gap:var(--spacing-s4)}
.gap-s5{gap:var(--spacing-s5)}
.gap-s6{gap:var(--spacing-s6)}
.gap-s7{gap:var(--spacing-s7)}
.gap-s8{gap:var(--spacing-s8)}
.gap-\\[2px\\]{gap:2px}
.gap-\\[4px\\]{gap:4px}
.gap-\\[8px\\]{gap:8px}
.gap-\\[10px\\]{gap:10px}
.gap-\\[12px\\]{gap:12px}
.gap-\\[14px\\]{gap:14px}
.gap-\\[16px\\]{gap:16px}
.gap-\\[20px\\]{gap:20px}
.gap-\\[24px\\]{gap:24px}
.gap-\\[28px\\]{gap:28px}
.gap-\\[32px\\]{gap:32px}
.gap-\\[40px\\]{gap:40px}
.gap-\\[48px\\]{gap:48px}
.gap-\\[56px\\]{gap:56px}
.gap-4{gap:16px}
.gap-6{gap:24px}
/* Arbitrary padding used in CTAs/Hero */
.px-\\[10px\\]{padding-left:10px;padding-right:10px}
.px-\\[12px\\]{padding-left:12px;padding-right:12px}
.px-\\[14px\\]{padding-left:14px;padding-right:14px}
.px-6{padding-left:24px;padding-right:24px}
.py-3{padding-top:12px;padding-bottom:12px}
.gap-2{gap:8px}
.gap-4{gap:16px}
.text-\\[16px\\]{font-size:16px;line-height:1.35}
.leading-none{line-height:1}
/* Tailwind px/py-* arbitrary helpers (ContactForm + Hero shared) */
.px-\\[26px\\]{padding-left:26px;padding-right:26px}
.py-\\[14px\\]{padding-top:14px;padding-bottom:14px}
/* Button hover + disabled state helpers */
.hover\\:brightness-\\[0\\.94\\]:hover{filter:brightness(.94)}
.disabled\\:opacity-80:disabled{opacity:.80}
/* ArrowBadge (right-side circular arrow chip) used on primary buttons */
.h-\\[32px\\],.h-8{height:32px}
.w-\\[32px\\],.w-8{width:32px}
.px-\\[22px\\]{padding-left:22px;padding-right:22px}
.px-\\[24px\\]{padding-left:24px;padding-right:24px}
.px-\\[40px\\]{padding-left:40px;padding-right:40px}
.py-\\[4px\\]{padding-top:4px;padding-bottom:4px}
.py-\\[6px\\]{padding-top:6px;padding-bottom:6px}
.py-\\[8px\\]{padding-top:8px;padding-bottom:8px}
.py-\\[12px\\]{padding-top:12px;padding-bottom:12px}
.py-\\[14px\\]{padding-top:14px;padding-bottom:14px}
.py-\\[48px\\]{padding-top:48px;padding-bottom:48px}
.py-\\[56px\\]{padding-top:56px;padding-bottom:56px}
.py-\\[64px\\]{padding-top:64px;padding-bottom:64px}
.py-\\[72px\\]{padding-top:72px;padding-bottom:72px}
.py-\\[80px\\]{padding-top:80px;padding-bottom:80px}
.py-\\[88px\\]{padding-top:88px;padding-bottom:88px}
/* Borders + rings */
.border{border-width:1px;border-style:solid}
.border-2{border-width:2px;border-style:solid}
.border-solid{border-style:solid}
.border-dashed{border-style:dashed}
.border-t{border-top-width:1px;border-top-style:solid}
.border-ink\\/10{border-color:rgba(0,0,0,.10)}
.border-ink\\/12{border-color:rgba(0,0,0,.12)}
.border-ink\\/15{border-color:rgba(0,0,0,.15)}
.border-violet{border-color:var(--violet)}
.border-violet\\/70{border-color:rgba(141,113,214,.70)}
.border-paper{border-color:#fff}
.border-paper\\/10{border-color:rgba(255,255,255,.10)}
.border-paper\\/15{border-color:rgba(255,255,255,.15)}
.ring-1{box-shadow:0 0 0 1px var(--tw-ring-color, rgba(0,0,0,.1))}
.ring-2{box-shadow:0 0 0 2px var(--tw-ring-color, rgba(141,113,214,1))}
.ring-violet{--tw-ring-color:var(--violet)}
.ring-ink\\/10{--tw-ring-color:rgba(0,0,0,.10)}
.ring-violet{box-shadow:0 0 0 2px var(--violet)}
.ring-ink\\/10{box-shadow:0 0 0 1px rgba(0,0,0,.10)}
/* Rounded */
.rounded-xs{border-radius:var(--radius-xs)}
.rounded-sm{border-radius:var(--radius-sm)}
.rounded-md{border-radius:var(--radius-md)}
.rounded-\\[14px\\]{border-radius:14px}
.rounded-\\[20px\\]{border-radius:20px}
.rounded-lg{border-radius:20px}
.rounded-xl{border-radius:28px}
.rounded-full, .rounded-pill{border-radius:9999px}
/* Shadows */
.shadow-none{box-shadow:none}
.shadow-xs{box-shadow:var(--shadow-xs)}
.shadow-sm{box-shadow:var(--shadow-sm)}
.shadow-md{box-shadow:var(--shadow-md)}
.shadow-lg{box-shadow:var(--shadow-lg)}
.shadow-pop{box-shadow:var(--shadow-pop)}
.shadow-\\[0_4px_0_rgba\\(20\\,15\\,45\\,.5\\)\\]{box-shadow:0 4px 0 rgba(20,15,45,.5)}
.shadow-\\[0_6px_0_rgba\\(141\\,113\\,214\\,.35\\)\\]{box-shadow:0 6px 0 rgba(141,113,214,.35)}
.shadow-\\[0_22px_60px_-30px_rgba\\(157\\,78\\,221\\,0\\.55\\)\\]{box-shadow:0 22px 60px -30px rgba(157,78,221,.55)}
/* Object fit */
.object-contain{object-fit:contain}
.object-cover{object-fit:cover}
/* Typography weights/sizes/leading/tracking used everywhere */
.font-light{font-weight:300}
.font-normal{font-weight:400}
.font-medium{font-weight:500}
.font-semibold{font-weight:600}
.font-bold{font-weight:700}
.font-mono{font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace}
.text-\\[11px\\]{font-size:11px;line-height:1.2}
.text-\\[12px\\]{font-size:12px;line-height:1.2}
.text-\\[13px\\]{font-size:13px;line-height:1.3}
.text-\\[14px\\]{font-size:14px;line-height:1.3}
.text-\\[16px\\]{font-size:16px;line-height:1.35}
.text-\\[18px\\]{font-size:18px;line-height:1.4}
.text-\\[20px\\]{font-size:20px;line-height:1.4}
.text-\\[22px\\]{font-size:22px;line-height:1.3}
.text-\\[26px\\]{font-size:26px;line-height:1.25}
.text-\\[32px\\]{font-size:32px;line-height:1.1}
.text-\\[40px\\]{font-size:40px;line-height:1.05}
.text-\\[48px\\]{font-size:48px;line-height:1.08}
.text-\\[56px\\]{font-size:56px;line-height:1.05}
.text-\\[64px\\]{font-size:64px;line-height:1.05}
.uppercase{text-transform:uppercase}
.italic{font-style:italic}
.leading-\\[1\\.05\\]{line-height:1.05}
.leading-\\[1\\.08\\]{line-height:1.08}
.leading-\\[1\\.2\\]{line-height:1.2}
.leading-\\[1\\.25\\]{line-height:1.25}
.leading-\\[1\\.3\\]{line-height:1.3}
.leading-\\[1\\.35\\]{line-height:1.35}
.leading-\\[1\\.4\\]{line-height:1.4}
.leading-\\[1\\.5\\]{line-height:1.5}
.leading-\\[1\\.55\\]{line-height:1.55}
.tracking-\\[0\\.14em\\]{letter-spacing:.14em}
.tracking-\\[0\\.20em\\]{letter-spacing:.20em}
.tracking-\\[0\\.28em\\]{letter-spacing:.28em}
.tracking-\\[0\\.30em\\]{letter-spacing:.30em}
.tracking-\\[0\\.3em\\]{letter-spacing:.30em}
.tracking-\\[-0\\.01em\\]{letter-spacing:-.01em}
.tracking-\\[-0\\.02em\\]{letter-spacing:-.02em}
.tracking-headline{letter-spacing:-.02em}
.tracking-eyebrow{letter-spacing:.08em}
/* Focus + disabled */
.focus\\:outline-none:focus{outline:none}
.focus\\:ring-4:focus{box-shadow:0 0 0 4px rgba(141,113,214,.30)}
.focus\\:ring-violet\\/30:focus{--tw-ring-color:rgba(141,113,214,.30)}
.disabled\\:cursor-default:disabled{cursor:default}
/* Transitions + transforms */
.transition-none{transition:none}
.transition{transition-property:color, background-color, border-color, box-shadow, transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms}
.transition-colors{transition-property:color, background-color, border-color;transition-duration:200ms;transition-timing-function:cubic-bezier(.4,0,.2,1)}
.transition-transform{transition-property:transform;transition-duration:200ms;transition-timing-function:cubic-bezier(.4,0,.2,1)}
.duration-200{transition-duration:200ms}
.ease-in-out{transition-timing-function:cubic-bezier(.4,0,.2,1)}
.-translate-y-\\[4px\\]{transform:translateY(-4px)}
.translate-x-\\[0\\]{transform:translateX(0)}
.-translate-x-1\\/2{transform:translateX(-50%)}
.-translate-z-0{transform:translateZ(0)}
.scale-105{transform:scale(1.05)}
.scale-110{transform:scale(1.1)}
.scale-\\[1\\.02\\]{transform:scale(1.02)}
/* Hover + group-hover states */
.hover\\:scale-105:hover{transform:scale(1.05)}
.hover\\:scale-110:hover{transform:scale(1.1)}
.hover\\:bg-violet\\/20:hover{background:rgba(141,113,214,.20)}
.hover\\:bg-violet\\/90:hover{background:rgba(141,113,214,.90)}
.hover\\:bg-cream:hover{background:var(--cream)}
.hover\\:bg-paper:hover{background:var(--paper)}
.hover\\:border-violet:hover{border-color:var(--violet)}
.hover\\:text-violet:hover{color:var(--violet)}
.hover\\:shadow-lg:hover{box-shadow:var(--shadow-lg)}
.group:hover .group-hover\\:scale-110{transform:scale(1.1)}
.group:hover .group-hover\\:bg-ink\\/30{background:rgba(0,0,0,.30)}
/* Backdrop blur variants */
.backdrop-blur{backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.backdrop-blur-sm{backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
/* Thumbnail avatar / play button tile sizes */
.h-\\[36px\\]{height:36px}
.h-\\[40px\\]{height:40px}
.h-\\[44px\\]{height:44px}
.h-\\[56px\\]{height:56px}
.h-\\[70px\\]{height:70px}
.h-\\[72px\\]{height:72px}
.h-\\[80px\\]{height:80px}
.h-\\[104px\\]{height:104px}
.w-\\[40px\\]{width:40px}
.w-\\[56px\\]{width:56px}
.w-\\[72px\\]{width:72px}
.w-\\[104px\\]{width:104px}
.-top-\\[48px\\]{top:-48px}
/* Edit-mode only Tailwind arbitrary-variant class names
   In JSX we write: className="hidden [html[data-edit-mode='true']_&]:inline-flex"
   DOM classes: "hidden" + "[html[data-edit-mode='true']_&]:inline-flex"
   These substring rules hide/show those elements cleanly without escape-hell. */
[class*="html[data-edit-mode"][class*="]:block"]{display:none}
[class*="html[data-edit-mode"][class*="]:inline-flex"]{display:none}
html[data-edit-mode="true"] [class*="html[data-edit-mode"][class*="]:block"]{display:block}
html[data-edit-mode="true"] [class*="html[data-edit-mode"][class*="]:inline-flex"]{display:inline-flex}
[data-edit-mode="true"] [data-editable="true"]{outline:2px solid var(--violet);outline-offset:2px;cursor:pointer}
/* Grid column span helpers */
.col-span-2{grid-column:span 2 / span 2}
/* Scroll marquee translate (for LogoTicker — just the final resting util) */
@keyframes ticker-x { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-50%,0,0)} }
.animate-ticker{animation:ticker-x 40s linear infinite}
/* Responsive md breakpoint (≥768px) equivalents of the most-used classes */
@media(min-width:768px){
.md\\:hidden{display:none}
.md\\:block{display:block}
.md\\:flex{display:flex}
.md\\:inline-flex{display:inline-flex}
.md\\:grid{display:grid}
.md\\:flex-row{flex-direction:row}
.md\\:flex-col{flex-direction:column}
.md\\:items-start{align-items:flex-start}
.md\\:items-center{align-items:center}
.md\\:items-end{align-items:flex-end}
.md\\:justify-start{justify-content:flex-start}
.md\\:justify-center{justify-content:center}
.md\\:justify-between{justify-content:space-between}
.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.md\\:col-span-2{grid-column:span 2 / span 2}
.md\\:w-auto{width:auto}
.md\\:w-\\[44px\\]{width:44px}
.md\\:h-\\[44px\\]{height:44px}
.md\\:h-\\[56px\\]{height:56px}
.md\\:text-\\[14px\\]{font-size:14px}
.md\\:text-\\[16px\\]{font-size:16px;line-height:1.35}
.md\\:text-\\[20px\\]{font-size:20px;line-height:1.4}
.md\\:text-\\[22px\\]{font-size:22px;line-height:1.3}
.md\\:text-\\[26px\\]{font-size:26px;line-height:1.25}
.md\\:text-\\[32px\\]{font-size:32px;line-height:1.1}
.md\\:text-\\[40px\\]{font-size:40px;line-height:1.05}
.md\\:text-\\[48px\\]{font-size:48px;line-height:1.08}
.md\\:text-\\[56px\\]{font-size:56px;line-height:1.05}
.md\\:text-\\[64px\\]{font-size:64px;line-height:1.05}
.md\\:px-\\[40px\\]{padding-left:40px;padding-right:40px}
.md\\:px-s8{padding-left:var(--spacing-s8);padding-right:var(--spacing-s8)}
.md\\:py-\\[14px\\]{padding-top:14px;padding-bottom:14px}
.md\\:py-\\[48px\\]{padding-top:48px;padding-bottom:48px}
.md\\:py-\\[56px\\]{padding-top:56px;padding-bottom:56px}
.md\\:py-\\[64px\\]{padding-top:64px;padding-bottom:64px}
.md\\:py-\\[80px\\]{padding-top:80px;padding-bottom:80px}
.md\\:py-\\[88px\\]{padding-top:88px;padding-bottom:88px}
.md\\:py-s9{padding-top:var(--spacing-s9);padding-bottom:var(--spacing-s9)}
.md\\:gap-6{gap:24px}
.md\\:gap-s6{gap:var(--spacing-s6)}
.md\\:gap-s7{gap:var(--spacing-s7)}
.md\\:gap-s8{gap:var(--spacing-s8)}
.md\\:gap-\\[20px\\]{gap:20px}
.md\\:gap-\\[28px\\]{gap:28px}
.md\\:gap-\\[32px\\]{gap:32px}
.md\\:gap-\\[40px\\]{gap:40px}
.md\\:gap-\\[48px\\]{gap:48px}
.md\\:gap-\\[56px\\]{gap:56px}
.md\\:max-w-\\[960px\\]{max-width:960px}
.md\\:max-w-\\[1040px\\]{max-width:1040px}
.md\\:max-w-\\[1120px\\]{max-width:1120px}
.md\\:rounded-lg{border-radius:20px}
}
/* Column width prose grid helpers used in Testimonial 2-column layouts */
.grid-cols-\\[1fr_1\\.4fr\\]{grid-template-columns:1fr 1.4fr}
.grid-cols-\\[minmax\\(0\\,1\\.1fr\\)_minmax\\(0\\,0\\.9fr\\)\\]{grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr)}
@media(min-width:768px){
.md\\:grid-cols-\\[1fr_1\\.4fr\\]{grid-template-columns:1fr 1.4fr}
.md\\:grid-cols-\\[minmax\\(0\\,1\\.1fr\\)_minmax\\(0\\,0\\.9fr\\)\\]{grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr)}
}
/* Arbitrary px-/py-/mt-/pt-/p- sizes used across Email/YouTube deck sections + contact spacing */
.px-\\[24px\\]{padding-left:24px;padding-right:24px}
.py-\\[88px\\]{padding-top:88px;padding-bottom:88px}
.mt-\\[8px\\]{margin-top:8px}
.pt-\\[16px\\]{padding-top:16px}
.p-\\[24px\\]{padding:24px}
.p-\\[28px\\]{padding:28px}
.gap-\\[6px\\]{gap:6px}
/* sm (≥640px) breakpoint utilities for the shared CTA row + hero stats layout */
@media(min-width:640px){
.sm\\:flex-row{flex-direction:row}
.sm\\:items-center{align-items:center}
.sm\\:justify-between{justify-content:space-between}
.sm\\:text-right{text-align:right}
}
/* lg (≥1024px) gap used in section 01 dual-screenshot layout */
@media(min-width:1024px){
.lg\\:gap-\\[40px\\]{gap:40px}
.lg\\:gap-\\[56px\\]{gap:56px}
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style
          data-hard="1"
          dangerouslySetInnerHTML={{ __html: hardCssInline }}
        />
      </head>
      <body
        className={`${poppins.className} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
