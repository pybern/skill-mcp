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
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

// Tiny SSR-safe "are we in the browser?" hook (no setState-in-effect).
const subscribeNoop = () => () => {};
function useIsBrowser() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

/**
 * HoverCodeReveal — wraps a single word and, on hover / focus / tap, reveals
 * a small "code card" with two snippets (TypeScript + Python). A subtle
 * "Expand" affordance inside the card opens a full modal that breaks the
 * code down line by line with scribble-style annotations, matching the
 * deck's "interactive note" voice.
 */

// ─── Token helpers ────────────────────────────────────────────────────────────

type Tok = ReactNode;
const T = {
  // ── Generic code tokens
  kw: (s: string): Tok => <span className="text-mcp">{s}</span>,
  str: (s: string): Tok => <span className="text-skill">{s}</span>,
  num: (s: string): Tok => <span className="text-accent">{s}</span>,
  fn: (s: string): Tok => <span className="text-ink font-medium">{s}</span>,
  com: (s: string): Tok => (
    <span className="text-ink-soft/80 italic">{s}</span>
  ),
  p: (s: string): Tok => <span className="text-ink-soft">{s}</span>,
  // ── Markdown / YAML-frontmatter tokens
  fm: (s: string): Tok => <span className="text-ink-soft/60">{s}</span>, // --- delimiter
  yk: (s: string): Tok => <span className="text-mcp">{s}</span>, // yaml key
  yv: (s: string): Tok => <span className="text-skill">{s}</span>, // yaml value
  h: (s: string): Tok => (
    <span className="text-mcp font-semibold">{s}</span>
  ), // markdown heading line
  h2: (s: string): Tok => (
    <span className="text-ink font-semibold">{s}</span>
  ), // markdown subheading
  li: (s: string): Tok => <span className="text-ink-soft">{s}</span>, // list bullet text
  b: (s: string): Tok => (
    <span className="text-ink font-semibold">{s}</span>
  ), // **bold** inline
};

const L = (...tokens: Tok[]): Tok => (
  <>
    {tokens.map((t, i) => (
      <Fragment key={i}>{t}</Fragment>
    ))}
  </>
);

// Build a code line — second argument is an optional plain-English note that
// will be rendered as a scribble annotation in the expanded modal.
const C = (tokens: Tok, note?: string): CodeLine => ({ tokens, note });

// ─── Snippet definitions ──────────────────────────────────────────────────────

export type CodeLine = { tokens: Tok; note?: string };

export type Snippet = {
  lang: "TypeScript" | "Python" | "Markdown";
  filename: string;
  lines: CodeLine[];
};

export type CodeReveal = {
  title: string;
  intro: string;
  /** One or more snippets. When >1, the modal renders tabs; the small popover stacks them. */
  snippets: Snippet[];
};

