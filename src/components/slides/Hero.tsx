"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerParent } from "@/lib/motion";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh w-full items-center justify-center px-6 md:px-12 py-16 paper-grain"
    >
      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ amount: 0.5, once: false }}
        variants={staggerParent(0.12, 0.05)}
        className="mx-auto w-full max-w-4xl text-center"
      >
        <motion.div
          variants={fadeUp}
          className="font-scribble text-2xl text-ink-soft mb-2"
        >
          an interactive note
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="font-display font-medium leading-[0.95] tracking-tight text-ink text-[clamp(56px,11vw,144px)]"
        >
          Skills
          <span className="font-scribble text-mcp mx-2 md:mx-4 align-middle text-[0.7em]">
            ×
          </span>
          <em className="not-italic text-skill italic font-semibold">MCP</em>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-ink-soft"
        >
          MCPs fetch the world.{" "}
          <span className="text-ink font-medium">SKILLS.md</span> teaches the
          agent what to do with what comes back.
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="mt-16 font-mono text-xs uppercase tracking-[0.25em] text-ink-soft/70"
        >
          scroll ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
