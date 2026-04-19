# Decisions Log — Cross-Disease Repurposing Scanner

### D1: Patch-in-place over full rebuild
Kept the existing 1,380-line app.js and 974-line style.css, mock data (15 compounds, ~40 indications each, 3 full dossiers), D3 evidence graph, Highcharts radar. Applied targeted fixes against the Domino guidelines rather than scaffolding a new app.

**Why:** Rewriting would throw away a working D3 force-directed evidence graph, a weight-slider re-ranking pipeline, and hand-authored dossier content. The spec deviations (theme tokens, top nav, icon noise) were surface-level.

### D2: No custom dark top nav
Root element uses `app-layout-no-topnav`. The sidebar is retained as internal navigation (4 tabs), but the Domino platform supplies the actual top chrome when hosted.

**Why:** Domino-hosted apps already get a platform nav bar. A second dark 44px nav creates a double-nav stack and wastes vertical space.

### D3: Demo Data toggle in the white app header, only when disconnected
Toggle was previously in a sidebar footer; moved to the right side of the white app-header, hidden when `connected: true`, shown with a Tooltip explaining switch behavior. A "Live" / "Demo data" status Tag always renders.

**Why:** The toggle has no purpose when a live Domino backend is reachable. Placing it in the header puts status and control together and frees sidebar space.

### D4: Honest `/api/health`
Backend now returns `connected: domino_ready()` — true only when `DOMINO_API_HOST` is set AND an access token is obtainable (via `API_KEY_OVERRIDE` or `localhost:8899/access-token`). Previously always returned `connected: True`.

**Why:** The frontend dummy-fallback logic depends on `connected`. Lying about the state caused the UI to hide the toggle even when the app had no real backend.

### D5: All emojis stripped
Removed glyphs from decision badges (`▲✕○`), stat icons (`🔬`, `🐛`), modal close (`✕`), signal cards (`📉📋🔬📄✨`), and impact arrows (`↑↓`). Signal cards now use a left-border color (green/red) to indicate positive/negative impact.

**Why:** User directive. Also aligned with Domino copy guidelines — no decorative glyphs, no exclamation marks.

### D6: Sentence case for all user-facing strings
`AXIS_FULL`, sidebar tabs, empty-state copy, decision labels, column headers all lowered from Title Case. Only stat-card labels and decision-badge text keep uppercase (applied via CSS `text-transform`), as tokenized badge styling.

**Why:** Domino UX writing standard.

### D7: Highcharts global palette set once
`Highcharts.setOptions({ colors: [...Domino palette], chart: { style: { fontFamily: Inter... } } })` runs immediately after the React destructure, so every chart inherits brand colors without per-chart config.

**Why:** Prevents ad-hoc color drift; matches `CLAUDE.md` guidance.

### D8: `Fragment` + `useRef` in the React destructure
Destructure includes `h = React.createElement`, `Fragment`, `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`.

**Why:** Missing `useRef` in a CDN app causes a blank-page crash with no error boundary. `Fragment` lets components return sibling nodes (used by the radar chart block).

### D9: `requests` added to `requirements.txt`
`app.py` uses `requests` for the Domino token + project proxy. It was not previously declared.

### D10: Port 8889
`app.sh`, `.claude/launch.json` aligned to port 8889 (port 8888 is held by the local msl_field_insights preview server). When deployed to Domino the port is managed by the platform.

### D11: Signal card impact styling via left border, not text
Removed the `Positive signal` / `Negative signal` badge text is still present for screen readers; the visual cue is now a 3px left border.

**Why:** Reduces visual noise inside the already-dense Dusty Shelf expand rows.
