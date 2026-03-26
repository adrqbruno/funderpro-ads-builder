import { FORMATS, COPY, MARKETS } from "./constants.js";
import { state, DEFAULT_LAYERS }  from "./state.js";
import { renderPreview }          from "./preview.js";
import { renderPanel, PANELS }    from "./controls.js";
import { exportPNG, exportHTML5, exportAll } from "./export.js";

// ── Per-format memory ─────────────────────────────────────────────────────────
const savedLayers  = {};
window.__savedLayers = savedLayers;   // exposed so controls.js can write to it
export const formatImages = {};

function saveCurrent() {
  savedLayers[state.fmt.label] = JSON.parse(JSON.stringify(state.layers));
}

function loadFormat(fmt) {
  saveCurrent();
  state.fmt = fmt;
  if (savedLayers[fmt.label]) {
    state.layers = JSON.parse(JSON.stringify(savedLayers[fmt.label]));
  } else {
    state.layers = DEFAULT_LAYERS(fmt);
    if (formatImages[fmt.label]) state.layers.image.src = formatImages[fmt.label];
  }
}

// ── Format sidebar ────────────────────────────────────────────────────────────
function buildFormatSidebar() {
  const sidebar = document.getElementById("sidebar-left");
  const header  = document.getElementById("app-header");
  sidebar.innerHTML = "";
  sidebar.appendChild(header);

  ["IAB", "Native"].forEach(cat => {
    const lbl = document.createElement("div");
    lbl.className = "format-group-label";
    lbl.textContent = cat === "IAB" ? "IAB Formats" : "Native";
    sidebar.appendChild(lbl);

    FORMATS.filter(f => f.cat === cat).forEach(fmt => {
      const item = document.createElement("div");
      item.className = "format-item" + (fmt.label === state.fmt.label ? " active" : "");
      item.dataset.label = fmt.label;

      const saved = !!savedLayers[fmt.label];
      item.innerHTML = `
        <span class="fi-text">
          <strong>${fmt.label}</strong>
          <span>${fmt.w}×${fmt.h}</span>
        </span>
        <span class="fi-dot" style="display:${saved ? "block" : "none"}"></span>
      `;
      item.onclick = () => {
        loadFormat(fmt);
        document.querySelectorAll(".format-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");
        refresh();
        updateDots();
      };
      sidebar.appendChild(item);
    });

    const spacer = document.createElement("div");
    spacer.className = "format-spacer";
    sidebar.appendChild(spacer);
  });
}

function updateDots() {
  document.querySelectorAll(".format-item").forEach(item => {
    const dot = item.querySelector(".fi-dot");
    if (dot) dot.style.display = savedLayers[item.dataset.label] ? "block" : "none";
  });
}

// ── Tab bar ───────────────────────────────────────────────────────────────────
function buildTabs() {
  const bar = document.getElementById("tabs-bar");
  bar.innerHTML = "";
  Object.keys(PANELS).forEach(key => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (key === state.activeTab ? " active" : "");
    btn.textContent = key;
    btn.onclick = () => {
      state.activeTab = key;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderPanel(key);
    };
    bar.appendChild(btn);
  });
}

// ── Market selector ───────────────────────────────────────────────────────────
function initMarketSelector() {
  const sel = document.getElementById("market-select");
  MARKETS.forEach(m => {
    const opt = document.createElement("option");
    opt.value = opt.textContent = m;
    if (m === state.market) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.onchange = e => {
    state.market = e.target.value;
    const s = COPY[state.market];
    state.layers.headline.text = s.h[0];
    state.layers.body.text     = s.b[0];
    state.layers.cta.text      = s.c[0];
    refresh();
  };
}

// ── Mode bar ──────────────────────────────────────────────────────────────────
function initModeBar() {
  const btns   = document.querySelectorAll(".mode-btn");
  const replay = document.getElementById("replay-btn");
  btns.forEach(btn => {
    btn.onclick = () => {
      state.mode = btn.dataset.mode;
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      replay.style.display = state.mode === "animated" ? "inline-block" : "none";
      triggerAnim();
    };
  });
  replay.onclick = triggerAnim;
}

function triggerAnim() {
  if (state.mode !== "animated") return;
  renderPreview(false);
  setTimeout(() => renderPreview(true), 50);
}

// ── Bulk Upload ───────────────────────────────────────────────────────────────
let bulkFiles = [];

function openBulkModal() {
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = "image/*"; inp.multiple = true;
  inp.onchange = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    bulkFiles = await Promise.all(files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = ev => res({ name: f.name, src: ev.target.result });
      r.readAsDataURL(f);
    })));
    renderBulkRows();
    document.getElementById("bulk-modal-overlay").classList.add("open");
  };
  inp.click();
}

