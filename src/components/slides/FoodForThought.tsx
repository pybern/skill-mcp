"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, staggerParent } from "@/lib/motion";

/**
 * FoodForThought — a closing reflection before the recap.
 *
 * Three concepts about where the industry is actually headed:
 *   1. The bet is on architecture, not autonomy.
 *   2. Intelligence lives in the model; capability lives in the scaffolding.
 *   3. Better models compound the value of every tool around them.
 */

type Thought = {
  number: string;
  numberColor: "mcp" | "accent" | "skill";
  headline: ReactNode;
  body: ReactNode;
  tags?: string[];
};

const THOUGHTS: Thought[] = [
  {
    number: "01",
    numberColor: "mcp",
    headline: (
      <>
        The bet isn&apos;t on{" "}
        <em className="italic text-ink-soft/70 not-italic line-through decoration-mcp/50">
          autonomy
        </em>
        . It&apos;s on{" "}
        <em className="italic text-mcp">architecture</em>.
      </>
    ),
    body: (
      <>
        The industry isn&apos;t wagering on models that can do anything on their
        own. It&apos;s wagering on smarter models as{" "}
        <span className="text-ink font-medium">decision engines</span> inside a{" "}
        <span className="text-ink font-medium">controlled execution system</span>
        {" "}— scoped, observable, steerable.
      </>
    ),
  },
  {
    number: "02",
    numberColor: "accent",
    headline: (
      <>
        Intelligence lives in the model.{" "}
        <em className="italic text-accent">
          Capability lives in the scaffolding.
        </em>
      </>
    ),
    body: (
      <>
        That execution system sits{" "}
        <em className="italic">outside</em> the weights. Each piece extends
        what the model can sense and do without asking it to be omnipotent.
      </>
    ),
    tags: [
      "tools",
      "sandboxes",
      "MCP servers",
      "skills",
      "agent runtimes",
      "validators",
      "memory",
      "harnesses",
    ],
  },
  {
    number: "03",
    numberColor: "skill",
    headline: (
      <>
        Better models make{" "}
        <em className="italic text-skill">every tool sharper.</em>
      </>
    ),
    body: (
      <>
        As context windows grow, reasoning deepens, and latency drops, the
        same scaffolding compounds in value. The skill you write today is{" "}
        <em className="italic">more</em> valuable next year, not less. The
        system around the model is the moat.
      </>
    ),
  },
];

const NUM_COLOR: Record<Thought["numberColor"], string> = {
  mcp: "text-mcp",
  accent: "text-accent",
  skill: "text-skill",
};

const TAG_COLOR: Record<Thought["numberColor"], string> = {
  mcp: "border-mcp/30 bg-mcp-soft/40 text-mcp",
  accent: "border-accent/30 bg-accent-soft/50 text-accent",
  skill: "border-skill/30 bg-skill-soft/40 text-skill",
};

export function FoodForThought() {
  const reduce = useReducedMotion();
  return (
    <section
      id="food-for-thought"
      className="relative flex min-h-dvh w-full items-center justify-center px-6 md:px-12 py-16 paper-grain"
    >
      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ amount: 0.35, once: false }}
        variants={staggerParent(0.12, 0.05)}
        className="mx-auto w-full max-w-3xl"
      >
        {/* Eyebrow */}
        <motion.div
          variants={fadeUp}
          className="text-center font-scribble text-2xl text-ink-soft mb-2"
        >
          bonus — food for thought
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={fadeUp}
          className="text-center font-display font-medium text-[clamp(36px,5.6vw,64px)] leading-[1.04] tracking-tight text-ink mb-3"
        >
          Three things worth{" "}
          <em className="italic text-mcp">chewing on.</em>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-center text-base md:text-lg text-ink-soft mb-8 md:mb-10"
        >
          Where the industry is actually pointing — and why the SKILLS.md ×
          MCP picture we just walked through is one instance of a much bigger
          pattern.
        </motion.p>

        {/* Thoughts */}
        <div className="flex flex-col gap-7 md:gap-9">
          {THOUGHTS.map((t, i) => (
            <motion.article
              key={t.number}
              variants={fadeUp}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 md:gap-x-8 items-start"
            >
              {/* Big number */}
              <div
                className={`font-display font-medium italic leading-none text-[clamp(40px,6vw,72px)] ${NUM_COLOR[t.numberColor]}`}
                aria-hidden
              >
                {t.number}
              </div>

              <div className="min-w-0">
                <h3 className="font-display text-[clamp(20px,2.6vw,28px)] leading-snug tracking-tight text-ink mb-2">
                  {t.headline}
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-ink-soft">
                  {t.body}
                </p>

                {t.tags ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-md border px-2 py-[1px] font-mono text-[11px] ${TAG_COLOR[t.numberColor]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Soft hand-drawn divider after each thought except the last */}
                {i < THOUGHTS.length - 1 ? (
                  <div className="mt-5 md:mt-6 -mb-2 flex items-center gap-3 text-ink-soft/40">
                    <span aria-hidden className="font-scribble text-lg">
                      ∿
                    </span>
                    <span className="h-px flex-1 bg-rule" />
                  </div>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Closing scribble */}
        <motion.div
          variants={fadeUp}
          className="mt-10 md:mt-12 text-center font-scribble text-xl text-ink-soft"
        >
          the model is the brain. the system around it is the body.
        </motion.div>
      </motion.div>
    </section>
  );
}
