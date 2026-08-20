import type { PlanStyleTheme } from "@/lib/styles";

export interface CvChartPalette {
  primary: string;
  secondary: string;
  grid: string;
  text: string;
}

const CHART_PALETTES: Record<string, CvChartPalette> = {
  neutral: {
    primary: "#64748b",
    secondary: "#94a3b8",
    grid: "#e2e8f0",
    text: "#475569",
  },
  "amber-classic": {
    primary: "#d97706",
    secondary: "#fbbf24",
    grid: "#fde68a",
    text: "#92400e",
  },
  "ocean-blue": {
    primary: "#2563eb",
    secondary: "#60a5fa",
    grid: "#bfdbfe",
    text: "#1d4ed8",
  },
  "blue-gradient": {
    primary: "#3b82f6",
    secondary: "#818cf8",
    grid: "#c7d2fe",
    text: "#1e40af",
  },
  emerald: {
    primary: "#059669",
    secondary: "#34d399",
    grid: "#a7f3d0",
    text: "#047857",
  },
  "royal-violet": {
    primary: "#7c3aed",
    secondary: "#a78bfa",
    grid: "#ddd6fe",
    text: "#5b21b6",
  },
  crimson: {
    primary: "#e11d48",
    secondary: "#fb7185",
    grid: "#fecdd3",
    text: "#9f1239",
  },
  lava: {
    primary: "#ea580c",
    secondary: "#fb923c",
    grid: "#fed7aa",
    text: "#9a3412",
  },
  "midnight-gradient": {
    primary: "#4f46e5",
    secondary: "#818cf8",
    grid: "#c7d2fe",
    text: "#3730a3",
  },
  "teal-breeze": {
    primary: "#0d9488",
    secondary: "#5eead4",
    grid: "#99f6e4",
    text: "#0f766e",
  },
};

const DEFAULT_PALETTE = CHART_PALETTES.neutral;

export function getChartPalette(
  theme: Pick<PlanStyleTheme, "id">,
): CvChartPalette {
  return CHART_PALETTES[theme.id] ?? DEFAULT_PALETTE;
}
