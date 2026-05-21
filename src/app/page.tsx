"use client";

import { Wordmark } from "@/components/Wordmark";
import { ProgressRail } from "@/components/ProgressRail";
import { Hero } from "@/components/slides/Hero";
import { WhatIsMcp } from "@/components/slides/WhatIsMcp";
import { WhatIsSkill } from "@/components/slides/WhatIsSkill";
import { Together } from "@/components/slides/Together";
import { ExampleIntro } from "@/components/slides/ExampleIntro";
import { Ex1Ask } from "@/components/slides/Ex1Ask";
import { Ex2McpFetch } from "@/components/slides/Ex2McpFetch";
import { Ex3SkillGuides } from "@/components/slides/Ex3SkillGuides";
import { Ex4Reason } from "@/components/slides/Ex4Reason";
import { Ex5Deliver } from "@/components/slides/Ex5Deliver";
import { Takeaway } from "@/components/slides/Takeaway";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "what-is-mcp", label: "MCP" },
  { id: "what-is-skill", label: "Skills" },
  { id: "together", label: "Together" },
  { id: "example-intro", label: "Example" },
  { id: "ex-1-ask", label: "Ask" },
  { id: "ex-2-mcp", label: "Fetch" },
  { id: "ex-3-skill", label: "Guide" },
  { id: "ex-4-reason", label: "Reason" },
  { id: "ex-5-deliver", label: "Deliver" },
  { id: "takeaway", label: "Recap" },
];

export default function Home() {
  return (
    <>
      <Wordmark />
      <ProgressRail ids={SECTIONS} containerId="deck" />
      <main
        id="deck"
        className="snap-deck h-dvh w-full overflow-y-scroll bg-cream"
      >
        <Hero />
        <WhatIsMcp />
        <WhatIsSkill />
        <Together />
        <ExampleIntro />
        <Ex1Ask />
        <Ex2McpFetch />
        <Ex3SkillGuides />
        <Ex4Reason />
        <Ex5Deliver />
        <Takeaway />
      </main>
    </>
  );
}

