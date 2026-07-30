import Link from "next/link";

import { FooterEditAccess } from "@/components/edit/FooterEditAccess";

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.25" cy="6.75" r="1.1" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M27.2 2.6C26.9 1.6 26.1 0.8 25.1 0.5C23 0 14 0 14 0C14 0 5 0 2.9 0.5C1.9 0.8 1.1 1.6 0.8 2.6C0.3 4.6 0.3 10 0.3 10C0.3 10 0.3 15.4 0.8 17.4C1.1 18.4 1.9 19.2 2.9 19.5C5 20 14 20 14 20C14 20 23 20 25.1 19.5C26.1 19.2 26.9 18.4 27.2 17.4C27.7 15.4 27.7 10 27.7 10C27.7 10 27.7 4.6 27.2 2.6Z"
        fill="currentColor"
      />
      <path d="M11.2 14.3L18.2 10L11.2 5.7V14.3Z" fill="#0C0A14" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M4 6.5L12 13L20 6.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://www.instagram.com/knwnlocal/",
    label: "Instagram",
    icon: <InstagramIcon />,
  },
  {
    href: "https://www.youtube.com/@RealEstateLegendsByKnwnLocal",
    label: "YouTube",
    icon: <YouTubeIcon />,
  },
  {
    href: "https://www.realestatelegends.show/",
    label: "Email",
    icon: <MailIcon />,
  },
];

export function Footer() {
  return (
    <footer className="bg-dark-radial text-paper">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[56px]">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-[32px] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-start justify-center gap-[24px] md:gap-[16px]">
            <Link href="/" className="text-[18px] tracking-[-0.02em]">
              <span className="font-bold">Knwn</span>
              <span className="font-normal">Local</span>
            </Link>

            <div className="flex flex-wrap items-center gap-[24px] text-white/80">
              <Link
                className="text-[14px] font-medium hover:text-white"
                href="/youtube"
              >
                Grow my YouTube Channel
              </Link>
              <Link
                className="text-[14px] font-medium hover:text-white"
                href="/email"
              >
                Monetize my Database
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center gap-[24px] md:items-end">
            <div className="flex items-center gap-[16px]">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={link.label}
                  className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-[color,border-color,background-color,transform] duration-200 hover:scale-105 hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  {link.icon}
                </a>
              ))}
            </div>

            <div className="flex flex-col items-start gap-s2 text-[14px] text-white/70 md:items-end">
              <div>knwnlocal.com</div>
              <FooterEditAccess />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
