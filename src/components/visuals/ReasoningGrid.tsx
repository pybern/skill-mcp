"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { clsx } from "clsx";
import { ROOMS, RULES, WINNER_ID, REQUEST, type Room } from "@/lib/rooms";

type Status = "ok" | "violates" | "winner";

function evaluateRoom(r: Room): { status: Status; failedRule?: string; notes: string[] } {
  const notes: string[] = [];
  // Rule: VC required if remote attendees
  if (REQUEST.remoteAttendees > 0 && !r.hasVc) {
    return { status: "violates", failedRule: "vc", notes: ["no VC"] };
  }
  // Capacity must fit
  if (r.capacity < REQUEST.size) {
    return { status: "violates", failedRule: "size", notes: ["too small"] };
  }
  if (r.floor !== 3) notes.push("off-floor");
  if (r.capacity > REQUEST.size + 2) notes.push("oversized");
  return { status: r.id === WINNER_ID ? "winner" : "ok", notes };
}

export function ReasoningGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  const reduce = useReducedMotion();

  const evaluated = ROOMS.map((r) => ({ room: r, ...evaluateRoom(r) }));

  return (
    <div ref={ref} className="w-full max-w-[560px] mx-auto">
      <div className="relative rounded-2xl bg-paper border border-rule p-5 shadow-[0_18px_40px_-24px_rgba(43,38,32,0.18)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            agent · reasoning
          </div>
          <div className="font-scribble text-lg text-mcp">thinking out loud…</div>
        </div>

        {/* Two columns: rules on left, rooms on right */}
        <div className="grid grid-cols-[1fr_1fr] gap-6 relative">
          {/* Rules column */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-skill mb-1">
              skill rules
            </div>
            {RULES.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="rounded-md bg-skill-soft/50 border border-skill/15 px-2.5 py-1.5 text-[12px] text-ink-soft"
              >
                <span className="font-mono text-[10px] text-skill mr-1.5">
                  {r.kind}
                </span>
                {r.id === "vc"
                  ? "remote → VC"
                  : r.id === "floor"
                  ? "floor = 3"
                  : r.id === "size"
                  ? "smallest fit"
                  : "$/hr ≤ 50"}
              </motion.div>
            ))}
          </div>

          {/* Rooms column */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mcp mb-1">
              mcp rooms
            </div>
            {evaluated.map((e, i) => {
              const isViolates = e.status === "violates";
              const isWinner = e.status === "winner";
              return (
                <motion.div
                  key={e.room.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={
                    inView
                      ? {
                          opacity: isViolates ? 0.32 : 1,
                          x: 0,
                          scale: isWinner ? 1.02 : 1,
                        }
                      : { opacity: 0, x: 8 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={clsx(
                    "relative rounded-md border px-2.5 py-1.5 text-[12px] flex items-center justify-between",
                    isWinner
                      ? "bg-accent-soft/60 border-accent text-ink shadow-[0_0_0_3px_rgba(217,164,65,0.18)]"
                      : isViolates
                      ? "bg-paper border-rule text-ink-soft line-through decoration-mcp/60"
                      : "bg-paper border-rule text-ink-soft",
                  )}
                >
                  <span className="font-display italic font-semibold">
                    {e.room.name}
                  </span>
                  <span className="font-mono text-[10px]">
                    f{e.room.floor} · {e.room.capacity}p ·{" "}
                    {e.room.hasVc ? "vc" : "—"} · ${e.room.pricePerHour}
                  </span>
                  {isWinner && !reduce && (
                    <motion.span
                      aria-hidden
                      className="absolute -right-2 -top-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-accent text-cream font-mono text-[12px]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 18 }}
                    >
                      ✓
                    </motion.span>
                  )}
                  {isViolates && e.notes[0] && (
                    <span className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full ml-2 hidden md:inline font-scribble text-mcp text-sm whitespace-nowrap">
                      {e.notes[0]}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Connecting lines (SVG overlay).
             We pin width/height inline because, without them, Chrome
             gives the <svg> its viewBox-derived intrinsic size (1:1
             square) instead of stretching to fill the absolutely
             positioned box — which made the dashed connectors leak far
             below the card. */}
          <svg
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {evaluated.map((e, i) => {
              const ruleIdx = RULES.findIndex(
                (r) => r.id === (e.failedRule ?? (e.status === "winner" ? "floor" : "size")),
              );
              if (ruleIdx < 0) return null;
              const y1 = 18 + ruleIdx * 16; // approx
              const y2 = 18 + i * 16;
              const color =
                e.status === "violates" ? "var(--color-mcp)" : "var(--color-skill)";
              return (
                <motion.line
                  key={e.room.id}
                  x1={48}
                  y1={y1}
                  x2={52}
                  y2={y2}
                  stroke={color}
                  strokeWidth={0.4}
                  strokeDasharray="1.2 1.2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    inView
                      ? { pathLength: 1, opacity: e.status === "winner" ? 0.9 : 0.35 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.7, delay: 1 + i * 0.15 }}
                />
              );
            })}
          </svg>
        </div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.5, delay: 1.9 }}
          className="mt-5 flex items-center gap-2 pt-3 border-t border-rule"
        >
          <span className="font-scribble text-lg text-ink-soft">winner:</span>
          <span className="font-display italic font-semibold text-ink">
            Cedar
          </span>
          <span className="font-mono text-[11px] text-ink-soft">
            (floor 3 · cap 8 · vc · $30/hr)
          </span>
        </motion.div>
      </div>
    </div>
  );
}
