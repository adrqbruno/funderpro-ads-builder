import { FONTS, ANIMS, ANIM_LABELS, COPY } from "./constants.js";
import { state } from "./state.js";
import { renderPreview } from "./preview.js";

// ── DOM helpers ───────────────────────────────────────────────────────────────
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k === "style") e.style.cssText = v;
    else e.setAttribute(k, v);
  });
  children.forEach(c => c && e.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return e;
}
function lbl(t)         { return el("div", { class: "ctrl-label" }, t); }
function section(title, ...children) {
  const w = el("div", { class: "ctrl-section" });
  w.appendChild(el("div", { class: "ctrl-section-title" }, title));
  children.forEach(c => c && w.appendChild(c));
  return w;
}
function row(...cols) {
  const r = el("div", { class: "ctrl-row" });
  cols.forEach(c => { const w = el("div", { class: "ctrl-col" }); w.appendChild(c); r.appendChild(w); });
  return r;
}

function numInput(label, value, onChange) {
  const w = el("div", { style: "margin-bottom:10px" });
  w.appendChild(lbl(label));
  const i = el("input", { type: "number", class: "ctrl-input", value, min: 0, style: "width:100%" });
  i.addEventListener("input", e => onChange(Number(e.target.value)));
  w.appendChild(i);
  return w;
}

function textInput(label, value, onChange, multiline = false) {
  const w = el("div", { style: "margin-bottom:10px" });
  if (label) w.appendChild(lbl(label));
  const i = multiline
    ? el("textarea", { class: "ctrl-input", style: "width:100%;height:60px;resize:vertical" })
    : el("input",    { type: "text", class: "ctrl-input" });
  i.value = value;
  i.addEventListener("input", e => onChange(e.target.value));
  w.appendChild(i);
  return w;
}

function selectField(label, value, options, onChange, optLabels = null) {
  const w = el("div", { style: "margin-bottom:10px" });
  w.appendChild(lbl(label));
  const s = el("select", { class: "ctrl-input" });
  options.forEach(o => {
    const opt = el("option", { value: o }, optLabels ? optLabels[o] || o : o);
    if (o === value) opt.selected = true;
    s.appendChild(opt);
  });
  s.addEventListener("change", e => onChange(e.target.value));
  w.appendChild(s);
  return w;
}

function colorPick(label, value, onChange) {
  const w = el("div", { class: "ctrl-col" });
  w.appendChild(lbl(label));
  const r   = el("div", { class: "ctrl-color-wrap" });
  const inp = el("input", { type: "color", value });
  const hex = el("span", {}, value);
  inp.addEventListener("input", e => { hex.textContent = e.target.value; onChange(e.target.value); });
  r.appendChild(inp);
  r.appendChild(hex);
  w.appendChild(r);
  return w;
}

function slider(label, value, min, max, onChange) {
  const w  = el("div", { style: "margin-bottom:10px" });
  const lb = lbl(`${label}: ${value}`);
  const inp = el("input", { type: "range", min, max, value, style: "width:100%;accent-color:#FF3333" });
  inp.addEventListener("input", e => {
    lb.textContent = `${label}: ${e.target.value}`;
    onChange(Number(e.target.value));
  });
  w.appendChild(lb);
  w.appendChild(inp);
  return w;
}

function xySliders(layer, xVal, yVal) {
  return row(
    slider("X %", xVal, 0, 100, v => upd(layer, "x", v)),
    slider("Y %", yVal, 0, 100, v => upd(layer, "y", v))
  );
}

function imageUpload(label, current, onUpload) {
  const w   = el("div", { style: "margin-bottom:12px" });
  w.appendChild(lbl(label));
  const r   = el("div", { class: "upload-row" });
  const btn = el("button", { class: "btn-upload" }, current ? "Replace" : "Upload");
  const ok  = el("span",   { class: "upload-ok" },  current ? "✓ Loaded" : "");
  const inp = el("input",  { type: "file", accept: "image/*", style: "display:none" });
  btn.onclick = () => inp.click();
  inp.onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = ev => { ok.textContent = "✓ Loaded"; btn.textContent = "Replace"; onUpload(ev.target.result); };
    rd.readAsDataURL(f);
  };
  r.appendChild(btn);
  r.appendChild(ok);
  r.appendChild(inp);
  w.appendChild(r);
  return w;
}

function suggestions(items, onClick) {
  const w = el("div", { style: "margin-bottom:8px" });
  items.forEach(text => {
    const chip = el("div", { class: "copy-sugg" }, `▸ ${text}`);
    chip.onclick = () => onClick(text);
    w.appendChild(chip);
  });
  return w;
}

function clearBtn(label, onClick) {
  const btn = el("button", { class: "btn-clear" }, `✕ ${label}`);
  btn.onclick = onClick;
  return btn;
}

function upd(layer, key, val) {
  state.layers[layer][key] = val;
  renderPreview(state.mode === "animated");
}

// ── Panels ────────────────────────────────────────────────────────────────────

