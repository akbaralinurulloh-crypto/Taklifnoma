import type { Design } from "@/lib/schema";
import type { FxKind } from "./Fx";

export type GateKind = "button" | "envelope" | "seal" | "heart" | "doors" | "swipe";
export type HeroKind = "rose" | "full" | "arch" | "oval" | "polaroid" | "silk" | "plain" | "tile" | "atlas";
/** Bo'limlar skeleti: cards = kartalar, story = uzluksiz hikoya, slides = to'liq ekranli bo'limlar. */
export type LayoutKind = "cards" | "story" | "slides";
export type CardShape = "arch" | "round" | "square";

export type Theme = {
  gate: GateKind;
  hero: HeroKind;
  card: CardShape;
  layout: LayoutKind;
  /** Fonda suzuvchi zarrachalar va ularning ranglari. */
  fx: FxKind;
  fxColors: string[];
  /** Zarrachalar zichligi (1 = oddiy, kichikroq = sokinroq). */
  fxDensity?: number;
  /** Qorong'i mavzu (oq matn, kulrang rasm emas). */
  dark?: boolean;
  /** Rasm bo'lmaganda qora-oq filtr. */
  gray?: boolean;
  /** Hero foni (gradient) va yorug'lik rangi. */
  heroBg?: string;
  glow?: string;
  /** Galereya va asosiy rasm uchun bezakli ramka. */
  frame?: "rose";
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
    frame: "rose", fxDensity: 0.35,
    fx: "petals", fxColors: ["#b3263a","#d94a5e","#8a1c2b","#f0a0aa"],
    gate: "heart", hero: "rose", layout: "cards", card: "round",
    vars: { "--bg": "#fdf8f4", "--paper": "#ffffff", "--ink": "#4a0f1c", "--muted": "#7a4a54", "--accent": "#7d1228", "--accent2": "#c9a15a", "--on": "#fff4ec" },
    gateBg: "radial-gradient(ellipse at top,#8c1a30,#4a0a17 75%)", gateInk: "#fff1e6", gateColor: "#e0314f", gateColor2: "#c9a15a",
  },
  osmon: {
    fx: "sparkles", fxColors: ["#c9a05a","#ffffff","#9fc2e3"],
    gate: "envelope", hero: "oval", layout: "cards", card: "round",
    vars: { "--bg": "#f6f9fc", "--paper": "#ffffff", "--ink": "#3d5f80", "--muted": "#6f8499", "--accent": "#5b86ad", "--accent2": "#b08a4a", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#d7e6f3 0%,#f4f8fb 55%,#fbf3e6 100%)", gateInk: "#3d5f80", gateColor: "#e9f1f9", gateColor2: "#c9a05a",
  },
  zarrin: {
    fx: "gold", fxColors: ["#e8c76a","#c9a557","#fff1b8"],
    gate: "heart", hero: "silk", layout: "slides", card: "round",
    vars: { "--bg": "#f4ecdc", "--paper": "#fffaf0", "--ink": "#4a3a16", "--muted": "#7c6a3e", "--accent": "#a8802c", "--accent2": "#6c5214", "--on": "#fffaf0" },
    gateBg: "linear-gradient(135deg,#5c4414,#c9a557 45%,#7b5f20 70%,#e8d49a)", gateInk: "#fffaf0", gateColor: "#fffaf0", gateColor2: "#a8802c",
  },
  oqqora: {
    dark: true, gray: true,
    fx: "stars", fxColors: ["#ffffff","#d9d9d9"],
    gate: "swipe", hero: "full", layout: "slides", card: "square",
    vars: { "--bg": "#0c0c0c", "--paper": "#161616", "--ink": "#f3f3f3", "--muted": "#a8a8a8", "--accent": "#ffffff", "--accent2": "#cfcfcf", "--on": "#0c0c0c" },
    gateBg: "radial-gradient(circle at 50% 40%,#2a2a2a,#050505 70%)", gateInk: "#ffffff", gateColor: "#ffffff", gateColor2: "#999999",
  },
  zaytun: {
    fx: "leaves", fxColors: ["#8ea16b","#6f7f4a","#b5c28f"],
    gate: "envelope", hero: "arch", layout: "story", card: "arch",
    vars: { "--bg": "#f4f5ef", "--paper": "#fbfbf7", "--ink": "#2d3a1e", "--muted": "#5f6b4b", "--accent": "#6f7f4a", "--accent2": "#b49a5a", "--on": "#fbfbf7" },
    gateBg: "linear-gradient(160deg,#59632f,#2b3216 60%,#7f8a55)", gateInk: "#f4f5ef", gateColor: "#69744a", gateColor2: "#b9965a",
  },
  shokolad: {
    fx: "hearts", fxColors: ["#c4a27a","#a07a58","#e3cdb0"],
    gate: "envelope", hero: "arch", layout: "story", card: "round",
    vars: { "--bg": "#f6efe8", "--paper": "#fffaf5", "--ink": "#3d2619", "--muted": "#7a5d4b", "--accent": "#6a4331", "--accent2": "#c4a27a", "--on": "#fffaf5" },
    gateBg: "linear-gradient(180deg,#efe2d3,#f9f2ea 60%,#e3d0bb)", gateInk: "#3d2619", gateColor: "#5a3825", gateColor2: "#c4a27a",
  },
  gulchizma: {
    fx: "petals", fxColors: ["#e9d5d9","#d8c2c8","#f3e6e9"],
    gate: "button", hero: "plain", layout: "story", card: "square",
    vars: { "--bg": "#fbfaf7", "--paper": "#ffffff", "--ink": "#232323", "--muted": "#666666", "--accent": "#232323", "--accent2": "#8a8a8a", "--on": "#ffffff" },
    gateBg: "#fbfaf7", gateInk: "#232323", gateColor: "#232323", gateColor2: "#8a8a8a",
  },
  muhr: {
    fx: "leaves", fxColors: ["#7c8c58","#55663a","#a3b07c"],
    gate: "seal", hero: "polaroid", layout: "story", card: "round",
    vars: { "--bg": "#fdfcf8", "--paper": "#ffffff", "--ink": "#2e3b25", "--muted": "#667258", "--accent": "#55663a", "--accent2": "#b49a5a", "--on": "#ffffff" },
    gateBg: "#fbfaf5", gateInk: "#2e3b25", gateColor: "#55663a", gateColor2: "#7c8c58",
  },
  firuza: {
    fx: "gold", fxColors: ["#d9a441","#f5eecf","#0f7f86"],
    gate: "doors", hero: "tile", layout: "slides", card: "arch",
    vars: { "--bg": "#eef7f6", "--paper": "#ffffff", "--ink": "#0b4f55", "--muted": "#4b7c80", "--accent": "#0f7f86", "--accent2": "#d9a441", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#0a6a72,#064147)", gateInk: "#f5eecf", gateColor: "#0f7f86", gateColor2: "#d9a441",
  },
  atlas: {
    fx: "confetti", fxColors: ["#c8281e","#f2b01e","#1f4aa8"],
    gate: "button", hero: "atlas", layout: "cards", card: "square",
    vars: { "--bg": "#fff8e8", "--paper": "#ffffff", "--ink": "#5a1410", "--muted": "#8a5a3c", "--accent": "#c8281e", "--accent2": "#1f4aa8", "--on": "#fff8e8" },
    gateBg: "linear-gradient(160deg,#c8281e,#7a120c 70%)", gateInk: "#fff3d6", gateColor: "#f2b01e", gateColor2: "#1f4aa8",
  },
  gulbarg: {
    gate: "heart", hero: "oval", layout: "slides", card: "round",
    fx: "petals", fxColors: ["#f4a6b8", "#e87a98", "#ffd0da", "#d46a85"],
    heroBg: "linear-gradient(180deg,#f9d3dc 0%,#fff0f3 65%,#fff7f1 100%)",
    vars: { "--bg": "#fff7f8", "--paper": "#ffffff", "--ink": "#6b2a3a", "--muted": "#9a6a76", "--accent": "#d46a85", "--accent2": "#e8b4a0", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#fbd9e1,#fff3f5 60%,#fde8dc)", gateInk: "#6b2a3a", gateColor: "#e87a98", gateColor2: "#d46a85",
  },
  yulduz: {
    gate: "swipe", hero: "full", layout: "story", card: "square", dark: true,
    fx: "stars", fxColors: ["#ffffff", "#ffe9a8", "#bcd0ff"],
    heroBg: "linear-gradient(180deg,#050b24 0%,#0e1d4d 60%,#1b2a66 100%)", glow: "#8fa8ff40",
    vars: { "--bg": "#0a1233", "--paper": "#111c4a", "--ink": "#eef1ff", "--muted": "#a9b4e0", "--accent": "#ffd978", "--accent2": "#bcd0ff", "--on": "#0a1233" },
    gateBg: "radial-gradient(circle at 50% 30%,#1d2c70,#050b24 75%)", gateInk: "#eef1ff", gateColor: "#ffd978", gateColor2: "#bcd0ff",
  },
  kapalak: {
    gate: "heart", hero: "arch", layout: "cards", card: "arch",
    fx: "butterflies", fxColors: ["#c58be0", "#f08bb4", "#8fb2f0", "#f4b36a"],
    heroBg: "linear-gradient(170deg,#e4d3f5,#f9e6f0 70%)",
    vars: { "--bg": "#fbf5fb", "--paper": "#ffffff", "--ink": "#4b2f66", "--muted": "#82689c", "--accent": "#9a5cc4", "--accent2": "#e58ab4", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#e6d6f7,#fbf1f8 60%,#f6e0ec)", gateInk: "#4b2f66", gateColor: "#b57bdc", gateColor2: "#9a5cc4",
  },
  oltin: {
    gate: "doors", hero: "full", layout: "slides", card: "square", dark: true,
    fx: "gold", fxColors: ["#e8c76a", "#c9a557", "#fff1b8"],
    heroBg: "radial-gradient(ellipse at 50% 30%,#3a2c0a,#0a0804 70%)", glow: "#e8c76a33",
    vars: { "--bg": "#0b0905", "--paper": "#16120a", "--ink": "#f6ecd0", "--muted": "#bba878", "--accent": "#e8c76a", "--accent2": "#c9a557", "--on": "#0b0905" },
    gateBg: "radial-gradient(circle at 50% 35%,#3a2c0a,#070503 75%)", gateInk: "#f6ecd0", gateColor: "#c9a557", gateColor2: "#e8c76a",
  },
  yurak: {
    gate: "heart", hero: "plain", layout: "cards", card: "round",
    fx: "hearts", fxColors: ["#e0314f", "#f27a8d", "#ff9fb0", "#b3122f"],
    vars: { "--bg": "#fffafa", "--paper": "#ffffff", "--ink": "#5a1220", "--muted": "#8c5a64", "--accent": "#d01f40", "--accent2": "#f27a8d", "--on": "#ffffff" },
    gateBg: "linear-gradient(160deg,#ffe3e8,#fff8f8 55%,#ffd2db)", gateInk: "#5a1220", gateColor: "#fff", gateColor2: "#d01f40",
  },
};
