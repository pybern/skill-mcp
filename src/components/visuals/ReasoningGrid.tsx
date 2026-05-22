"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { clsx } from "clsx";
import { ROOMS, REQUEST, WINNER_ID, type Room } from "@/lib/rooms";

/**
 * ReasoningGrid — the agent literally "thinking out loud."
 *
 * For each candidate room we render a small trace block:
 *   → Ash    f5 · 4p · — · $18
 *     [✗ remote → VC]
 *     out — missing VC
 *
 * Blocks stream in sequentially when the slide enters view, giving the
 * feel of an agent working through its checklist one room at a time.
 */

type Verdict = "drop" | "skip" | "winner";

type Check = {
  ok: boolean;
  label: string;
  rule: "vc" | "floor" | "size" | "price";
};

type Trace = {
  room: Room;
  checks: Check[];
  verdict: Verdict;
  reason: string;
};

function evaluate(r: Room): Trace {
  const checks: Check[] = [];

  // 1) MUST: remote attendees ⇒ VC required.
  if (REQUEST.remoteAttendees > 0) {
    checks.push({
      rule: "vc",
      ok: r.hasVc,
      label: r.hasVc ? "has VC" : "remote → VC",
    });
    if (!r.hasVc) {
      return { room: r, checks, verdict: "drop", reason: "missing VC" };
    }
  }

  // 2) DEFAULT: floor 3.
  checks.push({
    rule: "floor",
    ok: r.floor === 3,
    label: r.floor === 3 ? "floor 3" : `floor ${r.floor}`,
  });

  // 3) PREFER: smallest fit.
  const fits = r.capacity >= REQUEST.size;
  const oversize = r.capacity > REQUEST.size + 2;
  checks.push({
    rule: "size",
    ok: fits && !oversize,
    label: !fits
      ? "too small"
      : oversize
      ? `cap ${r.capacity} (oversized)`
      : `fits ${REQUEST.size}`,
  });

  // 4) GUARD: ≤ $50/hr.
  const priceOk = r.pricePerHour <= 50;
  checks.push({
    rule: "price",
    ok: priceOk,
    label: `$${r.pricePerHour}/hr`,
  });

  if (r.id === WINNER_ID) {
    return { room: r, checks, verdict: "winner", reason: "all rules pass" };
  }
  if (!priceOk) {
    return { room: r, checks, verdict: "skip", reason: "over $50 — needs confirm" };
  }
  return { room: r, checks, verdict: "drop", reason: "not the best fit" };
}

const VERDICT_STYLE: Record<Verdict, { label: string; chip: string; text: string }> = {
  drop: {
    label: "out",
    chip: "bg-mcp/10 text-mcp border-mcp/30",
    text: "text-mcp",
  },
  skip: {
    label: "skip",
    chip: "bg-rule text-ink-soft border-rule",
    text: "text-ink-soft",
  },
  winner: {
    label: "pick",
    chip: "bg-accent/15 text-accent border-accent/40",
    text: "text-accent",
  },
};

export function ReasoningGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: false });
  const reduce = useReducedMotion();

  const traces = ROOMS.map(evaluate);

  return (
    <div ref={ref} className="w-full max-w-[560px] mx-auto">
      <div className="relative rounded-2xl bg-paper border border-rule p-5 shadow-[0_18px_40px_-24px_rgba(43,38,32,0.18)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-rule">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            agent · reasoning
          </div>
          <div className="font-scribble text-lg text-mcp">thinking out loud…</div>
        </div>

        {/* Request summary */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.35 }}
          className="mb-3 flex items-baseline gap-2 text-[12px] text-ink-soft"
        >
          <span className="font-scribble text-base text-ink-soft">ask:</span>
          <span className="text-ink">
            room for <span className="font-semibold">{REQUEST.size}</span> at{" "}
            <span className="font-semibold">2pm</span> ·{" "}
            <span className="font-semibold">{REQUEST.remoteAttendees} remote</span>
          </span>
        </motion.div>

        {/* Per-room reasoning trace */}
        <ol className="space-y-2.5">
          {traces.map((t, i) => {
            const style = VERDICT_STYLE[t.verdict];
            const isWinner = t.verdict === "winner";
            return (
              <motion.li
                key={t.room.id}
                initial={{ opacity: 0, y: 6 }}
                animate={
                  inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
                }
                transition={{
                  duration: 0.45,
                  delay: 0.15 + i * 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={clsx(
                  "relative rounded-lg border px-3 py-2",
                  isWinner
                    ? "bg-accent-soft/40 border-accent/50 shadow-[0_0_0_3px_rgba(217,164,65,0.12)]"
                    : t.verdict === "drop"
                    ? "bg-paper border-rule opacity-80"
                    : "bg-paper border-rule",
                )}
              >
                {/* Room headline */}
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span
                      className={clsx(
                        "font-mono text-[11px]",
                        isWinner ? "text-accent" : "text-ink-soft/70",
                      )}
                    >
                      →
                    </span>
                    <span className="font-display italic font-semibold text-ink text-[15px]">
                      {t.room.name}
                    </span>
                    <span className="font-mono text-[10.5px] text-ink-soft truncate">
                      f{t.room.floor} · {t.room.capacity}p ·{" "}
                      {t.room.hasVc ? "vc" : "—"} · ${t.room.pricePerHour}
                    </span>
                  </div>
                  <span
                    className={clsx(
                      "shrink-0 rounded-full border px-2 py-[1px] font-mono text-[9.5px] uppercase tracking-[0.12em]",
                      style.chip,
                    )}
                  >
                    {style.label}
                  </span>
                </div>

                {/* Check chips */}
                <div className="mt-1.5 flex flex-wrap gap-1.5 pl-5">
                  {t.checks.map((c, j) => (
                    <span
                      key={j}
                      className={clsx(
                        "inline-flex items-center gap-1 rounded-md border px-1.5 py-[1px] font-mono text-[10.5px]",
                        c.ok
                          ? "border-skill/30 bg-skill-soft/30 text-skill"
                          : "border-mcp/30 bg-mcp-soft/40 text-mcp",
                      )}
                    >
                      <span aria-hidden className="font-semibold">
                        {c.ok ? "✓" : "✗"}
                      </span>
                      {c.label}
                    </span>
                  ))}
                </div>

                {/* Verdict reason */}
                <div className="mt-1.5 pl-5">
                  <span
                    className={clsx(
                      "font-scribble text-[15px]",
                      style.text,
                    )}
                  >
                    {isWinner ? "→ " : ""}
                    {t.reason}
                  </span>
                </div>

                {/* Winner star */}
                {isWinner && !reduce && (
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.15 + traces.length * 0.35 + 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 16,
                    }}
                    className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-cream font-mono text-[13px] shadow-[0_4px_10px_-4px_rgba(217,164,65,0.6)]"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.li>
            );
          })}
        </ol>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.5, delay: 0.15 + traces.length * 0.35 + 0.2 }}
          className="mt-4 flex items-center gap-2 pt-3 border-t border-rule"
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
