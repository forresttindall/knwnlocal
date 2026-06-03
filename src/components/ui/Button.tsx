import { ArrowUpRight } from "lucide-react";
import * as React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-[16px] font-medium leading-none transition-[transform,background-color,color,border-color] duration-[400ms] ease-out active:scale-[0.98]";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-black text-white font-semibold hover:bg-black/95",
  secondary: "bg-[#8d71d6] text-white font-semibold hover:bg-[#7059be]",
  ghost:
    "bg-transparent text-black border-[1.5px] border-black hover:bg-black hover:text-white",
};

function ArrowBadge() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white ring-1 ring-white/20">
      <ArrowUpRight aria-hidden size={16} strokeWidth={1.5} />
    </span>
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  if ("href" in props) {
    const { href, ...linkProps } = rest as ButtonAsLinkProps;
    const isExternalOrHash =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#");

    if (isExternalOrHash) {
      return (
        <a href={href} className={classes} {...linkProps}>
          <span>{children}</span>
          {variant === "primary" ? <ArrowBadge /> : null}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...linkProps}>
        <span>{children}</span>
        {variant === "primary" ? <ArrowBadge /> : null}
      </Link>
    );
  }

  const buttonProps = rest as ButtonAsButtonProps;
  return (
    <button className={classes} {...buttonProps}>
      <span>{children}</span>
      {variant === "primary" ? <ArrowBadge /> : null}
    </button>
  );
}
