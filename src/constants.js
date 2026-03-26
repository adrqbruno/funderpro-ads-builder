export const FORMATS = [
  // ── IAB Core ─────────────────────────────────────────────────────────
  { label: "Medium Rectangle",    w: 300,  h: 250,  cat: "IAB" },
  { label: "Leaderboard",         w: 728,  h: 90,   cat: "IAB" },
  { label: "Wide Skyscraper",     w: 160,  h: 600,  cat: "IAB" },
  { label: "Half Page",           w: 300,  h: 600,  cat: "IAB" },
  { label: "Billboard",           w: 970,  h: 250,  cat: "IAB" },
  { label: "Mobile Banner",       w: 320,  h: 50,   cat: "IAB" },
  { label: "Mobile Interstitial", w: 320,  h: 100,  cat: "IAB" },

  // ── IAB Extended ─────────────────────────────────────────────────────
  { label: "Large Leaderboard",   w: 970,  h: 90,   cat: "IAB" },
  { label: "Large Rectangle",     w: 336,  h: 280,  cat: "IAB" },
  { label: "Small Rectangle",     w: 180,  h: 150,  cat: "IAB" },
  { label: "Skyscraper",          w: 120,  h: 600,  cat: "IAB" },
  { label: "Square",              w: 250,  h: 250,  cat: "IAB" },
  { label: "Small Square",        w: 200,  h: 200,  cat: "IAB" },
  { label: "Vertical Banner",     w: 120,  h: 240,  cat: "IAB" },
  { label: "Banner",              w: 468,  h: 60,   cat: "IAB" },
  { label: "Half Banner",         w: 234,  h: 60,   cat: "IAB" },
  { label: "Portrait",            w: 300,  h: 1050, cat: "IAB" },

  // ── Native ────────────────────────────────────────────────────────────
  { label: "Native Feed",         w: 1200, h: 628,  cat: "Native" },
  { label: "Native Square",       w: 1080, h: 1080, cat: "Native" },
  { label: "Native Story",        w: 1080, h: 1920, cat: "Native" },
];

// CTA presets: W, H, border-radius, font-size, X%, Y% per format
export const CTA_PRESETS = {
  "Medium Rectangle":    { w: 131, h: 38, r: 6,  fs: 16, x: 50, y: 82 },
  "Leaderboard":         { w: 171, h: 33, r: 6,  fs: 21, x: 75, y: 50 },
  "Wide Skyscraper":     { w: 149, h: 43, r: 6,  fs: 19, x: 50, y: 85 },
  "Half Page":           { w: 204, h: 59, r: 6,  fs: 25, x: 50, y: 82 },
  "Billboard":           { w: 266, h: 50, r: 6,  fs: 28, x: 50, y: 80 },
  "Mobile Banner":       { w: 80,  h: 30, r: 4,  fs: 12, x: 75, y: 50 },
  "Mobile Interstitial": { w: 85,  h: 31, r: 6,  fs: 14, x: 75, y: 50 },
  "Large Leaderboard":   { w: 232, h: 54, r: 6,  fs: 28, x: 75, y: 50 },
  "Large Rectangle":     { w: 147, h: 43, r: 6,  fs: 18, x: 50, y: 82 },
  "Small Rectangle":     { w: 79,  h: 23, r: 6,  fs: 10, x: 50, y: 82 },
  "Skyscraper":          { w: 129, h: 38, r: 6,  fs: 16, x: 50, y: 85 },
  "Square":              { w: 120, h: 35, r: 6,  fs: 15, x: 50, y: 82 },
  "Small Square":        { w: 96,  h: 28, r: 6,  fs: 12, x: 50, y: 82 },
  "Vertical Banner":     { w: 81,  h: 24, r: 6,  fs: 10, x: 50, y: 82 },
  "Banner":              { w: 109, h: 26, r: 6,  fs: 13, x: 75, y: 50 },
  "Half Banner":         { w: 76,  h: 21, r: 6,  fs: 11, x: 75, y: 50 },
  "Portrait":            { w: 220, h: 46, r: 6,  fs: 26, x: 50, y: 88 },
  "Native Feed":         { w: 360, h: 90, r: 6,  fs: 50, x: 50, y: 82 },
  "Native Square":       { w: 115, h: 21, r: 6,  fs: 76, x: 50, y: 85 },
  "Native Story":        { w: 1000,h: 200,r: 6,  fs: 70, x: 50, y: 88 },
};

