"use client";

import { Slide } from "@/components/Slide";
import { ChatBubble } from "@/components/visuals/ChatBubble";

export function Ex1Ask() {
  return (
    <Slide
      id="ex-1-ask"
      index="slide 1 / 5"
      copy={
        <>
          <h3 className="font-display text-[clamp(36px,5.2vw,58px)] leading-[1.05] tracking-tight text-ink mb-6">
            The request <em className="italic text-mcp">lands.</em>
          </h3>
          <p className="text-lg leading-relaxed text-ink-soft">
            A teammate pings the agent in plain English. No structured form, no
            calendar event, no IDs — just intent.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            On its own the agent has the message and nothing else. To get
            anywhere it needs to <em className="italic">fetch the world</em>{" "}
            and <em className="italic">consult its playbook</em>.
          </p>
        </>
      }
      visual={<ChatBubble />}
    />
  );
}
