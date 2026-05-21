"use client";

import { clsx } from "clsx";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, staggerParent } from "@/lib/motion";

type Variant = "centered" | "split";

type Props = {
  id: string;
  index?: string; // e.g. "slide 2 / 5"
  eyebrow?: string;
  variant?: Variant;
  className?: string;
  copy?: ReactNode;
  visual?: ReactNode;
  children?: ReactNode;
};

/**
 * Slide — the layout primitive used by every section.
 * - Full dynamic-viewport height, snaps via parent `.snap-deck`.
 * - `centered`: stacked centered content (hero, takeaway, example-intro).
 * - `split`: 2-column grid (copy left, visual right) collapsing under 900px.
 */
export function Slide({
  id,
  eyebrow,
  index,
  variant = "split",
  className,
  copy,
  visual,
  children,
}: Props) {
  const reduce = useReducedMotion();

  if (variant === "centered") {
    return (
      <section
        id={id}
        className={clsx(
          "relative flex min-h-dvh w-full items-center justify-center px-6 md:px-12 py-16",
          className,
        )}
      >
        <motion.div
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ amount: 0.5, once: false }}
          variants={staggerParent(0.1, 0.05)}
          className="mx-auto w-full max-w-3xl text-center"
        >
          {eyebrow ? (
            <motion.div
              variants={fadeUp}
              className="font-scribble text-2xl text-ink-soft mb-4"
            >
              {eyebrow}
            </motion.div>
          ) : null}
          {children}
        </motion.div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={clsx(
        "relative flex min-h-dvh w-full items-center justify-center px-6 md:px-12 py-16",
        className,
      )}
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ amount: 0.4, once: false }}
          variants={staggerParent(0.1, 0.05)}
          className="max-w-[520px]"
        >
          {index ? (
            <motion.div
              variants={fadeUp}
              className="font-scribble text-xl text-mcp mb-2"
            >
              {index}
            </motion.div>
          ) : null}
          {eyebrow ? (
            <motion.div
              variants={fadeUp}
              className="font-sans text-xs uppercase tracking-[0.18em] text-ink-soft mb-4"
            >
              {eyebrow}
            </motion.div>
          ) : null}
          <motion.div variants={fadeUp}>{copy}</motion.div>
        </motion.div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[560px]">{visual}</div>
        </div>
      </div>
    </section>
  );
}
