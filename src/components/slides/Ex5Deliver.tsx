"use client";

import { Slide } from "@/components/Slide";
import { Confirmation } from "@/components/visuals/Confirmation";

export function Ex5Deliver() {
  return (
    <Slide
      id="ex-5-deliver"
      index="slide 5 / 5"
      copy={
        <>
          <h3 className="font-display text-[clamp(36px,5.2vw,58px)] leading-[1.05] tracking-tight text-ink mb-6">
            It delivers, with{" "}
            <em className="italic text-skill">reasoning.</em>
          </h3>
          <p className="text-lg leading-relaxed text-ink-soft">
            The reply isn&apos;t just a room number. It&apos;s a confirmation
            with the <em className="italic">why</em>, traceable to both the MCP
            data and the skill rules.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-mcp" />
              <span className="text-mcp font-medium">mcp</span>
            </span>{" "}
            tags facts that came from data.{" "}
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-skill" />
              <span className="text-skill font-medium">skill</span>
            </span>{" "}
            tags choices made by the playbook. That trail is the delta SKILLS.md
            adds.
          </p>
        </>
      }
      visual={<Confirmation />}
    />
  );
}
