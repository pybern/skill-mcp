"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Animated MCP data-pipe visual.
 * Agent silhouette (left) <-> Pipe with travelling packets <-> three external systems (right).
 */
export function DataPipe() {
  const reduce = useReducedMotion();

  const packets = [0, 0.33, 0.66];
  const systems = [
    { y: 56, label: "calendar" },
    { y: 140, label: "rooms api" },
    { y: 224, label: "directory" },
  ];

  return (
    <div className="relative aspect-[5/4] w-full">
      <svg
        viewBox="0 0 480 380"
        className="h-full w-full"
        role="img"
        aria-label="An agent connected through MCP to external systems"
      >
        {/* Agent node */}
        <g>
          <circle cx="60" cy="190" r="38" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.5" />
          <text
            x="60"
            y="196"
            textAnchor="middle"
            className="fill-ink"
            style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", fontWeight: 500 }}
          >
            agent
          </text>
        </g>

        {/* Pipe (3 lanes, one per system) */}
        {systems.map((s, i) => (
          <g key={i}>
            <path
              d={`M 100 190 C 200 190, 260 ${s.y + 24}, 360 ${s.y + 24}`}
              stroke="var(--color-rule)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            <path
              id={`lane-${i}`}
              d={`M 100 190 C 200 190, 260 ${s.y + 24}, 360 ${s.y + 24}`}
              stroke="transparent"
              strokeWidth="2"
              fill="none"
            />
          </g>
        ))}

        {/* Travelling data packets along each lane */}
        {systems.map((s, i) =>
          packets.map((delay, j) => {
            const path = `M 100 190 C 200 190, 260 ${s.y + 24}, 360 ${s.y + 24}`;
            return (
              <motion.circle
                key={`${i}-${j}`}
                r="5"
                fill="var(--color-mcp)"
                initial={false}
                animate={
                  reduce
                    ? { opacity: 0 }
                    : { offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }
                }
                transition={{
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.4 + delay * 2.6,
                }}
                style={{
                  offsetPath: `path('${path}')`,
                  offsetRotate: "auto",
                }}
              />
            );
          }),
        )}

        {/* External systems */}
        {systems.map((s, i) => (
          <g key={i}>
            <rect
              x="360"
              y={s.y}
              width="100"
              height="48"
              rx="10"
              fill="var(--color-paper)"
              stroke="var(--color-ink)"
              strokeWidth="1.25"
            />
            <text
              x="410"
              y={s.y + 30}
              textAnchor="middle"
              className="fill-ink"
              style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* Label */}
        <text
          x="230"
          y="350"
          textAnchor="middle"
          className="fill-ink-soft"
          style={{ fontFamily: "var(--font-scribble)", fontSize: 22 }}
        >
          mcp = the data pipe
        </text>
      </svg>
    </div>
  );
}
