"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Fragment,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";

/**
 * HoverCodeReveal — wraps a single word and, on hover / focus / tap, reveals
 * a small "code card" with two snippets (TypeScript + Python) side by side.
 *
 * Designed for inline use inside the hero <h1> around the words "Skills" and
 * "MCP" so the audience can glimpse what the concept looks like in code.
 */

// ─── Token helpers ────────────────────────────────────────────────────────────

type Tok = ReactNode;
const T = {
  kw: (s: string): Tok => <span className="text-mcp">{s}</span>,
  str: (s: string): Tok => <span className="text-skill">{s}</span>,
  num: (s: string): Tok => <span className="text-accent">{s}</span>,
  fn: (s: string): Tok => <span className="text-ink font-medium">{s}</span>,
  com: (s: string): Tok => (
    <span className="text-ink-soft/80 italic">{s}</span>
  ),
  p: (s: string): Tok => <span className="text-ink-soft">{s}</span>,
};

const L = (...tokens: Tok[]): Tok => (
  <>
    {tokens.map((t, i) => (
      <Fragment key={i}>{t}</Fragment>
    ))}
  </>
);

// ─── Snippet definitions ──────────────────────────────────────────────────────

export type Snippet = {
  lang: "TypeScript" | "Python";
  filename: string;
  lines: Tok[];
};

export const MCP_SNIPPETS: [Snippet, Snippet] = [
  {
    lang: "TypeScript",
    filename: "agent.ts",
    lines: [
      L(T.kw("import"), T.p(" { Client } "), T.kw("from"), T.p(" "), T.str('"@modelcontextprotocol/sdk"'), T.p(";")),
      L(),
      L(T.kw("const"), T.p(" mcp "), T.p("= "), T.kw("new"), T.p(" "), T.fn("Client"), T.p("(transport);")),
      L(T.kw("await"), T.p(" mcp."), T.fn("connect"), T.p("();")),
      L(),
      L(T.com("// raw facts from the world →")),
      L(T.kw("const"), T.p(" rooms "), T.p("= "), T.kw("await"), T.p(" mcp."), T.fn("callTool"), T.p("({")),
      L(T.p("  name: "), T.str('"list_rooms"'), T.p(",")),
      L(T.p("  arguments: { floor: "), T.num("3"), T.p(" },")),
      L(T.p("});")),
    ],
  },
  {
    lang: "Python",
    filename: "agent.py",
    lines: [
      L(T.kw("from"), T.p(" mcp "), T.kw("import"), T.p(" ClientSession")),
      L(),
      L(T.kw("async with"), T.p(" "), T.fn("ClientSession"), T.p("(transport) "), T.kw("as"), T.p(" mcp:")),
      L(T.p("    "), T.com("# raw facts from the world →")),
      L(T.p("    rooms = "), T.kw("await"), T.p(" mcp."), T.fn("call_tool"), T.p("(")),
      L(T.p("        "), T.str('"list_rooms"'), T.p(",")),
      L(T.p("        {"), T.str('"floor"'), T.p(": "), T.num("3"), T.p("},")),
      L(T.p("    )")),
    ],
  },
];

