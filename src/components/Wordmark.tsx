export function Wordmark() {
  return (
    <div className="fixed top-6 left-6 md:top-8 md:left-10 z-50 select-none pointer-events-none">
      <div className="flex items-baseline gap-1.5 font-display text-[18px] tracking-tight text-ink">
        <span className="text-mcp">skills</span>
        <span className="text-ink-soft font-scribble text-2xl leading-none -translate-y-0.5">
          ×
        </span>
        <span className="text-skill">mcp</span>
      </div>
    </div>
  );
}
