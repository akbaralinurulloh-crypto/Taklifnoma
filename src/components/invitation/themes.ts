import type { Design } from "@/lib/schema";
import type { FxKind } from "./Fx";

export type GateKind = "button" | "envelope" | "seal" | "heart" | "doors" | "swipe";
/** Bosh ekran: arch = arkali rasm, full = to'liq ekran rasm, oval = tuxumsimon, round = doira, frame = ofsetli ramka. */
export type HeroKind = "arch" | "full" | "oval" | "round" | "frame";
/** Bo'limlar skeleti: rule = chiziq bilan ajratilgan, panels = ramkali panellar, journey = chap tekislangan yo'l. */
export type LayoutKind = "rule" | "panels" | "journey";

export type Theme = {
  gate: GateKind;
  hero: HeroKind;
  layout: LayoutKind;
  fx: FxKind;
  fxColors: string[];
  /** Zarrachalar zichligi (1 = oddiy). */
  fxDensity?: number;
  dark?: boolean;
  /** Hero foni va yozuv rangi. */
  heroBg: string;
  heroInk: string;
  /** CSS o'zgaruvchilar. */
  vars: Record<"--bg" | "--paper" | "--ink" | "--muted" | "--accent" | "--accent2" | "--on", string>;
  gateBg: string;
  gateInk: string;
  gateColor: string;
  gateColor2: string;
};

export const THEMES: Record<Design, Theme> = {
  zarrin: {
    gate: "envelope", hero: "arch", layout: "rule",
    fx: "gold", fxColors: ["#e8c76a", "#c9a557", "#fff1b8"], fxDensity: 0.45,
    heroBg: "linear-gradient(180deg,#f6ecd6 0%,#fbf7ee 70%)", heroInk: "#2f2412",
    vars: { "--bg": "#fbf7ee", "--paper": "#fffdf8", "--ink": "#2f2412", "--muted": "#6b5a3a", "--accent": "#9a7218", "--accent2": "#c9a557", "--on": "#fffdf8" },
    gateBg: "linear-gradient(180deg,#f6ecd6,#fbf7ee 60%,#efe2c4)", gateInk: "#2f2412", gateColor: "#fffaf0", gateColor2: "#9a7218",
  },
  oqqora: {
    gate: "doors", hero: "full", layout: "panels", dark: true,
    fx: "sparkles", fxColors: ["#e8c76a", "#ffffff"], fxDensity: 0.4,
    heroBg: "radial-gradient(ellipse at 50% 20%,#2a2412,#0b0b0c 72%)", heroInk: "#f4ecd8",
    vars: { "--bg": "#0b0b0c", "--paper": "#151516", "--ink": "#f4ecd8", "--muted": "#c2b693", "--accent": "#d9b86c", "--accent2": "#a88a45", "--on": "#0b0b0c" },
    gateBg: "radial-gradient(circle at 50% 40%,#2a2412,#050505 70%)", gateInk: "#f4ecd8", gateColor: "#d9b86c", gateColor2: "#a88a45",
  },
  osmon: {
    gate: "envelope", hero: "oval", layout: "rule",
    fx: "none", fxColors: [],
    heroBg: "linear-gradient(180deg,#0f1c40 0%,#1b2f66 100%)", heroInk: "#f7f2e4",
    vars: { "--bg": "#f6f8fc", "--paper": "#ffffff", "--ink": "#14244a", "--muted": "#4d5c82", "--accent": "#24407e", "--accent2": "#b79a5b", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#0f1c40,#1b2f66)", gateInk: "#f7f2e4", gateColor: "#e9eefb", gateColor2: "#b79a5b",
  },
  zaytun: {
    gate: "seal", hero: "round", layout: "journey",
    fx: "leaves", fxColors: ["#8ea16b", "#b5c28f"], fxDensity: 0.3,
    heroBg: "linear-gradient(180deg,#e7ead8 0%,#f6f4ec 75%)", heroInk: "#2a3320",
    vars: { "--bg": "#f6f4ec", "--paper": "#fdfcf7", "--ink": "#2a3320", "--muted": "#56614a", "--accent": "#4a5c30", "--accent2": "#b49a5a", "--on": "#fdfcf7" },
    gateBg: "#f6f4ec", gateInk: "#2a3320", gateColor: "#4a5c30", gateColor2: "#7c8c58",
  },
  shokolad: {
    gate: "button", hero: "frame", layout: "panels",
    fx: "none", fxColors: [],
    heroBg: "linear-gradient(180deg,#f1e4d4 0%,#f8f1ea 72%)", heroInk: "#3d2619",
    vars: { "--bg": "#f8f1ea", "--paper": "#fffaf5", "--ink": "#3d2619", "--muted": "#6e5242", "--accent": "#6a4331", "--accent2": "#c4a27a", "--on": "#fffaf5" },
    gateBg: "linear-gradient(180deg,#efe2d3,#f9f2ea 60%,#e3d0bb)", gateInk: "#3d2619", gateColor: "#5a3825", gateColor2: "#c4a27a",
  },
};
