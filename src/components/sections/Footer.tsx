import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="text-white"
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%, #1a1530 0%, #0d0b1a 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[56px] md:px-[40px]">
        <div className="flex flex-col gap-[32px] md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-[18px] tracking-[-0.02em]">
            <span className="font-bold">Knwn</span>
            <span className="font-normal">Local</span>
          </Link>

          <div className="flex flex-wrap items-center gap-[24px] text-white/80">
            <Link className="text-[14px] font-medium hover:text-white" href="#problem">
              Problem
            </Link>
            <Link className="text-[14px] font-medium hover:text-white" href="#process">
              Process
            </Link>
            <Link className="text-[14px] font-medium hover:text-white" href="#pricing">
              Pricing
            </Link>
          </div>

          <div className="text-[14px] text-white/70">knwnlocal.com</div>
        </div>
      </div>
    </footer>
  );
}
