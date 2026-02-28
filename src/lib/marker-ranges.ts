/**
 * Resolve numeric reference ranges for lab markers.
 * Priority: marker.referenceRange → parsed marker.range text → static fallback.
 */

/** Static fallback ranges for common markers (male adult) */
const staticRanges: Record<string, { low?: number; high?: number }> = {
  'Apolipoprotein B': { high: 90 },
  'ApoB': { high: 90 },
  'Apo B': { high: 90 },
  'hs-CRP': { low: 0, high: 3 },
  'hsCRP': { low: 0, high: 3 },
  'CRP': { low: 0, high: 3 },
  'Lipoprotein (a)': { high: 75 },
  'Lp(a)': { high: 75 },
  'Total Cholesterol': { low: 100, high: 199 },
  'Vitamin D, 25-OH Total': { low: 30, high: 100 },
  'Vitamin D, 25-OH': { low: 30, high: 100 },
  'Vitamin D, 25-Hydroxy': { low: 30, high: 100 },
  'Vitamin D': { low: 30, high: 100 },
  'LDL Medium': { high: 215 },
  'LDL Particle Number': { high: 1138 },
  'LDL Small': { high: 142 },
  'LP-PLA2 Activity': { high: 124 },
  'Non-HDL Cholesterol': { high: 130 },
  'HDL Large': { low: 6729 },
  'Hematocrit': { low: 38.5, high: 50 },
  'Hemoglobin': { low: 13.2, high: 17.1 },
  'Platelet Count': { low: 140, high: 400 },
  'Platelets': { low: 140, high: 400 },
  'Testosterone, Free': { low: 46, high: 224 },
  'Testosterone, Total': { low: 264, high: 916 },
  'Testosterone, Bioavailable': { low: 110, high: 575 },
  'WBC': { low: 3.8, high: 10.8 },
  'RBC': { low: 4.2, high: 5.8 },
  'MCV': { low: 80, high: 100 },
  'MCH': { low: 27, high: 33 },
  'MCHC': { low: 32, high: 36 },
  'RDW': { low: 11.5, high: 14.5 },
  'HDL Cholesterol': { low: 40, high: 100 },
  'LDL Cholesterol': { low: 0, high: 100 },
  'Triglycerides': { low: 0, high: 150 },
  'Glucose': { low: 65, high: 99 },
  'HbA1c': { low: 4, high: 5.6 },
  'Hemoglobin A1c': { low: 4, high: 5.6 },
  'Insulin': { low: 2.6, high: 24.9 },
  'Insulin, Fasting': { low: 2.6, high: 24.9 },
  'HOMA-IR': { low: 0, high: 1.0 },
  'ALT': { low: 7, high: 56 },
  'AST': { low: 10, high: 40 },
  'ALP': { low: 44, high: 147 },
  'Alkaline Phosphatase': { low: 44, high: 147 },
  'GGT': { low: 9, high: 48 },
  'Bilirubin, Total': { low: 0.1, high: 1.2 },
  'Total Bilirubin': { low: 0.1, high: 1.2 },
  'Albumin': { low: 3.5, high: 5.5 },
  'Total Protein': { low: 6, high: 8.3 },
  'Creatinine': { low: 0.7, high: 1.3 },
  'BUN': { low: 6, high: 20 },
  'eGFR': { low: 90 },
  'eGFR (Cystatin C)': { low: 90 },
  'Uric Acid': { low: 3.5, high: 7.2 },
  'Sodium': { low: 136, high: 145 },
  'Potassium': { low: 3.5, high: 5.0 },
  'Chloride': { low: 98, high: 106 },
  'CO2': { low: 23, high: 29 },
  'Calcium': { low: 8.6, high: 10.3 },
  'Magnesium': { low: 1.7, high: 2.2 },
  'Phosphorus': { low: 2.5, high: 4.5 },
  'Iron': { low: 60, high: 170 },
  'Iron Saturation': { low: 20, high: 50 },
  'TIBC': { low: 250, high: 370 },
  'Ferritin': { low: 20, high: 250 },
  'Vitamin B12': { low: 232, high: 1245 },
  'Folate': { low: 2.7, high: 17 },
  'Zinc': { low: 60, high: 130 },
  'TSH': { low: 0.45, high: 4.5 },
  'Free T4': { low: 0.82, high: 1.77 },
  'Free T3': { low: 2, high: 4.4 },
  'SHBG': { low: 16.5, high: 55.9 },
  'DHEA-Sulfate': { low: 138, high: 475 },
  'Estradiol': { low: 7.6, high: 42.6 },
  'FSH': { low: 1.5, high: 12.4 },
  'LH': { low: 1.7, high: 8.6 },
  'Prolactin': { low: 4, high: 15.2 },
  'Cortisol': { low: 6.2, high: 19.4 },
  'IGF-1': { low: 98, high: 282 },
  'PSA': { high: 4 },
  'PSA, Total': { high: 4 },
  'Homocysteine': { low: 5, high: 15 },
  'ESR': { low: 0, high: 15 },
  'C-Peptide': { low: 1.1, high: 4.4 },
  'Creatine Kinase': { low: 39, high: 308 },
  'FIB-4 Index': { high: 1.3 },
  'Mercury, Blood': { high: 5 },
  'Cystatin C': { low: 0.62, high: 1.11 },
  'LDL Peak Size': { low: 220.8 },
  'Insulin Resistance Score': { high: 45 },
};

/**
 * Parse a range text string like "100-199", "<90", ">30", "0.00-3.00" into numeric low/high.
 */
export function parseRangeText(text: string): { low?: number; high?: number } | null {
  if (!text) return null;
  const t = text.trim();

  // "X-Y" or "X–Y"
  const dashMatch = t.match(/^([\d.]+)\s*[-–]\s*([\d.]+)$/);
  if (dashMatch) {
    return { low: parseFloat(dashMatch[1]), high: parseFloat(dashMatch[2]) };
  }

  // "<X" or "<=X"
  const ltMatch = t.match(/^[<≤]\s*=?\s*([\d.]+)$/);
  if (ltMatch) {
    return { high: parseFloat(ltMatch[1]) };
  }

  // ">X" or ">=X"
  const gtMatch = t.match(/^[>≥]\s*=?\s*([\d.]+)$/);
  if (gtMatch) {
    return { low: parseFloat(gtMatch[1]) };
  }

  return null;
}

/**
 * Resolve reference range for a marker. Returns { low?, high? } or null.
 */
export function resolveRange(
  name: string,
  referenceRange?: { low?: number; high?: number; text?: string } | null,
  rangeText?: string,
): { low?: number; high?: number } | null {
  // 1. Numeric referenceRange
  if (referenceRange && (referenceRange.low != null || referenceRange.high != null)) {
    return { low: referenceRange.low ?? undefined, high: referenceRange.high ?? undefined };
  }

  // 2. Parse referenceRange.text
  if (referenceRange?.text) {
    const parsed = parseRangeText(referenceRange.text);
    if (parsed) return parsed;
  }

  // 3. Parse range string
  if (rangeText) {
    const parsed = parseRangeText(rangeText);
    if (parsed) return parsed;
  }

  // 4. Static fallback
  if (staticRanges[name]) return staticRanges[name];

  // Case-insensitive fallback
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(staticRanges)) {
    if (key.toLowerCase() === lower) return val;
  }

  return null;
}
