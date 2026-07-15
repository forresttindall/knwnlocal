import Link from "next/link";

import { FooterEditAccess } from "@/components/edit/FooterEditAccess";

export function Footer() {
  return (
    <footer className="bg-dark-radial text-paper">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[56px] md:px-[40px]">
        <div className="flex flex-col gap-[32px] md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-[18px] tracking-[-0.02em]">
            <span className="font-bold">Knwn</span>
            <span className="font-normal">Local</span>
          </Link>

          <div className="flex flex-wrap items-center gap-[24px] text-white/80">
            <Link className="text-[14px] font-medium hover:text-white" href="/youtube">
              YouTube
            </Link>
            <Link className="text-[14px] font-medium hover:text-white" href="/email">
              Email
            </Link>
            <Link className="text-[14px] font-medium hover:text-white" href="/podcast">
              Podcast
            </Link>
          </div>

          <div className="flex flex-col items-start gap-s2 text-[14px] text-white/70 md:items-end">
            <div>knwnlocal.com</div>
            <FooterEditAccess />
          </div>
        </div>
      </div>
    </footer>
  );
}
