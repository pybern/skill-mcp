"use client";

import { Slide } from "@/components/Slide";
import { SkillNotebook } from "@/components/visuals/SkillNotebook";

export function WhatIsSkill() {
  return (
    <Slide
      id="what-is-skill"
      eyebrow="02 — the playbook"
      copy={
        <>
          <h2 className="font-display text-[clamp(40px,6vw,68px)] leading-[1.02] tracking-tight text-ink mb-6">
            SKILLS.md — <span className="text-skill italic">the guidebook.</span>
          </h2>
          <p className="text-lg leading-relaxed text-ink-soft">
            A plain markdown file the agent loads at the start of a task. It
            encodes the things you&apos;d tell a new colleague on day one:
            defaults, must-haves, tone, when to ask before acting.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            It isn&apos;t code — it&apos;s{" "}
            <em className="font-display italic text-ink">prose</em> the agent
            reasons over to make sense of whatever the MCPs returned.
          </p>
        </>
      }
      visual={<SkillNotebook />}
    />
  );
}
