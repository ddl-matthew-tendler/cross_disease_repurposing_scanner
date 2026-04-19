# FDE Spec: Cross-Disease Repurposing Scanner (Non-GxP)
*Classification: **Non-GxP** — discovery research / translational portfolio strategy*
*Generated: April 19, 2026 | Target Persona: Translational Medicine Lead (with Portfolio Strategy partnership) | Phase: Discovery Research → Translational Medicine*

> **Scoping note:** This is a proposed non-GxP extension that does **not** map 1:1 to a numbered entry in `Domino_Non-GxP_Extensions_100.xlsx`. Closest adjacencies are #1 TargetScout (target discovery) and #10 TargetPrioritizer, but the Cross-Disease Repurposing Scanner is meaningfully different: it starts from **an existing compound or target in the sponsor's own portfolio** (or an out-licensed / shelved asset) and scans **across every plausible indication** for a repurposing opportunity — then ranks by biological plausibility, unmet need, competitive whitespace, commercial attractiveness, and clinical-translation feasibility. This is strictly **non-GxP / pre-IND**: no patient data, no submission artifacts, no validation burden. The output is a rank-ordered indication list with an evidence dossier per top candidate, fed into the sponsor's Indication Expansion / Portfolio Strategy committee.

---

## Competitive Landscape Summary

- **Every Cure (ARPA-H funded, MATRIX platform)**: Scores 66M+ drug-disease pairs across ~4,000 approved drugs × ~18,500 diseases using knowledge-graph embeddings + RWE. Open-mission / non-profit orientation, paired with the BioPhy platform. Gap for pharma: **unfocused on a sponsor's own portfolio and commercial filters**. Every Cure optimizes for human-impact; a pharma portfolio strategy team needs the opposite lens — how does *my* de-risked asset fare against *my* competitive whitespace and *my* 10-year exclusivity window?

- **Healx (HealNet)**: Leader in rare-disease repurposing; literature-mining + KG + phenotype matching; has moved candidates to Phase 2a. Gap: **single-asset, rare-disease-first, service-engagement model**. Healx sells outcomes (a shortlist), not an in-house capability. A pharma translational lead cannot run a "what if we redirected asset X" scenario overnight against internal data.

- **BenevolentAI (Benevolent Platform)**: Knowledge-graph + ML for target and mechanism discovery; famously surfaced baricitinib for COVID-19. Gap: **target-first, not compound-first**. Strong at "for disease Y, what's the best target?" — weaker at the inverse "for compound X already in my portfolio, what disease lights up?" Also a heavy services engagement; pharma users who license Benevolent Platform report it is a **researcher tool, not a portfolio-committee tool**.

- **Lantern Pharma (RADR®)**: 200B+ oncology data points, focus on *rescuing* failed compounds and finding responder sub-populations. Excellent at in-oncology repositioning with genomic biomarker stratification. Gap: **oncology-only**. A cross-TA scanner (e.g., moving an approved diabetes drug into a rare neuro indication) is out of scope.

- **Causaly**: Biomedical knowledge-graph search over literature; excels at "what do we know about X–Y?" Gap: **retrieval, not ranking**. A translational lead still has to decide, by hand, which of the 30 literature-plausible indications to fund a lab experiment on. No portfolio, commercial, or feasibility scoring.

- **Ontoforce DISQOVER**: Semantic data-exploration layer widely deployed at AstraZeneca, Amgen, etc. Gap: **a platform for knowledge graph exploration by data scientists**, not a hypothesis-to-shortlist engine for a translational lead. Fine substrate; not the finished tool.

- **Internal / build-your-own**: Most top-20 pharma have a rotating cast of PhDs running Jupyter notebooks against Open Targets, ChEMBL, DrugBank, OMIM, DisGeNET, GTEx, Reactome, and their own CompAssay database. These efforts produce good results for a single asset on a six-month timeline; they do **not** scale across the portfolio and the insights evaporate when the PhD rotates off.

- **Universal gaps across the landscape**:
  1. **No portfolio lens.** The scanner runs against *your* compound library, *your* clinical history (including shelved assets and failed Phase 2s), and *your* IP position — and produces a shortlist that a portfolio committee can act on.
  2. **No commercial × unmet-need × whitespace fusion.** Biological plausibility is table stakes; the winning repurposing candidates are the ones with real unmet need, competitive whitespace, and a realistic go-to-market (pediatric exclusivity, orphan designation, RPDD voucher math, formulary positioning).
  3. **No translational-feasibility scoring.** A plausible prediction is useless if the PK won't reach the target tissue at the approved dose, or if the safety margin in the original indication doesn't leave headroom for the new one. Most KG-driven tools ignore this.
  4. **No explainability for a portfolio committee.** Every shortlist candidate must come with a 2-page dossier that a VP of R&D will actually read: mechanism, evidence graph, unmet need, competitive landscape, IP considerations, feasibility, proposed next experiment.

**Key insight for Cross-Disease Repurposing Scanner:** The wedge is **sponsor-centric portfolio scanning with multi-dimensional ranking and committee-ready dossiers**. Fuse best-of-breed public knowledge graphs (Open Targets, ChEMBL, DrugBank, DisGeNET, Reactome, GTEx, MONDO, OMIM) with the sponsor's own compound/assay/clinical history, overlay commercial and IP filters, apply a translational-feasibility model (PK/PD, safety headroom, tissue exposure), and deliver a ranked indication shortlist with a one-click LLM-drafted committee dossier per candidate — all inside the sponsor's governed Domino environment where the proprietary data never leaves.

---

## Persona Context

