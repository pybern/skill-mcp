"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ROOMS } from "@/lib/rooms";
import { cardIn, staggerParent } from "@/lib/motion";

const TOOL_CALL = "mcp ▸ rooms.search { date: 'tomorrow', time: '14:00', size: 6 }";

export function RoomStream() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(() => setTyped(TOOL_CALL), 0);
      return () => clearTimeout(t);
    }
    if (!inView) {
      const t = setTimeout(() => setTyped(""), 0);
      return () => clearTimeout(t);
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(TOOL_CALL.slice(0, i));
      if (i >= TOOL_CALL.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const callDone = typed.length === TOOL_CALL.length;

  return (
    <div ref={ref} className="w-full max-w-[560px] mx-auto">
      {/* Tool call line */}
      <div className="rounded-xl bg-ink/95 text-cream px-4 py-3 font-mono text-[12px] md:text-[13px] leading-relaxed shadow-[0_18px_40px_-24px_rgba(43,38,32,0.4)]">
        <span className="text-accent">$</span>{" "}
        <span>{typed}</span>
        {typed.length < TOOL_CALL.length && <span className="caret">|</span>}
      </div>

      {/* Streamed JSON cards */}
      <motion.div
        key={callDone ? "done" : "pending"}
        initial="hidden"
        animate={callDone ? "show" : "hidden"}
        variants={staggerParent(0.18, 0.1)}
        className="mt-5 grid grid-cols-2 gap-3"
      >
        {ROOMS.map((r) => (
          <motion.div
            key={r.id}
            variants={cardIn}
            className="rounded-xl bg-paper border border-rule p-4 shadow-[0_10px_22px_-18px_rgba(43,38,32,0.25)]"
          >
            <div className="flex items-baseline justify-between mb-2">
              <div className="font-display italic font-semibold text-ink text-lg">
                {r.name}
              </div>
              <div className="font-mono text-[11px] text-ink-soft">#{r.id}</div>
            </div>
            <pre className="font-mono text-[11.5px] leading-[1.55] text-ink-soft whitespace-pre-wrap">
{`{
  floor: ${r.floor},
  cap: ${r.capacity},
  vc: ${r.hasVc},
  $/hr: ${r.pricePerHour}
}`}
            </pre>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 font-scribble text-lg text-ink-soft text-center">
        raw facts. <em className="text-mcp not-italic">no opinion.</em>
      </div>
    </div>
  );
}