export const MCP_REVEAL: CodeReveal = {
  title: "MCP in code",
  intro:
    "An MCP client connects to a tool server and asks for raw, structured facts. No interpretation — just data.",
  snippets: [
    {
      lang: "TypeScript",
      filename: "agent.ts",
      lines: [
        C(
          L(
            T.kw("import"),
            T.p(" { Client } "),
            T.kw("from"),
            T.p(" "),
            T.str('"@modelcontextprotocol/sdk"'),
            T.p(";"),
          ),
          "the MCP client library",
        ),
        C(L()),
        C(
          L(
            T.kw("const"),
            T.p(" mcp "),
            T.p("= "),
            T.kw("new"),
            T.p(" "),
            T.fn("Client"),
            T.p("(transport);"),
          ),
          "wire it up to a tool server (stdio, http, …)",
        ),
        C(
          L(T.kw("await"), T.p(" mcp."), T.fn("connect"), T.p("();")),
          "handshake — discover available tools",
        ),
        C(L()),
        C(L(T.com("// raw facts from the world →"))),
        C(
          L(
            T.kw("const"),
            T.p(" rooms "),
            T.p("= "),
            T.kw("await"),
            T.p(" mcp."),
            T.fn("callTool"),
            T.p("({"),
          ),
          "call a tool the server exposes",
        ),
        C(L(T.p("  name: "), T.str('"list_rooms"'), T.p(","))),
        C(
          L(T.p("  arguments: { floor: "), T.num("3"), T.p(" },")),
          "structured inputs in, structured data out",
        ),
        C(L(T.p("});"))),
      ],
    },
    {
      lang: "Python",
      filename: "agent.py",
      lines: [
        C(
          L(T.kw("from"), T.p(" mcp "), T.kw("import"), T.p(" ClientSession")),
          "the MCP client library",
        ),
        C(L()),
        C(
          L(
            T.kw("async with"),
            T.p(" "),
            T.fn("ClientSession"),
            T.p("(transport) "),
            T.kw("as"),
            T.p(" mcp:"),
          ),
          "open a connection to a tool server",
        ),
        C(L(T.p("    "), T.com("# raw facts from the world →"))),
        C(
          L(
            T.p("    rooms = "),
            T.kw("await"),
            T.p(" mcp."),
            T.fn("call_tool"),
            T.p("("),
          ),
          "call a tool the server exposes",
        ),
        C(L(T.p("        "), T.str('"list_rooms"'), T.p(","))),
        C(
          L(
            T.p("        {"),
            T.str('"floor"'),
            T.p(": "),
            T.num("3"),
            T.p("},"),
          ),
          "structured inputs in, structured data out",
        ),
        C(L(T.p("    )"))),
      ],
    },
  ],
};

