/**
 * Complete fake persona for privacy/demo mode.
 * When privacy is enabled, ALL real data is swapped with this coherent fake person.
 *
 * Jordan Rivera — 42yo male with mild hypertension, seasonal allergies, and GERD.
 */

import type {
  Profile, Medication, Supplement, Provider, LabDraw,
  Alert, GeneticsPanel, Interaction, Immunization, MedicalRecord,
} from './types';

/* ── Profile ─────────────────────────────────────────────────────── */

export const fakeProfile: Profile = {
  name: 'Jordan Rivera',
  dob: '1984-03-15',
  age: 42,
  sex: 'Male',
  conditions: ['Mild Hypertension', 'Seasonal Allergies', 'GERD'],
  allergies: ['Sulfa Drugs', 'Latex'],
  bodyMetrics: { height: "5'11\"", weight: '180 lbs', bmi: 25.1, bodyFat: 22 },
  geneticFlags: ['CYP2D6 Intermediate Metabolizer'],
  updatedAt: '2026-02-20T10:00:00Z',
};

/* ── Medications ─────────────────────────────────────────────────── */

export const fakeMedications: Medication[] = [
  // Active
  { name: 'Lisinopril', dose: '10mg', frequency: 'Once daily', prescriber: 'Dr. Elena Vasquez', startDate: '2024-08-15', status: 'current', active: true, notes: 'For blood pressure management' },
  { name: 'Omeprazole', dose: '20mg', frequency: 'Once daily, before breakfast', prescriber: 'Dr. Elena Vasquez', startDate: '2025-03-01', status: 'current', active: true, notes: 'For GERD' },
  { name: 'Cetirizine', dose: '10mg', frequency: 'Once daily', prescriber: 'Dr. Sarah Kim', startDate: '2025-04-01', status: 'current', active: true },
  { name: 'Montelukast', dose: '10mg', frequency: 'Once daily at bedtime', prescriber: 'Dr. Sarah Kim', startDate: '2025-09-15', status: 'current', active: true, notes: 'Seasonal allergy support' },
  // Historical
  { name: 'Amoxicillin', dose: '500mg', frequency: 'Three times daily', prescriber: 'Dr. Elena Vasquez', startDate: '2025-11-01', endDate: '2025-11-10', status: 'stopped', active: false, notes: 'Sinus infection' },
  { name: 'Prednisone', dose: '20mg taper', frequency: 'As directed', prescriber: 'Dr. Sarah Kim', startDate: '2025-06-01', endDate: '2025-06-14', status: 'stopped', active: false, notes: 'Severe allergy flare' },
];

/* ── Supplements ─────────────────────────────────────────────────── */

export const fakeSupplements: Supplement[] = [
  { name: 'Vitamin D3', dose: '2000 IU', frequency: 'Once daily', timing: 'Morning with food', reason: 'Vitamin D insufficiency', status: 'current', active: true },
  { name: 'Fish Oil', dose: '1000mg', frequency: 'Once daily', timing: 'With dinner', reason: 'Cardiovascular support', status: 'current', active: true },
  { name: 'Magnesium Glycinate', dose: '400mg', frequency: 'Once daily', timing: 'Before bed', reason: 'Sleep quality', status: 'current', active: true },
  { name: 'Probiotic', dose: '50B CFU', frequency: 'Once daily', timing: 'Morning', reason: 'Gut health', status: 'current', active: true },
];

/* ── Providers ───────────────────────────────────────────────────── */

export const fakeProviders: Provider[] = [
  { name: 'Dr. Elena Vasquez', specialty: 'Internal Medicine', role: 'Primary Care', practice: 'Riverside Medical Group', address: '450 Riverside Dr, Suite 200', phone: '(555) 234-5678', email: 'vasquez@riversidemedical.com', lastVisit: '2026-01-15' },
  { name: 'Dr. Marcus Chen', specialty: 'Cardiology', role: 'Cardiologist', facility: 'Metro Heart Center', address: '800 Medical Parkway, Suite 310', phone: '(555) 345-6789', lastVisit: '2025-11-20' },
  { name: 'Dr. Sarah Kim', specialty: 'Allergy & Immunology', role: 'Allergist', practice: 'Allergy Associates', address: '225 Oak Street, Suite 105', phone: '(555) 456-7890', email: 'skim@allergyassoc.com', lastVisit: '2025-10-08' },
  { name: 'Dr. Robert Patel', specialty: 'Gastroenterology', role: 'GI Specialist', facility: 'Digestive Health Institute', phone: '(555) 567-8901', lastVisit: '2025-12-03' },
];