function renderBulkRows() {
  const container = document.getElementById("bulk-rows");
  container.innerHTML = "";
  bulkFiles.forEach((file, i) => {
    const row   = document.createElement("div");
    row.className = "bulk-row";
    const thumb = document.createElement("img");
    thumb.className = "bulk-thumb"; thumb.src = file.src;
    const name  = document.createElement("div");
    name.className = "bulk-filename"; name.textContent = file.name;
    const sel   = document.createElement("select");
    sel.className = "bulk-select"; sel.dataset.fileIndex = i;
    const blank = document.createElement("option");
    blank.value = ""; blank.textContent = "— select format —";
    sel.appendChild(blank);
    FORMATS.forEach(fmt => {
      const opt = document.createElement("option");
      opt.value = fmt.label;
      opt.textContent = `${fmt.label} (${fmt.w}×${fmt.h})`;
      sel.appendChild(opt);
    });
    // Auto-match by filename
    const lower = file.name.toLowerCase().replace(/px/g, "").replace(/_/g, "-");
    FORMATS.forEach(fmt => {
      const k1 = `${fmt.w}x${fmt.h}`, k2 = `${fmt.w}×${fmt.h}`, k3 = fmt.label.toLowerCase().replace(/ /g, "-");
      if (lower.includes(k1) || lower.includes(k2) || lower.includes(k3)) sel.value = fmt.label;
    });
    row.appendChild(thumb); row.appendChild(name); row.appendChild(sel);
    container.appendChild(row);
  });
}

function initBulkModal() {
  document.getElementById("bulk-cancel").onclick = () => {
    document.getElementById("bulk-modal-overlay").classList.remove("open");
    bulkFiles = [];
  };
  document.getElementById("bulk-apply").onclick = () => {
    document.querySelectorAll(".bulk-select").forEach(sel => {
      const fmtLabel = sel.value; if (!fmtLabel) return;
      const idx = Number(sel.dataset.fileIndex);
      formatImages[fmtLabel] = bulkFiles[idx].src;
      if (savedLayers[fmtLabel]) savedLayers[fmtLabel].image.src = bulkFiles[idx].src;
    });
    if (formatImages[state.fmt.label]) state.layers.image.src = formatImages[state.fmt.label];
    document.getElementById("bulk-modal-overlay").classList.remove("open");
    bulkFiles = [];
    refresh();
  };
  document.getElementById("bulk-modal-overlay").onclick = e => {
    if (e.target.id === "bulk-modal-overlay") {
      document.getElementById("bulk-modal-overlay").classList.remove("open");
      bulkFiles = [];
    }
  };
}

