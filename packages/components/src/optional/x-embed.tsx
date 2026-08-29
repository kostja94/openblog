"use client";

import { useEffect, useRef, useState } from "react";

import { obMuted } from "../tokens";
import { cn } from "../utils";
import { isXStatusUrl, normalizeXStatusUrl } from "./x-status-url";

const TWITTER_WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

let widgetsScriptPromise: Promise<void> | null = null;

function loadTwitterWidgets(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.twttr?.widgets) return Promise.resolve();

  if (!widgetsScriptPromise) {
    widgetsScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${TWITTER_WIDGETS_SRC}"]`,
      );

      if (existing) {
        if (window.twttr?.widgets) {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Twitter widgets failed")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.src = TWITTER_WIDGETS_SRC;
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Twitter widgets failed"));
      document.body.appendChild(script);
    });
  }

  return widgetsScriptPromise;
}

type XEmbedProps = {
  url?: string;
};

/** Renders an X/Twitter status via the official widgets.js blockquote embed. */
export function XEmbed({ url }: XEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const normalizedUrl =
    url && isXStatusUrl(url) ? normalizeXStatusUrl(url) : null;

  useEffect(() => {
    if (!normalizedUrl || !containerRef.current) return;

    let cancelled = false;

    loadTwitterWidgets()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        window.twttr?.widgets.load(containerRef.current);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedUrl]);

  if (!normalizedUrl) {
    return null;
  }

  if (failed) {
    return (
      <div className="my-6">
        <p className={cn("text-sm", obMuted)}>
          <a
            href={normalizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            View post on X
          </a>
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6"
      aria-busy={loaded ? undefined : true}
      aria-label="Embedded X post"
    >
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={normalizedUrl}>Loading post from X…</a>
      </blockquote>
      <noscript>
        <p className={cn("text-sm", obMuted)}>
          <a href={normalizedUrl} target="_blank" rel="noopener noreferrer">
            View post on X
          </a>
        </p>
      </noscript>
    </div>
  );
}
