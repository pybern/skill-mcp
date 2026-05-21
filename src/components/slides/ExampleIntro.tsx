"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerParent } from "@/lib/motion";

export function ExampleIntro() {
  const reduce = useReducedMotion();
  return (
    <section
      id="example-intro"
      className="relative flex min-h-dvh w-full items-center justify-center px-6 md:px-12 py-16"
    >
      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ amount: 0.5, once: false }}
        variants={staggerParent(0.14, 0.05)}
        className="mx-auto w-full max-w-3xl text-center"
      >
        <motion.div
          variants={fadeUp}
          className="font-sans text-xs uppercase tracking-[0.25em] text-ink-soft mb-6"
        >
          a worked example
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="font-display italic font-medium text-[clamp(48px,8vw,96px)] leading-[1.0] text-ink"
        >
          Book me a room.
        </motion.h2>
        <motion.div
          variants={fadeUp}
          className="mt-8 flex items-center justify-center gap-2 text-ink-soft/70"
        >
          {Array.from({ length: 19 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-current" />
          ))}
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="mt-8 font-scribble text-2xl text-mcp"
        >
          five slides, one booking.
        </motion.div>
      </motion.div>
    </section>
  );
}