// ── Preview All modal ─────────────────────────────────────────────────────────
function openPreviewAll() {
  const grid  = document.getElementById("preview-all-grid");
  grid.innerHTML = "";

  const shown = Object.keys(savedLayers).length
    ? FORMATS.filter(f => savedLayers[f.label])
    : FORMATS.slice(0, 6);

  ["IAB", "Native"].forEach(cat => {
    const fmts = shown.filter(f => f.cat === cat);
    if (!fmts.length) return;
    const grpLbl = document.createElement("div");
    grpLbl.className = "preview-group-label";
    grpLbl.textContent = cat;
    grid.appendChild(grpLbl);

    const row = document.createElement("div");
    row.className = "preview-grid-row";

    fmts.forEach(fmt => {
      const sc     = Math.min(120 / fmt.w, 110 / fmt.h, 0.55);
      const W      = Math.round(fmt.w * sc);
      const H      = Math.round(fmt.h * sc);
      const layers = savedLayers[fmt.label]
        ? JSON.parse(JSON.stringify(savedLayers[fmt.label]))
        : DEFAULT_LAYERS(fmt);

      const wrap = document.createElement("div");
      wrap.className = "preview-item";
      wrap.title = `Click to edit ${fmt.label}`;
      wrap.onclick = () => {
        loadFormat(fmt);
        document.querySelectorAll(".format-item").forEach(el => el.classList.remove("active"));
        document.querySelector(`.format-item[data-label="${fmt.label}"]`)?.classList.add("active");
        document.getElementById("preview-modal-overlay").classList.remove("open");
        refresh();
      };

      // Mini banner
      const clip = document.createElement("div");
      clip.style.cssText = `width:${W}px;height:${H}px;overflow:hidden;border-radius:3px;box-shadow:0 2px 8px rgba(0,0,0,.25);background:${layers.bg.color};position:relative;flex-shrink:0;`;

      if (layers.image.src) {
        const img = document.createElement("img");
        img.src = layers.image.src;
        img.style.cssText = `position:absolute;left:${layers.image.x}%;top:${layers.image.y}%;width:${layers.image.w}%;height:${layers.image.h}%;object-fit:cover;opacity:${layers.image.opacity/100};`;
        clip.appendChild(img);
      }
      if (!fmt.h <= 100) {
        const hl = document.createElement("div");
        hl.textContent = layers.headline.text;
        hl.style.cssText = `position:absolute;left:${layers.headline.x}%;top:${layers.headline.y}%;transform:translate(-50%,-50%);text-align:center;width:85%;color:${layers.headline.color};font-size:${layers.headline.size*sc}px;font-weight:700;line-height:1.2;word-wrap:break-word;`;
        clip.appendChild(hl);
        const cta = document.createElement("div");
        cta.textContent = layers.cta.text;
        cta.style.cssText = `position:absolute;left:${layers.cta.x}%;top:${layers.cta.y}%;transform:translate(-50%,-50%);background:${layers.cta.bgColor};color:${layers.cta.textColor};font-size:${layers.cta.size*sc}px;width:${layers.cta.w*sc}px;height:${layers.cta.h*sc}px;border-radius:${layers.cta.radius}px;display:flex;align-items:center;justify-content:center;font-weight:700;white-space:nowrap;`;
        clip.appendChild(cta);
      }

      const info = document.createElement("div");
      info.className = "preview-item-info";
      info.innerHTML = `<strong>${fmt.label}</strong><span>${fmt.w}×${fmt.h}</span>`;

      wrap.appendChild(clip);
      wrap.appendChild(info);
      row.appendChild(wrap);
    });

    grid.appendChild(row);
  });

  document.getElementById("preview-modal-overlay").classList.add("open");
}

// ── Export + Reset ────────────────────────────────────────────────────────────
function initExportBar() {
  document.getElementById("btn-png").onclick        = exportPNG;
  document.getElementById("btn-html5").onclick      = exportHTML5;
  document.getElementById("btn-export-all").onclick = () => exportAll(savedLayers, formatImages);
  document.getElementById("btn-bulk-upload").onclick= openBulkModal;
  document.getElementById("btn-preview-all").onclick= openPreviewAll;
  document.getElementById("btn-reset").onclick      = () => {
    state.layers = DEFAULT_LAYERS(state.fmt);
    delete savedLayers[state.fmt.label];
    refresh();
    updateDots();
  };
  document.getElementById("preview-modal-overlay").onclick = e => {
    if (e.target.id === "preview-modal-overlay")
      document.getElementById("preview-modal-overlay").classList.remove("open");
  };
  document.getElementById("btn-preview-close").onclick = () =>
    document.getElementById("preview-modal-overlay").classList.remove("open");
}

// ── Refresh ───────────────────────────────────────────────────────────────────
function refresh() {
  renderPreview(state.mode === "animated");
  renderPanel(state.activeTab);
}

// ── Init ──────────────────────────────────────────────────────────────────────
buildFormatSidebar();
buildTabs();
initModeBar();
initMarketSelector();
initExportBar();
initBulkModal();
refresh();
