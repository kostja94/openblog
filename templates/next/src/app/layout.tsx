import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { OpenBlogProvider } from "@openblog/components";

import { absoluteUrl, site } from "@/config/site";
import { config, getThemeColorModeClass } from "@/lib/openblog-config";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${getThemeColorModeClass()} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--ob-color-bg)] text-[var(--ob-color-text)]">
        <OpenBlogProvider config={config}>
          {children}
        </OpenBlogProvider>
      </body>
    </html>
  );
}