**Translational Medicine Lead** (titles vary: "Head of Translational Medicine," "VP, Translational Research," "Senior Director, Translational Sciences & Experimental Medicine," "Executive Director, Indication Strategy"). 12–20 years of experience; typically MD, MD/PhD, or PhD with post-doc + industry preclinical/early-clinical time. Sits at the seam between Discovery and Clinical Development. Works with Portfolio Strategy, Chief Medical Office, Chief Scientific Office, and BD&L. Owns the "what indication(s) should this asset pursue, and in what order" question for a portfolio of molecules — both active-development and de-prioritized.

- **Daily reality:** Mornings start with literature alerts (Ovid, Causaly, bioRxiv) on the sponsor's top-3 molecules and their pathways. Midday: a 60-minute session with a computational biologist walking through Open Targets association scores for an indication the BD&L team just floated for an in-licensing play. Early afternoon: a standing Tuesday Indication Strategy Committee — a round-table with the Head of Discovery, a CMO designee, a Commercial lead, an IP attorney, and a biostatistician — reviewing one molecule's "indication map" at a time. Late afternoon: a mentoring session with a newer MD-PhD on how to frame a translational hypothesis for a PoC study. Fridays are for the "dusty shelf" review — revisiting de-prioritized assets against recent external data to ask whether anything new has emerged that warrants a second look. Three times a year, the translational lead presents a cross-portfolio indication expansion scenario to the R&D ExCom.

- **Top 3 frustrations:**
  1. **The "map of possibilities" is reconstructed by hand, one molecule at a time.** A typical indication-expansion deep-dive for a single compound takes 6–10 weeks of a computational-biologist FTE — pulling Open Targets, DrugBank, ChEMBL, OMIM, GTEx, and the sponsor's internal preclinical database into a one-off notebook, then hand-curating a shortlist in PowerPoint. When the CMO asks "what about molecule B?" on a Thursday afternoon, the honest answer is "give me a month." There is no systematic way to *scan the entire portfolio at once*, and the data pipeline gets rebuilt every time because no one ever invested in a shared substrate.
  2. **Biological plausibility ≠ a good indication.** The prior tools (Benevolent, Causaly, literature search) all surface *plausible* indications. The hard work is triaging: is the PK good enough? Is the safety margin from the approved indication preserved at the dose needed? Is there actual unmet need or are the current SoCs strong enough that a new entrant won't move the needle? Is there competitive whitespace, or are three other players already in Phase 2? Is there an IP runway, or does the composition-of-matter patent expire in three years? The plausibility filter lets 30 candidates through; the real shortlist is 3, and the 27 deletions are the expensive work.
  3. **Every deliverable ends as a committee slide.** The Indication Strategy Committee and the R&D ExCom don't read notebooks. They read 2-page dossiers per candidate with a clear recommendation, an evidence graph, a competitive landscape bar, a unmet-need chart, an IP box, and a proposed next-experiment budget. Producing each dossier takes a scientist 2–3 days of writing plus 2 rounds of review. Across the portfolio, this is *weeks of senior-scientist time that should be spent on hypothesis generation, not deck-building*.

- **Language they use:** "Indication expansion," "label extension," "pipeline-in-a-product," "asset rescue," "failed Phase 2 but not dead," "shelved asset," "out-licensing candidate," "orphan indication," "RPDD voucher," "pediatric exclusivity," "505(b)(2)," "composition-of-matter runway," "method-of-use patent," "PK/PD translation," "human-equivalent dose," "safety margin," "therapeutic index," "tissue exposure," "CNS penetration," "MOA hypothesis," "mechanistic rationale," "on-target / off-target," "biomarker-defined subpopulation," "unmet medical need," "standard of care," "competitive whitespace," "Phase-2 readout risk," "feasibility / tractability," "translational gap," "proof-of-concept study," "IIS" (investigator-initiated study), "KOL alignment," "indication ranking," "TPP" (target product profile).

- **Winning looks like:** A single tool inside Domino where the translational lead picks a compound from the sponsor's portfolio (or a target, or a class), and within minutes sees: (1) A ranked list of 50–200 candidate indications scored across biological plausibility, unmet need, competitive whitespace, translational feasibility, and commercial attractiveness — each axis configurable per strategy; (2) For each candidate, an explanation of *why* it ranked where it did, with a clickable evidence graph (pathway → target → disease → clinical evidence) traceable to primary sources; (3) A one-click LLM-drafted committee dossier (2-page) with the mechanistic rationale, unmet-need chart, competitive landscape summary, IP considerations, and a proposed next experiment; (4) A cross-portfolio view that asks *the inverse* — "across all our assets, which three indications have the most shots on goal and should we build an indication-led franchise?"; (5) A "dusty shelf" mode that systematically rescans de-prioritized assets against new external data, flagging anything where the landscape has meaningfully moved. The translational lead comes out of the Friday shelf review with 1–2 rescue hypotheses per quarter that have *actual* portfolio governance momentum — not dead-on-arrival slide-ware.

- **AI/automation fears:** "If the model hallucinates a target-disease link I'll waste $3M on a preclinical study." And: "I have a reputation with the ExCom. I can't walk in with a candidate that an AI gave me and I can't defend the reasoning." And: "Our last attempt at an internal KG-driven repurposing tool got oversold — it produced 500 predictions per compound and we had no way to triage, so the scientists stopped using it." Needs reassurance that every prediction has an evidence trace, that the ranking is tunable to *this company's* strategy (oncology-only, or rare-only, or cross-TA), that the LLM-drafted dossiers cite primary sources and are clearly marked as draft until scientist-reviewed, and that the shortlist is small enough to be defensible (top-10, not top-500).

---

## SECTION 1: Submitter Information

