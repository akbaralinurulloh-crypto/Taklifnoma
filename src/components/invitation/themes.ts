import type { Design } from "@/lib/schema";
import type { FxKind } from "./Fx";

export type GateKind = "button" | "envelope" | "seal" | "heart" | "doors" | "swipe";
/** Bosh ekran: arch = arkali rasm, full = to'liq ekran rasm, oval = tuxumsimon, round = doira, frame = ofsetli ramka. */
export type HeroKind = "arch" | "full" | "oval" | "round" | "frame" | "sky" | "silk" | "card" | "deco" | "botanic" | "boho" | "editorial";
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
  /** Ipak mato foni (hero va sahifa foni). */
  silk?: "gold" | "olive" | "cream" | "wine";
  /** Yumaloq kartalar (ipak dizaynlar uchun). */
  round?: boolean;
  /** Taqvimda yurak. */
  heart?: boolean;
  /** Zaytun shoxi bezagi. */
  branch?: boolean;
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
  deko: {
    dark: true,
    gate: "doors", hero: "deco", layout: "rule",
    fx: "sparkles", fxColors: ["#e8c76a", "#ffffff"], fxDensity: 0.35,
    heroBg: "radial-gradient(ellipse at 50% 0%,#1d2a45,#0a0f1c 75%)", heroInk: "#f3e9cf",
    vars: { "--bg": "#0a0f1c", "--paper": "#121a2d", "--ink": "#f3e9cf", "--muted": "#c9bd9a", "--accent": "#e0be6a", "--accent2": "#b8975a", "--on": "#0a0f1c" },
    gateBg: "radial-gradient(circle at 50% 35%,#1d2a45,#070a14 75%)", gateInk: "#f3e9cf", gateColor: "#e0be6a", gateColor2: "#b8975a",
  },
  evkalipt: {
    gate: "envelope", hero: "botanic", layout: "panels", round: true,
    fx: "leaves", fxColors: ["#9db39a", "#c2d1bf"], fxDensity: 0.3,
    heroBg: "linear-gradient(180deg,#e8eee4 0%,#f8f6ef 75%)", heroInk: "#34452f",
    vars: { "--bg": "#f8f6ef", "--paper": "#ffffff", "--ink": "#34452f", "--muted": "#5f7058", "--accent": "#4f6b4a", "--accent2": "#b49a5a", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#dfe8da,#f8f6ef 60%,#e9e4d2)", gateInk: "#34452f", gateColor: "#7f967a", gateColor2: "#b49a5a",
  },
  boho: {
    gate: "button", hero: "boho", layout: "journey", round: true,
    fx: "none", fxColors: [],
    heroBg: "linear-gradient(180deg,#f3e3cf 0%,#faf3e8 80%)", heroInk: "#5a3322",
    vars: { "--bg": "#faf3e8", "--paper": "#fffaf3", "--ink": "#5a3322", "--muted": "#85624e", "--accent": "#b4573a", "--accent2": "#d3a06a", "--on": "#fffaf3" },
    gateBg: "linear-gradient(180deg,#f3e3cf,#faf3e8)", gateInk: "#5a3322", gateColor: "#b4573a", gateColor2: "#d3a06a",
  },
  jurnal: {
    gate: "swipe", hero: "editorial", layout: "journey",
    fx: "none", fxColors: [],
    heroBg: "#ffffff", heroInk: "#141414",
    vars: { "--bg": "#ffffff", "--paper": "#fafafa", "--ink": "#141414", "--muted": "#5c5c5c", "--accent": "#141414", "--accent2": "#a8874a", "--on": "#ffffff" },
    gateBg: "#ffffff", gateInk: "#141414", gateColor: "#141414", gateColor2: "#a8874a",
  },
  yoqut: {
    silk: "wine", dark: true,
    gate: "heart", hero: "silk", layout: "panels",
    fx: "hearts", fxColors: ["#e8c76a", "#f2d9a0"], fxDensity: 0.25,
    heroBg: "#5a1426", heroInk: "#fbeedd",
    vars: { "--bg": "#2a0a14", "--paper": "#3a1220", "--ink": "#fbeedd", "--muted": "#d9bfa8", "--accent": "#e8c76a", "--accent2": "#c9a557", "--on": "#2a0a14" },
    gateBg: "linear-gradient(115deg,#3a0c18 0%,#8a2540 30%,#4a1022 52%,#a8344f 74%,#3a0c18 100%)", gateInk: "#fbeedd", gateColor: "#fbeedd", gateColor2: "#e8c76a",
  },
  tong: {
    heart: true, round: true,
    gate: "envelope", hero: "sky", layout: "panels",
    fx: "sparkles", fxColors: ["#c9a05a", "#ffffff"], fxDensity: 0.3,
    heroBg: "linear-gradient(180deg,#dbe8f6 0%,#f4f8fc 70%,#fbf4e6 100%)", heroInk: "#2c4a6e",
    vars: { "--bg": "#f4f8fc", "--paper": "#ffffff", "--ink": "#2c4a6e", "--muted": "#5b7390", "--accent": "#4f7cab", "--accent2": "#c9a05a", "--on": "#ffffff" },
    gateBg: "linear-gradient(180deg,#d4e4f4 0%,#f4f8fc 60%,#fbf1de 100%)", gateInk: "#2c4a6e", gateColor: "#e6eff9", gateColor2: "#c9a05a",
  },
  ipak: {
    silk: "gold",
    gate: "heart", hero: "silk", layout: "rule",
    fx: "gold", fxColors: ["#e8c76a", "#fff1b8"], fxDensity: 0.35,
    heroBg: "#b98d4a", heroInk: "#fffaf0",
    vars: { "--bg": "#efe5d3", "--paper": "#f8f1e3", "--ink": "#4a3516", "--muted": "#76603a", "--accent": "#8f6a22", "--accent2": "#c9a557", "--on": "#fffaf0" },
    gateBg: "linear-gradient(115deg,#6d5222 0%,#c9a557 30%,#8a6a2a 52%,#e6cf94 74%,#7b5f20 100%)", gateInk: "#fffaf0", gateColor: "#fffaf0", gateColor2: "#c9a557",
  },
  bant: {
    silk: "olive", round: true,
    gate: "seal", hero: "card", layout: "panels",
    fx: "none", fxColors: [],
    heroBg: "#6f7650", heroInk: "#2f3520",
    vars: { "--bg": "#7b8259", "--paper": "#f7f5ec", "--ink": "#2f3520", "--muted": "#59603f", "--accent": "#4f5a30", "--accent2": "#a58d4e", "--on": "#f7f5ec" },
    gateBg: "linear-gradient(120deg,#555d36,#8a916a 45%,#4e552f 75%,#7b8259)", gateInk: "#f7f5ec", gateColor: "#6a7344", gateColor2: "#a58d4e",
  },
  krem: {
    silk: "cream", round: true, heart: true,
    gate: "seal", hero: "card", layout: "rule",
    fx: "none", fxColors: [],
    heroBg: "#e2d3bf", heroInk: "#4a2f22",
    vars: { "--bg": "#efe4d3", "--paper": "#fbf8f2", "--ink": "#4a2f22", "--muted": "#7d6554", "--accent": "#6b4331", "--accent2": "#b89a6b", "--on": "#fbf8f2" },
    gateBg: "linear-gradient(120deg,#e6d8c4,#faf4ea 45%,#d9c7ad 75%,#efe4d3)", gateInk: "#4a2f22", gateColor: "#5a3a2a", gateColor2: "#b89a6b",
  },
  marmar: {
    gate: "swipe", hero: "round", layout: "panels",
    fx: "none", fxColors: [],
    heroBg: "linear-gradient(135deg,#f4f4f2 0%,#e6e6e3 40%,#f8f8f6 70%,#dedddb 100%)", heroInk: "#1c1c1c",
    vars: { "--bg": "#f6f6f4", "--paper": "#ffffff", "--ink": "#1c1c1c", "--muted": "#555555", "--accent": "#1c1c1c", "--accent2": "#b8975a", "--on": "#ffffff" },
    gateBg: "linear-gradient(135deg,#f6f6f4,#e4e4e1 50%,#f8f8f6)", gateInk: "#1c1c1c", gateColor: "#1c1c1c", gateColor2: "#b8975a",
  },
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
    branch: true,
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
