# skill-mcp

An interactive one-page site that explains how **MCPs** and **SKILLS.md**
work together, using a worked **room booking** example.

> MCPs fetch the world. SKILLS.md teaches the agent what to do with what
> comes back.

The page is a vertical scroll-snap "deck" of 11 full-viewport slides:

1. **Hero** — the thesis.
2. **MCP** — the data pipe.
3. **SKILLS.md** — the guidebook.
4. **Together** — the duet.
5. **Example intro** — "Book me a room."
6. **Slide 1 / 5 · The ask** — a teammate pings the agent in plain English.
7. **Slide 2 / 5 · MCP fetches** — `rooms.search` returns raw availability.
8. **Slide 3 / 5 · SKILLS.md guides** — the rules of the road.
9. **Slide 4 / 5 · Agent reasons** — match rooms to rules, dim violators,
   crown a winner.
10. **Slide 5 / 5 · Value delivered** — a "Booked." card with reasoning
    chips colored by source (terracotta = MCP data, sage = SKILLS rule).
11. **Takeaway.**

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** with CSS-first `@theme` config
- **motion** (Framer Motion v12) for animations
- Four typefaces via `next/font`: **Fraunces**, **Inter**, **JetBrains Mono**, **Caveat**
- Fully static — `next build` prerenders the page

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build
npm run lint
```

## Project layout

```
src/
  app/{layout,page,globals.css}   ← root layout, fonts, @theme palette
  components/
    Slide.tsx                     ← layout primitive (centered or split)
    Wordmark.tsx                  ← fixed top-left brand
    ProgressRail.tsx              ← fixed right-side dot nav
    slides/                       ← one component per scroll-snap section
    visuals/                      ← the animated right-side artwork
  lib/{rooms,motion}.ts           ← fixtures + shared motion variants
```
