"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Duet — two streams (data + guidance) merge into a single action node.
 * Left column: terracotta JSON-ish snippets falling.
 * Right column: sage ruled lines falling.
 * They funnel into a central node which pulses warmly.
 */
const DATA_LINES = [
  "{ room: 'cedar', cap: 8 }",
  "{ floor: 3, vc: true }",
  "{ price: 30 }",
  "{ ts: 14:00 }",
];

const RULE_LINES = [
  "must have VC",
  "default floor 3",
  "smallest fit",
  "confirm > $50",
];

export function Duet() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full aspect-[5/5] max-w-[480px] mx-auto">
      <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full">
        {/* Funnel lines */}
        <path
          d="M 90 80 C 90 220, 200 280, 240 320"
          stroke="var(--color-mcp)"
          strokeWidth="1.25"
          strokeDasharray="3 4"
          fill="none"
        />
        <path
          d="M 390 80 C 390 220, 280 280, 240 320"
          stroke="var(--color-skill)"
          strokeWidth="1.25"
          strokeDasharray="3 4"
          fill="none"
        />
      </svg>

      {/* Left stream (MCP data) */}
      <div className="absolute left-0 top-0 w-1/2 px-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mcp/80 mb-2">
          mcp · data
        </div>
        <div className="relative h-[240px] overflow-hidden">
          {DATA_LINES.map((t, i) => (
            <motion.div
              key={t}
              initial={false}
              animate={
                reduce
                  ? { opacity: 1, y: i * 36 }
                  : { y: [-40, 220], opacity: [0, 1, 1, 0] }
              }
              transition={{
                duration: 3.2,
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.7,
              }}
              className="absolute left-0 right-2 font-mono text-[12px] text-mcp"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right stream (Skill guidance) */}
      <div className="absolute right-0 top-0 w-1/2 px-3 text-right">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-skill/80 mb-2">
          skills · guidance
        </div>
        <div className="relative h-[240px] overflow-hidden">
          {RULE_LINES.map((t, i) => (
            <motion.div
              key={t}
              initial={false}
              animate={
                reduce
                  ? { opacity: 1, y: i * 36 }
                  : { y: [-40, 220], opacity: [0, 1, 1, 0] }
              }
              transition={{
                duration: 3.2,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 0.35 + i * 0.7,
              }}
              className="absolute left-2 right-0 font-display italic text-[14px] text-skill"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Central action node */}
      <motion.div
        className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={reduce ? { scale: 1 } : { scale: [1, 1.07, 1] }}
        transition={{
          duration: 2.2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent-soft/70 blur-md" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-paper border border-accent/40 shadow-[0_8px_30px_-10px_rgba(217,164,65,0.5)]">
            <span className="font-display italic font-semibold text-[20px] text-ink">
              action
            </span>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-1 left-0 right-0 text-center font-scribble text-xl text-ink-soft">
        facts + taste → a real answer
      </div>
    </div>
  );
}
