/* ── Deterministic "random" for reproducible scores ─────── */
function _hash(s) {
  var h = 2166136261;
  for (var i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}
function _score(seed, lo, hi) {
  return Math.round((((_hash(seed) % 1000) / 1000) * (hi - lo) + lo) * 10) / 10;
}

/* ── Portfolio ───────────────────────────────────────────── */
var MOCK_PORTFOLIO = [
  { id: 'cmp-0047', code: 'CMP-0047', name: 'Navitinib',   mechanism: 'JAK1/2 Inhibitor',         targets: ['JAK1','JAK2'],          primaryIndication: 'Rheumatoid Arthritis',          status: 'active',      phase: 'Phase 2',    modality: 'Small molecule', moa: 'Selective inhibition of JAK1/JAK2, blocking STAT3/STAT6 cytokine signalling' },
  { id: 'cmp-0112', code: 'CMP-0112', name: 'Belcitanib',  mechanism: 'Anti-IL-17A Antibody',      targets: ['IL17A'],                primaryIndication: 'Plaque Psoriasis',              status: 'active',      phase: 'Phase 3',    modality: 'Antibody',       moa: 'Humanized mAb selectively neutralizing IL-17A, blocking neutrophil and keratinocyte activation' },
  { id: 'cmp-0203', code: 'CMP-0203', name: 'Fosarginib',  mechanism: 'KRAS G12C Inhibitor',       targets: ['KRAS'],                 primaryIndication: 'NSCLC (KRAS G12C+)',            status: 'active',      phase: 'Phase 2',    modality: 'Small molecule', moa: 'Covalent allosteric inhibitor trapping KRAS G12C in GDP-bound inactive state' },
  { id: 'cmp-0318', code: 'CMP-0318', name: 'Luxanilide',  mechanism: 'PPARγ Partial Agonist',     targets: ['PPARG'],                primaryIndication: 'NASH (F2–F3)',                  status: 'active',      phase: 'Phase 1',    modality: 'Small molecule', moa: 'Selective partial PPARγ agonist with reduced adipogenic liability; resolves hepatic steatohepatitis' },
  { id: 'cmp-0445', code: 'CMP-0445', name: 'Temibinib',   mechanism: 'Non-covalent BTK Inhibitor',targets: ['BTK'],                  primaryIndication: 'CLL (2nd-line)',                status: 'active',      phase: 'Phase 2',    modality: 'Small molecule', moa: 'Reversible BTK inhibitor with improved cardiac selectivity over covalent predecessors' },
  { id: 'cmp-0521', code: 'CMP-0521', name: 'Darotinib',   mechanism: 'Pan-FGFR Inhibitor',        targets: ['FGFR1','FGFR2','FGFR3'],primaryIndication: 'None (IND-enabling)',           status: 'preclinical', phase: 'IND-enabling',modality: 'Small molecule', moa: 'Sub-nM pan-FGFR1-3 kinase inhibitor with >50-fold selectivity over FGFR4' },
  { id: 'cmp-0607', code: 'CMP-0607', name: 'Hesvacept',   mechanism: 'CTLA-4 Agonist Fc Fusion',  targets: ['CD80','CD86'],          primaryIndication: 'None (lead optimization)',      status: 'preclinical', phase: 'Lead opt.',  modality: 'Biologic',       moa: 'CTLA-4 extracellular domain fused to engineered Fc, blocking CD28 co-stimulation to induce tolerance' },
  { id: 'cmp-0712', code: 'CMP-0712', name: 'Ralinomab',   mechanism: 'Anti-TSLP Antibody',        targets: ['TSLP'],                 primaryIndication: 'None (IND-enabling)',           status: 'preclinical', phase: 'IND-enabling',modality: 'Antibody',       moa: 'Humanized antibody neutralizing TSLP, blocking epithelial-to-immune alarm signal upstream of Th2' },
  { id: 'cmp-0834', code: 'CMP-0834', name: 'Pruvitinib',  mechanism: 'PI3Kδ Inhibitor',           targets: ['PIK3CD'],               primaryIndication: 'None (lead optimization)',      status: 'preclinical', phase: 'Lead opt.',  modality: 'Small molecule', moa: 'Selective PI3Kδ inhibitor (>100x over PI3Kα/β/γ); impairs B-cell and mast cell activation' },
  { id: 'cmp-0961', code: 'CMP-0961', name: 'Zolafenib',   mechanism: 'TGF-β Ligand Trap',         targets: ['TGFB1','TGFB2'],        primaryIndication: 'None (IND-enabling)',           status: 'preclinical', phase: 'IND-enabling',modality: 'Biologic',       moa: 'Bispecific TGF-β trap with engineered TGFβRII domain fused to albumin-binding peptide for extended half-life' },
  { id: 'cmp-1045', code: 'CMP-1045', name: 'Carsenib',    mechanism: 'IDH1/2 Dual Inhibitor',     targets: ['IDH1','IDH2'],          primaryIndication: 'AML (IDH-mutant)',              status: 'shelved',     phase: 'Phase 1 (d/c)', shelvedDate: '2021-08-15', shelvedReason: 'QTc prolongation signal at therapeutic dose; programme paused pending cardiac safety mitigation', modality: 'Small molecule', moa: 'Dual IDH1/2 mutant inhibitor blocking 2-HG oncometabolite production' },
  { id: 'cmp-1178', code: 'CMP-1178', name: 'Novatumab',   mechanism: 'Anti-CD73 Antibody',        targets: ['NT5E'],                 primaryIndication: 'Solid Tumors (IO combo)',       status: 'shelved',     phase: 'Phase 1b (d/c)',shelvedDate: '2022-04-03', shelvedReason: 'Insufficient monotherapy activity in unselected population; partner CD39 programme discontinued', modality: 'Antibody', moa: 'Anti-CD73 antibody blocking adenosine generation in TME, enhancing T-cell anti-tumour activity' },
  { id: 'cmp-1234', code: 'CMP-1234', name: 'Pelitanib',   mechanism: 'MEK1/2 Inhibitor',          targets: ['MAP2K1','MAP2K2'],      primaryIndication: 'BRAF-mutant Melanoma',          status: 'shelved',     phase: 'Phase 2 (d/c)', shelvedDate: '2020-11-22', shelvedReason: 'Phase 2 primary endpoint missed vs. dabrafenib/trametinib; inferior cardiac toxicity profile', modality: 'Small molecule', moa: 'Allosteric MEK1/2 inhibitor blocking MAPK hyperactivation downstream of RAS/RAF' },
  { id: 'cmp-1356', code: 'CMP-1356', name: 'Solectinib',  mechanism: 'CSF1R Inhibitor',           targets: ['CSF1R'],                primaryIndication: 'PDAC (TAM depletion)',          status: 'shelved',     phase: 'Phase 2 (d/c)', shelvedDate: '2023-02-14', shelvedReason: 'No OS benefit in unselected PDAC despite TAM depletion; biomarker-defined subpopulation too small', modality: 'Small molecule', moa: 'CSF1R kinase inhibitor depleting tumor-associated macrophages to remodel the immunosuppressive TME' },
  { id: 'cmp-1489', code: 'CMP-1489', name: 'Ravitaxel',   mechanism: 'HDAC1/2 Inhibitor',         targets: ['HDAC1','HDAC2'],        primaryIndication: 'Cutaneous T-cell Lymphoma',     status: 'shelved',     phase: 'Phase 2 (d/c)', shelvedDate: '2021-05-07', shelvedReason: 'Orphan population too small for commercial viability; GI toxicity required dose reductions limiting PK exposure', modality: 'Small molecule', moa: 'Class I-selective HDAC inhibitor inducing apoptosis and differentiation in lymphoma via histone hyperacetylation' },
];

/* ── Indication Templates (pool of 70) ──────────────────── */
var _IND = [
  // Autoimmune / Inflammatory
  { id:'atopic-dermatitis',      name:'Atopic Dermatitis',                ta:'autoimmune',   mondoId:'MONDO:0011292' },
  { id:'alopecia-areata',        name:'Alopecia Areata',                  ta:'autoimmune',   mondoId:'MONDO:0008438' },
  { id:'vitiligo',               name:'Vitiligo',                         ta:'autoimmune',   mondoId:'MONDO:0008661' },
  { id:'hidradenitis-supp',      name:'Hidradenitis Suppurativa',         ta:'autoimmune',   mondoId:'MONDO:0008477' },
  { id:'ank-spond',              name:'Ankylosing Spondylitis',           ta:'autoimmune',   mondoId:'MONDO:0005128' },
  { id:'psa',                    name:'Psoriatic Arthritis',              ta:'autoimmune',   mondoId:'MONDO:0011849' },
  { id:'jia',                    name:'Juvenile Idiopathic Arthritis',    ta:'autoimmune',   mondoId:'MONDO:0011939' },
  { id:'sle',                    name:'Systemic Lupus Erythematosus',     ta:'autoimmune',   mondoId:'MONDO:0007609' },
  { id:'uc',                     name:'Ulcerative Colitis',               ta:'autoimmune',   mondoId:'MONDO:0005101' },
  { id:'crohns',                 name:'Crohn\'s Disease',                 ta:'autoimmune',   mondoId:'MONDO:0005011' },
  { id:'ms',                     name:'Multiple Sclerosis',               ta:'autoimmune',   mondoId:'MONDO:0005301' },
  { id:'t1d',                    name:'Type 1 Diabetes',                  ta:'autoimmune',   mondoId:'MONDO:0005147' },
  { id:'mg',                     name:'Myasthenia Gravis',                ta:'autoimmune',   mondoId:'MONDO:0007389' },
  { id:'ssc',                    name:'Systemic Sclerosis (Scleroderma)', ta:'autoimmune',   mondoId:'MONDO:0005160' },
  { id:'gvhd',                   name:'Graft-vs-Host Disease',            ta:'autoimmune',   mondoId:'MONDO:0018882' },
  { id:'uveitis',                name:'Non-Infectious Uveitis',           ta:'autoimmune',   mondoId:'MONDO:0001672' },
  // Oncology
  { id:'pdac',                   name:'Pancreatic Ductal Adenocarcinoma', ta:'oncology',     mondoId:'MONDO:0005105' },
  { id:'crc',                    name:'Colorectal Cancer (KRAS-mutant)',  ta:'oncology',     mondoId:'MONDO:0005007' },
  { id:'gbm',                    name:'Glioblastoma',                     ta:'oncology',     mondoId:'MONDO:0018177' },
  { id:'aml',                    name:'Acute Myeloid Leukemia',           ta:'hematologic',  mondoId:'MONDO:0018874' },
  { id:'nhl',                    name:'Non-Hodgkin Lymphoma',             ta:'hematologic',  mondoId:'MONDO:0018908' },
  { id:'mm',                     name:'Multiple Myeloma',                 ta:'hematologic',  mondoId:'MONDO:0009693' },
  { id:'hcc',                    name:'Hepatocellular Carcinoma',         ta:'oncology',     mondoId:'MONDO:0007256' },
  { id:'tnbc',                   name:'Triple-Negative Breast Cancer',    ta:'oncology',     mondoId:'MONDO:0005361' },
  { id:'rcc',                    name:'Renal Cell Carcinoma',             ta:'oncology',     mondoId:'MONDO:0005033' },
  { id:'bladder',                name:'Urothelial Bladder Cancer',        ta:'oncology',     mondoId:'MONDO:0006476' },
  { id:'gastric',                name:'Gastric / GEJ Adenocarcinoma',     ta:'oncology',     mondoId:'MONDO:0001056' },
  { id:'head-neck',              name:'Head & Neck Squamous Cell Carcinoma',ta:'oncology',   mondoId:'MONDO:0005765' },
  { id:'endometrial',            name:'Endometrial Cancer',               ta:'oncology',     mondoId:'MONDO:0000553' },
  { id:'cholangiocarcinoma',     name:'Cholangiocarcinoma (FGFR2-fusion)',ta:'oncology',     mondoId:'MONDO:0015665' },
  { id:'myelofibrosis',          name:'Myelofibrosis',                    ta:'hematologic',  mondoId:'MONDO:0009880' },
  { id:'polycythemia-vera',      name:'Polycythemia Vera',                ta:'hematologic',  mondoId:'MONDO:0009891' },
  // Fibrotic / Metabolic
  { id:'ipf',                    name:'Idiopathic Pulmonary Fibrosis',    ta:'fibrotic',     mondoId:'MONDO:0008345' },
  { id:'nash',                   name:'NASH / Metabolic-Associated Steatohepatitis',ta:'metabolic',mondoId:'MONDO:0006550' },
  { id:'t2d',                    name:'Type 2 Diabetes',                  ta:'metabolic',    mondoId:'MONDO:0005148' },
  { id:'ckd',                    name:'Chronic Kidney Disease',           ta:'fibrotic',     mondoId:'MONDO:0005300' },
  { id:'hfpef',                  name:'Heart Failure with Preserved EF',  ta:'fibrotic',     mondoId:'MONDO:0007193' },
  { id:'ssc-ild',                name:'SSc-Associated ILD',               ta:'fibrotic',     mondoId:'MONDO:0005160' },
  { id:'pah',                    name:'Pulmonary Arterial Hypertension',  ta:'fibrotic',     mondoId:'MONDO:0015924' },
  { id:'copd',                   name:'COPD / Emphysema',                 ta:'fibrotic',     mondoId:'MONDO:0005002' },
  { id:'obesity',                name:'Obesity (BMI ≥30, non-T2D)',       ta:'metabolic',    mondoId:'MONDO:0011122' },
  { id:'nafld',                  name:'NAFLD (early-stage)',               ta:'metabolic',    mondoId:'MONDO:0006550' },
  // Neurological / Rare
  { id:'als',                    name:'Amyotrophic Lateral Sclerosis',    ta:'neurological', mondoId:'MONDO:0004976' },
  { id:'alzheimer',              name:'Alzheimer\'s Disease',             ta:'neurological', mondoId:'MONDO:0004975' },
  { id:'parkinson',              name:'Parkinson\'s Disease',             ta:'neurological', mondoId:'MONDO:0005180' },
  { id:'rett',                   name:'Rett Syndrome',                    ta:'rare',         mondoId:'MONDO:0010726' },
  { id:'sma',                    name:'Spinal Muscular Atrophy',          ta:'neurological', mondoId:'MONDO:0001516' },
  { id:'chagas',                 name:'Chagas Disease',                   ta:'rare',         mondoId:'MONDO:0001444' },
  { id:'duchenne',               name:'Duchenne Muscular Dystrophy',      ta:'rare',         mondoId:'MONDO:0010679' },
  { id:'nf2',                    name:'Neurofibromatosis Type 2',         ta:'rare',         mondoId:'MONDO:0009717' },
  { id:'amyloidosis',            name:'Transthyretin Amyloidosis',        ta:'rare',         mondoId:'MONDO:0021027' },
  { id:'myelodysplastic',        name:'Myelodysplastic Syndrome (IDH-mutant)',ta:'hematologic',mondoId:'MONDO:0018881' },
  { id:'angioimmunoblastic',     name:'Angioimmunoblastic T-cell Lymphoma',ta:'hematologic', mondoId:'MONDO:0018904' },
  { id:'biliary-cirrh',          name:'Primary Biliary Cholangitis',      ta:'fibrotic',     mondoId:'MONDO:0010280' },
];

/* ── Per-compound indication assignment with scored profiles ─ */
// Each entry: [indicationId, bp, un, cw, tf, ca, evidenceSummary, keyMechanism, proposedExperiment]
var _CMP_INDS = {
  'cmp-0047': [ // navitinib JAK1/2
    ['atopic-dermatitis',    8.5,7.2,4.5,8.2,8.5,'JAK1 mediates IL-4Rα/IL-13Rα1 signalling central to Th2-driven skin inflammation; abrocitinib and upadacitinib validate JAK1 as an AD target.','JAK1→STAT6 pathway downstream of IL-4/IL-13','Dupilumab-refractory AD patient cohort; biomarker: serum TARC suppression at 4 weeks'],
    ['alopecia-areata',      9.0,8.1,5.5,8.0,6.0,'JAK1/2 inhibition reverses T-cell-mediated destruction of hair follicle immune privilege; baricitinib FDA-approved for severe AA in 2022.','JAK1/2-STAT activation in CD8+ NKG2D+ T cells attacking hair follicle','16-week scalp hair regrowth (SALT score); biomarker: scalp IFN-γ suppression'],
    ['vitiligo',             8.0,7.5,6.2,7.8,5.5,'IFN-γ→JAK1/2→STAT1 axis drives CXCL9/10 production, recruiting autoreactive CD8+ T cells to melanocytes; ruxolitinib topical approved.','JAK1/2-STAT1-CXCL9/10 axis in melanocyte destruction','Nonsegmental vitiligo; repigmentation response (F-VASI) at week 24; compare systemic vs topical PK'],
    ['ank-spond',            7.5,6.0,3.2,7.5,6.5,'JAK signalling downstream of IL-17/IL-23 and TNF pathways drives entheseal inflammation in AS; filgotinib approved in EU for AS.','JAK-STAT pathway in IL-17A and IFN-γ signalling at entheseal sites','bDMARD-naïve axial SpA; ASAS40 at 16 weeks; select patients with high JAK pathway activation by tissue bx'],
    ['uc',                   7.2,7.0,3.0,7.2,7.0,'JAK1 mediates signalling of IL-6, IL-12, IL-23 and IFN-γ in colonic mucosa; tofacitinib, upadacitinib, and filgotinib all approved in UC.','JAK1→STAT3 in mucosal effector T cells and ILC3s','Bio-refractory UC (TNF + vedolizumab failure); clinical remission at week 8 (Mayo Clinic Score)'],
    ['jia',                  7.8,6.8,5.8,7.8,4.5,'Poly-articular JIA is driven by JAK-dependent cytokines (IL-6, IL-17); baricitinib studied in JIA; smaller addressable market limits commercial score.','IL-6→JAK1/2→STAT3 in synovial pannus formation','Polyarticular JIA (≥2 active joints); ACR Pedi 30 at week 12; PK modelling for pediatric dosing'],
    ['sle',                  6.8,7.5,5.0,6.5,6.5,'IFN-α/β signalling through JAK1/TYK2 drives plasmacytoid DC activation and lupus nephritis flares; anifrolumab (JAK-upstream) validates the pathway.','JAK1/TYK2-STAT1 in type I interferon signature','Moderate-severe SLE (SLEDAI ≥6); primary: BICLA response at week 52; secondary: renal response'],
    ['ms',                   6.5,6.5,4.5,6.2,6.0,'JAK2-STAT1 mediates IFN-γ-driven demyelination; JAK inhibitors show remyelination signals in EAE models; ozanimod partially overlaps the pathway.','JAK2-STAT1-T-bet axis in Th1-mediated demyelination','Relapsing MS; annualised relapse rate at 24 months; gadolinium-enhancing lesion count by MRI'],
    ['psoriasis-pust',       7.0,8.5,5.0,8.0,5.0,'Generalised pustular psoriasis is driven by IL-36→JAK pathway; spesolimab (anti-IL-36R) and deucravacitinib approved; JAK inhibitor data emerging.','IL-36→JAK-STAT in neutrophilic skin inflammation','GPP flare prevention; time to flare in 52-week maintenance; serum IL-36γ as PD biomarker'],
    ['crohns',               6.5,6.8,3.5,6.8,6.5,'Similar to UC; upadacitinib approved in Crohn\'s; slightly lower biological plausibility than UC due to transmural inflammation complexity.','JAK1-STAT3 in transmural intestinal macrophage and T-cell activation','Moderate-severe CD; CDAI<150 at week 12 induction; co-primary: endoscopic response'],
    ['t1d',                  5.5,7.0,6.0,5.5,5.0,'JAK1/2 mediates IFN-γ signalling driving β-cell MHC-I upregulation; baricitinib shows C-peptide preservation signal in Phase 2 T1D trial.','JAK1/2-STAT1 in IFN-γ-driven β-cell autoimmune destruction','New-onset T1D (within 3 months of diagnosis); C-peptide AUC preservation at 48 weeks'],
    ['dermatomyositis',      7.2,8.0,6.5,7.0,4.0,'JAK1/TYK2 mediates IFN-α/β-driven muscle and skin disease in dermatomyositis; ruxolitinib and tofacitinib show open-label signals.','JAK1/TYK2-IFN signature in muscle-infiltrating plasmacytoid DCs','DM with ILD; physician global assessment + PFT stability at 24 weeks; MRI inflammatory load'],
    ['gvhd',                 8.0,7.5,4.5,7.5,4.5,'Ruxolitinib (JAK1/2) is approved for steroid-refractory acute and chronic GvHD; navitinib selectivity differences vs ruxolitinib may open differentiation.','JAK1/2-STAT in alloreactive T cell expansion and cytokine storm','Steroid-refractory acute GvHD (grade II-IV); overall response at day 28; OS at 6 months'],
    ['hfpef',                4.5,7.0,7.8,5.0,6.5,'JAK-STAT activation drives cardiac fibroblast activation and myocardial inflammation contributing to HFpEF; entirely unvalidated indication for JAK inhibitors.','JAK2-STAT3 in cardiac fibroblast activation and macrophage infiltration','HFpEF (EF ≥50%); 6MWT at 24 weeks; NT-proBNP reduction; echocardiographic diastolic function'],
    ['ssc',                  6.0,7.8,6.8,6.0,5.0,'JAK1 mediates TGF-β-driven fibroblast activation in SSc skin and lung; pilot ruxolitinib data shows skin score improvements in dcSSc.','JAK1-STAT3 in TGF-β-driven myofibroblast differentiation','dcSSc (skin score ≥20); mRSS at 24 weeks; co-primary: FVC stability in SSc-ILD patients'],
  ],
  'cmp-0112': [ // belcitanib IL-17A
    ['hidradenitis-supp',    9.0,9.0,5.5,8.5,7.0,'IL-17A drives keratinocyte hyperproliferation, neutrophil recruitment and fistula formation in HS tunnels; secukinumab Phase 3 in HS showed efficacy (Novak 2023).','IL-17A→CXCL1/8 neutrophil recruitment + keratinocyte AMPs in HS follicles','Moderate-severe HS (Hurley II-III, ≥3 nodules); HiSCR75 at week 16; NRS pain score'],
    ['psa',                  9.5,7.5,3.0,9.0,8.0,'IL-17A is the dominant cytokine in enthesitis and synovitis of PsA; ixekizumab and secukinumab both approved; belcitanib differentiation on durability.','IL-17A-driven entheseal stromal fibroblast activation and bone erosion','Active PsA (≥5 tender/swollen joints); ACR50 at week 24; enthesitis resolution by MRI'],
    ['ank-spond',            9.0,7.0,3.5,9.0,7.5,'Two IL-17A antibodies approved for AS (ixekizumab, secukinumab); IL-17A drives entheseal stromal activation and new bone formation via Wnt/BMP.','IL-17A→Wnt/BMP osteoblast activation at entheses causing ankylosis','Radiographic axSpA (mNY criteria); ASAS40 at week 16; MRI SPARCC score at 52 weeks'],
    ['nr-axspa',             8.5,7.5,4.0,8.5,7.0,'Non-radiographic axSpA shares IL-17A pathway with r-axSpA; ixekizumab approved; belcitanib opportunity in patients who fail IL-17 class (unlikely) or treatment-naive.','IL-17A signalling in pre-ankylotic entheseal inflammation','nr-axSpA by ASAS criteria with MRI sacroiliac inflammation; ASAS40 at 16 weeks'],
    ['pustular-psoriasis',   8.0,8.5,6.0,8.0,5.5,'Generalised and palmoplantar pustular psoriasis have IL-17A pathway involvement; spesolimab approved for GPP but IL-17A mAbs have supporting data.','IL-17A→IL-36 amplification loop in neutrophilic pustular skin inflammation','GPP or PPPP; IGA 0/1 at week 12; DLQI; compare to spesolimab historical data'],
    ['crohns',               5.5,7.0,4.5,5.0,6.5,'IL-17A blockade paradoxically worsened Crohn\'s disease in early trials (secukinumab); low biological plausibility specific to CD; feasibility score penalised.','IL-17A loss in mucosal barrier function may worsen colitis','NOT RECOMMENDED — regulatory and safety concern; investigate mucosal IL-17A expression level first'],
    ['non-infect-uveitis',   7.5,8.5,6.5,7.0,5.0,'IL-17A drives uveal T-cell recruitment in HLA-B27 uveitis subtypes; secukinumab ophthalmology studies ongoing.','IL-17A in HLA-B27-associated anterior uveitis recurrence','HLA-B27+ recurrent anterior uveitis; annualised flare rate at 12 months; OCT macular thickness'],
    ['reactive-arth',        7.0,7.0,8.0,7.5,3.5,'Reactive arthritis (Reiter syndrome) is IL-17A-driven post-infectious joint inflammation with very limited competitive landscape.','IL-17A in post-infectious entheseal and synovial inflammation','Recent-onset reactive arthritis; remission at 12 weeks; salvage rate vs standard NSAIDs/sulfasalazine'],
    ['ssc-ild',              6.0,7.5,6.5,6.0,5.5,'IL-17A contributes to SSc-ILD via fibroblast-keratinocyte crosstalk; limited clinical validation but high unmet need.','IL-17A-driven stromal fibroblast senescence in SSc lung','Early SSc-ILD (FVC ≥70%); FVC decline prevention at 52 weeks; HRCT fibrosis score'],
    ['behcet',               7.8,8.5,7.5,7.2,4.0,'IL-17A is elevated in Behçet\'s disease vasculitis and ocular involvement; no approved biologic targets IL-17A specifically in Behçet\'s.','IL-17A-driven neutrophilic vasculitis in Behçet\'s oral/genital/ocular lesions','BD with recurrent oral ulcers ≥3/year; ulcer recurrence rate at 52 weeks; IBDDAM score'],
    ['spondyloarthritis-undiff',7.5,7.2,5.5,8.0,4.5,'Undifferentiated SpA shares IL-17A-driven enthesitis pathology with axSpA and PsA.','IL-17A in early entheseal inflammation before radiographic progression','Undifferentiated SpA with MRI-confirmed enthesitis; BASDAI at 24 weeks; biomarker MRI SPARCC'],
    ['ibd-arthropathy',      6.5,7.0,6.0,6.0,4.5,'IBD-associated arthropathy shares SpA-like IL-17A pathway; however, IL-17A blockade risk in IBD limits feasibility score.','IL-17A in extra-intestinal manifestation of IBD (peripheral arthropathy)','Active peripheral IBD arthropathy with controlled intestinal disease; ACR20 at 12 weeks'],
    ['t1d',                  4.0,7.0,7.5,4.5,5.0,'IL-17A blockade in T1D has limited mechanistic rationale (Th2 target in Th1-driven disease); low biological plausibility.','IL-17A peripheral cytokine role in islet microenvironment','Pilot PD study only — not recommended for development; peripheral CXCL1 as biomarker'],
    ['copd',                 5.5,7.5,7.0,5.0,7.0,'IL-17A drives neutrophilic airway inflammation in COPD; no approved mAb in COPD; early signal in severe eosinophilic COPD patients.','IL-17A→CXCL5/8 neutrophil extracellular trap (NET) formation in COPD airways','Severe eosinophilic COPD (eos ≥300); annual exacerbation rate at 52 weeks; MRC dyspnoea score'],
    ['ms',                   4.0,6.5,7.5,4.0,6.0,'IL-17A blockade has shown controversial results in MS (worsening in some EAE subtypes); low biological plausibility and feasibility.','IL-17A in Th17-driven CNS demyelination (limited data)','NOT RECOMMENDED — safety concern in MS; investigate CSF IL-17A in biomarker substudy only'],
  ],
  'cmp-0203': [ // fosarginib KRAS G12C
    ['pdac',                 8.5,9.5,7.5,6.5,8.5,'KRAS G12C occurs in ~2% of PDAC but KRAS mutations drive >95% of cases; KRAS inhibitor combos with EGFR/SOS1 are being explored in PDAC; very high unmet need.','KRAS G12C in pancreatic stellate cell-mediated tumour-stroma cross-talk','KRAS G12C+ PDAC (2nd-line); primary DCR at 12 weeks; combo with SOS1 inhibitor; ctDNA clearance as early response biomarker'],
    ['crc-kras',             8.0,8.0,5.5,7.0,8.0,'KRAS G12C occurs in ~3% of CRC; sotorasib/adagrasib Phase 2 data shows modest activity; combination with cetuximab (anti-EGFR) shows synergy.','KRAS G12C→RAF→MEK→ERK MAPK pathway in CRC (with EGFR feedback reactivation)','KRAS G12C+ mCRC (2nd-line); DCR at 8 weeks; co-primary: PFS at 6 months; combo with cetuximab arm'],
    ['biliary-kras',         8.5,8.5,8.5,7.5,6.5,'KRAS G12C present in ~5% of biliary tract cancers; essentially no approved targeted therapy in KRAS+ biliary; very open whitespace.','KRAS G12C in biliary epithelial neoplastic transformation','KRAS G12C+ biliary tract cancer (1st or 2nd-line); ORR by RECIST 1.1; basket trial design with ctDNA screening'],
    ['endometrial',          7.0,7.5,7.0,7.0,7.0,'KRAS G12C occurs in ~2% of endometrial cancer; PI3K pathway co-activation complicates response; pembro approved in MSI-H subset.','KRAS G12C→PI3K co-activation loop in endometrial adenocarcinoma','KRAS G12C+ endometrial cancer (2nd-line after platinum); ORR; co-enrol MSS and MSI-H; biomarker: PI3K pathway co-mutation'],
    ['gastric',              6.5,8.0,7.5,6.5,7.0,'KRAS G12C in ~1-2% gastric; limited data; anti-VEGF and anti-HER2 dominate gastric treatment landscape.','KRAS G12C in gastric adenocarcinoma MAPK signalling','KRAS G12C+ gastric/GEJ (2nd-line); basket enrolment via ctDNA; ORR; combo with SHP2 inhibitor arm'],
    ['nsclc-combo',          7.5,7.0,3.5,8.0,8.0,'Primary indication is NSCLC; differentiation opportunity in combination (fosarginib + EGFR, +SOS1, +SHP2) for treatment-naive or post-AMG510/MRTX849 resistance.','KRAS G12C + EGFR/SOS1 feedback reactivation in NSCLC adaptive resistance','Post-sotorasib or adagrasib progression NSCLC; ORR; resistance mechanism by ctDNA panel; combo arms'],
    ['lung-adeno-kras-other',6.5,7.5,6.0,6.5,7.0,'Non-G12C KRAS mutant NSCLC has no approved therapy; pan-KRAS inhibitors emerging; signal from G12C tools applicable to G12V/G12D if pan-KRAS data emerges.','KRAS non-G12C mutations — SOS1 converging pathway','Non-G12C KRAS+ NSCLC; biomarker substudy; exploratory ORR; SOS1i combination rationale'],
    ['appendiceal',          8.0,9.0,9.5,7.0,5.5,'KRAS mutations in ~30% of appendiceal mucinous neoplasms; essentially no approved therapy for advanced peritoneal mucinous appendiceal cancer; enormous whitespace.','KRAS G12C in mucinous appendiceal neoplasm MAPK signalling','Advanced PPMP/DPAM (peritoneal appendiceal cancer); DCR at 12 weeks; basket trial; very small population'],
    ['rcc',                  4.5,7.0,6.5,4.5,7.0,'KRAS G12C rare in RCC (<0.5%); limited biological rationale; VHL/mTOR pathway dominates; very low biological plausibility.','KRAS G12C as incidental mutation in RCC','NOT RECOMMENDED — insufficient prevalence; biomarker prescreening only; exclude'],
    ['hnscc-kras',           5.5,7.5,7.5,5.5,6.0,'KRAS G12C in ~1% HNSCC; EGFR/cetuximab dominates; signal from KRAS G12C inhibition uncertain in HPV+ vs HPV- subtypes.','KRAS G12C in HPV- HNSCC MAPK pathway','HPV- KRAS G12C+ HNSCC (2nd-line); basket enrolment; ORR at 8 weeks; HPV status stratification'],
    ['gbm',                  4.0,9.0,7.0,3.5,6.0,'KRAS G12C very rare in GBM (<0.3%); BBB penetration of fosarginib is the primary feasibility constraint; extremely high unmet need provides pull.','KRAS G12C in GBM MAPK signalling (rare)','Basket Phase 1 CNS expansion cohort; PK CSF/plasma ratio; explore BBB penetration-enhancing formulation first'],
    ['myelofibrosis',        5.0,8.0,5.5,5.5,6.5,'KRAS mutations (including G12C) occur in ~5% of MF; JAK2 pathway dominates; potential for KRAS inhibitor + ruxolitinib combo.','KRAS G12C in clonal haematopoiesis and myeloid progenitor expansion','MF with KRAS G12C (add-on to ruxolitinib); SVR35 at week 24; biomarker: allele burden by ddPCR'],
    ['pdac-early',           8.0,9.5,8.5,5.0,7.5,'Neoadjuvant KRAS G12C inhibition in resectable PDAC is emerging as a strategy; Hypothesis: downstaging before surgery could improve R0 resection rates.','KRAS G12C inhibition as neoadjuvant debulking strategy','Resectable KRAS G12C+ PDAC; neoadjuvant 8 weeks then surgery; primary: R0 resection rate; pCR rate'],
    ['nsclc-adjuvant',       7.0,7.5,4.5,7.5,7.5,'Adjuvant KRAS G12C inhibition in resected Stage IB-IIIA NSCLC emerging as high-value indication after osimertinib adjuvant success in EGFR-mutant disease.','KRAS G12C as driver in early resected NSCLC','Resected Stage IB-IIIA KRAS G12C+ NSCLC; adjuvant 3 years; DFS at 3 years; safety profile'],
    ['crc-adj',              6.5,7.5,6.5,6.5,7.0,'Adjuvant therapy in Stage III KRAS G12C CRC after FOLFOX is an unmet need; CEA-guided strategy with ctDNA clearance as endpoint.','KRAS G12C in Stage III CRC micrometastatic disease','Stage III KRAS G12C+ CRC after curative resection + FOLFOX; DFS at 3 years; ctDNA clearance at 3 months'],
  ],
};

/* ── Auto-generate remaining compound indication lists ──────── */
(function() {
  var cmpToTas = {
    'cmp-0318': ['metabolic','fibrotic','autoimmune','oncology'],
    'cmp-0445': ['hematologic','autoimmune','fibrotic','oncology'],
    'cmp-0521': ['oncology','fibrotic','autoimmune','hematologic'],
    'cmp-0607': ['autoimmune','fibrotic','hematologic','neurological'],
    'cmp-0712': ['autoimmune','fibrotic','oncology','respiratory'],
    'cmp-0834': ['autoimmune','hematologic','fibrotic','oncology'],
    'cmp-0961': ['fibrotic','oncology','autoimmune','metabolic'],
    'cmp-1045': ['hematologic','oncology','fibrotic','autoimmune'],
    'cmp-1178': ['oncology','hematologic','autoimmune','fibrotic'],
    'cmp-1234': ['oncology','autoimmune','hematologic','fibrotic'],
    'cmp-1356': ['oncology','fibrotic','hematologic','autoimmune'],
    'cmp-1489': ['hematologic','oncology','autoimmune','fibrotic'],
  };
  var evidencePhrases = [
    'Mechanistic data from public knowledge-graph (Open Targets, ChEMBL) indicates target expression in disease tissue.',
    'DisGeNET gene-disease association (GDA score >0.3) supports biological plausibility; preclinical model data available.',
    'RNA-expression evidence from GTEx shows target upregulation in disease-relevant tissue; pathway analysis confirms convergence.',
    'Literature mining (PubMed, bioRxiv) identifies 12 pathway-relevant citations in last 24 months; at least one Phase 1 precedent.',
    'Genetic association (GWAS hit, p<5×10⁻⁸) in UKBB cohort; eQTL data from GTEx confirm functional relevance.',
    'Reactome pathway overlap analysis identifies top-10 shared pathway nodes with approved drug mechanism.',
    'Cross-disease phenotypic similarity score (PheWAS) >0.65 supports shared molecular aetiology.',
    'Compound structural analogue in clinical development for this indication provides de-risking data.',
  ];
  var expPhrases = [
    'In vitro disease model panel (3 cell lines); quantify target modulation and functional readout at 72h.',
    'Ex vivo primary human tissue (patient-derived); measure pathway suppression and cell viability.',
    'Syngeneic mouse model; PK/PD modelling at human-equivalent dose; histological endpoint at 4 weeks.',
    'Xenograft model with biomarker-selected patients; ctDNA/serum biomarker pharmacodynamic assessment.',
    'Patient-derived organoid screen; dose-response curve; compare vs approved SoC agent.',
    'Co-culture assay with primary immune effector cells; assess cytokine release and target cell killing.',
  ];
  function pick(arr, seed) { return arr[_hash(seed) % arr.length]; }
  function genScore(cid, iid, axis) {
    var base = _hash(cid + iid + axis) % 60;
    return Math.round((base / 10 + 3.5) * 10) / 10;
  }
  Object.keys(cmpToTas).forEach(function(cid) {
    var tas = cmpToTas[cid];
    var pool = _IND.filter(function(ind) { return tas.indexOf(ind.ta) !== -1; });
    // pad with other indications if needed
    if (pool.length < 20) {
      _IND.forEach(function(ind) {
        if (pool.indexOf(ind) === -1) pool.push(ind);
      });
    }
    _CMP_INDS[cid] = pool.slice(0, 22).map(function(ind) {
      return [
        ind.id,
        genScore(cid, ind.id, 'bp'),
        genScore(cid, ind.id, 'un'),
        genScore(cid, ind.id, 'cw'),
        genScore(cid, ind.id, 'tf'),
        genScore(cid, ind.id, 'ca'),
        pick(evidencePhrases, cid + ind.id + 'ev'),
        ind.name + ' — pathway convergence identified via knowledge-graph analysis.',
        pick(expPhrases, cid + ind.id + 'exp'),
      ];
    });
  });
})();

/* ── Build MOCK_INDICATIONS object ──────────────────────────── */
var MOCK_INDICATIONS = {};
(function() {
  var litPool = [
    { title: 'Target–disease link confirmed by proteomics: implications for repurposing', journal: 'Nat Med', year: 2023, pmid: '37100012' },
    { title: 'Multi-omics repurposing network identifies high-confidence candidates across 400 indications', journal: 'Cell', year: 2022, pmid: '35830833' },
    { title: 'Mechanistic target expression validated in disease-relevant primary human tissue', journal: 'J Clin Invest', year: 2022, pmid: '35349476' },
    { title: 'GWAS meta-analysis identifies shared genetic architecture supporting cross-indication hypothesis', journal: 'Nat Genet', year: 2023, pmid: '37185706' },
    { title: 'PK/PD model predicts adequate target tissue exposure at approved dose for candidate indication', journal: 'Clin Pharmacol Ther', year: 2023, pmid: '36888001' },
    { title: 'Phase 2 trial in adjacent indication establishes safety margin at efficacious dose', journal: 'NEJM', year: 2023, pmid: '36856619' },
    { title: 'Transcriptomic atlas confirms target upregulation in disease endotype with highest unmet need', journal: 'Science', year: 2022, pmid: '35271291' },
    { title: 'Real-world evidence: drug-disease pair associated with reduced disease-related endpoints in claims data', journal: 'JAMA', year: 2023, pmid: '37162012' },
  ];
  var compPhrases = [
    { drug: 'Comparator A (Phase 2)', sponsor: 'Unnamed Sponsor', phase: 'Phase 2' },
    { drug: 'Approved SoC (generic)', sponsor: 'Multiple',        phase: 'Approved' },
    { drug: 'Pipeline Asset B (Phase 1)', sponsor: 'Emerging Biotech', phase: 'Phase 1' },
  ];

  Object.keys(_CMP_INDS).forEach(function(cid) {
    MOCK_INDICATIONS[cid] = _CMP_INDS[cid].map(function(row, idx) {
      var indId = row[0];
      var meta = _IND.find(function(i) { return i.id === indId; }) || { id: indId, name: indId, ta: 'other', mondoId: '' };
      return {
        id: cid + '-' + indId,
        indicationId: indId,
        name: meta.name,
        ta: meta.ta,
        mondoId: meta.mondoId,
        scores: {
          biologicalPlausibility:    row[1],
          unmetNeed:                 row[2],
          competitiveWhitespace:     row[3],
          translationalFeasibility:  row[4],
          commercialAttractiveness:  row[5],
        },
        composite: Math.round((row[1]+row[2]+row[3]+row[4]+row[5])/5 * 10) / 10,
        rank: idx + 1,
        evidenceSummary:   row[6],
        keyMechanism:      row[7],
        proposedExperiment:row[8],
        competitorCount:   _hash(cid + indId + 'nc') % 5,
        competitorPhase:   ['Approved','Phase 3','Phase 2','Phase 1','None'][_hash(cid + indId + 'cp') % 5],
        patentRunwayYears: (_hash(cid + indId + 'ip') % 10) + 3,
        unmetNeedScore:    row[2],
        citations: litPool.slice(_hash(cid + indId) % 5, (_hash(cid + indId) % 5) + 3),
        competitive: compPhrases.slice(0, Math.min(3, (_hash(cid + indId) % 3) + 1)),
      };
    });
  });
})();

/* ── Full Dossiers (3 showcase indications) ─────────────────── */
var MOCK_DOSSIERS = {
  'cmp-0047-atopic-dermatitis': {
    draftStatus: 'AI Draft — Scientist Review Required',
    mechanisticRationale: 'Navitinib (JAK1/2 inhibitor) exerts its anti-inflammatory effect through selective inhibition of Janus kinase 1 and 2, which are the critical signal transducers for the cytokines that drive atopic dermatitis pathophysiology. IL-4 and IL-13, the canonical Th2 cytokines, signal exclusively through JAK1 (in complex with IL-4Rα/IL-13Rα1), activating STAT6 to transcribe TSLP, CCL17, and periostin — amplifying the Th2 cascade and disrupting keratinocyte barrier function. JAK2 additionally mediates IL-31 itch signalling through JAK2/TYK2-STAT3, the molecular basis of itch in AD. The clinical validation of this mechanism is robust: abrocitinib (JAK1-selective) and upadacitinib (JAK1-preferential) are both FDA-approved for moderate-to-severe AD, and baricitinib (JAK1/2, like navitinib) is approved in the EU. Navitinib\'s PK profile from the RA programme demonstrates adequate skin exposure (Cmax skin/plasma ratio 0.7 in healthy volunteers), and the approved-indication safety dataset provides a clear therapeutic index framework for repurposing. The principal differentiation hypothesis vs. approved JAKi is navitinib\'s selectivity profile — lower off-target kinase inhibition at JAK3 than tofacitinib — which may reduce infection and lymphoma risk in a younger, longer-treatment AD population.',
    unmetNeedNarrative: 'Atopic dermatitis affects 230 million people globally with an estimated US prevalence of 16.5 million adults. Despite dupilumab\'s transformative impact, 30-40% of patients fail to achieve IGA 0/1 after 16 weeks, and a further 20% lose response by year 3 (secondary failure). Among dupilumab non-responders, the current options are tralokinumab (similar mechanism), lebrikizumab (similar mechanism), or abrocitinib/upadacitinib (JAK inhibitors). A JAK inhibitor with a cleaner selectivity profile than existing agents addresses the specific unmet need in patients who require long-term systemic therapy but have infection or malignancy risk concerns that limit JAK inhibitor use.',
    ipConsiderations: 'CMP-0047 composition-of-matter patent expires 2032 (US). Method-of-use patent covering JAK1/2 inhibition in inflammatory skin diseases filed 2023 — 20-year runway to 2043. Atopic dermatitis market exclusivity via orphan not applicable (>200K prevalence). NCE exclusivity (5 years from potential approval) provides additional commercial protection. Freedom-to-operate confirmed vs. Pfizer\'s abrocitinib compound class.',
    proposedNextExperiment: 'Phase 2a proof-of-concept: 16-week, randomised, double-blind, placebo-controlled study in 120 adults with moderate-to-severe AD (IGA ≥3, EASI ≥16) inadequately controlled on dupilumab. Primary endpoint: EASI-75 at week 16. Key secondary: IGA 0/1, Peak Pruritus NRS ≥4-point improvement, DLQI. Mechanistic biomarkers: serum TARC (CCL17), total IgE, skin tape-strip phospho-STAT6 at baseline, week 4, and week 16. Budget estimate: $18M over 24 months.',
    evidenceGraph: {
      nodes: [
        { id: 'jak1',  type: 'target',   label: 'JAK1',   name: 'Janus Kinase 1' },
        { id: 'jak2',  type: 'target',   label: 'JAK2',   name: 'Janus Kinase 2' },
        { id: 'stat6', type: 'pathway',  label: 'STAT6',  name: 'STAT6 (IL-4Rα)' },
        { id: 'stat3', type: 'pathway',  label: 'STAT3',  name: 'STAT3 (IL-31R)' },
        { id: 'il4',   type: 'pathway',  label: 'IL-4',   name: 'Interleukin-4' },
        { id: 'il13',  type: 'pathway',  label: 'IL-13',  name: 'Interleukin-13' },
        { id: 'il31',  type: 'pathway',  label: 'IL-31',  name: 'Interleukin-31 (itch)' },
        { id: 'ad',    type: 'disease',  label: 'AD',     name: 'Atopic Dermatitis' },
        { id: 'gwas',  type: 'evidence', label: 'GWAS',   name: 'GWAS (JAK1 locus, p=3×10⁻¹²)' },
        { id: 'drug',  type: 'evidence', label: 'Drug',   name: 'Approved: abrocitinib, upadacitinib, baricitinib' },
      ],
      edges: [
        { source: 'il4',  target: 'jak1',  label: 'signals through' },
        { source: 'il13', target: 'jak1',  label: 'signals through' },
        { source: 'il31', target: 'jak2',  label: 'signals through' },
        { source: 'jak1', target: 'stat6', label: 'phosphorylates' },
        { source: 'jak2', target: 'stat3', label: 'phosphorylates' },
        { source: 'stat6',target: 'ad',    label: 'drives Th2 barrier disruption' },
        { source: 'stat3',target: 'ad',    label: 'mediates itch signalling' },
        { source: 'gwas', target: 'jak1',  label: 'genetic evidence' },
        { source: 'drug', target: 'jak1',  label: 'validated target' },
      ],
    },
    citations: [
      { title: 'Abrocitinib versus dupilumab for moderate-to-severe atopic dermatitis', journal: 'NEJM', year: 2021, pmid: '34592116' },
      { title: 'Upadacitinib in adults with moderate-to-severe atopic dermatitis: AD Up Phase 3 trial', journal: 'NEJM', year: 2021, pmid: '34592113' },
      { title: 'JAK1 genetic variants and atopic dermatitis susceptibility: evidence from GWAS meta-analysis', journal: 'Nat Genet', year: 2022, pmid: '35332294' },
      { title: 'Skin bioavailability and tissue pharmacokinetics of JAK inhibitors: implications for dose selection', journal: 'Clin Pharmacol Ther', year: 2023, pmid: '36695212' },
    ],
  },
  'cmp-0112-hidradenitis-supp': {
    draftStatus: 'AI Draft — Scientist Review Required',
    mechanisticRationale: 'Hidradenitis suppurativa (HS) is a chronic, debilitating folliculocentric inflammatory disorder characterised by painful nodules, abscesses and sinus tracts primarily in intertriginous areas. The immunopathology of HS involves a TNF/IL-17A-IL-36 amplification loop centred on the pilosebaceous unit. Keratinocytes and neutrophils co-produce IL-17A and CXCL1/8, driving sustained neutrophil recruitment into follicular occlusion funnels that form tunnels. Belcitanib\'s anti-IL-17A mechanism directly suppresses this CXCL1/8 axis and breaks the keratinocyte activation cycle. The clinical validation is strong: secukinumab (also anti-IL-17A) demonstrated positive Phase 3 data in HS (Novak et al., NEJM 2023), achieving HiSCR75 in 34% vs 18% placebo — establishing IL-17A as a validated HS target. Belcitanib\'s differentiation is its superior binding affinity (IC₅₀ 3.2 pM vs secukinumab 100 pM) and potential for longer dosing intervals, which are particularly important in HS given chronic disease duration and patient convenience needs. PK modelling from the psoriasis programme suggests equivalent drug exposure in HS skin given similar tissue compartment — formal HS PK study is recommended but not a gating step.',
    unmetNeedNarrative: 'HS affects an estimated 4 million US patients and is severely underdiagnosed; true prevalence is estimated at 1-4% of the adult population. It is associated with a quality-of-life burden equivalent to severe psoriasis and moderate heart failure. Despite two FDA-approved biologics (adalimumab, secukinumab approved 2023), >50% of patients do not achieve meaningful response (HiSCR50) and virtually none achieve skin remission. The recurrence and tunnelling disease characteristic of Hurley Stage II-III patients drives a massive unmet need for durable, sustained remission that no current therapy delivers consistently.',
    ipConsiderations: 'Belcitanib composition-of-matter patent covers all IL-17A-neutralizing antibody claims until 2035 (US/EU). Method-of-use patent for HS specifically filed 2024 (pending). Secukinumab\'s HS approval in 2023 validates the indication but does not threaten belcitanib\'s IP position — different compound. Potential for orphan drug designation in EU (HS prevalence <5 in 10,000 in EU context) would add 10-year market exclusivity in Europe. RPDD voucher eligibility may apply if qualifying paediatric indication is co-developed.',
    proposedNextExperiment: 'Phase 2b dose-finding: 24-week, randomised, double-blind, placebo-controlled study in 240 adults with moderate-severe HS (Hurley Stage II-III, ≥3 inflammatory nodules). Belcitanib 150 mg Q4W vs 300 mg Q4W vs placebo. Primary endpoint: HiSCR75 at week 16. Key secondary: HiSCR90, abscess/nodule count reduction, Dermatology Life Quality Index, time to first flare at week 24. Biomarkers: lesional IL-17A/CXCL1 biopsy (baseline, week 4); serum CRP/IL-6. Costs: $22M over 28 months.',
    evidenceGraph: {
      nodes: [
        { id: 'il17a', type: 'target',   label: 'IL-17A',  name: 'Interleukin-17A' },
        { id: 'cxcl1', type: 'pathway',  label: 'CXCL1',   name: 'CXCL1 (GROα) chemokine' },
        { id: 'cxcl8', type: 'pathway',  label: 'CXCL8',   name: 'CXCL8 (IL-8) chemokine' },
        { id: 'neut',  type: 'pathway',  label: 'PMN',      name: 'Neutrophil recruitment' },
        { id: 'kerat', type: 'pathway',  label: 'KerAct',   name: 'Keratinocyte AMPs' },
        { id: 'il36',  type: 'pathway',  label: 'IL-36',    name: 'IL-36 amplification loop' },
        { id: 'hs',    type: 'disease',  label: 'HS',       name: 'Hidradenitis Suppurativa' },
        { id: 'drug2', type: 'evidence', label: 'Drug',     name: 'Secukinumab approved 2023 (Phase 3 positive)' },
        { id: 'rna',   type: 'evidence', label: 'scRNA',    name: 'scRNA-seq: IL-17A+ T cells enriched in HS tunnels' },
      ],
      edges: [
        { source: 'il17a', target: 'cxcl1', label: 'induces' },
        { source: 'il17a', target: 'cxcl8', label: 'induces' },
        { source: 'il17a', target: 'kerat', label: 'activates AMPs' },
        { source: 'cxcl1', target: 'neut',  label: 'recruits' },
        { source: 'cxcl8', target: 'neut',  label: 'recruits' },
        { source: 'kerat', target: 'il36',  label: 'amplification' },
        { source: 'il36',  target: 'il17a', label: 'feedback loop' },
        { source: 'neut',  target: 'hs',    label: 'drives tunnel formation' },
        { source: 'drug2', target: 'il17a', label: 'validated target' },
        { source: 'rna',   target: 'il17a', label: 'expression evidence' },
      ],
    },
    citations: [
      { title: 'Secukinumab in hidradenitis suppurativa: Phase 3 SUNSHINE and SUNRISE trials', journal: 'NEJM', year: 2023, pmid: '37140880' },
      { title: 'IL-17A and the keratinocyte-neutrophil axis in HS pathogenesis: single-cell analysis', journal: 'J Invest Dermatol', year: 2022, pmid: '35150723' },
      { title: 'HiSCR75 as an endpoint for HS clinical trials: validation and regulatory context', journal: 'Br J Dermatol', year: 2023, pmid: '36480370' },
      { title: 'Long-term anti-IL-17A therapy in inflammatory skin disease: integrated safety dataset', journal: 'Lancet', year: 2023, pmid: '37182002' },
    ],
  },
  'cmp-0203-pdac': {
    draftStatus: 'AI Draft — Scientist Review Required',
    mechanisticRationale: 'Pancreatic ductal adenocarcinoma (PDAC) harbours KRAS mutations in >95% of cases, but the G12C variant occurs in only ~2% of PDAC (versus ~13% in NSCLC). Despite the lower prevalence, the high unmet need (5-year OS <12% in metastatic PDAC) and near-absence of any effective targeted therapy make G12C+ PDAC a compelling repurposing target for fosarginib. Mechanistically, KRAS G12C in PDAC signals through both the MAPK (RAF-MEK-ERK) and PI3K-AKT pathways, driving proliferation and survival in a desmoplastic stroma where drug delivery is already compromised. A key insight is that KRAS G12C inhibitors may paradoxically benefit from PDAC\'s unique biology: the GDP-locked inactive state targeted by covalent inhibitors like fosarginib depends on KRAS cycling through GTP-GDP exchange, and PDAC stroma has low RAS GEF activity — potentially prolonging the inactive-state targeting window compared to NSCLC. However, PDAC also upregulates SOS1/EGFR feedback reactivation more strongly than NSCLC, arguing for early combination with SOS1 inhibitors or EGFR antibodies. PK modelling from the NSCLC Phase 2 study shows adequate pancreatic tissue levels if corrected for albumin binding in the hypervascular PDAC TME — formal PDAC biopsy PK substudies are planned.',
    unmetNeedNarrative: 'PDAC killed 51,000 Americans in 2023 — the 3rd leading cause of cancer death with a lethality-to-incidence ratio of 0.93. First-line FOLFIRINOX or gemcitabine/nab-paclitaxel achieves a median OS of 8.5-11.1 months in metastatic PDAC, with essentially no OS benefit from subsequent lines. Only ~2% of PDAC patients harbour a G12C mutation, yielding a US addressable population of ~900 patients/year — modest in absolute terms but with complete absence of targeted therapy, NCCB pricing precedent from sotorasib/adagrasib in NSCLC ($25,000-35,000/month) makes the economic case compelling. Orphan drug designation is applicable (prevalence <200,000).',
    ipConsiderations: 'Fosarginib composition-of-matter patent (covalent KRAS G12C binder) expires 2034 (US). PDAC-specific method-of-use patent pending (2024 filing). FDA Orphan Drug Designation applicable for PDAC (prevalence <200,000 US) — 7-year market exclusivity from approval. Breakthrough Therapy Designation pathway likely given unmet need and KRAS G12C as biomarker-defined population. Freedom-to-operate confirmed vs. AMG510 (sotorasib) and MRTX849 (adagrasib) — distinct compound class.',
    proposedNextExperiment: 'Phase 1b/2 basket + expansion: Enrol KRAS G12C+ PDAC patients (2nd-line, post-gem/nab-P) via ctDNA liquid biopsy screening (turnaround 5 business days). Phase 1b: Fosarginib dose escalation (160 mg vs 240 mg QD) in PDAC to confirm safety and pancreatic PK (paired biopsy at baseline and week 4). Phase 2 expansion: Fosarginib 240 mg QD + SOS1i (partner compound in-licensing) vs fosarginib monotherapy in 60 patients. Primary: DCR at 12 weeks (RECIST 1.1 + CA19-9). Key secondary: PFS, OS, ctDNA clearance at 4 weeks as early biomarker. Costs: $28M over 30 months.',
    evidenceGraph: {
      nodes: [
        { id: 'kras',  type: 'target',   label: 'KRAS',   name: 'KRAS G12C' },
        { id: 'raf',   type: 'pathway',  label: 'RAF',    name: 'CRAF/BRAF' },
        { id: 'mek',   type: 'pathway',  label: 'MEK',    name: 'MEK1/2' },
        { id: 'erk',   type: 'pathway',  label: 'ERK',    name: 'ERK1/2' },
        { id: 'pi3k',  type: 'pathway',  label: 'PI3K',   name: 'PI3K-AKT-mTOR' },
        { id: 'sos1',  type: 'pathway',  label: 'SOS1',   name: 'SOS1 (feedback reactivation)' },
        { id: 'pdac',  type: 'disease',  label: 'PDAC',   name: 'Pancreatic Ductal Adenocarcinoma' },
        { id: 'genetic',type: 'evidence',label: 'Mut',    name: 'KRAS G12C driver mutation (95% PDAC KRAS+)' },
        { id: 'drug3', type: 'evidence', label: 'Drug',   name: 'Sotorasib/adagrasib in NSCLC validate G12C binders' },
      ],
      edges: [
        { source: 'kras',   target: 'raf',   label: 'activates' },
        { source: 'kras',   target: 'pi3k',  label: 'activates' },
        { source: 'raf',    target: 'mek',   label: 'phosphorylates' },
        { source: 'mek',    target: 'erk',   label: 'phosphorylates' },
        { source: 'erk',    target: 'pdac',  label: 'proliferation/survival' },
        { source: 'pi3k',   target: 'pdac',  label: 'survival/apoptosis resistance' },
        { source: 'sos1',   target: 'kras',  label: 'feedback reactivation' },
        { source: 'genetic',target: 'kras',  label: 'driver mutation' },
        { source: 'drug3',  target: 'kras',  label: 'validated target class' },
      ],
    },
    citations: [
      { title: 'KRAS G12C inhibition in pancreatic cancer: mechanism, preclinical activity and clinical perspectives', journal: 'Nat Cancer', year: 2023, pmid: '37225799' },
      { title: 'Adagrasib in pancreatic cancer with KRAS G12C mutation: KRYSTAL-1 expansion cohort', journal: 'J Clin Oncol', year: 2023, pmid: '37040470' },
      { title: 'SOS1 inhibitor combination overcomes adaptive resistance to KRAS G12C inhibitors in PDAC', journal: 'Cancer Cell', year: 2022, pmid: '36099918' },
      { title: 'Pancreatic cancer KRAS mutation landscape and implications for precision therapy', journal: 'Nat Rev Cancer', year: 2023, pmid: '36894627' },
    ],
  },
};

/* ── Historical Committee Decisions ─────────────────────────── */
var MOCK_DECISIONS = [
  {
    id: 'dec-001', compoundId: 'cmp-0047', indicationId: 'cmp-0047-alopecia-areata',
    decision: 'advance', rationale: 'Strong biological plausibility (JAK1/2 validated by baricitinib approval); unmet need remains high in severe AA not responding to baricitinib. Agreed to initiate Phase 2a design. Navitinib selectivity advantage over baricitinib at JAK3 is the differentiation hypothesis.',
    decidedBy: 'Dr. Sarah Chen, Translational Medicine Lead', decidedAt: '2026-01-14T14:30:00Z',
    evidenceSnapshotId: 'snap-001',
    evidenceSnapshot: { biologicalPlausibility: 9.0, unmetNeed: 8.1, competitiveWhitespace: 5.5, translationalFeasibility: 8.0, commercialAttractiveness: 6.0, composite: 7.3 },
  },
  {
    id: 'dec-002', compoundId: 'cmp-0047', indicationId: 'cmp-0047-ms',
    decision: 'kill', rationale: 'Competitive landscape is crowded (>20 approved DMTs); biological plausibility for JAK inhibition in relapsing MS is not differentiated vs existing anti-CD20/S1P approaches. Decision: de-prioritize. Revisit only if JAK inhibitor trial in progressive MS shows signal.',
    decidedBy: 'Dr. Michael Torres, VP Portfolio Strategy', decidedAt: '2026-01-14T15:10:00Z',
    evidenceSnapshotId: 'snap-002',
    evidenceSnapshot: { biologicalPlausibility: 6.5, unmetNeed: 6.5, competitiveWhitespace: 4.5, translationalFeasibility: 6.2, commercialAttractiveness: 6.0, composite: 5.9 },
  },
  {
    id: 'dec-003', compoundId: 'cmp-0112', indicationId: 'cmp-0112-hidradenitis-supp',
    decision: 'advance', rationale: 'Secukinumab approval in 2023 validates the indication and mechanism. Belcitanib has superior binding affinity and may offer longer dosing intervals — key for HS chronicity. Agreed to initiate Phase 2b. Orphan EU designation applied for.',
    decidedBy: 'Dr. Sarah Chen, Translational Medicine Lead', decidedAt: '2026-02-03T10:00:00Z',
    evidenceSnapshotId: 'snap-003',
    evidenceSnapshot: { biologicalPlausibility: 9.0, unmetNeed: 9.0, competitiveWhitespace: 5.5, translationalFeasibility: 8.5, commercialAttractiveness: 7.0, composite: 7.8 },
  },
  {
    id: 'dec-004', compoundId: 'cmp-0203', indicationId: 'cmp-0203-rcc',
    decision: 'kill', rationale: 'KRAS G12C prevalence in RCC is <0.5% — insufficient for viable development. VHL/mTOR pathway dominates RCC biology. No further resource allocation.',
    decidedBy: 'Dr. Priya Anand, Head of Oncology', decidedAt: '2026-02-18T09:45:00Z',
    evidenceSnapshotId: 'snap-004',
    evidenceSnapshot: { biologicalPlausibility: 4.5, unmetNeed: 7.0, competitiveWhitespace: 6.5, translationalFeasibility: 4.5, commercialAttractiveness: 7.0, composite: 5.9 },
  },
  {
    id: 'dec-005', compoundId: 'cmp-0203', indicationId: 'cmp-0203-pdac',
    decision: 'watch', rationale: 'High unmet need and open whitespace. Decision: watch and invest $2M in PDAC pancreatic PK characterization study and SOS1 inhibitor combination in PDX models. Re-present to committee in Q3 with biomarker data. Phase 2 decision deferred.',
    decidedBy: 'Dr. Priya Anand, Head of Oncology', decidedAt: '2026-03-05T11:30:00Z',
    evidenceSnapshotId: 'snap-005',
    evidenceSnapshot: { biologicalPlausibility: 8.5, unmetNeed: 9.5, competitiveWhitespace: 7.5, translationalFeasibility: 6.5, commercialAttractiveness: 8.5, composite: 8.1 },
  },
];

/* ── Dusty Shelf Rescue Data ─────────────────────────────────── */
var MOCK_DUSTY_SHELF = {
  'cmp-1045': {
    rescueScore: 8.2,
    rescueRationale: 'IDH2 inhibitor enasidenib is approved for AML but IDH1/2 dual inhibition is not — carsenib\'s dual profile remains mechanistically differentiated. Three Phase 2 failures in cholangio (IDH1) and MDS (IDH2) since shelving create new whitespace. Key: cardiac safety mitigation by dose fractionation is feasible per updated Phase 1 PK re-analysis.',
    externalChanges: [
      { type: 'Competitor Failure', icon: '📉', date: '2025-09', text: 'Ivosidenib + azacitidine Phase 3 in MDS missed OS endpoint (AGILE-MDS) — creates competitive whitespace for dual IDH1/2 approach in IDH-mutant MDS.', impact: 'positive' },
      { type: 'Regulatory Signal', icon: '📋', date: '2025-11', text: 'FDA Hematology Advisory Committee released draft guidance on QTc monitoring strategy for IDH inhibitors, suggesting dose-fractionation can mitigate QTc risk — directly addresses carsenib\'s shelving reason.', impact: 'positive' },
      { type: 'New Biomarker', icon: '🔬', date: '2026-01', text: 'ctDNA IDH1/2 co-mutation panel validated as screening tool (sensitivity 94%) — enables patient enrichment without bone marrow biopsy, reducing Phase 2 screen failure rate.', impact: 'positive' },
    ],
  },
  'cmp-1178': {
    rescueScore: 6.4,
    rescueRationale: 'CD73/adenosine axis rescue story is strengthened by three new biomarker-selected trials. High-CD73 solid tumors (colorectal, bladder, breast) represent a viable niche if combined with a new IO partner. Commercial path: small biotech licensing for combination development.',
    externalChanges: [
      { type: 'New Biomarker', icon: '🔬', date: '2025-08', text: 'CD73-high IHC scoring system validated and standardised across 4 pathology labs — enables biomarker-stratified enrolment for a rescue Phase 2.', impact: 'positive' },
      { type: 'Competitor Failure', icon: '📉', date: '2025-12', text: 'AstraZeneca anti-CD73 oleclumab Phase 2/3 did not meet OS in NSCLC — but biomarker-unselected design blamed; creates opening for biomarker-selected trial.', impact: 'positive' },
      { type: 'Scientific Publication', icon: '📄', date: '2026-02', text: 'Nature paper: CD73-high pancreatic cancer responds to adenosine receptor antagonist combination — novatumab\'s mechanism could be repositioned as a combination partner in PDAC CD73-high subpopulation.', impact: 'positive' },
    ],
  },
  'cmp-1234': {
    rescueScore: 4.1,
    rescueRationale: 'MEK inhibitor competitive landscape has not materially improved since de-prioritization. Cobimetinib, trametinib, binimetinib all approved; cardiac toxicity remains a class concern. Only viable path is a new indication with no BRAF comutation requirement — limited candidates identified.',
    externalChanges: [
      { type: 'Regulatory Signal', icon: '📋', date: '2025-07', text: 'FDA issued class safety communication for MEK inhibitors on cardiac monitoring — increases regulatory burden for a new MEK program.', impact: 'negative' },
      { type: 'Scientific Publication', icon: '📄', date: '2026-01', text: 'MEK inhibitor combination with CDK4/6 inhibitors shows synergy in KRAS-mutant pancreatic cancer cell lines — potential combination rescue strategy if PDAC fosarginib data is negative.', impact: 'positive' },
    ],
  },
  'cmp-1356': {
    rescueScore: 7.1,
    rescueRationale: 'CSF1R biology has pivoted from TAM depletion toward microglial diseases (Alzheimer\'s, ALS). Two Phase 2 trials in microglial diseases launched 2024-2025. Solectinib\'s CNS penetration was never characterized — if favourable, this is a genuine rescue hypothesis in neuroinflammatory diseases.',
    externalChanges: [
      { type: 'New Indication Signal', icon: '✨', date: '2025-06', text: 'AbbVie Phase 2 CSF1Ri in Alzheimer\'s (AD-TAC study) shows microglial activation suppression and slowing of cognitive decline at 18 months — validates CSF1R as Alzheimer\'s target.', impact: 'positive' },
      { type: 'Scientific Publication', icon: '📄', date: '2025-10', text: 'Nat Neurosci: CSF1R-high microglia drive neuroinflammation in ALS spinal cord; CSF1R knockout in SOD1 mice extends survival by 28%. Solectinib\'s mechanism is directly relevant.', impact: 'positive' },
      { type: 'Regulatory Signal', icon: '📋', date: '2026-03', text: 'FDA Neurology Division issued draft guidance on CSF1R inhibitor CNS development — clarifies BBB penetration requirements and acceptable surrogate endpoints (CSF neurofilament).', impact: 'positive' },
    ],
  },
  'cmp-1489': {
    rescueScore: 5.3,
    rescueRationale: 'HDAC1/2 class I selectivity remains a mechanistic differentiator. Two new indications have emerged: (1) HDAC1/2 inhibition in solid-organ GvHD (small market, orphan), and (2) combination with PD-1 antibodies in SSc (very early signal). GI toxicity must be re-addressed with modified release formulation.',
    externalChanges: [
      { type: 'New Indication Signal', icon: '✨', date: '2025-09', text: 'Phase 2 signal: romidepsin (HDAC1/2) in steroid-refractory chronic GvHD shows ORR 48% — creates rationale for ravitaxel class I HDAC inhibitor rescue in GvHD with improved tolerability.', impact: 'positive' },
      { type: 'Scientific Publication', icon: '📄', date: '2026-02', text: 'HDAC1/2 inhibition reprogrammes fibroblast epigenome in SSc skin: class I HDAC inhibitor reduces ACTA2 and COL1A1 by 60% in patient-derived fibroblasts. New indication hypothesis.', impact: 'positive' },
    ],
  },
};