| Field | Value |
|-------|-------|
| Full name | Matthew Tendler |
| Work email | matthew.tendler@dominodatalab.com |
| Role | — fill in — |
| Submission date | [auto-populated by portal] |
| Notes | Cross-Disease Repurposing Scanner is a Discovery / Translational Medicine extension. Non-GxP: no patient-level data, no submission artifacts, no CSV validation burden — predictions feed a portfolio-committee decision, not a regulatory filing. Intended to live alongside TargetScout and TargetPrioritizer in a Discovery Research suite. |

---

## SECTION 2: Prospect Overview

| Field | Value |
|-------|-------|
| Company / prospect name | [fill in per customer engagement] |
| Region | [fill in per customer engagement] |
| Industry vertical | Pharma / biotech (applicable to top-20 pharma, specialty biotech with portfolios of 10+ assets, and rare-disease-focused biotechs) |
| Relationship stage | [fill in per customer engagement — Early discovery / Active evaluation / POC / trial / Late stage / negotiation] |
| Primary contact name | [fill in per engagement — typically Head of Translational Medicine or VP Portfolio Strategy] |
| Primary contact title / role | [fill in per engagement] |
| Estimated data science team size | [fill in — typically 15–60 translational/computational biologists at a mid-size sponsor; 80–200+ at top-20 pharma, with 3–8 dedicated to repurposing / indication analytics] |
| Additional context | Look for sponsors with (a) a portfolio of ≥15 clinical-stage or late-preclinical assets, (b) a dedicated Indication Strategy / Portfolio Committee cadence, (c) an existing Domino footprint in Discovery or Translational, and (d) a CSO/CMO mandate to "do more with what we already have" in a tight capital environment. Sponsors with a history of successful 505(b)(2) / label-expansion plays (e.g., any company with >3 label expansions in the past 5 years) will self-qualify. |

---

## SECTION 3: Business Problem

### High-level problem description
Pharma sponsors sit on hundreds of compounds — some in active development, many on the "dusty shelf" as shelved or de-prioritized assets — and every one of them carries a theoretical opportunity to be repurposed into a second indication. Today, evaluating that opportunity is a manual, artisanal exercise: a computational biologist builds a one-off knowledge graph from public sources, a translational lead curates a literature shortlist by hand, and the resulting analysis takes 6–10 weeks per compound and ends as a PowerPoint slide. The portfolio never gets systematically scanned, shelved assets rarely get revisited, and genuinely valuable repurposing opportunities are routinely missed — or discovered late, after a competitor has already moved.

### Business objectives
1. **Cut the time-to-indication-shortlist from 6–10 weeks to 48 hours** for any compound in the sponsor's portfolio.
2. **Systematically scan the entire portfolio** (including de-prioritized assets) on a quarterly cadence so the Indication Strategy Committee always has a fresh, cross-portfolio view of the best repurposing opportunities.
3. **Raise the signal-to-noise ratio of the shortlist** by fusing biological plausibility with commercial attractiveness, competitive whitespace, unmet-need quantification, IP runway, and translational feasibility — so a portfolio committee discusses 10 candidates, not 500.
4. **Produce committee-ready dossiers on-demand** so translational scientists stop spending 60% of their time on deck-building.
5. **Capture at least 2 actionable repurposing hypotheses per quarter** that progress into a proof-of-concept experiment or a formal indication-expansion Target Product Profile (TPP).

### Current state
At a typical top-20 pharma today: one repurposing question from the CMO triggers a 6–10 week project. A computational biologist pulls Open Targets, DrugBank, ChEMBL, DisGeNET, Reactome, OMIM, GTEx, and the sponsor's internal CompAssay and preclinical database into a bespoke Jupyter notebook. Literature evidence is pulled by hand from Ovid and Causaly. Commercial whitespace is assembled from GlobalData, Citeline Pipeline, and IQVIA ARK. Unmet-need evidence is pieced together from Epidemiology, KOL interviews, and Optum/SEER claims feeds. IP runway comes from an internal patent-search system. All of it lands in a 40-slide deck for one molecule. When the CMO asks about molecule B, the whole process restarts. The "dusty shelf" shelf never gets systematically revisited because there is no team with the bandwidth to run 50 of these analyses a year. Smaller biotechs can't afford even one — they outsource to Healx or a consultancy and wait 3 months for a shortlist they can't reproduce, extend, or re-tune.

### Pain points
- **"Give me a month"** is the honest answer to every rapid-fire indication question from the CMO or BD&L. The translational team hates this. The CMO hates this. The BD&L team moves on without them.
- **Every analysis is artisanal.** The last repurposing notebook sits on one scientist's laptop. When she rotates, the next analyst rebuilds half the pipeline from scratch. The company learns nothing that compounds.
- **Plausibility without prioritization.** The KG spits out 300 target-disease links per compound. Without a commercial × unmet-need × whitespace × feasibility overlay, the only triage is "which one does the translational lead find interesting this week" — not a defensible portfolio process.
- **The dusty shelf rots.** Shelved assets *should* be re-evaluated every 12–18 months as the external landscape shifts (new biomarkers, new regulatory pathways, competitor Phase 2 failures creating whitespace). In practice, they're revisited only when a BD&L inbound request names one specifically, which is essentially never.
- **Dossier production crowds out science.** A two-page committee dossier takes a senior scientist 2–3 days to draft. Across a portfolio, this is *weeks* of senior bandwidth per quarter spent on writing and layout, not on hypothesis generation.
- **No audit trail for a governance decision.** When the portfolio committee kills a candidate, the reasoning lives in meeting minutes. Six months later when the same candidate resurfaces from BD&L, no one remembers why it was killed. The tool should capture the decision *and* the evidence it was based on at the time.

