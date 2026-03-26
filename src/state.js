import { FORMATS, CTA_PRESETS, BRAND } from "./constants.js";

export function DEFAULT_LAYERS(fmt) {
  const p = CTA_PRESETS[fmt.label] || { w: 120, h: 36, r: 6, fs: 14, x: 50, y: 80 };
  return {
    bg: {
      color: BRAND.dark,
    },
    image: {
      src: "", x: 0, y: 0, w: 100, h: 100, opacity: 100,
    },
    logo: {
      src: "", x: 10, y: 10, w: 80, h: 40, opacity: 100,
    },
    visual: {
      src: "", x: 50, y: 40, w: 200, h: 200, opacity: 100,
    },
    headline: {
      text:  "Trade Like a Pro. Keep the Profits.",
      color: BRAND.white,
      size:  18,
      font:  "Inter",
      bold:  true,
      x: 50, y: 40,
      anim: "fade-in",
    },
    body: {
      text:  "Start your funded trader journey today.",
      color: "#CCCCCC",
      size:  13,
      font:  "Inter",
      bold:  false,
      x: 50, y: 58,
      anim: "fade-in",
    },
    cta: {
      text:      "Get Funded Now",
      bgColor:   BRAND.red,
      textColor: BRAND.white,
      size:      p.fs,
      font:      "Inter",
      w: p.w, h: p.h,
      radius:    p.r,
      x: p.x,   y: p.y,
      anim: "fade-in",
    },
  };
}

export const state = {
  fmt:       FORMATS[0],
  layers:    DEFAULT_LAYERS(FORMATS[0]),
  mode:      "static",      // "static" | "animated"
  activeTab: "bg",          // "bg" | "logo" | "visual" | "headline" | "body" | "cta"
  market:    "Global (EN)",
};
