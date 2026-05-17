"use client";

import { useEffect, useRef } from "react";

export function SiteFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resize = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const height = Math.max(
          doc.documentElement.scrollHeight,
          doc.body?.scrollHeight ?? 0,
        );
        iframe.style.height = `${height}px`;
      } catch {
        iframe.style.minHeight = "100dvh";
      }
    };

    const onLoad = () => {
      resize();
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const observer = new ResizeObserver(resize);
        observer.observe(doc.documentElement);
        if (doc.body) observer.observe(doc.body);
        return () => observer.disconnect();
      } catch {
        /* same-origin only */
      }
    };

    iframe.addEventListener("load", onLoad);
    window.addEventListener("resize", resize);
    return () => {
      iframe.removeEventListener("load", onLoad);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/landing.html"
      className="site-frame"
      title="ИнжКапСтрой — Комплексное проектирование под ключ"
    />
  );
}
