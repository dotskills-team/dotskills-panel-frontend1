"use client";

import Link from "next/link";
import { ArrowLeft, Home, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";

const NODES = [
  { id: 0, x: 40, y: 40 },
  { id: 1, x: 130, y: 25 },
  { id: 2, x: 220, y: 45 },
  { id: 3, x: 300, y: 20 },
  { id: 4, x: 60, y: 120 },
  { id: 5, x: 150, y: 110 },
  { id: 6, x: 240, y: 130 },
  { id: 7, x: 320, y: 100 },
  { id: 8, x: 30, y: 210 },
  { id: 9, x: 120, y: 200 },
  { id: 10, x: 210, y: 220 },
  { id: 11, x: 300, y: 195 },
] as const;

type NodeId = typeof NODES[number]["id"];

const EDGES: ReadonlyArray<readonly [NodeId, NodeId]> = [
  [0, 1], [1, 2], [2, 3],
  [0, 4], [1, 5], [2, 6], [3, 7],
  [4, 5], [5, 6], [6, 7],
  [4, 8], [5, 9], [6, 10], [7, 11],
  [8, 9], [9, 10], [10, 11],
];

const PULSE_NODE_IDS = new Set<NodeId>([2, 6, 10]);
const nodeById = new Map(NODES.map((node) => [node.id, node]));

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Ambient glow, matching the auth illustration panel */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-[110px] dark:bg-indigo-500/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-indigo-400/10 blur-[110px] dark:bg-indigo-400/15"
        aria-hidden="true"
      />

      {/* Dot-lattice signature, faint, behind the content */}
      <svg
        viewBox="0 0 360 260"
        className="pointer-events-none absolute left-1/2 top-1/2 h-85 w-120 -translate-x-1/2 -translate-y-1/2 opacity-[0.35] dark:opacity-[0.25]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="notFoundNodeGlow" cx="50%" cy="50%" r="50%">
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
              strokeOpacity={0.3}
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
                  r={12}
                  fill="url(#notFoundNodeGlow)"
                  className="motion-safe:animate-pulse"
                  style={{ animationDelay: `${node.id * 140}ms` }}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={isPulse ? 3 : 2}
                fill={isPulse ? "#a5b4fc" : "#6366f1"}
                fillOpacity={isPulse ? 1 : 0.5}
              />
            </g>
          );
        })}
      </svg>

      <div className="relative flex w-full max-w-lg flex-col items-center text-center">
        {/* Brand mark */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 shadow-[0_2px_10px_-2px_rgba(79,70,229,0.55)]">
            <span className="absolute left-1.75 top-1.75 h-1.5 w-1.5 rounded-full bg-white/90" />
            <span className="absolute bottom-1.75 right-1.75 h-1.5 w-1.5 rounded-full bg-white/50" />
            <span className="text-[13px] font-semibold text-white">D</span>
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            DotSkills <span className="text-muted-foreground">Panel</span>
          </span>
        </Link>

        {/* 404 */}
        <p className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-primary">
          Error 404
        </p>

        <h1 className="mt-3 bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-[96px] font-bold leading-none tracking-tight text-transparent sm:text-[120px]">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          This page took a wrong turn
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, moved, or the link is
          out of date. Let&apos;s get you back to somewhere useful.
        </p>

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            asChild
            className="h-11 gap-2 rounded-xl bg-primary px-6 font-medium text-primary-foreground shadow-[0_1px_2px_rgba(79,70,229,0.1),0_8px_20px_-8px_rgba(79,70,229,0.5)] hover:bg-primary/90"
          >
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              Go home
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="h-11 gap-2 rounded-xl border-border/80 font-medium"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go back
          </Button>
        </div>

        {/* Quick link */}
        <div className="mt-10 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Looking for something specific?</span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 rounded font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}