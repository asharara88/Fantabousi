// Muscle Recovery 360 – Lovable-ready component
// Single-file React component with recovery logic + 360-view integration.
// Drop into Lovable. Add `react-360-view`, `framer-motion`, `lucide-react`, and `clsx` as deps.

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Info, RotateCw, Activity, Clock } from "lucide-react";
import clsx from "clsx";
// If you already use shadcn/ui in your project, you can swap these lightweight primitives
// with shadcn <Card>, <Button>, <Badge>, etc. Keeping plain divs for portability.

// --- OPTIONAL: 360 Viewer ---
// If you supply frame images (24+), this component will render a rotatable sprite sequence.
// npm i react-360-view
// Note: Temporarily disabled due to dependency conflicts
// import ThreeSixty from "react-360-view";

// ---------------------- Types & Data ----------------------
export type MuscleGroup =
  | "chest"
  | "front_delts"
  | "side_delts"
  | "rear_delts"
  | "lats"
  | "upper_back"
  | "lower_back"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "obliques"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves";

export type RecoveryStatus = "red" | "yellow" | "green";

export type LastTrainedMap = Partial<Record<MuscleGroup, string>>; // ISO date strings

export type ExerciseToMusclesMap = Record<string, MuscleGroup[]>;

// Mapping compound days → muscles typically hit
export const DayTemplates: Record<
  "chest_day" | "back_day" | "leg_day" | "shoulders_day" | "arms_day" | "core_day",
  MuscleGroup[]
> = {
  chest_day: ["chest", "front_delts", "triceps"],
  back_day: ["lats", "upper_back", "rear_delts", "biceps", "forearms"],
  leg_day: ["quads", "hamstrings", "glutes", "calves", "lower_back"],
  shoulders_day: ["front_delts", "side_delts", "rear_delts", "upper_back", "triceps"],
  arms_day: ["biceps", "triceps", "forearms"],
  core_day: ["abs", "obliques"]
};

// Fine-grained exercise → muscle mapping (extend as needed)
export const ExerciseToMuscles: ExerciseToMusclesMap = {
  bench_press: ["chest", "front_delts", "triceps"],
  incline_db_press: ["chest", "front_delts", "triceps"],
  pushups: ["chest", "front_delts", "triceps"],
  overhead_press: ["front_delts", "side_delts", "triceps", "upper_back"],
  lateral_raise: ["side_delts"],
  rear_delt_fly: ["rear_delts", "upper_back"],
  pullups: ["lats", "biceps", "forearms", "upper_back"],
  barbell_row: ["lats", "upper_back", "rear_delts", "biceps", "forearms"],
  deadlift: ["hamstrings", "glutes", "lower_back", "forearms"],
  squat: ["quads", "glutes", "hamstrings", "lower_back"],
  leg_press: ["quads", "glutes", "hamstrings"],
  rdl: ["hamstrings", "glutes", "lower_back"],
  calf_raise: ["calves"],
  curl: ["biceps", "forearms"],
  triceps_pushdown: ["triceps"],
  plank: ["abs", "obliques"],
  hanging_leg_raise: ["abs", "obliques"],
};

// Recovery timing (hours) by muscle size & category.
// Note: Back recovers slowest, then legs, then chest/shoulders, then arms/calves/core.
// Also reflects: it takes less time to move Red→Yellow→Green for chest than for back.
const RecoveryWindows: Record<
  MuscleGroup,
  { red_cutoff_h: number; yellow_cutoff_h: number }
