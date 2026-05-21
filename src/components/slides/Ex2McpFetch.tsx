"use client";

import { Slide } from "@/components/Slide";
import { RoomStream } from "@/components/visuals/RoomStream";

export function Ex2McpFetch() {
  return (
    <Slide
      id="ex-2-mcp"
      index="slide 2 / 5"
      copy={
        <>
          <h3 className="font-display text-[clamp(36px,5.2vw,58px)] leading-[1.05] tracking-tight text-ink mb-6">
            MCP goes and <em className="italic text-mcp">gets the facts.</em>
          </h3>
          <p className="text-lg leading-relaxed text-ink-soft">
            The agent calls <span className="font-mono text-ink">rooms.search</span>{" "}
            over MCP. Back come raw availability records — capacity, floor,
            equipment, price — for every candidate.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Notice what isn&apos;t in the response: any opinion on which room is
            the <em className="italic">right</em> one. That part comes next.
          </p>
        </>
      }
      visual={<RoomStream />}
    />
  );
}
