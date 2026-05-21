"use client";

import { Slide } from "@/components/Slide";
import { ReasoningGrid } from "@/components/visuals/ReasoningGrid";

export function Ex4Reason() {
  return (
    <Slide
      id="ex-4-reason"
      index="slide 4 / 5"
      copy={
        <>
          <h3 className="font-display text-[clamp(36px,5.2vw,58px)] leading-[1.05] tracking-tight text-ink mb-6">
            It <em className="italic text-accent">thinks out loud.</em>
          </h3>
          <p className="text-lg leading-relaxed text-ink-soft">
            The agent matches each room against each rule. Rooms that violate a{" "}
            <em className="italic">must-have</em> drop out — no VC means no
            room, no matter how nice. Among the survivors it picks the one the
            skill <em className="italic">prefers</em>.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            This is the part that&apos;s impossible without SKILLS.md. The MCP
            had no idea floor 3 was special.
          </p>
        </>
      }
      visual={<ReasoningGrid />}
    />
  );
}