> = {
  // red: 0 → red_cutoff_h, yellow: (red_cutoff_h, yellow_cutoff_h], green: > yellow_cutoff_h
  chest: { red_cutoff_h: 24, yellow_cutoff_h: 60 },
  front_delts: { red_cutoff_h: 20, yellow_cutoff_h: 48 },
  side_delts: { red_cutoff_h: 18, yellow_cutoff_h: 42 },
  rear_delts: { red_cutoff_h: 20, yellow_cutoff_h: 48 },
  lats: { red_cutoff_h: 30, yellow_cutoff_h: 72 }, // slower than chest
  upper_back: { red_cutoff_h: 28, yellow_cutoff_h: 68 },
  lower_back: { red_cutoff_h: 30, yellow_cutoff_h: 76 },
  biceps: { red_cutoff_h: 18, yellow_cutoff_h: 40 },
  triceps: { red_cutoff_h: 18, yellow_cutoff_h: 40 },
  forearms: { red_cutoff_h: 16, yellow_cutoff_h: 36 },
  abs: { red_cutoff_h: 16, yellow_cutoff_h: 36 },
  obliques: { red_cutoff_h: 16, yellow_cutoff_h: 36 },
  glutes: { red_cutoff_h: 26, yellow_cutoff_h: 64 },
  quads: { red_cutoff_h: 28, yellow_cutoff_h: 68 },
  hamstrings: { red_cutoff_h: 28, yellow_cutoff_h: 68 },
  calves: { red_cutoff_h: 18, yellow_cutoff_h: 40 },
};

// ---------------------- Utilities ----------------------
function hoursSince(dateIso?: string): number | null {
  if (!dateIso) return null;
  const then = new Date(dateIso).getTime();
  if (Number.isNaN(then)) return null;
  const now = Date.now();
  return Math.max(0, (now - then) / (1000 * 60 * 60));
}

export function computeStatus(m: MuscleGroup, lastIso?: string): RecoveryStatus {
  const hrs = hoursSince(lastIso);
  if (hrs === null) return "green"; // never trained → considered fresh
  const w = RecoveryWindows[m];
  if (!w) return "green";
  if (hrs <= w.red_cutoff_h) return "red";
  if (hrs <= w.yellow_cutoff_h) return "yellow";
  return "green";
}

export function statusText(s: RecoveryStatus): string {
  if (s === "red") return "Not ready (trained ≤24h)";
  if (s === "yellow") return "Partially recovered (48–72h window)";
  return "Ready (≥3 days)";
}

export function statusColor(s: RecoveryStatus): string {
  return s === "red" ? "#ef4444" : s === "yellow" ? "#f59e0b" : "#22c55e";
}

// Given logged workouts (either templates or exercises) + timestamp, build a LastTrainedMap
export type WorkoutLogItem =
  | { type: "template"; template: keyof typeof DayTemplates; at: string }
  | { type: "exercise"; exercise: keyof typeof ExerciseToMuscles; at: string };

export function accumulateLastTrained(logs: WorkoutLogItem[]): LastTrainedMap {
  const last: LastTrainedMap = {};
  for (const item of logs) {
    const groups: MuscleGroup[] =
      item.type === "template"
        ? DayTemplates[item.template]
        : ExerciseToMuscles[item.exercise];
    if (!groups) continue;
    for (const g of groups) {
      const existing = last[g] ? new Date(last[g]!).getTime() : 0;
      const current = new Date(item.at).getTime();
      if (current > existing) last[g] = item.at; // keep most recent time
    }
  }
  return last;
}

// ---------------------- Component ----------------------
export type MuscleRecovery360Props = {
  // Array of frame image URLs in correct order (e.g., 24 or 36 frames per 360°).
  frames?: string[];
  frameWidth?: number; // px
  frameHeight?: number; // px
  lastTrained?: LastTrainedMap; // if omitted, everything is green
  className?: string;
  title?: string;
  // optional: show a right-side panel with computed statuses
  showPanel?: boolean;
  // fired when a muscle is selected from the panel
  onSelectMuscle?: (m: MuscleGroup, status: RecoveryStatus) => void;
};

const ALL_MUSCLES: MuscleGroup[] = [
  "chest",
  "front_delts",
  "side_delts",
  "rear_delts",
  "lats",
  "upper_back",
  "lower_back",
  "biceps",
  "triceps",
  "forearms",
  "abs",
  "obliques",
  "glutes",
  "quads",
  "hamstrings",
  "calves",
];