### Success metrics
- **Time to indication shortlist:** from 6–10 weeks → <48 hours per compound (≥95% reduction).
- **Portfolio coverage:** % of clinical-stage + shelved assets with a refreshed indication scan in the last 90 days, target ≥80% (vs. <10% today).
- **Dossier production time:** 2–3 days/manual → <30 minutes of scientist review time on an LLM-drafted dossier (≥90% reduction).
- **Quality of shortlist:** ≥70% of committee-surfaced candidates judged by the Indication Strategy Committee as "worth an hour of discussion" (a proxy for signal-to-noise) vs. a historical baseline of ~20%.
- **Indication scans on shelved assets:** ≥2 full re-scans of the shelved portfolio per year, producing ≥2 rescue hypotheses per quarter that reach a committee decision.
- **Translational scientist time reallocation:** ≥30% of senior-scientist time recovered from deck-building redirected to hypothesis-generation and experimental design (measured via quarterly time-survey).
- **Governance auditability:** 100% of committee decisions traceable to the evidence snapshot the tool provided at time of decision.

### Key stakeholders
`Translational Medicine Lead` `Head of Discovery` `Chief Medical Officer` `Chief Scientific Officer` `VP Portfolio Strategy` `VP Indication Strategy` `BD&L Lead` `Commercial Insights Lead` `IP / Legal` `Computational Biologist` `Medicinal Chemistry Lead` `Head of Preclinical Pharmacology` `Biomarker Lead` `R&D ExCom`

### Urgency and timeline drivers
- **Capital-efficiency pressure in 2025–2026.** R&D budgets are flat-to-down at most top-20 pharma. Every CSO is being asked "what more can we get from what we already have?" — which is precisely the repurposing question.
- **Patent-cliff defensives.** Sponsors with major LOE events in 2027–2029 need label-extension and repurposing hypotheses *now* to matter financially. Each quarter of delay is a quarter of exclusivity forfeited.
- **Rare-disease / pediatric incentive windows.** RPDD vouchers, pediatric exclusivity, and EMA PUMA pathways each carry specific timing dynamics; a repurposing candidate identified 18 months late is a candidate that loses its voucher economics.
- **Competitive pressure from AI-first repurposing companies.** Every Cure, Healx, BenevolentAI, and Lantern are all publicly advancing repurposing candidates. Sponsors without an internal capability are structurally behind; every quarter the gap widens.
- **Scientist attrition risk.** Translational scientists who spend 60% of their time on deck-building leave. Retention depends on giving them real science to do.

---

## SECTION 4: Data Assets

### Data overview
The Cross-Disease Repurposing Scanner fuses **open-domain biomedical knowledge** (target-disease-drug-pathway-phenotype graphs from public sources), **sponsor-proprietary portfolio and preclinical data** (compound library, ADMET, assay results, internal clinical history, shelved assets), **commercial and competitive intelligence** (pipeline, trial, epidemiology, sales feeds), and **IP / regulatory context** (patent positions, orange-book entries, exclusivity timelines) into a single Domino-governed substrate. All data is **pre-clinical and non-patient-level** — no patient-identifiable records, no EHR feeds, no clinical trial operational data that would pull the system into GxP territory.

### Data sources

**Source 1: Open Targets Platform**
- **System type:** REST / GraphQL API
- **Data formats:** Semi-structured (JSON); Structured (tabular exports of association scores)
- **Access status:** Already accessible (public)
- **Notes:** The backbone of target-disease evidence. Provides association scores across genetic, somatic mutation, drug, text-mining, RNA-expression, animal-model, and pathway evidence classes. Needs periodic refresh (quarterly); full release snapshots can be loaded into a Domino dataset.

**Source 2: ChEMBL**
- **System type:** REST API + bulk downloads
- **Data formats:** Structured (tabular); Semi-structured (XML, JSON)
- **Access status:** Already accessible (public, EBI-hosted)
- **Notes:** Bioactivity, IC50/EC50, target binding, mechanism annotations for ~2.4M compounds and ~15K targets. Critical for compound-level signature matching.

**Source 3: DrugBank**
- **System type:** REST API / bulk downloads (commercial license)
- **Data formats:** Structured; Semi-structured (XML)
- **Access status:** Requires procurement / licensing (sponsor typically already has an enterprise DrugBank license)
- **Notes:** Approved-drug metadata, indication, mechanism, PK, ADME, interactions. Central spine for the "approved drug → new indication" use case.

**Source 4: DisGeNET (gene-disease associations)**
- **System type:** REST API + bulk downloads
- **Data formats:** Structured (tabular)
- **Access status:** Already accessible (public, academic license for commercial use)
- **Notes:** Complements Open Targets with a differently-weighted gene-disease view.

**Source 5: Reactome / KEGG**
- **System type:** REST API + bulk downloads
- **Data formats:** Structured; Semi-structured (BioPAX, SBML)
- **Access status:** Reactome already accessible; KEGG requires commercial license
- **Notes:** Pathway topology for mechanistic rationale generation.

**Source 6: MONDO / OMIM / Orphanet / EFO**
- **System type:** Ontologies (OWL / OBO files)
- **Data formats:** Structured (ontology)
- **Access status:** Already accessible (public)
- **Notes:** Disease normalization layer — maps across heterogeneous disease vocabularies from different source databases. Non-negotiable for cross-disease scanning.

**Source 7: GTEx / Human Protein Atlas**
- **System type:** Bulk downloads
- **Data formats:** Structured (tabular); Time-series (expression across tissues)
- **Access status:** Already accessible (public)
- **Notes:** Tissue expression data to support target-tissue-disease feasibility scoring (e.g., "does my compound's target express in the disease-relevant tissue?").

