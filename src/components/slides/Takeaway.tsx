"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerParent } from "@/lib/motion";

export function Takeaway() {
  const reduce = useReducedMotion();
  return (
    <section
      id="takeaway"
      className="relative flex min-h-dvh w-full items-center justify-center px-6 md:px-12 py-16"
    >
      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ amount: 0.5, once: false }}
        variants={staggerParent(0.14, 0.05)}
        className="mx-auto w-full max-w-4xl text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="font-display font-medium text-[clamp(44px,8vw,96px)] leading-[1.02] tracking-tight text-ink"
        >
          <span className="text-mcp">MCPs</span> fetch.{" "}
          <span className="text-skill">Skills</span> decide.
          <br />
          <em className="italic">Agents deliver.</em>
        </motion.h2>
        <motion.div
          variants={fadeUp}
          className="mt-10 font-scribble text-2xl text-ink-soft"
        >
          thanks for scrolling.
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="mt-12 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft/70"
        >
          <span className="text-ink-soft/50">{"//"}</span> built with next.js · tailwind v4 · motion
        </motion.div>
      </motion.div>
    </section>
  );
}
