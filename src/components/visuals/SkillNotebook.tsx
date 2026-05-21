"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * SkillNotebook — a styled "open notebook" card showing a markdown excerpt.
 * Highlight bar sweeps line-by-line on a loop.
 */
const LINES = [
  { kind: "h", text: "# Booking rooms" },
  { kind: "p", text: "How we like things." },
  { kind: "h2", text: "## Defaults" },
  { kind: "li", text: "- prefer floor 3" },
  { kind: "li", text: "- smallest fit > biggest" },
  { kind: "h2", text: "## Must-haves" },
  { kind: "li", text: "- remote attendees → VC required" },
];

export function SkillNotebook() {
  const reduce = useReducedMotion();
  const lineH = 30;
  const baseTop = 56;

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* Notebook card */}
      <div className="relative rounded-2xl bg-paper border border-rule shadow-[0_18px_40px_-24px_rgba(43,38,32,0.18)] overflow-hidden">
        {/* Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-20 bg-accent-soft/80 border border-accent/30 rounded-sm rotate-[-2deg]" />
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-rule bg-cream/60">
          <span className="h-2.5 w-2.5 rounded-full bg-mcp/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-skill/70" />
          <span className="ml-3 font-mono text-xs text-ink-soft">SKILLS.md</span>
        </div>

        <div className="relative px-6 pt-4 pb-6 min-h-[280px]">
          {/* Animated highlight bar */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="absolute left-4 right-4 rounded-md bg-skill-soft/70 mix-blend-multiply"
              style={{ height: lineH - 2 }}
              initial={{ y: baseTop, opacity: 0 }}
              animate={{
                y: LINES.map((_, i) => baseTop + i * lineH),
                opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
              }}
              transition={{
                duration: LINES.length * 0.9,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.4,
              }}
            />
          )}

          <div className="relative font-mono text-[14px] leading-[30px] text-ink">
            {LINES.map((l, i) => {
              const cls =
                l.kind === "h"
                  ? "text-mcp font-semibold"
                  : l.kind === "h2"
                  ? "text-ink font-semibold"
                  : l.kind === "li"
                  ? "text-ink-soft"
                  : "text-ink-soft italic";
              return (
                <div key={i} className={cls}>
                  {l.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center font-scribble text-xl text-ink-soft">
        the agent reads this <em className="not-italic text-skill">first</em>
      </div>
    </div>
  );
}
