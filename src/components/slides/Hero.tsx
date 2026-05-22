"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerParent } from "@/lib/motion";
import {
  HoverCodeReveal,
  MCP_REVEAL,
  SKILL_REVEAL,
} from "@/components/visuals/HoverCodeReveal";

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
          <HoverCodeReveal
            label="Skills"
            ariaLabel="Skills — show the SKILL.md spec"
            reveal={SKILL_REVEAL}
            accent="skill"
            align="left"
            // Skills = the playbook, hand-written prose → more cursive feel
            triggerClassName="font-scribble font-medium text-[1.1em] leading-[0.85] align-baseline"
          />
          <span className="font-scribble text-mcp mx-2 md:mx-4 align-middle text-[0.7em]">
            ×
          </span>
          <HoverCodeReveal
            label="MCP"
            ariaLabel="MCP — show code examples"
            reveal={MCP_REVEAL}
            accent="mcp"
            align="right"
            // MCP = the data pipe, a protocol → mono, code-like, tightly tracked
            triggerClassName="font-mono font-bold tracking-[-0.04em] text-[0.88em] text-skill"
          />
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
          className="mt-4 font-scribble text-base text-ink-soft/80"
        >
          <span aria-hidden>↑</span> hover to peek — click for the breakdown
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="mt-12 font-mono text-xs uppercase tracking-[0.25em] text-ink-soft/70"
        >
          scroll ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
