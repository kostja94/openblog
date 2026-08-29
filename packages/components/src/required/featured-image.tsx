"use client";

import Image from "next/image";

import { resolvePostImageUrl } from "@openblog/core";

import { useSiteHelpers } from "../provider";
import { obBorder, obCodeBg } from "../tokens";

export function FeaturedImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const site = useSiteHelpers();
  const resolved = resolvePostImageUrl(src, site.absoluteUrl) ?? src;
  const isExternal = resolved.startsWith("http");

  return (
    <figure className={`mt-8 overflow-hidden rounded-2xl border ${obBorder} ${obCodeBg}`}>
      {isExternal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={alt}
          className="aspect-[16/9] w-full object-cover"
          loading="eager"
        />
      ) : (
        <Image
          src={resolved}
          alt={alt}
          width={1200}
          height={675}
          className="aspect-[16/9] w-full object-cover"
          priority
        />
      )}
    </figure>
  );
}
