"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { REQUEST } from "@/lib/rooms";

export function ChatBubble() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: false });
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(() => setTyped(REQUEST.text), 0);
      return () => clearTimeout(t);
    }
    if (!inView) {
      const t = setTimeout(() => setTyped(""), 0);
      return () => clearTimeout(t);
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(REQUEST.text.slice(0, i));
      if (i >= REQUEST.text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="w-full max-w-[520px] mx-auto">
      <div className="rounded-2xl bg-paper border border-rule shadow-[0_18px_40px_-24px_rgba(43,38,32,0.18)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-rule bg-cream/60">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            #room-booking
          </span>
          <span className="ml-auto font-mono text-[11px] text-ink-soft/70">
            today · 4:12pm
          </span>
        </div>

        <div className="p-6 space-y-4">
          {/* Other side preface */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-skill-soft flex items-center justify-center font-display italic text-skill text-sm">
              p
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-cream px-4 py-2.5 text-ink-soft text-sm max-w-[78%]">
              hey, can you book us a room?
            </div>
          </motion.div>

          {/* User typewriter bubble */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-start gap-3 justify-end"
          >
            <div className="rounded-2xl rounded-tr-sm bg-mcp text-cream px-4 py-3 text-[15px] leading-relaxed max-w-[78%]">
              <span>{typed}</span>
              {typed.length < REQUEST.text.length && <span className="caret">|</span>}
            </div>
            <div className="h-8 w-8 rounded-full bg-mcp-soft flex items-center justify-center font-display italic text-mcp text-sm">
              j
            </div>
          </motion.div>

          {/* Agent thinking */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              inView && typed.length === REQUEST.text.length
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-paper border border-rule flex items-center justify-center font-display italic text-ink text-sm">
              a
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-cream border border-rule px-4 py-2.5 text-ink-soft text-sm flex gap-1">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              >
                ·
              </motion.span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              >
                ·
              </motion.span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              >
                ·
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-5 text-center font-scribble text-xl text-ink-soft">
        plain english, no fields.
      </div>
    </div>
  );
}
