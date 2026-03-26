 # README.md

# FunderPro Ads Builder

Web-based programmatic display ad builder for FunderPro campaigns.  
Built by [AdRoq](https://adroq.com).

## Structure

```
funderpro-ads-builder/
├── index.html          ← Landing page (/)
├── vercel.json         ← Routing config
├── builder/
│   └── index.html      ← Builder app (/builder)
└── src/
    ├── constants.js    ← Formats, CTA presets, copy, brand tokens
    ├── state.js        ← DEFAULT_LAYERS, global state object
    ├── preview.js      ← DOM renderer (renderPreview)
    ├── controls.js     ← Layer panels (bg, logo, headline, body, cta)
    ├── export.js       ← PNG, HTML5, Export All → ZIP
    └── main.js         ← Init, format sidebar, tabs, bulk upload, modals
```

## Deploy

1. Create repo on GitHub: `funderpro-ads-builder`
2. Push all files
3. Import repo on [Vercel](https://vercel.com) → Deploy
4. Optional: add custom domain `ads.funderpro.com`

No build step required — vanilla ES modules, loaded directly by the browser.

## Formats

20 formats: 17 IAB + 3 Native.  
CTA presets pre-configured for every format (W, H, radius, font size, X/Y position).

## Markets

- Global (EN)
- Colombia (ES)
- Peru (ES)  
- Brazil (PT-BR)
- Mexico (ES)

## File naming (bulk upload)

Name designer files exactly as: `300x250.png`, `728x90.png`, `160x600.png`, etc.  
Lowercase x, no spaces, no `px` suffix. Auto-matched on bulk upload.

## Export

| Format | Notes |
|--------|-------|
| PNG    | Uses html-to-image (loaded via ESM CDN) |
| HTML5  | Self-contained .html with CSS animations + ClickTag |
| ZIP    | All formats bundled via JSZip (loaded via ESM CDN) |

Replace `clickTag` in exported HTML5 files with your platform macro before trafficking.
