"use client";

import { Slide } from "@/components/Slide";
import { DataPipe } from "@/components/visuals/DataPipe";

export function WhatIsMcp() {
  return (
    <Slide
      id="what-is-mcp"
      eyebrow="01 — the hands"
      copy={
        <>
          <h2 className="font-display text-[clamp(40px,6vw,68px)] leading-[1.02] tracking-tight text-ink mb-6">
            MCP — <span className="text-mcp italic">the data pipe.</span>
          </h2>
          <p className="text-lg leading-relaxed text-ink-soft">
            The <span className="font-mono text-ink">Model Context Protocol</span>{" "}
            is a standardized way for an agent to call tools and read data
            from external systems — calendars, databases, file stores, internal
            APIs. It returns raw, structured facts.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            What it doesn&apos;t do: tell the agent what those facts{" "}
            <em className="font-display italic text-ink">mean</em>, or which
            ones to care about.
          </p>
        </>
      }
      visual={<DataPipe />}
    />
  );
}
