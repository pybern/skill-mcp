"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

type Props = {
  ids: { id: string; label: string }[];
  /** Ref / element id of the scroll container (the .snap-deck <main>). */
  containerId: string;
};

export function ProgressRail({ ids, containerId }: Props) {
  const [activeId, setActiveId] = useState<string>(ids[0]?.id ?? "");

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sections = ids
      .map((d) => document.getElementById(d.id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the section with the largest intersection ratio that is intersecting.
        let best: { id: string; ratio: number } | null = null;
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            if (!best || e.intersectionRatio > best.ratio) {
              best = { id, ratio: e.intersectionRatio };
            }
          }
        }
        if (best) setActiveId(best.id);
      },
      {
        root: container,
        threshold: [0.5, 0.6, 0.75],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids, containerId]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-center gap-3"
    >
      {ids.map((d) => {
        const active = d.id === activeId;
        return (
          <button
            key={d.id}
            type="button"
            aria-label={`Go to ${d.label}`}
            aria-current={active ? "true" : undefined}
            onClick={() => handleClick(d.id)}
            className="group relative flex items-center justify-center p-1.5 cursor-pointer"
          >
            <span
              className={clsx(
                "block rounded-full transition-all duration-300 ease-out",
                active
                  ? "h-2.5 w-2.5 bg-ink"
                  : "h-1.5 w-1.5 bg-ink/25 group-hover:bg-ink/55",
              )}
            />
            <span
              className={clsx(
                "pointer-events-none absolute right-full mr-3 whitespace-nowrap font-sans text-[11px] uppercase tracking-[0.16em] text-ink-soft transition-opacity",
                active ? "opacity-100" : "opacity-0 group-hover:opacity-70",
              )}
            >
              {d.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
