"use client";

import { Slide } from "@/components/Slide";
import { SkillRules } from "@/components/visuals/SkillRules";

export function Ex3SkillGuides() {
  return (
    <Slide
      id="ex-3-skill"
      index="slide 3 / 5"
      copy={
        <>
          <h3 className="font-display text-[clamp(36px,5.2vw,58px)] leading-[1.05] tracking-tight text-ink mb-6">
            SKILLS.md tells it{" "}
            <em className="italic text-skill">how to choose.</em>
          </h3>
          <p className="text-lg leading-relaxed text-ink-soft">
            The same markdown file the agent loaded at session start now does
            real work. Rules about must-haves, defaults, and when to confirm
            shape what a <em className="italic">good</em> answer looks like.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            No code, no schema — just sentences a teammate could have written
            on a whiteboard.
          </p>
        </>
      }
      visual={<SkillRules />}
    />
  );
}