export default function MuscleRecovery360({
  frames,
  frameWidth = 480,
  frameHeight = 480,
  lastTrained = {},
  className,
  title = "Muscle Recovery",
  showPanel = true,
  onSelectMuscle,
}: MuscleRecovery360Props) {
  const [frame] = useState(1);
  const count = frames?.length ?? 0;

  const statuses = useMemo(() => {
    const s: Record<MuscleGroup, RecoveryStatus> = {} as any;
    for (const m of ALL_MUSCLES) s[m] = computeStatus(m, lastTrained[m]);
    return s;
  }, [lastTrained]);

  // Group by status for quick legend counts
  const totals = useMemo(() => {
    const t = { red: 0, yellow: 0, green: 0 } as Record<RecoveryStatus, number>;
    for (const m of ALL_MUSCLES) t[statuses[m]]++;
    return t;
  }, [statuses]);

  return (
    <div className={clsx("w-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <LegendDot color="#ef4444" label={`Red (${totals.red})`} />
          <LegendDot color="#f59e0b" label={`Yellow (${totals.yellow})`} />
          <LegendDot color="#22c55e" label={`Green (${totals.green})`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative rounded-2xl bg-neutral-900/5 p-2 flex items-center justify-center">
          {frames && count > 0 ? (
            <div className="overflow-hidden rounded-2xl">
              {/* 360 Viewer temporarily disabled - requires react-360-view dependency */}
              <div 
                className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl"
                style={{ width: frameWidth, height: frameHeight }}
              >
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <RotateCw className="w-12 h-12 mx-auto mb-2 animate-spin" />
                  <p className="text-sm">360° View</p>
                  <p className="text-xs">Coming Soon</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[420px] flex flex-col items-center justify-center text-center p-6">
              <RotateCw className="w-8 h-8 mb-2" />
              <p className="text-sm opacity-80">
                Provide 360° frames to enable the rotatable model.
              </p>
              <p className="text-xs opacity-70">
                Pass a string[] of ordered frame URLs via the <code>frames</code> prop.
              </p>
            </div>
          )}

          {/* Status hint overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 text-white text-xs flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>Frame {frame}/{Math.max(count, 0)}</span>
          </motion.div>
        </div>

        {showPanel && (
          <div className="rounded-2xl border p-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4" />
              <p className="text-sm opacity-80">
                Status is computed per muscle from last trained timestamps.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_MUSCLES.map((m) => {
                const s = statuses[m];
                return (
                  <button
                    key={m}
                    onClick={() => onSelectMuscle?.(m, s)}
                    className="text-left rounded-xl border p-2 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: statusColor(s) }}
                      />
                      <span className="font-medium capitalize">{m.replace("_", " ")}</span>
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {lastTrained[m]
                        ? new Date(lastTrained[m]!).toLocaleString()
                        : "No logs"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs opacity-80">{label}</span>
    </div>
  );
}

// ---------------------- Example usage ----------------------
// <MuscleRecovery360
//   frames={["/frames/0001.png", "/frames/0002.png", ...]}
//   lastTrained={accumulateLastTrained([
//     { type: "template", template: "leg_day", at: new Date().toISOString() },
//     { type: "template", template: "chest_day", at: new Date(Date.now() - 48*3600*1000).toISOString() },
//   ])}
// />

// ==========================================================
// ALT RENDERER: Human GLTF model with real-time tinting
// Use this if sprite frames look "robotic."
// Requires: @react-three/fiber, @react-three/drei, three
// You must supply a HUMAN GLTF/GLB model URL via `modelUrl`.
// No placeholder assets included (per your requirement).
// ==========================================================

// Temporarily disabled due to missing dependencies
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import * as THREE from "three";

export function HumanRecoveryViewer({
  modelUrl,
  lastTrained = {},
  onSelectMuscle,
  initialZoom = 1.2,
}: {
  modelUrl: string; // e.g., "/models/human.glb" (you provide)
  lastTrained?: LastTrainedMap;
  onSelectMuscle?: (m: MuscleGroup, s: RecoveryStatus) => void;
  initialZoom?: number;
}) {
  // Placeholder implementation - requires @react-three/fiber, @react-three/drei, three
  console.log('3D Viewer parameters:', { modelUrl, lastTrained, onSelectMuscle, initialZoom });
  
  return (
    <div className="w-full h-[540px] rounded-2xl border overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <Activity className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">3D Human Model</h3>
        <p className="text-sm mb-2">Interactive muscle recovery visualization</p>
        <p className="text-xs">Requires Three.js dependencies to be installed</p>
      </div>
    </div>
  );
}
