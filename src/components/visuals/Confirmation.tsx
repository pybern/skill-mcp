"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { popIn } from "@/lib/motion";

const CHIPS = [
  { label: "floor 3", note: "default", source: "skill" as const },
  { label: "has VC", note: "remote attendee", source: "mcp" as const },
  { label: "smallest fit", note: "cap 8 for 6", source: "skill" as const },
  { label: "$30/hr", note: "under confirm threshold", source: "mcp" as const },
];

export function Confirmation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="relative w-full max-w-[520px] mx-auto">
      {/* Confetti dots */}
      {!reduce && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { c: "bg-mcp", x: -20, y: 60, d: 0.3 },
            { c: "bg-skill", x: 90, y: 30, d: 0.5 },
            { c: "bg-accent", x: -10, y: 220, d: 0.7 },
            { c: "bg-mcp", x: 110, y: 240, d: 0.9 },
            { c: "bg-accent", x: 50, y: 8, d: 0.6 },
          ].map((d, i) => (
            <motion.span
              key={i}
              className={`absolute h-1.5 w-1.5 rounded-full ${d.c}`}
              style={{ left: `calc(50% + ${d.x}px)`, top: d.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                inView
                  ? { opacity: [0, 1, 0], scale: [0, 1, 1], y: [0, -16, -8] }
                  : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 1.2, delay: 0.5 + d.d }}
            />
          ))}
        </div>
      )}

      <motion.div
        variants={popIn}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="relative rounded-2xl bg-paper border border-rule shadow-[0_24px_50px_-28px_rgba(43,38,32,0.25)] overflow-hidden"
      >
        {/* Header strip */}
        <div className="bg-skill-soft/70 px-5 py-3 flex items-center gap-3 border-b border-skill/20">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-skill text-cream font-mono text-sm">
            ✓
          </span>
          <span className="font-display italic font-semibold text-ink text-lg">
            Booked.
          </span>
          <span className="ml-auto font-mono text-[11px] text-ink-soft">
            #cedar
          </span>
        </div>

        <div className="px-5 py-5">
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[14px]">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              room
            </div>
            <div className="font-display italic font-semibold text-ink">
              Cedar
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              when
            </div>
            <div className="font-mono text-ink">tomorrow · 14:00 — 15:00</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              for
            </div>
            <div className="font-mono text-ink">6 (2 remote)</div>
          </div>

          <div className="my-4 h-px bg-rule" />

          <div className="font-scribble text-lg text-ink-soft mb-2">
            why this one →
          </div>
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((c, i) => (
              <motion.span
                key={c.label}
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.12 }}
                className={
                  c.source === "skill"
                    ? "inline-flex items-center gap-1.5 rounded-full bg-skill-soft text-ink px-3 py-1 text-[12.5px] border border-skill/25"
                    : "inline-flex items-center gap-1.5 rounded-full bg-mcp-soft text-ink px-3 py-1 text-[12.5px] border border-mcp/25"
                }
              >
                <span
                  className={
                    c.source === "skill" ? "text-skill" : "text-mcp"
                  }
                >
                  {c.source === "skill" ? "skill" : "mcp"}
                </span>
                <span className="font-medium">{c.label}</span>
                <span className="text-ink-soft">· {c.note}</span>
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mt-5 text-center font-scribble text-xl text-ink-soft">
        a colleague, not a search engine.
      </div>
    </div>
  );
}
