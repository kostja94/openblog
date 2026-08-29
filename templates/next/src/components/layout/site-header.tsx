"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { chromeBrand } from "@/chrome/brand";
import { headerLinks, type SiteNavLink } from "@/chrome/site-chrome";
import { blogPath } from "@/config/site";
import { cn } from "@/lib/utils";

function NavLink({ link }: { link: SiteNavLink }) {
  const pathname = usePathname();
  const href = link.href.startsWith("http") ? link.href : link.href;
  const isActive =
    link.match === "blog"
      ? pathname.startsWith(blogPath()) || pathname === blogPath()
      : link.match === "exact"
        ? pathname === href
        : false;

  const className = cn(
    "text-sm font-medium text-[var(--ob-color-muted)] transition hover:text-[var(--ob-color-text)]",
    isActive && "text-[var(--ob-color-text)]",
  );

  if (link.external || link.href.startsWith("http")) {
    return (
      <a href={link.href} className={className} target="_blank" rel="noreferrer">
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

function SiteLogo() {
  const { logo, logoAlt, homeUrl } = chromeBrand;
  const isExternalHome = homeUrl.startsWith("http");

  const logoContent = logo ? (
    <>
      {logo.startsWith("http") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={logoAlt} className="h-8 w-auto" />
      ) : (
        <Image src={logo} alt={logoAlt} width={32} height={32} className="h-8 w-auto" />
      )}
      <span className="font-semibold tracking-tight text-[var(--ob-color-text)]">{logoAlt}</span>
    </>
  ) : (
    <span className="font-semibold tracking-tight text-[var(--ob-color-text)]">{logoAlt}</span>
  );

  const className = "flex items-center gap-2";

  if (isExternalHome) {
    return (
      <a href={homeUrl} className={className}>
        {logoContent}
      </a>
    );
  }

  return (
    <Link href={homeUrl} className={className}>
      {logoContent}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--ob-color-border)] bg-[var(--ob-color-surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <SiteLogo />
        <nav className="flex flex-wrap items-center gap-5">
          {headerLinks.map((link) => (
            <NavLink key={link.label} link={link} />
          ))}
        </nav>
      </div>
    </header>
  );
}