/* ── Lab Draws ───────────────────────────────────────────────────── */

export const fakeLabs: LabDraw[] = [
  // Draw 1 — Most recent (2026-01-10)
  {
    date: '2026-01-10',
    source: 'Quest Diagnostics',
    orderedBy: 'Dr. Vasquez',
    markers: [
      // Lipid Panel
      { name: 'Total Cholesterol', value: 218, unit: 'mg/dL', referenceRange: { low: 125, high: 200 }, flag: 'high', category: 'Lipid Panel' },
      { name: 'LDL Cholesterol', value: 142, unit: 'mg/dL', referenceRange: { low: 0, high: 100 }, flag: 'high', category: 'Lipid Panel' },
      { name: 'HDL Cholesterol', value: 52, unit: 'mg/dL', referenceRange: { low: 40, high: 60 }, category: 'Lipid Panel' },
      { name: 'Triglycerides', value: 120, unit: 'mg/dL', referenceRange: { low: 0, high: 150 }, category: 'Lipid Panel' },
      // CMP
      { name: 'Glucose', value: 98, unit: 'mg/dL', referenceRange: { low: 70, high: 100 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'BUN', value: 15, unit: 'mg/dL', referenceRange: { low: 7, high: 20 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Creatinine', value: 0.95, unit: 'mg/dL', referenceRange: { low: 0.7, high: 1.3 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Sodium', value: 140, unit: 'mEq/L', referenceRange: { low: 136, high: 145 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Potassium', value: 4.2, unit: 'mEq/L', referenceRange: { low: 3.5, high: 5.1 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Calcium', value: 9.5, unit: 'mg/dL', referenceRange: { low: 8.5, high: 10.5 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'ALT', value: 28, unit: 'U/L', referenceRange: { low: 7, high: 56 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'AST', value: 22, unit: 'U/L', referenceRange: { low: 10, high: 40 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Total Protein', value: 7.0, unit: 'g/dL', referenceRange: { low: 6.0, high: 8.3 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Albumin', value: 4.2, unit: 'g/dL', referenceRange: { low: 3.5, high: 5.5 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Bilirubin, Total', value: 0.8, unit: 'mg/dL', referenceRange: { low: 0.1, high: 1.2 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Alkaline Phosphatase', value: 65, unit: 'U/L', referenceRange: { low: 44, high: 147 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'CO2', value: 24, unit: 'mEq/L', referenceRange: { low: 20, high: 29 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Chloride', value: 101, unit: 'mEq/L', referenceRange: { low: 98, high: 106 }, category: 'Comprehensive Metabolic Panel' },
      // CBC
      { name: 'WBC', value: 6.8, unit: 'K/uL', referenceRange: { low: 4.5, high: 11.0 }, category: 'Complete Blood Count' },
      { name: 'RBC', value: 4.9, unit: 'M/uL', referenceRange: { low: 4.5, high: 5.5 }, category: 'Complete Blood Count' },
      { name: 'Hemoglobin', value: 14.8, unit: 'g/dL', referenceRange: { low: 13.5, high: 17.5 }, category: 'Complete Blood Count' },
      { name: 'Hematocrit', value: 44, unit: '%', referenceRange: { low: 38, high: 50 }, category: 'Complete Blood Count' },
      { name: 'Platelets', value: 245, unit: 'K/uL', referenceRange: { low: 150, high: 400 }, category: 'Complete Blood Count' },
      { name: 'MCV', value: 89.8, unit: 'fL', referenceRange: { low: 80, high: 100 }, category: 'Complete Blood Count' },
      { name: 'MCH', value: 30.2, unit: 'pg', referenceRange: { low: 27, high: 33 }, category: 'Complete Blood Count' },
      { name: 'MCHC', value: 33.6, unit: 'g/dL', referenceRange: { low: 32, high: 36 }, category: 'Complete Blood Count' },
      { name: 'RDW', value: 13.1, unit: '%', referenceRange: { low: 11.5, high: 14.5 }, category: 'Complete Blood Count' },
      // Thyroid
      { name: 'TSH', value: 2.1, unit: 'mIU/L', referenceRange: { low: 0.4, high: 4.0 }, category: 'Thyroid' },
      // Vitamin D
      { name: '25-OH Vitamin D', value: 28, unit: 'ng/mL', referenceRange: { low: 30, high: 100 }, flag: 'low', category: 'Vitamins' },
      // A1C
      { name: 'HbA1c', value: 5.6, unit: '%', referenceRange: { low: 4.0, high: 5.7 }, category: 'Diabetes' },
    ],
  },
  // Draw 2 — 6 months ago (2025-07-15)
  {
    date: '2025-07-15',
    source: 'LabCorp',
    orderedBy: 'Dr. Chen',
    markers: [
      // Lipid Panel
      { name: 'Total Cholesterol', value: 232, unit: 'mg/dL', referenceRange: { low: 125, high: 200 }, flag: 'high', category: 'Lipid Panel' },
      { name: 'LDL Cholesterol', value: 155, unit: 'mg/dL', referenceRange: { low: 0, high: 100 }, flag: 'high', category: 'Lipid Panel' },
      { name: 'HDL Cholesterol', value: 48, unit: 'mg/dL', referenceRange: { low: 40, high: 60 }, category: 'Lipid Panel' },
      { name: 'Triglycerides', value: 145, unit: 'mg/dL', referenceRange: { low: 0, high: 150 }, category: 'Lipid Panel' },
      // CMP
      { name: 'Glucose', value: 96, unit: 'mg/dL', referenceRange: { low: 70, high: 100 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'BUN', value: 16, unit: 'mg/dL', referenceRange: { low: 7, high: 20 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Creatinine', value: 0.92, unit: 'mg/dL', referenceRange: { low: 0.7, high: 1.3 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Sodium', value: 141, unit: 'mEq/L', referenceRange: { low: 136, high: 145 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Potassium', value: 4.0, unit: 'mEq/L', referenceRange: { low: 3.5, high: 5.1 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Calcium', value: 9.3, unit: 'mg/dL', referenceRange: { low: 8.5, high: 10.5 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'ALT', value: 32, unit: 'U/L', referenceRange: { low: 7, high: 56 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'AST', value: 25, unit: 'U/L', referenceRange: { low: 10, high: 40 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Total Protein', value: 7.1, unit: 'g/dL', referenceRange: { low: 6.0, high: 8.3 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Albumin', value: 4.3, unit: 'g/dL', referenceRange: { low: 3.5, high: 5.5 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Alkaline Phosphatase', value: 70, unit: 'U/L', referenceRange: { low: 44, high: 147 }, category: 'Comprehensive Metabolic Panel' },
      // CBC
      { name: 'WBC', value: 7.1, unit: 'K/uL', referenceRange: { low: 4.5, high: 11.0 }, category: 'Complete Blood Count' },
      { name: 'RBC', value: 4.8, unit: 'M/uL', referenceRange: { low: 4.5, high: 5.5 }, category: 'Complete Blood Count' },
      { name: 'Hemoglobin', value: 14.5, unit: 'g/dL', referenceRange: { low: 13.5, high: 17.5 }, category: 'Complete Blood Count' },
      { name: 'Hematocrit', value: 43, unit: '%', referenceRange: { low: 38, high: 50 }, category: 'Complete Blood Count' },
      { name: 'Platelets', value: 238, unit: 'K/uL', referenceRange: { low: 150, high: 400 }, category: 'Complete Blood Count' },
      // Thyroid
      { name: 'TSH', value: 2.4, unit: 'mIU/L', referenceRange: { low: 0.4, high: 4.0 }, category: 'Thyroid' },
      // Vitamin D
      { name: '25-OH Vitamin D', value: 22, unit: 'ng/mL', referenceRange: { low: 30, high: 100 }, flag: 'low', category: 'Vitamins' },
      // A1C
      { name: 'HbA1c', value: 5.5, unit: '%', referenceRange: { low: 4.0, high: 5.7 }, category: 'Diabetes' },
      // hsCRP (cardiac workup)
      { name: 'hs-CRP', value: 1.8, unit: 'mg/L', referenceRange: { low: 0, high: 3.0 }, category: 'Cardiac' },
      // BNP
      { name: 'BNP', value: 35, unit: 'pg/mL', referenceRange: { low: 0, high: 100 }, category: 'Cardiac' },
    ],
  },
  // Draw 3 — 1 year ago (2025-01-20)
  {
    date: '2025-01-20',
    source: 'Quest Diagnostics',
    orderedBy: 'Dr. Vasquez',
    markers: [
      // Lipid Panel
      { name: 'Total Cholesterol', value: 225, unit: 'mg/dL', referenceRange: { low: 125, high: 200 }, flag: 'high', category: 'Lipid Panel' },
      { name: 'LDL Cholesterol', value: 148, unit: 'mg/dL', referenceRange: { low: 0, high: 100 }, flag: 'high', category: 'Lipid Panel' },
      { name: 'HDL Cholesterol', value: 46, unit: 'mg/dL', referenceRange: { low: 40, high: 60 }, category: 'Lipid Panel' },
      { name: 'Triglycerides', value: 155, unit: 'mg/dL', referenceRange: { low: 0, high: 150 }, flag: 'high', category: 'Lipid Panel' },
      // CMP
      { name: 'Glucose', value: 102, unit: 'mg/dL', referenceRange: { low: 70, high: 100 }, flag: 'high', category: 'Comprehensive Metabolic Panel' },
      { name: 'BUN', value: 14, unit: 'mg/dL', referenceRange: { low: 7, high: 20 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Creatinine', value: 0.98, unit: 'mg/dL', referenceRange: { low: 0.7, high: 1.3 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Sodium', value: 139, unit: 'mEq/L', referenceRange: { low: 136, high: 145 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Potassium', value: 4.4, unit: 'mEq/L', referenceRange: { low: 3.5, high: 5.1 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'Calcium', value: 9.6, unit: 'mg/dL', referenceRange: { low: 8.5, high: 10.5 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'ALT', value: 35, unit: 'U/L', referenceRange: { low: 7, high: 56 }, category: 'Comprehensive Metabolic Panel' },
      { name: 'AST', value: 28, unit: 'U/L', referenceRange: { low: 10, high: 40 }, category: 'Comprehensive Metabolic Panel' },
      // CBC
      { name: 'WBC', value: 7.5, unit: 'K/uL', referenceRange: { low: 4.5, high: 11.0 }, category: 'Complete Blood Count' },
      { name: 'RBC', value: 5.0, unit: 'M/uL', referenceRange: { low: 4.5, high: 5.5 }, category: 'Complete Blood Count' },
      { name: 'Hemoglobin', value: 15.1, unit: 'g/dL', referenceRange: { low: 13.5, high: 17.5 }, category: 'Complete Blood Count' },
      { name: 'Hematocrit', value: 45, unit: '%', referenceRange: { low: 38, high: 50 }, category: 'Complete Blood Count' },
      { name: 'Platelets', value: 252, unit: 'K/uL', referenceRange: { low: 150, high: 400 }, category: 'Complete Blood Count' },
      // Thyroid
      { name: 'TSH', value: 2.3, unit: 'mIU/L', referenceRange: { low: 0.4, high: 4.0 }, category: 'Thyroid' },
      // Vitamin D
      { name: '25-OH Vitamin D', value: 19, unit: 'ng/mL', referenceRange: { low: 30, high: 100 }, flag: 'low', category: 'Vitamins' },
      // A1C
      { name: 'HbA1c', value: 5.8, unit: '%', referenceRange: { low: 4.0, high: 5.7 }, flag: 'high', category: 'Diabetes' },
    ],
  },
];

/* ── Alerts ───────────────────────────────────────────────────────── */

export const fakeAlerts: Alert[] = [
  {
    id: 'fake-alert-1',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
    category: 'lab_out_of_range',
    severity: 'warning',
    status: 'active',
    title: 'LDL Cholesterol Elevated',
    message: 'LDL cholesterol at 142 mg/dL, above the optimal range of <100 mg/dL. Consider discussing statin therapy with Dr. Chen at your next cardiology visit. Dietary modifications and increased exercise may also help.',
    relatedProviders: ['Dr. Marcus Chen'],
    relatedMedications: [],
    actionItems: ['Schedule follow-up with cardiologist', 'Review dietary habits', 'Recheck lipid panel in 3 months'],
  },
  {
    id: 'fake-alert-2',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-12T08:00:00Z',
    category: 'lab_out_of_range',
    severity: 'info',
    status: 'active',
    title: 'Vitamin D Below Optimal',
    message: '25-OH Vitamin D at 28 ng/mL is just below the reference range (30–100). Current supplementation with 2000 IU daily may need a bump to 4000 IU. Recheck in 3 months.',
    relatedProviders: ['Dr. Elena Vasquez'],
    relatedMedications: [],
    actionItems: ['Consider increasing Vitamin D3 dose', 'Recheck 25-OH Vitamin D in 3 months'],
  },
  {
    id: 'fake-alert-3',
    createdAt: '2025-09-20T14:00:00Z',
    updatedAt: '2025-09-20T14:00:00Z',
    category: 'genetic_safety',
    severity: 'critical',
    status: 'active',
    title: 'CYP2D6 Intermediate Metabolizer',
    message: 'Pharmacogenomic testing shows CYP2D6 *1/*4 — intermediate metabolizer status. Use caution with codeine (reduced efficacy) and tramadol. Share this result with any new prescriber.',
    relatedProviders: ['Dr. Elena Vasquez'],
    relatedMedications: [],
    actionItems: ['Inform all prescribers of CYP2D6 status', 'Avoid codeine-based pain medications', 'Carry pharmacogenomic card'],
  },
  {
    id: 'fake-alert-4',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
    category: 'lab_trend',
    severity: 'warning',
    status: 'active',
    title: 'HbA1c Trending Down — Lifestyle Changes Working',
    message: 'HbA1c improved from 5.8% (Jan 2025) to 5.6% (Jan 2026), moving out of the pre-diabetes range. Continue current dietary and exercise regimen. Recheck annually.',
    relatedProviders: ['Dr. Elena Vasquez'],
    relatedMedications: [],
    actionItems: ['Continue lifestyle modifications', 'Annual HbA1c recheck'],
  },
];

/* ── Genetics ────────────────────────────────────────────────────── */

export const fakeGenetics: GeneticsPanel = {
  enzymes: [
    { gene: 'CYP2D6', variant: '*1/*4', metabolizerStatus: 'Intermediate Metabolizer', phenotype: 'Intermediate Metabolizer', implications: 'May need dose adjustments for some medications metabolized by CYP2D6' },
    { gene: 'CYP2C19', variant: '*1/*1', metabolizerStatus: 'Normal Metabolizer', phenotype: 'Extensive Metabolizer', implications: 'Standard dosing expected for CYP2C19 substrates' },
    { gene: 'CYP3A4', variant: '*1/*1', metabolizerStatus: 'Normal Metabolizer', phenotype: 'Normal Metabolizer', implications: 'No dose adjustments needed' },
  ],
  hlaTypes: [
    { gene: 'HLA-B', marker: 'HLA-B*57:01', result: 'Negative', risk: 'Low risk for abacavir hypersensitivity' },
  ],
  actionableFlags: ['CYP2D6 Intermediate Metabolizer — use caution with codeine, tramadol'],
  updatedAt: '2025-09-15T10:00:00Z',
};

/* ── Interactions ────────────────────────────────────────────────── */

export const fakeInteractions: Interaction[] = [
  { drugA: 'Lisinopril', drugB: 'Montelukast', severity: 'low', description: 'No significant interaction expected', recommendation: 'Safe to use together' },
  { drugA: 'Omeprazole', drugB: 'Magnesium Glycinate', severity: 'moderate', description: 'Long-term PPI use may affect magnesium absorption', recommendation: 'Monitor magnesium levels periodically' },
];

/* ── Immunizations ───────────────────────────────────────────────── */

export const fakeImmunizations: Immunization[] = [
  { vaccine: 'COVID-19 Pfizer Bivalent', date: '2025-10-15', provider: 'CVS Pharmacy', notes: 'Updated booster' },
  { vaccine: 'Influenza', date: '2025-09-20', provider: 'Riverside Medical Group' },
  { vaccine: 'Tdap', date: '2023-04-10', provider: 'Dr. Elena Vasquez' },
];

/* ── Records ─────────────────────────────────────────────────────── */

export const fakeRecords: MedicalRecord[] = [
  { id: 'fake-rec-1', filename: 'annual_physical_2026.pdf', documentType: 'clinical_note', source: 'Riverside Medical', uploadedAt: '2026-01-20T10:00:00Z', status: 'complete', description: 'Annual physical examination', dateRange: { start: '2026-01-15', end: '2026-01-15' }, recordCount: 1 },
  { id: 'fake-rec-2', filename: 'lipid_panel_jan2026.pdf', documentType: 'lab_report', source: 'Quest Diagnostics', uploadedAt: '2026-01-18T10:00:00Z', status: 'complete', description: 'Comprehensive lipid panel', dateRange: { start: '2026-01-10', end: '2026-01-10' }, recordCount: 8 },
  { id: 'fake-rec-3', filename: 'echo_report.pdf', documentType: 'imaging', source: 'Metro Heart Center', uploadedAt: '2025-11-22T10:00:00Z', status: 'complete', description: 'Echocardiogram — normal LV function', dateRange: { start: '2025-11-20', end: '2025-11-20' }, recordCount: 1 },
  { id: 'fake-rec-4', filename: 'pharmacogenomics_panel.pdf', documentType: 'genetic_report', source: 'GeneSight', uploadedAt: '2025-09-20T10:00:00Z', status: 'complete', description: 'Pharmacogenomic panel — CYP2D6, CYP2C19, CYP3A4', dateRange: { start: '2025-09-15', end: '2025-09-15' }, recordCount: 12 },
  { id: 'fake-rec-5', filename: 'allergy_testing.pdf', documentType: 'clinical_note', source: 'Allergy Associates', uploadedAt: '2025-10-10T10:00:00Z', status: 'complete', description: 'Skin prick allergy panel results', dateRange: { start: '2025-10-08', end: '2025-10-08' }, recordCount: 1 },
];

/* ── Derived helpers for components that fetch data ───────────────── */

/** Fake "latest-all" response shape for LabsCard / LabsPage */
export function fakeLatestMarkers() {
  // Build a map of latest value per marker name (most recent draw first)
  const sorted = [...fakeLabs].sort((a, b) => b.date.localeCompare(a.date));
  const latest = new Map<string, {
    name: string; value: number | string; unit: string;
    referenceRange?: { low?: number; high?: number; text?: string } | null;
    range?: string; flag?: 'high' | 'low' | 'critical'; category?: string;
    date: string; source: string; historyCount: number;
  }>();

  for (const draw of sorted) {
    for (const m of draw.markers) {
      if (!latest.has(m.name)) {
        latest.set(m.name, { ...m, date: draw.date, source: draw.source, historyCount: 0 });
      }
      const entry = latest.get(m.name)!;
      entry.historyCount++;
    }
  }

  return {
    markers: Array.from(latest.values()),
    drawCount: fakeLabs.length,
  };
}

// ── Fake Symptoms Timeline ──────────────────────────────────────────────
import type { SymptomEntry } from '@/lib/symptoms-data';

export const fakeSymptomsTimeline: SymptomEntry[] = [
  {
    id: 'fake-bp-2024',
    date: '2024-03',
    label: 'Elevated blood pressure readings',
    description: 'Consistently elevated readings at home (140/88 average). No symptoms but flagged at annual physical.',
    severity: 5,
    duration: 'Several months',
    triggers: ['Stress', 'High sodium diet', 'Poor sleep'],
    tags: ['Cardiac', 'Primary Care'],
    outcome: 'Lisinopril 10mg started — BP normalized within 4 weeks',
  },
  {
    id: 'fake-gerd-2024',
    date: '2024-06',
    label: 'Acid reflux episodes',
    description: 'Frequent heartburn and regurgitation, worse after meals and when lying down. Affecting sleep quality.',
    severity: 6,
    duration: '2+ months',
    triggers: ['Spicy food', 'Large meals', 'Coffee', 'Lying flat after eating'],
    tags: ['GI', 'Primary Care'],
    outcome: 'Omeprazole 20mg daily — symptoms resolved within 2 weeks',
  },
  {
    id: 'fake-allergy-spring-2025',
    date: '2025-03',
    label: 'Severe spring allergy flare',
    description: 'Intense nasal congestion, itchy/watery eyes, sneezing fits. Worst season in years — cedar and oak pollen.',
    severity: 7,
    duration: '6 weeks',
    triggers: ['Cedar pollen', 'Oak pollen', 'Outdoor exercise'],
    tags: ['Allergy', 'ENT'],
    outcome: 'Added Montelukast to Cetirizine — moderate improvement',
  },
  {
    id: 'fake-prednisone-2025',
    date: '2025-06',
    label: 'Allergic reaction — prednisone taper',
    description: 'Severe allergic flare with facial swelling and hives after suspected latex exposure at dentist office.',
    severity: 8,
    duration: '2 weeks',
    triggers: ['Latex exposure', 'Dental procedure'],
    tags: ['Allergy', 'Emergency'],
    outcome: 'Prednisone 20mg taper over 14 days — full resolution',
  },
  {
    id: 'fake-sinus-2025',
    date: '2025-11',
    label: 'Sinus infection',
    description: 'Post-nasal drip progressed to sinus pressure, green discharge, and low-grade fever. Likely bacterial.',
    severity: 5,
    duration: '10 days',
    triggers: ['Fall allergies', 'URI'],
    tags: ['ENT', 'Primary Care'],
    outcome: 'Amoxicillin 500mg × 10 days — cleared',
  },
  {
    id: 'fake-cholesterol-2025',
    date: '2025-07',
    label: 'Elevated LDL cholesterol',
    description: 'LDL at 155 mg/dL on routine labs. Cardiology referral for assessment. Echo normal, no structural concerns.',
    severity: 4,
    duration: 'Ongoing',
    triggers: ['Diet', 'Genetics'],
    tags: ['Cardiac', 'Labs', 'Metabolic'],
    outcome: 'Lifestyle modifications — diet changes + fish oil, recheck in 6 months',
  },
  {
    id: 'fake-vitd-2025',
    date: '2025-01',
    label: 'Vitamin D insufficiency',
    description: 'Level at 19 ng/mL on annual labs. Fatigue and mild joint stiffness as associated symptoms.',
    severity: 4,
    duration: 'Chronic',
    triggers: ['Indoor lifestyle', 'Northern latitude winters'],
    tags: ['Labs', 'Primary Care'],
    outcome: 'Vitamin D3 2000 IU daily — improved to 28 at last check',
  },
  {
    id: 'fake-sleep-2026',
    date: '2026-01',
    label: 'Sleep quality decline',
    description: 'Waking 2-3x per night, difficulty returning to sleep. Possibly related to GERD positioning or stress.',
    severity: 5,
    duration: '3+ weeks',
    triggers: ['Work stress', 'Late meals', 'Screen time'],
    tags: ['Sleep', 'GI'],
    outcome: 'Magnesium glycinate before bed + sleep hygiene changes — improving',
  },
];
