"use client";

import { Slide } from "@/components/Slide";
import { Duet } from "@/components/visuals/Duet";

export function Together() {
  return (
    <Slide
      id="together"
      eyebrow="03 — the duet"
      copy={
        <>
          <h2 className="font-display text-[clamp(40px,6vw,68px)] leading-[1.02] tracking-tight text-ink mb-6">
            Data without judgment is{" "}
            <em className="italic text-mcp">just noise.</em>
          </h2>
          <p className="text-lg leading-relaxed text-ink-soft">
            MCPs give the agent <span className="text-mcp font-medium">facts</span>.
            SKILLS.md gives it{" "}
            <span className="text-skill font-medium">taste</span>. Run them
            together and the agent stops being a search engine and starts being
            a colleague.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            One feeds the other: the skill tells the agent what to{" "}
            <em className="italic">ask for</em>, and what to{" "}
            <em className="italic">do</em> with the answer.
          </p>
        </>
      }
      visual={<Duet />}
    />
  );
}
