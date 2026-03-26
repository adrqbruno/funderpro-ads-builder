import { getScale, ANIM_MAP } from "./constants.js";
import { state } from "./state.js";

const ANIM_CSS = `
  @keyframes adsFadeIn    { from { opacity:0 } to { opacity:1 } }
  @keyframes adsSlideLeft { from { opacity:0; transform:translateX(calc(-50% + 30px)) } to { opacity:1; transform:translateX(-50%) } }
  @keyframes adsSlideUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  @keyframes adsZoomIn    { from { opacity:0; transform:scale(.8) } to { opacity:1; transform:scale(1) } }
  @keyframes adsBounce    { 0% { opacity:0; transform:scale(.6) } 60% { transform:scale(1.1) } 100% { opacity:1; transform:scale(1) } }
`;

function animStyle(name, delay, active) {
  if (!active || name === "none" || !ANIM_MAP[name]) return "";
  return `animation:${ANIM_MAP[name]} 0.7s ease-out ${delay}s both;`;
}

export function renderPreview(animating = false) {
  const { fmt, layers } = state;
  const sc   = getScale(fmt);
  const W    = fmt.w * sc;
  const H    = fmt.h * sc;
  const thin = fmt.h <= 100;

  const wrapper = document.getElementById("banner-wrapper");
  wrapper.innerHTML = "";

  // Outer clip (hides overflow, gives shadow)
  const clip = document.createElement("div");
  clip.style.cssText = `width:${W}px;height:${H}px;overflow:hidden;border-radius:4px;box-shadow:0 4px 24px rgba(0,0,0,.35);flex-shrink:0;`;

  // Banner root
  const banner = document.createElement("div");
  banner.id = "banner";
  banner.style.cssText = `width:${W}px;height:${H}px;position:relative;overflow:hidden;background:${layers.bg.color};`;

  // Inject animation keyframes once
  const styleEl = document.createElement("style");
  styleEl.textContent = ANIM_CSS;
  banner.appendChild(styleEl);

  // Background image
  if (layers.image.src) {
    const img = document.createElement("img");
    img.src = layers.image.src;
    img.style.cssText = `position:absolute;left:${layers.image.x}%;top:${layers.image.y}%;width:${layers.image.w}%;height:${layers.image.h}%;object-fit:cover;opacity:${layers.image.opacity / 100};`;
    banner.appendChild(img);
  }

  // Logo (positioned in px, scaled)
  if (layers.logo.src) {
    const img = document.createElement("img");
    img.src = layers.logo.src;
    img.style.cssText = `position:absolute;left:${layers.logo.x * sc}px;top:${layers.logo.y * sc}px;width:${layers.logo.w * sc}px;height:${layers.logo.h * sc}px;object-fit:contain;opacity:${layers.logo.opacity / 100};`;
    banner.appendChild(img);
  }

  // Visual element (positioned in %, sized in px scaled)
  if (layers.visual.src) {
    const img = document.createElement("img");
    img.src = layers.visual.src;
    img.style.cssText = `position:absolute;left:${layers.visual.x}%;top:${layers.visual.y}%;transform:translate(-50%,-50%);width:${layers.visual.w * sc}px;height:${layers.visual.h * sc}px;object-fit:contain;opacity:${layers.visual.opacity / 100};`;
    banner.appendChild(img);
  }

  if (thin) {
    // ── Thin layout (Leaderboard, Banner, Mobile Banner, etc.) ──────────
    const pad  = Math.round(H * 0.15);
    const ctaW = Math.min(layers.cta.w * sc, W * 0.35);
    const ctaH = Math.min(layers.cta.h * sc, H * 0.72);

    const hl = document.createElement("div");
    hl.textContent = layers.headline.text;
    hl.style.cssText = `position:absolute;left:${pad}px;top:50%;transform:translateY(-50%);width:${W - ctaW - pad * 3.5}px;color:${layers.headline.color};font-size:${layers.headline.size * sc}px;font-family:${layers.headline.font};font-weight:${layers.headline.bold ? 700 : 400};line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${animStyle(layers.headline.anim, 0.1, animating)}`;
    banner.appendChild(hl);

    const cta = document.createElement("div");
    cta.textContent = layers.cta.text;
    cta.style.cssText = `position:absolute;right:${pad}px;top:50%;transform:translateY(-50%);background:${layers.cta.bgColor};color:${layers.cta.textColor};font-size:${layers.cta.size * sc}px;font-family:${layers.cta.font};width:${ctaW}px;height:${ctaH}px;border-radius:${layers.cta.radius}px;display:flex;align-items:center;justify-content:center;font-weight:700;cursor:pointer;white-space:nowrap;${animStyle(layers.cta.anim, 0.4, animating)}`;
    banner.appendChild(cta);

  } else {
    // ── Standard layout ─────────────────────────────────────────────────
    const hl = document.createElement("div");
    hl.textContent = layers.headline.text;
    hl.style.cssText = `position:absolute;left:${layers.headline.x}%;top:${layers.headline.y}%;transform:translate(-50%,-50%);text-align:center;width:85%;color:${layers.headline.color};font-size:${layers.headline.size * sc}px;font-family:${layers.headline.font};font-weight:${layers.headline.bold ? 700 : 400};line-height:1.2;word-wrap:break-word;${animStyle(layers.headline.anim, 0.1, animating)}`;
    banner.appendChild(hl);

    const bd = document.createElement("div");
    bd.textContent = layers.body.text;
    bd.style.cssText = `position:absolute;left:${layers.body.x}%;top:${layers.body.y}%;transform:translate(-50%,-50%);text-align:center;width:80%;color:${layers.body.color};font-size:${layers.body.size * sc}px;font-family:${layers.body.font};font-weight:${layers.body.bold ? 700 : 400};line-height:1.4;word-wrap:break-word;${animStyle(layers.body.anim, 0.35, animating)}`;
    banner.appendChild(bd);

    const ctaW = Math.min(layers.cta.w * sc, W * 0.92);
    const ctaH = layers.cta.h * sc;
    const cta  = document.createElement("div");
    cta.textContent = layers.cta.text;
    cta.style.cssText = `position:absolute;left:${layers.cta.x}%;top:${layers.cta.y}%;transform:translate(-50%,-50%);background:${layers.cta.bgColor};color:${layers.cta.textColor};font-size:${layers.cta.size * sc}px;font-family:${layers.cta.font};width:${ctaW}px;height:${ctaH}px;border-radius:${layers.cta.radius}px;display:flex;align-items:center;justify-content:center;font-weight:700;cursor:pointer;white-space:nowrap;${animStyle(layers.cta.anim, 0.6, animating)}`;
    banner.appendChild(cta);
  }

  clip.appendChild(banner);
  wrapper.appendChild(clip);

  document.getElementById("canvas-info").textContent =
    `${fmt.label} — ${fmt.w}×${fmt.h}px (preview at ${Math.round(sc * 100)}%)`;
}
