import { Activity, ShieldCheck, Users } from "lucide-react";

import { AuthHeader } from "@/components/auth/AuthHeader";

// A small lattice of nodes/edges — a literal nod to "Dot"Skills, and a
// stand-in for the connected projects, teams, and data the panel manages.
// Coordinates are static (not random) so server and client markup match.
const NODES = [
  { id: 0, x: 40, y: 60 },
  { id: 1, x: 120, y: 40 },
  { id: 2, x: 200, y: 70 },
  { id: 3, x: 280, y: 50 },
  { id: 4, x: 350, y: 90 },
  { id: 5, x: 60, y: 150 },
  { id: 6, x: 150, y: 140 },
  { id: 7, x: 230, y: 160 },
  { id: 8, x: 320, y: 170 },
  { id: 9, x: 30, y: 240 },
  { id: 10, x: 110, y: 230 },
  { id: 11, x: 190, y: 250 },
  { id: 12, x: 270, y: 240 },
  { id: 13, x: 360, y: 260 },
  { id: 14, x: 50, y: 330 },
  { id: 15, x: 140, y: 320 },
  { id: 16, x: 220, y: 340 },
  { id: 17, x: 300, y: 330 },
  { id: 18, x: 370, y: 350 },
  { id: 19, x: 80, y: 410 },
  { id: 20, x: 160, y: 400 },
  { id: 21, x: 240, y: 420 },
  { id: 22, x: 330, y: 410 },
  { id: 23, x: 200, y: 460 },
] as const;

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [1, 6], [2, 7], [3, 8],
  [5, 6], [6, 7], [7, 8],
  [5, 9], [6, 10], [7, 11], [8, 12], [8, 13],
  [9, 10], [10, 11], [11, 12], [12, 13],
  [9, 14], [10, 15], [11, 16], [12, 17], [13, 18],
  [14, 15], [15, 16], [16, 17], [17, 18],
  [14, 19], [15, 20], [16, 21], [17, 22],
  [19, 20], [20, 21], [21, 22],
  [20, 23], [21, 23],
];

// The diagonal chain of nodes that "pulses" — a subtle, deliberate
// animation suggesting live activity flowing through the network.
const PULSE_NODE_IDS = new Set([2, 7, 11, 16, 21]);

const nodeById = new Map<number, (typeof NODES)[number]>(
  NODES.map((node) => [node.id, node]),
);

const FEATURES = [
  {
    icon: ShieldCheck,
    label: "Role-based access",
    detail: "Every seat scoped to exactly what it needs.",
  },
  {
    icon: Users,
    label: "One workspace, every team",
    detail: "Stores, plans, and owners in a single view.",
  },
  {
    icon: Activity,
    label: "Live by default",
    detail: "Changes reflect across the panel instantly.",
  },
];

export function AuthIllustration() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#0a0a14] via-[#0e0e1f] to-[#0b0b16] px-10 py-8">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/25 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-[100px]"
        aria-hidden="true"
      />

      <AuthHeader variant="inverted" />

      <div className="relative mt-10 flex-1">
        <svg
          viewBox="0 0 400 500"
          className="absolute inset-0 h-full w-full opacity-90"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {EDGES.map(([from, to], index) => {
            const a = nodeById.get(from);
            const b = nodeById.get(to);
            if (!a || !b) return null;

            return (
              <line
                key={`edge-${index}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#6366f1"
                strokeOpacity={0.16}
                strokeWidth={1}
              />
            );
          })}

          {NODES.map((node) => {
            const isPulse = PULSE_NODE_IDS.has(node.id);

            return (
              <g key={`node-${node.id}`}>
                {isPulse && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={14}
                    fill="url(#nodeGlow)"
                    className="motion-safe:animate-pulse"
                    style={{ animationDelay: `${node.id * 120}ms` }}
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isPulse ? 3.5 : 2.5}
                  fill={isPulse ? "#a5b4fc" : "#6366f1"}
                  fillOpacity={isPulse ? 1 : 0.55}
                />
              </g>
            );
          })}
        </svg>

        <div className="relative flex h-full flex-col justify-end">
          <h2 className="max-w-[22ch] text-[28px] font-semibold leading-[1.15] tracking-tight text-white xl:text-[32px]">
            Every store, plan, and owner — one clear picture.
          </h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-white/60">
            DotSkills Panel gives your team a single, secure place to run the
            business behind the business.
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, label, detail }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Icon className="h-4 w-4 text-indigo-300" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-white/50">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-xs font-medium text-white/70">
          All systems operational
        </span>
        <span className="ml-auto font-mono text-[11px] text-white/40">
          99.98% uptime
        </span>
      </div>
    </div>
  );
}