// A spec-compliant Anthropic SKILL.md: YAML frontmatter (name + description)
// followed by markdown prose the agent reasons over.
export const SKILL_REVEAL: CodeReveal = {
  title: "SKILL.md",
  intro:
    "A skill is a plain markdown file with YAML frontmatter. The agent reads the description to decide when to load it, then reasons over the body to decide what to do.",
  snippets: [
    {
      lang: "Markdown",
      filename: "skills/booking-rooms/SKILL.md",
      lines: [
        // ── Frontmatter ───────────────────────────────────────────────
        C(L(T.fm("---")), "YAML frontmatter — the machine-readable header"),
        C(
          L(T.yk("name"), T.p(": "), T.yv("booking-rooms")),
          "unique skill id (kebab-case, ≤64 chars)",
        ),
        C(
          L(
            T.yk("description"),
            T.p(": "),
            T.yv(
              "Use whenever the user wants to book, reserve, or find a meeting room.",
            ),
          ),
          "the agent uses this to decide WHEN to load the skill",
        ),
        C(L(T.fm("---"))),
        C(L()),
        // ── Body: title + intro ───────────────────────────────────────
        C(
          L(T.h("# Booking rooms")),
          "everything below is prose the agent reasons over",
        ),
        C(L()),
        C(L(T.p("How we like things around here."))),
        C(L()),
        // ── Must-haves ────────────────────────────────────────────────
        C(
          L(T.h2("## Must-haves")),
          "hard constraints — break these and the answer is wrong",
        ),
        C(
          L(
            T.li("- If any attendee is "),
            T.b("**remote**"),
            T.li(", the room "),
            T.b("**must**"),
            T.li(" have video conferencing."),
          ),
        ),
        C(L(T.li("- Capacity must fit the requested party size."))),
        C(L()),
        // ── Defaults ──────────────────────────────────────────────────
        C(
          L(T.h2("## Defaults")),
          "what to assume when the user didn't say",
        ),
        C(
          L(
            T.li("- Prefer "),
            T.b("**floor 3**"),
            T.li(" (closest to the team)."),
          ),
        ),
        C(L(T.li("- Default meeting length is 60 minutes if unspecified."))),
        C(L()),
        // ── Preferences ───────────────────────────────────────────────
        C(
          L(T.h2("## Preferences")),
          "tie-breakers among otherwise valid options",
        ),
        C(
          L(
            T.li("- Prefer the "),
            T.b("**smallest**"),
            T.li(" room that fits — leave big rooms for big meetings."),
          ),
        ),
        C(L()),
        // ── Guardrails ────────────────────────────────────────────────
        C(
          L(T.h2("## Guardrails")),
          "when to PAUSE and confirm rather than act",
        ),
        C(
          L(
            T.li("- "),
            T.b("**Confirm**"),
            T.li(" before booking anything over $50/hr."),
          ),
        ),
        C(L(T.li("- Ask before inviting people outside the company."))),
        C(L()),
        // ── Output ────────────────────────────────────────────────────
        C(L(T.h2("## Output")), "the shape of a good answer"),
        C(
          L(
            T.li(
              "Reply with the chosen room, the rationale (which rules applied), and a one-line confirmation diff for the user to approve.",
            ),
          ),
        ),
      ],
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

type Accent = "mcp" | "skill";
type Align = "left" | "right" | "center";

type Props = {
  label: ReactNode;
  ariaLabel: string;
  reveal: CodeReveal;
  accent: Accent;
  /** Horizontal anchor of the popover relative to the trigger word. */
  align?: Align;
  /** Classes applied to the visible trigger word. */
  triggerClassName?: string;
};

export function HoverCodeReveal({
  label,
  ariaLabel,
  reveal,
  accent,
  align = "center",
  triggerClassName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const popoverId = useId();

  // Escape closes whichever surface is on top.
  useEffect(() => {
    if (!open && !expanded) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (expanded) setExpanded(false);
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, expanded]);

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

  // Click toggles the full modal. Hover/focus only previews the small popover.
  const toggleExpanded = () => {
    setExpanded((v) => !v);
    setOpen(false);
  };

  const onTriggerKey = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpanded();
    }
  };

  return (
    <span
      className="relative inline-block align-baseline"
      onMouseEnter={() => !expanded && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => !expanded && setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={toggleExpanded}
    >
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open || expanded}
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
        {open && !expanded ? (
          <motion.span
            id={popoverId}
            role="tooltip"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            // Reset typographic inheritance from the hero <h1>.
            style={{
              transformOrigin: "top center",
              fontFamily:
                "var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif",
              fontStyle: "normal",
              fontWeight: 400,
              letterSpacing: "normal",
              lineHeight: 1.4,
            }}
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
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft"
                  style={{ letterSpacing: "0.18em" }}
                >
                  how it looks in code
                </span>
              </span>

              <span className="flex flex-col gap-2">
                {reveal.snippets.map((snip) => (
                  <CodeCard key={snip.lang} snippet={snip} />
                ))}
              </span>

              {/* Hint: clicking the word itself opens the full breakdown */}
              <span className="mt-2.5 flex items-center justify-between px-1">
                <span className="text-[11px] text-ink-soft">
                  click for the full breakdown
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    accent === "mcp" ? "text-mcp" : "text-skill"
                  }`}
                >
                  open ↗
                </span>
              </span>
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>

      <ExpandedCodeModal
        open={expanded}
        onClose={() => setExpanded(false)}
        reveal={reveal}
        accent={accent}
      />
    </span>
  );
}

// ─── Small popover code card ─────────────────────────────────────────────────

function CodeCard({ snippet }: { snippet: Snippet }) {
  const langTint =
    snippet.lang === "TypeScript"
      ? "bg-mcp-soft text-mcp"
      : snippet.lang === "Python"
      ? "bg-skill-soft text-skill"
      : /* Markdown */ "bg-accent-soft text-accent";

  return (
    <span className="block overflow-hidden rounded-lg border border-rule bg-cream/60">
      <span className="flex items-center justify-between border-b border-rule bg-paper/70 px-3 py-1.5">
        <span
          className="text-[11px] text-ink-soft"
          style={{
            fontFamily:
              "var(--font-jetbrains), ui-monospace, monospace",
          }}
        >
          {snippet.filename}
        </span>
        <span
          className={`rounded-full px-2 py-[1px] text-[9px] uppercase ${langTint}`}
          style={{
            fontFamily: "var(--font-jetbrains), ui-monospace, monospace",
            letterSpacing: "0.16em",
          }}
        >
          {snippet.lang}
        </span>
      </span>
      <span className="relative block max-h-[260px] overflow-auto px-3 py-2.5">
        <span
          className="block whitespace-pre text-ink"
          style={{
            fontFamily:
              "var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: 1.65,
            letterSpacing: "0",
          }}
        >
          {snippet.lines.map((line, i) => (
            <span key={i} className="block">
              {line.tokens ?? "\u00A0"}
            </span>
          ))}
        </span>
        {/* soft fade hint that there's more to scroll */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-8"
          style={{
            background:
              "linear-gradient(to bottom, rgba(251,247,240,0), var(--color-cream))",
          }}
        />
      </span>
    </span>
  );
}

// ─── Expanded modal ──────────────────────────────────────────────────────────

type ModalProps = {
  open: boolean;
  onClose: () => void;
  reveal: CodeReveal;
  accent: Accent;
};

function ExpandedCodeModal({ open, onClose, reveal, accent }: ModalProps) {
  const isBrowser = useIsBrowser();

  if (!isBrowser) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <ModalSurface
          key="modal"
          onClose={onClose}
          reveal={reveal}
          accent={accent}
        />
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function ModalSurface({
  onClose,
  reveal,
  accent,
}: {
  onClose: () => void;
  reveal: CodeReveal;
  accent: Accent;
}) {
  const reduce = useReducedMotion();
  // Tab state lives here so it auto-resets each time the modal opens
  // (this component only mounts when `open` is true).
  const [tab, setTab] = useState<0 | 1>(0);

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const accentText = accent === "mcp" ? "text-mcp" : "text-skill";
  const accentBg = accent === "mcp" ? "bg-mcp" : "bg-skill";
  const accentSoft = accent === "mcp" ? "bg-mcp-soft" : "bg-skill-soft";
  const safeTab = Math.min(tab, reveal.snippets.length - 1) as 0 | 1;
  const snippet = reveal.snippets[safeTab];
  const showTabs = reveal.snippets.length > 1;

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/35 p-4 backdrop-blur-sm"
      style={{
        fontFamily:
          "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
        fontStyle: "normal",
        fontWeight: 400,
        letterSpacing: "normal",
        lineHeight: 1.5,
      }}
      aria-modal="true"
      role="dialog"
      aria-label={reveal.title}
    >
      <motion.div
        key="dialog"
        initial={
          reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[820px] max-h-[88vh] overflow-hidden rounded-2xl border border-rule bg-paper shadow-[0_40px_120px_-30px_rgba(43,38,32,0.45)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-rule px-6 pt-5 pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${accentBg}`} />
              <span
                className="text-[10px] uppercase text-ink-soft"
                style={{
                  fontFamily:
                    "var(--font-jetbrains), ui-monospace, monospace",
                  letterSpacing: "0.2em",
                }}
              >
                breakdown
              </span>
            </div>
            <h3
              className="mt-1 text-2xl text-ink"
              style={{
                fontFamily:
                  "var(--font-fraunces), ui-serif, Georgia, serif",
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            >
              {reveal.title}
            </h3>
            <p className="mt-1.5 max-w-[60ch] text-sm text-ink-soft">
              {reveal.intro}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full border border-rule bg-cream/50 px-2.5 py-1 text-xs text-ink-soft transition hover:bg-cream"
          >
            Esc ✕
          </button>
        </div>

        {/* Tabs (or single-snippet header strip) */}
        <div className="flex items-center gap-1 border-b border-rule bg-cream/40 px-4 py-2">
          {showTabs ? (
            reveal.snippets.map((s, i) => {
              const active = i === safeTab;
              return (
                <button
                  key={s.lang}
                  type="button"
                  onClick={() => setTab(i as 0 | 1)}
                  className={`relative rounded-full px-3 py-1 text-xs transition ${
                    active
                      ? `${accentSoft} ${accentText}`
                      : "text-ink-soft hover:text-ink"
                  }`}
                  style={{
                    fontFamily:
                      "var(--font-jetbrains), ui-monospace, monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.lang.toLowerCase()}
                </button>
              );
            })
          ) : (
            <span
              className={`rounded-full px-3 py-1 text-xs ${accentSoft} ${accentText}`}
              style={{
                fontFamily:
                  "var(--font-jetbrains), ui-monospace, monospace",
                letterSpacing: "0.05em",
              }}
            >
              {snippet.lang.toLowerCase()}
            </span>
          )}
          <span
            className="ml-auto text-[11px] text-ink-soft"
            style={{
              fontFamily:
                "var(--font-jetbrains), ui-monospace, monospace",
            }}
          >
            {snippet.filename}
          </span>
        </div>

        {/* Code body */}
        <div className="overflow-y-auto px-2 sm:px-6 py-5">
          <AnnotatedCode
            key={snippet.lang}
            snippet={snippet}
            accent={accent}
          />
        </div>

        <div className="border-t border-rule px-6 py-3 flex items-center justify-between text-xs text-ink-soft">
          <span
            className="font-scribble text-base"
            style={{
              fontFamily:
                "var(--font-caveat), 'Comic Sans MS', cursive",
            }}
          >
            the notes in the margin tell you what each line means
          </span>
          <span>click outside or press Esc to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnnotatedCode({
  snippet,
  accent,
}: {
  snippet: Snippet;
  accent: Accent;
}) {
  const accentText = accent === "mcp" ? "text-mcp" : "text-skill";
  const accentRule = accent === "mcp" ? "border-mcp/40" : "border-skill/40";

  return (
    <div className="rounded-xl border border-rule bg-cream/40 p-3 sm:p-5">
      <div
        className="w-full overflow-x-auto"
        style={{
          fontFamily:
            "var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "13.5px",
          lineHeight: 1.7,
          letterSpacing: "0",
        }}
      >
        {snippet.lines.map((line, i) => {
          const lineNum = i + 1;
          return (
            <div key={i} className="group/code">
              <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,14rem)] gap-x-3">
                {/* line number gutter */}
                <span className="select-none text-right text-ink-soft/50 tabular-nums">
                  {lineNum}
                </span>
                {/* code — wrap long lines so they don't collide with the annotation column */}
                <span
                  className="text-ink min-w-0"
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {line.tokens ?? "\u00A0"}
                </span>
                {/* annotation column (md+) */}
                <span
                  className={`hidden sm:block self-center pl-3 border-l ${
                    line.note ? accentRule : "border-transparent"
                  }`}
                >
                  {line.note ? (
                    <span
                      className={`font-scribble text-[17px] leading-snug ${accentText}`}
                      style={{
                        fontFamily:
                          "var(--font-caveat), 'Comic Sans MS', cursive",
                        letterSpacing: "normal",
                      }}
                    >
                      ↳ {line.note}
                    </span>
                  ) : null}
                </span>
              </div>
              {/* Stacked annotation on small screens */}
              {line.note ? (
                <div className="sm:hidden pl-[3rem] -mt-0.5 mb-1">
                  <span
                    className={`font-scribble text-[16px] ${accentText}`}
                    style={{
                      fontFamily:
                        "var(--font-caveat), 'Comic Sans MS', cursive",
                      letterSpacing: "normal",
                    }}
                  >
                    ↳ {line.note}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
