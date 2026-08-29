import Link from "next/link";

import { chromeBrand } from "@/chrome/brand";
import { footerColumns, footerLegalLinks } from "@/chrome/site-chrome";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--ob-color-border)] bg-[var(--ob-color-bg)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-[var(--ob-color-text)]">{site.name}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--ob-color-muted)]">{site.tagline}</p>
          {chromeBrand.siteUrl ? (
            <a
              href={chromeBrand.siteUrl}
              className="mt-3 inline-block text-sm text-[var(--ob-color-muted)] hover:text-[var(--ob-color-text)]"
            >
              {chromeBrand.siteUrl.replace(/^https?:\/\//, "")}
            </a>
          ) : null}
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold text-[var(--ob-color-text)]">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.external || link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      className="text-sm text-[var(--ob-color-muted)] hover:text-[var(--ob-color-text)]"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--ob-color-muted)] hover:text-[var(--ob-color-text)]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--ob-color-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 text-sm text-[var(--ob-color-muted)] sm:px-6">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          {footerLegalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[var(--ob-color-text)]"
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
