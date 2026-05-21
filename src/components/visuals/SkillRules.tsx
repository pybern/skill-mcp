"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { RULES } from "@/lib/rooms";

/**
 * Renders rich-text emphasis from rule labels using **bold** markdown.
 */
function RichRuleText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="text-ink font-semibold">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

const KIND_LABEL: Record<string, string> = {
  must: "must",
  default: "default",
  prefer: "prefer",
  guard: "guard",
};

const KIND_COLOR: Record<string, string> = {
  must: "bg-mcp-soft text-mcp",
  default: "bg-skill-soft text-skill",
  prefer: "bg-accent-soft text-accent",
  guard: "bg-rule text-ink-soft",
};

export function SkillRules() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="w-full max-w-[560px] mx-auto">
      <div className="relative rounded-2xl bg-paper border border-rule shadow-[0_18px_40px_-24px_rgba(43,38,32,0.18)] overflow-hidden">
        {/* Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-24 bg-skill-soft/80 border border-skill/30 rounded-sm rotate-[-2deg]" />

        <div className="flex items-center gap-2 px-5 py-3 border-b border-rule bg-cream/60">
          <span className="font-mono text-xs text-ink-soft">SKILLS.md</span>
          <span className="font-mono text-xs text-ink-soft/60">— Room booking</span>
        </div>

        <ol className="relative p-5 space-y-3">
          {/* Highlight bar — uses CSS variables computed per-rule via index */}
          {!reduce && inView && (
            <motion.div
              aria-hidden
              className="absolute left-3 right-3 rounded-md bg-skill-soft/60 mix-blend-multiply pointer-events-none"
              style={{ height: 64 }}
              initial={{ y: 16, opacity: 0 }}
              animate={{
                y: RULES.map((_, i) => 16 + i * 76),
                opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              }}
              transition={{
                duration: RULES.length * 1.1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.4,
              }}
            />
          )}

          {RULES.map((r, i) => (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.12 }}
              className="relative flex items-start gap-3 py-2 px-3"
            >
              <span
                className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${KIND_COLOR[r.kind]}`}
              >
                {KIND_LABEL[r.kind]}
              </span>
              <div className="flex-1 text-[15px] leading-relaxed text-ink-soft">
                <RichRuleText text={r.label} />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="mt-4 text-center font-scribble text-xl text-ink-soft">
        the rules of the road
      </div>
    </div>
  );
}