function panelBg() {
  const l = state.layers;
  const f = document.createDocumentFragment();

  f.appendChild(section("Background Colour",
    colorPick("Colour", l.bg.color, v => upd("bg", "color", v)),
  ));

  f.appendChild(section("Background Image",
    imageUpload("BG Image", l.image.src, v => upd("image", "src", v)),
    ...(l.image.src ? [
      slider("Opacity", l.image.opacity, 0, 100, v => upd("image", "opacity", v)),
      row(
        slider("X %", l.image.x, 0, 100, v => upd("image", "x", v)),
        slider("Y %", l.image.y, 0, 100, v => upd("image", "y", v)),
      ),
      row(
        slider("W %", l.image.w, 10, 200, v => upd("image", "w", v)),
        slider("H %", l.image.h, 10, 200, v => upd("image", "h", v)),
      ),
      clearBtn("Remove image", () => upd("image", "src", "")),
    ] : [])
  ));

  return f;
}

function panelLogo() {
  const l = state.layers;
  const f = document.createDocumentFragment();

  f.appendChild(section("Logo",
    imageUpload("Logo file (global — all formats)", l.logo.src, v => {
      // 1. store globally so unvisited formats pick it up on load
      window.__globalLogo = v;
      // 2. apply to all already-saved formats
      if (window.__savedLayers) {
        Object.values(window.__savedLayers).forEach(sl => { if (sl) sl.logo.src = v; });
      }
      // 3. apply to current format live
      upd("logo", "src", v);
    }),
    ...(l.logo.src ? [
      slider("Opacity", l.logo.opacity, 0, 100, v => upd("logo", "opacity", v)),
      row(numInput("X (px)", l.logo.x, v => upd("logo", "x", v)), numInput("Y (px)", l.logo.y, v => upd("logo", "y", v))),
      row(numInput("W (px)", l.logo.w, v => upd("logo", "w", v)), numInput("H (px)", l.logo.h, v => upd("logo", "h", v))),
      clearBtn("Remove logo (all formats)", () => {
        window.__globalLogo = "";
        if (window.__savedLayers) {
          Object.values(window.__savedLayers).forEach(sl => { if (sl) sl.logo.src = ""; });
        }
        upd("logo", "src", "");
      }),
    ] : [])
  ));

  f.appendChild(section("Visual Element",
    imageUpload("Image / PNG", l.visual.src, v => upd("visual", "src", v)),
    ...(l.visual.src ? [
      slider("Opacity", l.visual.opacity, 0, 100, v => upd("visual", "opacity", v)),
      xySliders("visual", l.visual.x, l.visual.y),
      row(numInput("W (px)", l.visual.w, v => upd("visual", "w", v)), numInput("H (px)", l.visual.h, v => upd("visual", "h", v))),
      clearBtn("Remove visual", () => upd("visual", "src", "")),
    ] : [])
  ));

  return f;
}

function panelHeadline() {
  const l = state.layers;
  const s = COPY[state.market] || COPY["Global (EN)"];
  const f = document.createDocumentFragment();

  f.appendChild(section("Headline",
    textInput("Text", l.headline.text, v => upd("headline", "text", v), true),
    suggestions(s.h, v => upd("headline", "text", v)),
    row(colorPick("Colour", l.headline.color, v => upd("headline", "color", v)), numInput("Size (px)", l.headline.size, v => upd("headline", "size", v))),
    selectField("Font", l.headline.font, FONTS, v => upd("headline", "font", v)),
    xySliders("headline", l.headline.x, l.headline.y),
    selectField("Animation", l.headline.anim, ANIMS, v => upd("headline", "anim", v), ANIM_LABELS),
  ));

  return f;
}

function panelBody() {
  const l = state.layers;
  const s = COPY[state.market] || COPY["Global (EN)"];
  const f = document.createDocumentFragment();

  f.appendChild(section("Body Copy",
    textInput("Text", l.body.text, v => upd("body", "text", v), true),
    suggestions(s.b, v => upd("body", "text", v)),
    row(colorPick("Colour", l.body.color, v => upd("body", "color", v)), numInput("Size (px)", l.body.size, v => upd("body", "size", v))),
    selectField("Font", l.body.font, FONTS, v => upd("body", "font", v)),
    xySliders("body", l.body.x, l.body.y),
    selectField("Animation", l.body.anim, ANIMS, v => upd("body", "anim", v), ANIM_LABELS),
  ));

  return f;
}

function panelCta() {
  const l = state.layers;
  const s = COPY[state.market] || COPY["Global (EN)"];
  const f = document.createDocumentFragment();

  f.appendChild(section("CTA Button",
    textInput("Label", l.cta.text, v => upd("cta", "text", v)),
    suggestions(s.c, v => upd("cta", "text", v)),
    row(colorPick("BG", l.cta.bgColor, v => upd("cta", "bgColor", v)), colorPick("Text", l.cta.textColor, v => upd("cta", "textColor", v))),
    row(numInput("W (px)", l.cta.w, v => upd("cta", "w", v)), numInput("H (px)", l.cta.h, v => upd("cta", "h", v))),
    row(numInput("Radius (px)", l.cta.radius, v => upd("cta", "radius", v)), numInput("Size (px)", l.cta.size, v => upd("cta", "size", v))),
    selectField("Font", l.cta.font, FONTS, v => upd("cta", "font", v)),
    xySliders("cta", l.cta.x, l.cta.y),
    selectField("Animation", l.cta.anim, ANIMS, v => upd("cta", "anim", v), ANIM_LABELS),
  ));

  return f;
}

export const PANELS = {
  bg:       panelBg,
  logo:     panelLogo,
  headline: panelHeadline,
  body:     panelBody,
  cta:      panelCta,
};

export function renderPanel(tab) {
  const content = document.getElementById("panel-content");
  content.innerHTML = "";
  content.appendChild(PANELS[tab]());
}
