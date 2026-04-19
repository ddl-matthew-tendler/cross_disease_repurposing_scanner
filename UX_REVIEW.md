# UX Review: Cross-Disease Repurposing Scanner

Reviewed against `/Users/matthewtendler/.claude/skills/ux-review/SKILL.md` and `/Users/matthewtendler/Library/CloudStorage/Dropbox/Projects/dominoapps/CLAUDE.md`.

## Summary
The app now aligns with the Domino design system on color, typography, button hierarchy, and copy case. Four views were walked: Scanner (with and without a dossier open), Portfolio dashboard, Dusty shelf (expanded rescue tracker), and Decision audit. The remaining issues are table-column truncation, a few non-actionable empty states, and some naming inconsistencies. No High-severity blockers found.

---

## Findings

### High severity
None.

### Medium severity

1. **"View" link column is cut off** (Scanner → Indication Ranker table). The rightmost "View" text renders as "Vie" across all rows because the column is too narrow and the text is clipped. This is the primary drill-through to the dossier.
   - Recommendation: Give the action column a fixed width of ~60px, or replace the text link with a Tertiary Button labeled "Open" that sits pinned to the cell's right edge.

2. **Truncated indication names lack visible tooltips** ("Systemic Lupus Erythemato…", "Heart Failure with Preserv…"). Per the Domino table checklist, truncated cells must surface the full value on hover.
   - Recommendation: Wrap the indication name cell in `Tooltip` with the full string; verify on hover.

3. **View naming inconsistency between sidebar and breadcrumb/header.** Sidebar item is "Scanner" but the page header says "Indication scanner". Small but breaks the "consistent design language" principle.
   - Recommendation: Align to one name. Preferred: "Indication scanner" everywhere (more specific), and match breadcrumbs.

4. **Score column duplicated by radar chart + axis bars in dossier.** The right pane shows axis bars (0–10) and a five-axis radar chart that render identical data.
   - Recommendation: Keep only the radar. Move the per-axis numerics into the radar tooltip, or remove the radar if bar precision matters more. This enforces "reduce effort to value".

5. **No loading/skeleton state while fetching `/api/health` or live Domino data.** Initial render flashes empty panes before the dummy fallback kicks in.
   - Recommendation: Render a table skeleton (AntD `Skeleton` / `Spin`) inside the pane-body for ~250ms then fall through.

6. **Decision badges remain uppercase via `text-transform`.** ADVANCE / KILL / WATCH read as shouty next to the sentence-case page content.
   - Recommendation: Switch to sentence case with colored pill ("Advance" on green 10% fill, etc.), matching AntD Tag conventions.

### Low severity

1. **Stat-card labels all caps** ("TOTAL DECISIONS", "INDICATIONS SCANNED"). Consistent with common Domino dashboards but slightly jars against the sentence-case elsewhere. Consider small-caps at 11px instead of uppercase text-transform.

2. **Mock indication names render lowercase** ("psoriasis-pust", "dermatomyositis"). Cosmetic mock data issue — production data would be properly cased.

3. **"Dusty shelf — de-prioritized assets" uses em dash** in the page subtitle. The global UX guidance says "no em dashes in generated UI copy".
   - Recommendation: Replace with a colon or two separate sentences.

4. **Evidence-graph legend missing.** The D3 node colors (target / pathway / disease / clinical evidence) have no key in the dossier pane.
   - Recommendation: Add a four-chip legend above the graph.

5. **Scoring-weights sliders do not sum to 100 visibly.** Users can move all five to 20 (default, sum 100) but any adjustment leaves the total unclear.
   - Recommendation: Show a live "Total: 100" readout with a warning color if ≠ 100, or auto-normalize.

6. **"Demo data" tag in the header is always visible when disconnected**, but also when a user intentionally flips the toggle to Demo mode while connected. Status reflects mode honestly — just worth confirming the copy reads correctly in the connected-but-dummy case.

7. **Decision modal radios are inline and color-coded** (green Advance / yellow Watch / red Kill). Good signaling, but the green/red diverge from the AntD Radio default and may look off. Verify AA contrast (4.5:1) for the radio label text against white bg.

---

## Checklist Results

### Core Experience — Pass
The Scanner's 3-pane layout makes the workflow clear: pick compound → tune weights → click indication → read dossier → record decision.

### Layout & Space — Mostly pass
- Sidebar is 220px dark nav (internal to the app, fine when standalone). When deployed to Domino, the platform nav will stack above and the internal sidebar should remain.
- Dossier pane is 390px; does not crush the center table on laptop (1440×900).
- Differential 1:2 spacing applied inside the dossier pane.

### Tables & Data — Mixed
- Numbers right-aligned (score, competitors, IP years). Pass.
- Column filters + sorters present on key columns. Pass.
- Truncation without tooltips on indication name cell. **Medium #2**.
- "View" link cut off. **Medium #1**.

### Interactive Elements — Mostly pass
- No Primary button on Scanner or Dashboard — this is correct; Primary appears only in the Decision modal ("Record decision").
- Decision modal has exactly one Primary; Cancel is Secondary. Pass.
- Icon-only buttons: none present after emoji removal. Pass.
- Touch targets ≥ 24px verified on sidebar and table rows.

### Empty & Error States — Pass
Empty panes answer what / why / what to do ("Select a compound from the left panel / 15 assets in portfolio").

### Forms — Pass
Decision modal labels above fields; radios for decision type; rationale Textarea with placeholder.

### Content & Information — Mostly pass
- Sentence case on labels. Pass.
- Domino brand capitalization (Workspace, Model API, Artifacts) — not applicable in this app.
- Em dash appears in subtitle. **Low #3**.

---

## What's Working Well
- Domino theme is applied end-to-end: `#543FDE` primary, Inter font, 4px border radius.
- Highcharts uses the Domino palette; the horizontal bar chart on Portfolio dashboard colors by therapeutic area without clashing.
- Dossier pane clearly flags "AI Draft — Scientist Review Required" — strong signal of provenance and confidence.
- D3 force-directed evidence graph is appropriate (Highcharts cannot do this natively per `domino-app` skill guidance).
- Dusty shelf expand-row pattern reveals external-signal cards with color-coded positive/negative borders — no emoji clutter.
- Weight sliders recompute composite score and rank in real time (useMemo), no reload needed.
- Decision audit trail preserves an evidence snapshot per decision, supporting governance traceability.
- The app works fully offline in dummy mode; live-mode gracefully falls back when `/api/health` reports disconnected.

---

## Notes on Screenshot Limitations
Per SKILL.md, static screenshots cannot verify: tooltip presence, hover/focus states, loading states, responsive behavior, keyboard navigation. Items flagged with "verify on hover" above should be confirmed live.

Screenshots were captured via the running preview server (serverId `94e17b07-...`, port 8889). To inspect interactively, open http://localhost:8889 and navigate Scanner → Portfolio dashboard → Dusty shelf → Decision audit.