export const FONTS = [
  "Inter", "Arial", "Georgia", "Helvetica", "Trebuchet MS",
  "Verdana", "Montserrat", "Oswald", "Barlow Condensed",
];

export const ANIMS = ["none", "fade-in", "slide-left", "slide-up", "zoom-in", "bounce"];

export const ANIM_LABELS = {
  "none": "None", "fade-in": "Fade In", "slide-left": "Slide Left",
  "slide-up": "Slide Up", "zoom-in": "Zoom In", "bounce": "Bounce",
};

export const ANIM_MAP = {
  "fade-in":    "adsFadeIn",
  "slide-left": "adsSlideLeft",
  "slide-up":   "adsSlideUp",
  "zoom-in":    "adsZoomIn",
  "bounce":     "adsBounce",
};

export const MARKETS = [
  "Global (EN)", "Colombia (ES)", "Peru (ES)", "Brazil (PT-BR)", "Mexico (ES)",
];

export const COPY = {
  "Global (EN)": {
    h: ["Trade Like a Pro. Keep the Profits.", "Get Funded. Trade Real Markets.", "Your Skills. Our Capital.", "Pass the Challenge. Unlock $200K."],
    b: ["Start your funded trader journey today.", "No risk to your own money.", "Join 50,000+ funded traders worldwide.", "FunderPro — where talent gets capital."],
    c: ["Get Funded Now", "Start Challenge", "Trade Now", "Apply Today"],
  },
  "Colombia (ES)": {
    h: ["Opera como los grandes. Quédate con las ganancias.", "Financiación real. Mercados reales.", "Tu talento. Nuestro capital.", "Supera el reto. Desbloquea $200K."],
    b: ["Empieza hoy tu camino como trader financiado.", "Sin riesgo para tu propio dinero.", "Únete a más de 50,000 traders financiados.", "FunderPro — donde el talento consigue capital."],
    c: ["Obtén Financiación", "Empieza el Reto", "Opera Ahora", "Aplica Hoy"],
  },
  "Peru (ES)": {
    h: ["Opera como los grandes. Quédate con las ganancias.", "Capital real. Mercados reales.", "Tu habilidad. Nuestro dinero.", "Completa el reto. Accede a $200K."],
    b: ["Inicia hoy como trader financiado.", "Sin arriesgar tu propio capital.", "Más de 50,000 traders financiados en el mundo.", "FunderPro — talento que consigue financiación."],
    c: ["Consigue Financiación", "Inicia el Reto", "Empieza a Operar", "Postula Ahora"],
  },
  "Brazil (PT-BR)": {
    h: ["Opera como os grandes. Fique com os lucros.", "Capital real. Mercados reais.", "Seu talento. Nosso capital.", "Passe o desafio. Acesse $200K."],
    b: ["Comece hoje sua jornada como trader financiado.", "Sem risco para o seu dinheiro.", "Mais de 50.000 traders financiados no mundo.", "FunderPro — onde talento vira capital."],
    c: ["Quero Financiamento", "Iniciar Desafio", "Operar Agora", "Candidatar-se"],
  },
  "Mexico (ES)": {
    h: ["Opera como los pros. Guarda las ganancias.", "Fondeo real. Mercados reales.", "Tu talento. Nuestro capital.", "Supera el desafío. Accede a $200K."],
    b: ["Comienza hoy como trader fondeado.", "Sin arriesgar tu propio dinero.", "Únete a más de 50,000 traders fondeados.", "FunderPro — donde el talento obtiene fondeo."],
    c: ["Obtén Fondeo", "Empieza el Desafío", "Opera Ya", "Aplica Ahora"],
  },
};

// FunderPro brand colours
export const BRAND = {
  red:   "#FF3333",
  dark:  "#1A1A1A",
  white: "#FFFFFF",
};

export const SCALE_MAX = 420;
export function getScale(fmt) {
  return Math.min(1, SCALE_MAX / Math.max(fmt.w, fmt.h));
}
