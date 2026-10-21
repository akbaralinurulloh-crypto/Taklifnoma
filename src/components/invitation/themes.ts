import type { Design } from "@/lib/schema";

export type GateKind = "button" | "envelope" | "seal" | "heart" | "doors" | "swipe";
export type HeroKind = "full" | "arch" | "oval" | "polaroid" | "silk" | "plain" | "tile" | "atlas";
export type CardShape = "arch" | "round" | "square";

export type Theme = {
  gate: GateKind;
  hero: HeroKind;
  card: CardShape;
  /** CSS o'zgaruvchilar: --bg sahifa foni, --paper karta foni, --ink matn, --muted ikkilamchi matn, --accent urg'u, --on rang ustidagi matn. */
  vars: Record<"--bg" | "--paper" | "--ink" | "--muted" | "--accent" | "--accent2" | "--on", string>;
  /** Ochilish ekrani foni va yozuv rangi. */
  gateBg: string;
  gateInk: string;
  /** Konvert/muhr rangi. */
  gateColor: string;
  gateColor2: string;
};

export const THEMES: Record<Design, Theme> = {
  anor: {
    gate: "button", hero: "full", card: "round",
    vars: { "--bg": "#fdf8f4", "--paper": "#ffffff", "--ink": "#4a0f1c", "--muted": "#7a4a54", "--accent": "#7d1228", "--accent2": "#c9a15a", "--on": "#fff4ec" },
    gateBg: "radial-gradient(ellipse at top,#8c1a30,#4a0a17 75%)", gateInk: "#fff1e6", gateColor: "#7d1228", gateColor2: "#c9a15a",
  },
  osmon: {
    gate: "envelope", hero: "oval", card: "round",
    vars: { "--bg": "#f6f9fc", "--paper": "#ffffff", "--ink": "#3d5f80", "--muted": "#6f8499", "--accent": "#5b86ad", "--accent2": "#b08a4a", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#d7e6f3 0%,#f4f8fb 55%,#fbf3e6 100%)", gateInk: "#3d5f80", gateColor: "#e9f1f9", gateColor2: "#c9a05a",
  },
  zarrin: {
    gate: "heart", hero: "silk", card: "round",
    vars: { "--bg": "#f4ecdc", "--paper": "#fffaf0", "--ink": "#4a3a16", "--muted": "#7c6a3e", "--accent": "#a8802c", "--accent2": "#6c5214", "--on": "#fffaf0" },
    gateBg: "linear-gradient(135deg,#5c4414,#c9a557 45%,#7b5f20 70%,#e8d49a)", gateInk: "#fffaf0", gateColor: "#fffaf0", gateColor2: "#a8802c",
  },
  oqqora: {
    gate: "swipe", hero: "full", card: "square",
    vars: { "--bg": "#0c0c0c", "--paper": "#161616", "--ink": "#f3f3f3", "--muted": "#a8a8a8", "--accent": "#ffffff", "--accent2": "#cfcfcf", "--on": "#0c0c0c" },
    gateBg: "radial-gradient(circle at 50% 40%,#2a2a2a,#050505 70%)", gateInk: "#ffffff", gateColor: "#ffffff", gateColor2: "#999999",
  },
  zaytun: {
    gate: "envelope", hero: "arch", card: "arch",
    vars: { "--bg": "#f4f5ef", "--paper": "#fbfbf7", "--ink": "#2d3a1e", "--muted": "#5f6b4b", "--accent": "#6f7f4a", "--accent2": "#b49a5a", "--on": "#fbfbf7" },
    gateBg: "linear-gradient(160deg,#59632f,#2b3216 60%,#7f8a55)", gateInk: "#f4f5ef", gateColor: "#69744a", gateColor2: "#b9965a",
  },
  shokolad: {
    gate: "envelope", hero: "arch", card: "round",
    vars: { "--bg": "#f6efe8", "--paper": "#fffaf5", "--ink": "#3d2619", "--muted": "#7a5d4b", "--accent": "#6a4331", "--accent2": "#c4a27a", "--on": "#fffaf5" },
    gateBg: "linear-gradient(180deg,#efe2d3,#f9f2ea 60%,#e3d0bb)", gateInk: "#3d2619", gateColor: "#5a3825", gateColor2: "#c4a27a",
  },
  gulchizma: {
    gate: "button", hero: "plain", card: "square",
    vars: { "--bg": "#fbfaf7", "--paper": "#ffffff", "--ink": "#232323", "--muted": "#666666", "--accent": "#232323", "--accent2": "#8a8a8a", "--on": "#ffffff" },
    gateBg: "#fbfaf7", gateInk: "#232323", gateColor: "#232323", gateColor2: "#8a8a8a",
  },
  muhr: {
    gate: "seal", hero: "polaroid", card: "round",
    vars: { "--bg": "#fdfcf8", "--paper": "#ffffff", "--ink": "#2e3b25", "--muted": "#667258", "--accent": "#55663a", "--accent2": "#b49a5a", "--on": "#ffffff" },
    gateBg: "#fbfaf5", gateInk: "#2e3b25", gateColor: "#55663a", gateColor2: "#7c8c58",
  },
  firuza: {
    gate: "doors", hero: "tile", card: "arch",
    vars: { "--bg": "#eef7f6", "--paper": "#ffffff", "--ink": "#0b4f55", "--muted": "#4b7c80", "--accent": "#0f7f86", "--accent2": "#d9a441", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#0a6a72,#064147)", gateInk: "#f5eecf", gateColor: "#0f7f86", gateColor2: "#d9a441",
  },
  atlas: {
    gate: "button", hero: "atlas", card: "square",
    vars: { "--bg": "#fff8e8", "--paper": "#ffffff", "--ink": "#5a1410", "--muted": "#8a5a3c", "--accent": "#c8281e", "--accent2": "#1f4aa8", "--on": "#fff8e8" },
    gateBg: "linear-gradient(160deg,#c8281e,#7a120c 70%)", gateInk: "#fff3d6", gateColor: "#f2b01e", gateColor2: "#1f4aa8",
  },
};