**Source 8: ClinicalTrials.gov + EudraCT + Citeline Pipeline / Trialtrove**
- **System type:** Public APIs (CT.gov / EudraCT) + SaaS (Citeline, licensed)
- **Data formats:** Structured; Semi-structured (JSON)
- **Access status:** CT.gov / EudraCT already accessible; Citeline requires procurement (most sponsors already have)
- **Notes:** Competitive-whitespace and "who else is moving into this indication" intelligence. Critical for the competitive-landscape axis of ranking.

**Source 9: PubMed / bioRxiv / medRxiv (full-text corpus)**
- **System type:** Document store
- **Data formats:** Unstructured text (PDFs, XMLs)
- **Access status:** Already accessible (PubMed abstracts, bioRxiv/medRxiv full text)
- **Notes:** Underpins literature-evidence generation and LLM-drafted mechanistic rationale, with citation tracing back to primary sources.

**Source 10: Sponsor-internal compound library / ADMET database**
- **System type:** On-prem relational database (often Oracle or custom Pipeline Pilot backing store)
- **Data formats:** Structured; Semi-structured (SDF files)
- **Access status:** Access pending per customer (sponsor-governed; BD&L / legal sign-off often required even for cross-functional use)
- **Notes:** The sponsor's own compound assets, including shelved ones. This is the difference between a generic repurposing tool and a sponsor-specific portfolio scanner.

**Source 11: Sponsor-internal preclinical database (in vitro / in vivo outcomes)**
- **System type:** On-prem relational database (often a LIMS + data warehouse)
- **Data formats:** Structured; Time-series; Images (for phenotypic screens)
- **Access status:** Access pending per customer
- **Notes:** Historical assay results inform translational feasibility (e.g., did we already test this compound in a related disease model?).

**Source 12: Sponsor-internal clinical history (for active and shelved assets)**
- **System type:** On-prem relational database / data lake
- **Data formats:** Structured (tabular — summary-level only, no patient data)
- **Access status:** Access pending per customer
- **Notes:** Summary-level PK/PD, AE profile, dose-exposure — *not* patient-level. The goal is to understand the safety-margin and PK envelope of the compound so the scanner can score feasibility for a candidate new indication. **Strictly aggregated / summary-level to maintain non-GxP boundary.**

