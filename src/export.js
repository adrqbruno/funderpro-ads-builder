import { getScale, ANIM_MAP } from "./constants.js";
import { state } from "./state.js";

function slug(fmt) { return `${fmt.label.replace(/ /g, "_")}_${fmt.w}x${fmt.h}`; }
function dl(href, filename) { const a = document.createElement("a"); a.href = href; a.download = filename; a.click(); }

// ── PNG Export ────────────────────────────────────────────────────────────────
export async function exportPNG() {
  const btn = document.getElementById("btn-png");
  btn.textContent = "Exporting…"; btn.disabled = true;
  try {
    const { fmt } = state;
    const sc      = getScale(fmt);
    const banner  = document.getElementById("banner");
    if (!banner) throw new Error("Banner element not found");
    const { toPng } = await import("https://esm.run/html-to-image@1.11.11");
    const dataUrl = await toPng(banner, {
      width:  fmt.w,
      height: fmt.h,
      style: {
        transform:       `scale(${1 / sc})`,
        transformOrigin: "top left",
        width:           fmt.w + "px",
        height:          fmt.h + "px",
      },
    });
    dl(dataUrl, slug(fmt) + ".png");
  } catch (e) { alert("PNG export failed: " + e.message); }
  btn.textContent = "↓ Export PNG"; btn.disabled = false;
}

// ── HTML5 Export ──────────────────────────────────────────────────────────────
export function exportHTML5() {
  const { fmt, layers } = state;

  const ac = (anim, delay) => {
    if (anim === "none" || !ANIM_MAP[anim]) return "";
    return `animation:${ANIM_MAP[anim]} 0.7s ease-out ${delay}s both;`;
  };

  const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="ad.size" content="width=${fmt.w},height=${fmt.h}">
<title>${fmt.label} ${fmt.w}x${fmt.h}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${fmt.w}px;height:${fmt.h}px;overflow:hidden;font-family:sans-serif}
#banner{width:${fmt.w}px;height:${fmt.h}px;position:relative;overflow:hidden;background:${layers.bg.color}}
#hl{position:absolute;left:${layers.headline.x}%;top:${layers.headline.y}%;transform:translate(-50%,-50%);text-align:center;width:85%;color:${layers.headline.color};font-size:${layers.headline.size}px;font-family:${layers.headline.font};font-weight:${layers.headline.bold?700:400};line-height:1.2;word-wrap:break-word;${ac(layers.headline.anim,0.1)}}
#bd{position:absolute;left:${layers.body.x}%;top:${layers.body.y}%;transform:translate(-50%,-50%);text-align:center;width:80%;color:${layers.body.color};font-size:${layers.body.size}px;font-family:${layers.body.font};font-weight:${layers.body.bold?700:400};line-height:1.4;word-wrap:break-word;${ac(layers.body.anim,0.35)}}
#cta{position:absolute;left:${layers.cta.x}%;top:${layers.cta.y}%;transform:translate(-50%,-50%);background:${layers.cta.bgColor};color:${layers.cta.textColor};font-size:${layers.cta.size}px;font-family:${layers.cta.font};width:${layers.cta.w}px;height:${layers.cta.h}px;border-radius:${layers.cta.radius}px;display:flex;align-items:center;justify-content:center;font-weight:700;cursor:pointer;white-space:nowrap;${ac(layers.cta.anim,0.6)}}
@keyframes adsFadeIn{from{opacity:0}to{opacity:1}}
@keyframes adsSlideLeft{from{opacity:0;transform:translateX(calc(-50% + 30px))}to{opacity:1;transform:translateX(-50%)}}
@keyframes adsSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes adsZoomIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
@keyframes adsBounce{0%{opacity:0;transform:scale(.6)}60%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}
</style></head><body>
<div id="banner">
${layers.image.src  ? `<img src="${layers.image.src}"  style="position:absolute;left:${layers.image.x}%;top:${layers.image.y}%;width:${layers.image.w}%;height:${layers.image.h}%;object-fit:cover;opacity:${layers.image.opacity/100}">` : ""}
${layers.logo.src   ? `<img src="${layers.logo.src}"   style="position:absolute;left:${layers.logo.x}px;top:${layers.logo.y}px;width:${layers.logo.w}px;height:${layers.logo.h}px;object-fit:contain;opacity:${layers.logo.opacity/100}">` : ""}
${layers.visual.src ? `<img src="${layers.visual.src}" style="position:absolute;left:${layers.visual.x}%;top:${layers.visual.y}%;transform:translate(-50%,-50%);width:${layers.visual.w}px;height:${layers.visual.h}px;object-fit:contain;opacity:${layers.visual.opacity/100}">` : ""}
<div id="hl">${layers.headline.text}</div>
<div id="bd">${layers.body.text}</div>
<div id="cta">${layers.cta.text}</div>
</div>
<script>
// ClickTag — replace with platform macro before trafficking
var clickTag = "https://funderpro.com";
document.getElementById("cta").onclick = function(){ window.open(clickTag); };
<\/script>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  dl(URL.createObjectURL(blob), slug(fmt) + "_HTML5.html");
}