export const SKILL_SNIPPETS: [Snippet, Snippet] = [
  {
    lang: "TypeScript",
    filename: "agent.ts",
    lines: [
      L(T.kw("import"), T.p(" { Agent } "), T.kw("from"), T.p(" "), T.str('"@anthropic-ai/agent-sdk"'), T.p(";")),
      L(),
      L(T.kw("const"), T.p(" agent "), T.p("= "), T.kw("new"), T.p(" "), T.fn("Agent"), T.p("({")),
      L(T.p("  model: "), T.str('"claude-sonnet-4"'), T.p(",")),
      L(T.com("  // the playbook the agent reads first")),
      L(T.p("  skills: ["), T.str('"./skills/booking-rooms.md"'), T.p("],")),
      L(T.p("});")),
      L(),
      L(T.kw("await"), T.p(" agent."), T.fn("run"), T.p("("), T.str('"Find a room for 4 at 2pm."'), T.p(");")),
    ],
  },
  {
    lang: "Python",
    filename: "agent.py",
    lines: [
      L(T.kw("from"), T.p(" anthropic "), T.kw("import"), T.p(" Agent")),
      L(),
      L(T.p("agent = "), T.fn("Agent"), T.p("(")),
      L(T.p("    model="), T.str('"claude-sonnet-4"'), T.p(",")),
      L(T.p("    "), T.com("# the playbook the agent reads first")),
      L(T.p("    skills=["), T.str('"./skills/booking-rooms.md"'), T.p("],")),
      L(T.p(")")),
      L(),
      L(T.p("agent."), T.fn("run"), T.p("("), T.str('"Find a room for 4 at 2pm."'), T.p(")")),
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

type Accent = "mcp" | "skill";
type Align = "left" | "right" | "center";

type Props = {
  label: ReactNode;
  ariaLabel: string;
  snippets: [Snippet, Snippet];
  accent: Accent;
  /** Horizontal anchor of the popover relative to the trigger word. */
  align?: Align;
  /** Classes applied to the visible trigger word. */
  triggerClassName?: string;
};

export function HoverCodeReveal({
  label,
  ariaLabel,
  snippets,
  accent,
  align = "center",
  triggerClassName,
}: Props) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const popoverId = useId();

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const accentDot = accent === "mcp" ? "bg-mcp" : "bg-skill";
  const accentRing =
    accent === "mcp"
      ? "shadow-[0_24px_60px_-28px_rgba(201,123,90,0.55)]"
      : "shadow-[0_24px_60px_-28px_rgba(122,139,111,0.55)]";

  const anchorClass =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  // Where the little "tail" sits on the card, pointing back at the word.
  const tailStyle: CSSProperties =
    align === "left"
      ? { left: "1.75rem" }
      : align === "right"
      ? { right: "1.75rem" }
      : { left: "50%", transform: "translateX(-50%)" };

  const onTriggerKey = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  return (
    <span
      className="relative inline-block align-baseline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label={ariaLabel}
        onKeyDown={onTriggerKey}
        className={`cursor-help outline-none focus-visible:[text-decoration:underline_wavy] decoration-2 underline-offset-[0.18em] ${
          triggerClassName ?? ""
        }`}
      >
        {label}
      </span>

      <AnimatePresence>
        {open ? (
          <motion.span
            id={popoverId}
            role="tooltip"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top center" }}
            className={`absolute top-full ${anchorClass} z-40 block pt-5`}
          >
            {/* Pointer tail */}
            <span
              aria-hidden
              className={`absolute top-[14px] block h-3 w-3 rotate-45 border-l border-t border-rule bg-paper ${accentRing}`}
              style={tailStyle}
            />

            <span
              className={`relative block w-[min(78vw,340px)] rounded-2xl border border-rule bg-paper p-3 text-left ${accentRing}`}
            >
              {/* Tiny header strip */}
              <span className="mb-2 flex items-center gap-2 px-1">
                <span className={`h-1.5 w-1.5 rounded-full ${accentDot}`} />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                  how it looks in code
                </span>
              </span>

              <span className="flex flex-col gap-2">
                {snippets.map((snip) => (
                  <CodeCard key={snip.lang} snippet={snip} />
                ))}
              </span>
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

function CodeCard({ snippet }: { snippet: Snippet }) {
  const langTint =
    snippet.lang === "TypeScript"
      ? "bg-mcp-soft text-mcp"
      : "bg-skill-soft text-skill";

  return (
    <span className="block overflow-hidden rounded-lg border border-rule bg-cream/60">
      <span className="flex items-center justify-between border-b border-rule bg-paper/70 px-3 py-1.5">
        <span className="font-mono text-[11px] text-ink-soft">
          {snippet.filename}
        </span>
        <span
          className={`rounded-full px-2 py-[1px] font-mono text-[9px] uppercase tracking-[0.16em] ${langTint}`}
        >
          {snippet.lang}
        </span>
      </span>
      <span className="block overflow-x-auto px-3 py-2.5">
        <span
          className="block whitespace-pre font-mono text-[11.5px] leading-[1.55] text-ink"
          // The H1 sets italic on its inner em — make sure our code never inherits it.
          style={{ fontStyle: "normal", fontWeight: 400 }}
        >
          {snippet.lines.map((line, i) => (
            <span key={i} className="block">
              {line ?? " "}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