**Source 13: IP / patent intelligence (sponsor's internal system + Derwent / PatSnap / Clarivate)**
- **System type:** SaaS + internal document store
- **Data formats:** Structured; Unstructured text (patent filings)
- **Access status:** Requires procurement / sponsor-internal
- **Notes:** Composition-of-matter runway, method-of-use freedom-to-operate, competitor patent positions per indication.

**Source 14: Commercial / epidemiology / unmet-need feeds (GlobalData, IQVIA ARK, Evaluate Pharma, CDC, Orphanet epidemiology)**
- **System type:** SaaS CRM / ERP-adjacent + public
- **Data formats:** Structured
- **Access status:** Requires procurement (most sponsors already have)
- **Notes:** Powers the commercial-attractiveness and unmet-need axes of ranking. Must be kept current — commercial landscape refreshes quarterly at minimum.

### Estimated total data volume
**10–100GB** per sponsor deployment at steady state. Breakdown: public KG extracts (~5–15GB), literature corpus embeddings (~10–30GB), sponsor compound / preclinical / clinical-summary data (~1–10GB), commercial feeds (~1–5GB), vector indices for LLM-powered retrieval (~5–20GB). Well within Domino's data-handling capacity.

### Data velocity / freshness
**Mixed.** Public KG snapshots refresh quarterly (Open Targets, DisGeNET, DrugBank). Pipeline / trial feeds refresh daily–weekly (Citeline, CT.gov). Literature corpus refreshes daily. Sponsor-internal data refreshes batch (daily or weekly). No sub-second or streaming requirements; the tool is a deliberative scanner, not a real-time monitor.

### Known data quality issues
- **Disease-name normalization** across MONDO / OMIM / Orphanet / EFO / ICD-10 / MeSH is a perennial pain. Two sources will call the same disease three different things. The scanner must normalize consistently or scores become meaningless.
- **Literature evidence is noisy.** Knowledge-graph edges derived from text mining have false-positive rates that need guardrails — an LLM-first approach with source-citation and human-in-the-loop review is the only defensible path.
- **Internal compound metadata is incomplete for shelved assets.** The "dusty shelf" compounds often have sparse ADMET and PK data; the scanner needs to flag uncertainty explicitly rather than score as if data were complete.
- **Commercial feed lag.** Pipeline databases lag competitor Phase-1 starts by 3–6 months. Scoring should recognize this staleness.
- **Ontology drift.** MONDO and EFO change versions; a scorecard built on one version doesn't directly compare to one built on the next. Version-pinning is important for reproducibility.

### Data access notes
Public data flows into Domino via scheduled batch refresh jobs running in the Domino environment (no external outbound from compute for data pulls beyond whitelisted data-source endpoints). Sponsor-proprietary data is accessed via a read-only service account into the sponsor's internal data warehouse, scoped to the repurposing project. **No patient-level data is ever ingested** — only summary-level internal clinical data — which is the single most important scoping decision that keeps the system out of GxP.

---

## SECTION 5: Governance & Compliance

### Applicable regulatory frameworks
- **SOC 2** (as part of the broader Domino tenant — for enterprise data-handling assurance)
- **GDPR** (for EU-based sponsors, even though the data is non-patient, sponsor-internal employee-linked metadata may touch GDPR)
- **Other — specify:**
  - **Non-GxP explicitly.** This extension lives *before* IND; it informs portfolio decisions and experimental design, not regulatory submissions. Therefore 21 CFR Part 11, ICH E6(R2), and GAMP 5 Cat-4 validation are **not in scope**. This is a deliberate scoping decision and a major differentiator vs. the GxP extensions.
  - **Sponsor IP governance policies** (internal; generally stricter than external regulation) — the compound library and internal preclinical data are the most commercially sensitive data the sponsor owns. The scanner must respect internal access controls for this substrate.
  - **License terms of upstream data sources** (Citeline, GlobalData, IQVIA ARK, DrugBank commercial license, Clarivate / PatSnap) — usage must conform to each vendor's seat-licensing and redistribution terms.

*(Not applicable: HIPAA — no patient data; FedRAMP — not a federal system; PCI-DSS — no payment data; FINRA/SEC — not a financial system; DORA — not an EU financial entity; EU AI Act — this is a decision-support tool in a low-risk research context, not a high-risk system per the Act's taxonomy, but should still be reviewed per the sponsor's internal AI-governance framework.)*

### Data residency requirements
Typically **in-region for the sponsor's primary R&D hub.** US-headquartered sponsors deploy in US regions; EU / UK sponsors in EU regions. Sponsor IP (compound structures, preclinical data) cannot cross borders without explicit legal sign-off. Domino deployment must respect this — a single global scanner is rarely permissible; multi-region or federated is the norm.

### Data access restrictions
- Sponsor-internal compound library / preclinical / clinical-summary data: **strict need-to-know**, typically restricted to the translational, discovery, and portfolio-strategy teams. BD&L access often requires additional sign-off.
- Commercial and competitive intelligence feeds: licensed-seat-based.
- Scanner outputs (ranked indication lists, dossiers): **highly sensitive** — a ranked shortlist for a specific compound is, in effect, the sponsor's forward portfolio strategy. Leakage would be commercially material.

### Input/output logging requirements
- **All query inputs** (compound ID, target, filter selections) logged per-user, per-session.
- **All outputs** (ranked lists, dossiers, evidence graphs) logged with a persistent artifact reference so a committee decision can be traced back to the exact snapshot the decision was made against.
- **Data-source versions pinned** per run (Open Targets v25.06, DrugBank v5.2.3, etc.) so runs are reproducible.
- Logs retained ≥5 years to cover the typical preclinical→Phase 1 cycle.

### Decision audit trail requirements
When a portfolio committee kills or advances a candidate, the tool must allow the decision to be annotated and pinned to the evidence snapshot used. Six months later, when the same candidate resurfaces from BD&L or a shelf-review, the prior decision + its underlying evidence is instantly recallable.

### Explainability requirements
**Non-negotiable.** Every shortlist candidate must come with:
- **An evidence graph** tracing the prediction back to primary sources (KG edges, literature citations, assay results) — clickable down to the source document or assay record.
- **A per-axis score breakdown** (biological plausibility, unmet need, whitespace, feasibility, commercial) — never a single black-box score.
- **An LLM-drafted rationale** marked clearly as draft, with every substantive claim tied to a primary-source citation (no hallucinated evidence).
- **Model card** documenting training data, cut-off date, known biases (e.g., oncology over-represented in public data), and known failure modes.

### Result consumer access restrictions
- **Translational scientists:** full access to query and explore, including raw KG and per-asset deep dives.
- **Portfolio committee members:** full access to read the committee-ready dossiers and per-candidate summaries; not expected to run raw queries.
- **BD&L team:** scoped access — can read shortlists for assets they are exploring in-license / out-license; cannot run arbitrary queries on the full internal portfolio without sponsor-lead approval.
- **External consultants:** no access without explicit data-use agreement.

### Additional governance notes
- **LLM usage boundary:** any LLM call must run against a sponsor-tenant-hosted or Domino-managed private model endpoint. No sponsor-proprietary compound data leaves the tenant boundary for LLM inference.
- **Content safety:** standard guardrails against fabricated citations, hallucinated clinical claims, and off-label implication language (dossiers must frame predictions as hypothesis-generating, not efficacy claims).
- **Model drift monitoring:** quarterly re-validation of the scoring pipeline against a held-out gold set (known successful repurposing cases: e.g., sildenafil→ED, thalidomide→multiple myeloma, minoxidil→hair loss, raloxifene→breast cancer prevention) to ensure the scanner continues to rank known winners near the top.
- **Responsible disclosure:** when the scanner surfaces a high-value candidate that may implicate competitive intelligence (e.g., a competitor's Phase-2 readout changes whitespace overnight), governance flow should route to IP counsel before any BD&L action.

---

## SECTION 6: Solution Requirements

### Deployment environment
**Domino Cloud (Domino-managed)** OR **AWS / Azure** depending on sponsor's primary R&D cloud footprint. Most top-20 pharma R&D organizations run on AWS; several run on Azure (notably those with deep Microsoft enterprise alignment). Hybrid (cloud + on-prem) is common where sponsor-proprietary compound data resides on-prem and must stay there — the scanner's orchestration layer lives in Domino, with federated data-access calls into the on-prem LIMS / compound library.

### Prototype timeline expectation
**4–8 weeks** for a single-sponsor POC: pull in public KG sources, wire in one sponsor compound library dataset, implement a first-pass ranking model across the 5 axes, generate LLM-drafted dossiers for 3–5 seed compounds, present to a mock Indication Strategy Committee. **8+ weeks** to reach production (multi-asset portfolio scan, quarterly refresh cadence, governance workflow, committee dashboard).

### Deployment notes
- Requires a Domino project with GPU access (for KG embedding models and batched LLM inference).
- Requires scheduled batch-refresh jobs for public KG snapshots (quarterly) and commercial feeds (weekly).
- Requires a read-only service-account into the sponsor's compound library and preclinical database, scoped to the repurposing project.
- Portal front-end: a lightweight Domino App (Streamlit / Dash / R Shiny) for translational users; PDF export for committee dossiers.

### Integration requirements

**Integration 1: Open Targets Platform**
- System / tool name: Open Targets
- Integration type: Read data from it
- Notes: GraphQL API for on-demand target-disease association lookups; bulk-download parquet for batch ranking runs.

**Integration 2: ChEMBL**
- System / tool name: ChEMBL
- Integration type: Read data from it
- Notes: REST API + bulk SQL dumps for compound bioactivity and target annotations.

**Integration 3: DrugBank**
- System / tool name: DrugBank (commercial)
- Integration type: Read data from it
- Notes: Bulk XML; seat-licensed per sponsor.

**Integration 4: Sponsor compound library / LIMS**
- System / tool name: Sponsor-internal compound DB (varies — Pipeline Pilot, Benchling, custom Oracle schema)
- Integration type: Read data from it
- Notes: Read-only service account; schema varies wildly by sponsor — first 2 weeks of each engagement is schema mapping.

**Integration 5: Sponsor preclinical database (in vitro / in vivo)**
- System / tool name: Sponsor-internal preclinical LIMS / data warehouse
- Integration type: Read data from it
- Notes: Read-only; summary-level only.

**Integration 6: Sponsor-internal clinical summary data (for active and shelved assets)**
- System / tool name: Sponsor-internal clinical data warehouse (summary-level)
- Integration type: Read data from it
- Notes: Read-only; **aggregated / summary-level only** — critical for preserving non-GxP boundary. No patient-identifiable data.

**Integration 7: Citeline Pipeline / Trialtrove / ClinicalTrials.gov / EudraCT**
- System / tool name: Citeline (commercial) + public registries
- Integration type: Read data from it
- Notes: Weekly refresh. License-seat governance.

**Integration 8: PubMed / bioRxiv / medRxiv**
- System / tool name: NCBI E-utilities + bioRxiv/medRxiv API
- Integration type: Read data from it
- Notes: Rate-limited; embeddings precomputed in-tenant to avoid sending proprietary queries to third-party services.

**Integration 9: IP / patent intelligence (Derwent / Clarivate / PatSnap)**
- System / tool name: Derwent Innovation or equivalent
- Integration type: Read data from it
- Notes: Sponsor-licensed.

**Integration 10: Commercial / epidemiology feeds (GlobalData, Evaluate Pharma, IQVIA ARK, Orphanet)**
- System / tool name: Various (sponsor-licensed)
- Integration type: Read data from it
- Notes: Quarterly refresh for most; used for unmet-need and commercial-attractiveness scoring.

**Integration 11: Portfolio-committee workspace (SharePoint, Confluence, or Veeva Vault PromoMats-adjacent)**
- System / tool name: Sponsor-internal committee workspace
- Integration type: Write data to it (publish dossier artifacts with version control)
- Notes: One-click "publish to committee workspace" as a PDF + linked evidence snapshot.

**Integration 12: SSO (Okta / Azure AD / Ping)**
- System / tool name: Sponsor IdP
- Integration type: Authentication / SSO
- Notes: Required for enterprise deployment. Role-based access tied to the user's function (translational, BD&L, portfolio strategy, committee read-only).

### UX and delivery requirements
- **Primary surface: Domino App** — a streamlined interface for translational scientists. Left pane: compound/target/class picker. Center pane: ranked indication list with per-axis scores and filters. Right pane: per-candidate dossier preview (mechanism, evidence graph, competitive landscape, unmet-need chart, IP snippet, proposed experiment).
- **Second surface: Portfolio-committee dashboard** — a read-only view summarizing the top-10 candidates across the portfolio, refreshed quarterly, with one-click drill-down into each candidate.
- **Third surface: "Dusty shelf" mode** — a dedicated view over shelved assets, with a "what's changed externally since this was shelved" narrative per asset.
- **Dossier export:** one-click PDF (2-page committee format) or .docx for edit-in-place. Every citation is a live hyperlink to the source document or KG edge.
- **Evidence graph visualization:** interactive network diagram (target ↔ pathway ↔ disease ↔ clinical evidence) — the "why" layer behind every prediction.
- **Tunable scoring weights:** the translational lead can dial up/down the axes (biological plausibility / unmet need / whitespace / feasibility / commercial) for different strategic contexts (rare-disease push vs. oncology focus vs. general portfolio scan). Weight changes re-rank in real time.
- **Explainable "why this ranked above that":** pairwise comparison mode for any two candidates, showing the axis-by-axis difference.

### Target user personas
`Translational Medicine Lead` `Head of Indication Strategy` `Portfolio Strategy Director` `Head of Discovery` `Computational Biologist` `Chief Medical Officer (read-only committee view)` `Chief Scientific Officer (read-only)` `BD&L Lead (scoped)` `Medicinal Chemistry Lead` `Biomarker Lead`

### Priority level
**High** — a capital-efficiency play that makes the sponsor's existing portfolio work harder, with a clear metric (indication-shortlist cycle time) that translates directly to ExCom visibility. Not *Critical* for a single compound decision, but genuinely Critical as a quarterly portfolio rhythm.

### Technology constraints
- LLM inference must stay within the sponsor's Domino tenant — no sponsor compound structures or sponsor preclinical data to external LLM APIs.
- GPU infrastructure must support batched inference across 100+ compounds × 10,000+ candidate indications in <1 hour per quarterly run.
- Must respect sponsor data-residency (US-only, EU-only, or federated) per tenant.
- Ontology version pinning per run for reproducibility.
- Model card and data card required per release for internal AI-governance review.

### Predictive ML models toggle
**Yes**
- Knowledge-graph embedding models (e.g., TransE, RotatE, or graph neural network variants) for link-prediction scoring of target-disease associations.
- Compound similarity / signature-matching models (ECFP fingerprints, 2D/3D descriptors, learned embeddings from ChEMBL).
- Translational-feasibility model: PK exposure at target tissue given approved dose (scaled from existing clinical data); safety-margin estimate (therapeutic index) carried from prior approved indications.
- Commercial-attractiveness regression / classifier trained on historical label-expansion outcomes.
- Ensemble ranker combining the axes, with tunable weights.

### Generative AI / LLMs toggle
**Yes**
- **GenAI use case types:**
  - [x] Text generation / drafting (committee-ready dossiers)
  - [x] Summarization (literature evidence digests, competitive-landscape summaries)
  - [x] Document Q&A (clickable evidence graph → "why is this edge here?" answered from primary source)
  - [x] Entity / info extraction (pulling mechanism-of-action, dose, outcome from trial registries and publications)
  - [x] RAG (retrieval-augmented generation over a Domino-tenant-local literature index; never external)
  - [x] Agents / autonomous tasks (multi-step "rescan the shelved portfolio against last quarter's external changes" workflow)
  - [ ] Code generation (not needed)
  - [ ] Conversational chat (not the primary surface — scientists don't want a chatbot; they want a ranked list + a dossier)
- **Preferred LLM providers:**
  - [x] Anthropic Claude (preferred for long-document reasoning and citation-faithful summarization; strong biomedical performance)
  - [x] Azure OpenAI / AWS Bedrock (for sponsors with existing enterprise agreements — Bedrock-hosted Claude or GPT within the sponsor's AWS VPC is the most common enterprise configuration)
  - [x] Open source / self-hosted (for sponsors with strict on-prem constraints — Llama-3, Mixtral, or a biomedically-tuned variant like BioMedLM hosted in the Domino tenant)
  - [ ] OpenAI direct (not acceptable for sponsor IP; only Azure-hosted OpenAI is in scope)
- **Must use self-hosted / open-source models only:** **No** (but tenant-private hosting, whether via Bedrock/Azure OpenAI in VPC or self-hosted OSS, is mandatory — sponsor compound data never leaves the tenant boundary)
- **Approach:**
  - [x] RAG (primary — all dossier generation is retrieval-grounded with citation tracing)
  - [x] Prompt engineering only (for committee-dossier templates; scientific-writing style guides, IMRaD or dossier-specific)
  - [x] Agentic workflows / tool use (for multi-step scanning — dispatch KG query → score → summarize → assemble dossier)
  - [ ] Fine-tuning / PEFT (not required at launch; may be considered post-deployment if dossier-style drift is observed)
  - [ ] Mixture (not initial scope)
- **Context window / document size needs:** Large — a single candidate dossier may need 20–50 literature abstracts, 5–10 trial records, 3–5 patent filings, and the sponsor's internal compound profile compiled in one context. 100K–200K token context window is comfortable; chunked RAG handles larger corpora.
- **Streaming responses required:** **No** (dossiers are assembled in the background; the UX is a "generate" → "review" pattern, not a real-time chat. A progress indicator is sufficient.)
- **Content safety / guardrails required:** **Yes** — fabricated-citation detection, hallucination guardrails with mandatory primary-source attribution, off-label language linting (dossier text must frame as hypothesis-generating, not efficacy claim), and a human-in-the-loop "scientist review" step before any dossier is published to the committee workspace.
- **Specific model version requirements:** Model version and knowledge cutoff must be logged per dossier for reproducibility. Dossiers older than 90 days should be flagged for a refresh.

### Real-time / online inference toggle
**No.** The scanner is a deliberative, batch-refresh tool. Quarterly portfolio scans are scheduled. On-demand per-compound analyses run in minutes-to-hours, not sub-second. No real-time inference latency requirements.

### Additional solution notes
- **Gold-set validation is critical.** Before rollout, validate the ranker against a curated set of known successful repurposing cases (sildenafil, thalidomide, minoxidil, raloxifene, aspirin, metformin, naltrexone/bupropion, etc.) — known winners should rank in the top decile. Publish this validation transparently; translational leads will not trust a tool whose gold-set performance is undisclosed.
- **"Dusty shelf" rescue mode is a first-class feature.** It is the most defensible ROI story for capital-constrained sponsors — every shelved asset is a sunk cost, and any rescue is pure upside.
- **Pair with TargetScout and TargetPrioritizer.** The Discovery Research suite inside Domino becomes a coherent stack: TargetScout (target discovery) → TargetPrioritizer (target ranking) → Cross-Disease Repurposing Scanner (compound-to-indication scan). Sponsors that buy one should have a clear path to the others.
- **Governance integration is the acceptance test.** A repurposing shortlist that does not reach an Indication Strategy Committee decision is a failed deployment. The tool's measure of success is quarterly committee momentum — new candidates entered, old candidates retired, rescue hypotheses advanced — not prediction accuracy in isolation.
- **Portfolio-strategy partnership.** The tool's economic value case should be built with Portfolio Strategy, not just Translational, in the loop. Portfolio Strategy owns the ExCom narrative and the "what more from what we have" framing.
- **Non-GxP boundary preservation.** Any pressure from customers to add patient-level data, IND-supporting artifacts, or validated-output requirements should be met with a firm "that's a different extension" — conflating this with GxP work destroys its speed-to-value and its strategic positioning.

---