// ── Export All → ZIP ──────────────────────────────────────────────────────────
export async function exportAll(savedLayers, formatImages) {
  const btn = document.getElementById("btn-export-all");
  btn.textContent = "Zipping…"; btn.disabled = true;
  try {
    const { default: JSZip } = await import("https://esm.run/jszip@3.10.1");
    const { toPng }          = await import("https://esm.run/html-to-image@1.11.11");
    const zip = new JSZip();

    const { FORMATS, CTA_PRESETS } = await import("./constants.js");
    const { DEFAULT_LAYERS }       = await import("./state.js");

    for (const fmt of FORMATS) {
      const layers = savedLayers[fmt.label]
        ? JSON.parse(JSON.stringify(savedLayers[fmt.label]))
        : (() => { const l = DEFAULT_LAYERS(fmt); if (formatImages[fmt.label]) l.image.src = formatImages[fmt.label]; return l; })();

      // HTML5
      const ac = (anim, delay) => {
        const map = { "fade-in":"adsFadeIn","slide-left":"adsSlideLeft","slide-up":"adsSlideUp","zoom-in":"adsZoomIn","bounce":"adsBounce" };
        if (anim === "none" || !map[anim]) return "";
        return `animation:${map[anim]} 0.7s ease-out ${delay}s both;`;
      };
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="ad.size" content="width=${fmt.w},height=${fmt.h}"><style>*{margin:0;padding:0;box-sizing:border-box}body{width:${fmt.w}px;height:${fmt.h}px;overflow:hidden}#banner{width:${fmt.w}px;height:${fmt.h}px;position:relative;overflow:hidden;background:${layers.bg.color}}#hl{position:absolute;left:${layers.headline.x}%;top:${layers.headline.y}%;transform:translate(-50%,-50%);text-align:center;width:85%;color:${layers.headline.color};font-size:${layers.headline.size}px;font-family:${layers.headline.font};font-weight:700;line-height:1.2;word-wrap:break-word;${ac(layers.headline.anim,0.1)}}#bd{position:absolute;left:${layers.body.x}%;top:${layers.body.y}%;transform:translate(-50%,-50%);text-align:center;width:80%;color:${layers.body.color};font-size:${layers.body.size}px;font-family:${layers.body.font};line-height:1.4;word-wrap:break-word;${ac(layers.body.anim,0.35)}}#cta{position:absolute;left:${layers.cta.x}%;top:${layers.cta.y}%;transform:translate(-50%,-50%);background:${layers.cta.bgColor};color:${layers.cta.textColor};font-size:${layers.cta.size}px;font-family:${layers.cta.font};width:${layers.cta.w}px;height:${layers.cta.h}px;border-radius:${layers.cta.radius}px;display:flex;align-items:center;justify-content:center;font-weight:700;white-space:nowrap;${ac(layers.cta.anim,0.6)}}@keyframes adsFadeIn{from{opacity:0}to{opacity:1}}@keyframes adsSlideLeft{from{opacity:0;transform:translateX(calc(-50% + 30px))}to{opacity:1;transform:translateX(-50%)}}@keyframes adsSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes adsZoomIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes adsBounce{0%{opacity:0;transform:scale(.6)}60%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}</style></head><body><div id="banner">${layers.image.src?`<img src="${layers.image.src}" style="position:absolute;left:${layers.image.x}%;top:${layers.image.y}%;width:${layers.image.w}%;height:${layers.image.h}%;object-fit:cover;opacity:${layers.image.opacity/100}">`:""}${layers.logo.src?`<img src="${layers.logo.src}" style="position:absolute;left:${layers.logo.x}px;top:${layers.logo.y}px;width:${layers.logo.w}px;height:${layers.logo.h}px;object-fit:contain;opacity:${layers.logo.opacity/100}">`:""}${layers.visual.src?`<img src="${layers.visual.src}" style="position:absolute;left:${layers.visual.x}%;top:${layers.visual.y}%;transform:translate(-50%,-50%);width:${layers.visual.w}px;height:${layers.visual.h}px;object-fit:contain;opacity:${layers.visual.opacity/100}">`:""}<div id="hl">${layers.headline.text}</div><div id="bd">${layers.body.text}</div><div id="cta">${layers.cta.text}</div></div><script>var clickTag="https://funderpro.com";document.getElementById("cta").onclick=function(){window.open(clickTag);};<\/script></body></html>`;
      zip.file(`${fmt.w}x${fmt.h}_HTML5.html`, html);
    }

    const content = await zip.generateAsync({ type: "blob" });
    dl(URL.createObjectURL(content), "FunderPro_AllFormats.zip");
  } catch (e) { alert("Export All failed: " + e.message); }
  btn.textContent = "↓ Export All → ZIP"; btn.disabled = false;
}
