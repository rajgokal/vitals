/**
 * Plain-English explanations for common lab markers.
 * Static map — no API calls needed.
 */
export const markerExplanations: Record<string, string> = {
  // Hormones
  'Testosterone, Total': 'Primary male sex hormone. Affects muscle mass, bone density, libido, and energy levels.',
  'Testosterone, Free': 'The unbound, active form of testosterone your body can actually use.',
  'Testosterone, Bioavailable': 'Testosterone available for tissue uptake — free plus loosely albumin-bound.',
  'Estradiol': 'Primary estrogen. In men, elevated levels can cause water retention and gynecomastia.',
  'SHBG': 'Sex hormone-binding globulin — binds testosterone and estradiol, reducing their availability.',
  'DHEA-Sulfate': 'Adrenal hormone precursor to testosterone and estrogen. Marker of adrenal function.',
  'FSH': 'Follicle-stimulating hormone. Signals the testes to produce sperm.',
  'LH': 'Luteinizing hormone. Signals the testes to produce testosterone.',
  'Prolactin': 'Pituitary hormone. Elevated levels can suppress testosterone and libido.',
  'Cortisol': 'Primary stress hormone. Chronic elevation leads to muscle wasting and fat gain.',
  'IGF-1': 'Insulin-like growth factor. Reflects growth hormone activity in the body.',
  'TSH': 'Thyroid-stimulating hormone. High = underactive thyroid, low = overactive.',
  'Free T4': 'Active thyroid hormone that regulates metabolism and energy.',
  'Free T3': 'Most potent thyroid hormone. Drives cellular metabolism.',
  'T4 (Thyroxine)': 'Main thyroid hormone. Converted to active T3 in tissues.',
  'T3 (Triiodothyronine)': 'Active thyroid hormone. Low levels cause fatigue and weight gain.',
  'Progesterone': 'Hormone involved in sleep quality and neuroprotection in men.',

  // Metabolic
  'Glucose': 'Blood sugar level. Fasting values above 100 suggest insulin resistance.',
  'Hemoglobin A1c': 'Average blood sugar over ~3 months. Below 5.7% is normal.',
  'HbA1c': 'Average blood sugar over ~3 months. Below 5.7% is normal.',
  'Insulin': 'Hormone that moves glucose into cells. High fasting insulin = early diabetes signal.',
  'Insulin, Fasting': 'Hormone that moves glucose into cells. High fasting insulin = early diabetes signal.',
  'HOMA-IR': 'Insulin resistance score. Below 1.0 is optimal; above 2.0 is concerning.',

  // Lipids
  'Total Cholesterol': 'Sum of all cholesterol. Less useful than LDL/HDL breakdown.',
  'LDL Cholesterol': 'The "bad" cholesterol that builds arterial plaque. Lower is better for heart health.',
  'LDL-C': 'The "bad" cholesterol that builds arterial plaque. Lower is better for heart health.',
  'HDL Cholesterol': 'The "good" cholesterol. Removes LDL from arteries. Higher is better.',
  'HDL-C': 'The "good" cholesterol. Removes LDL from arteries. Higher is better.',
  'Triglycerides': 'Blood fats from food. Elevated = metabolic syndrome risk. Fasting value matters.',
  'VLDL Cholesterol': 'Carries triglycerides. Elevated levels correlate with heart disease.',
  'Non-HDL Cholesterol': 'Total cholesterol minus HDL. Better predictor of heart risk than LDL alone.',
  'Lp(a)': 'Lipoprotein(a) — genetic risk factor for heart disease. Largely unmodifiable.',
  'ApoB': 'Apolipoprotein B — one per atherogenic particle. Best single marker for cardiovascular risk.',
  'Apo B': 'Apolipoprotein B — one per atherogenic particle. Best single marker for cardiovascular risk.',
  'Apolipoprotein B': 'One per atherogenic particle. Best single marker for cardiovascular risk.',

  // Inflammation
  'hs-CRP': 'High-sensitivity C-reactive protein. Marker of systemic inflammation and cardiac risk.',
  'CRP': 'C-reactive protein. General inflammation marker — elevated in infection or chronic disease.',
  'ESR': 'Erythrocyte sedimentation rate. Nonspecific inflammation marker.',
  'Homocysteine': 'Amino acid linked to cardiovascular risk when elevated. B vitamins help lower it.',
  'Ferritin': 'Iron storage protein. Also an inflammation marker — elevated in chronic disease.',
  'Fibrinogen': 'Clotting protein. Elevated levels indicate inflammation or clotting risk.',

  // Blood Count
  'WBC': 'White blood cells. Your immune army. High = infection/inflammation, low = immune suppression.',
  'RBC': 'Red blood cells. Carry oxygen. Low = anemia, high = dehydration or polycythemia.',
  'Hemoglobin': 'Oxygen-carrying protein in red blood cells. Low = anemia.',
  'Hematocrit': 'Percentage of blood that is red blood cells. TRT can elevate this — monitor closely.',
  'MCV': 'Mean corpuscular volume — red blood cell size. High = B12/folate deficiency, low = iron deficiency.',
  'MCH': 'Mean corpuscular hemoglobin. Amount of hemoglobin per red blood cell.',
  'MCHC': 'Mean corpuscular hemoglobin concentration. Hemoglobin density in red blood cells.',
  'RDW': 'Red cell distribution width. High variation suggests mixed nutritional deficiencies.',
  'Platelets': 'Blood clotting cells. Low = bleeding risk, high = clotting risk.',
  'MPV': 'Mean platelet volume. Larger platelets are more active in clotting.',
  'Neutrophils': 'Most abundant white blood cell. First responders to bacterial infection.',
  'Lymphocytes': 'White blood cells that fight viral infections and produce antibodies.',
  'Monocytes': 'White blood cells that become macrophages — clean up dead cells and pathogens.',
  'Eosinophils': 'White blood cells involved in allergic responses and parasitic infections.',
  'Basophils': 'Rarest white blood cell. Involved in allergic and inflammatory reactions.',

  // Liver
  'ALT': 'Alanine aminotransferase. Liver enzyme — elevated = liver stress (meds, alcohol, NAFLD).',
  'AST': 'Aspartate aminotransferase. Liver/muscle enzyme. Elevated after heavy exercise or liver damage.',
  'ALP': 'Alkaline phosphatase. Elevated in liver or bone disease.',
  'GGT': 'Gamma-glutamyl transferase. Sensitive liver marker — elevated by alcohol and certain meds.',
  'Bilirubin, Total': 'Breakdown product of red blood cells. Mildly elevated = Gilbert syndrome (benign).',
  'Bilirubin, Direct': 'Conjugated bilirubin processed by the liver. Elevated in bile duct issues.',
  'Albumin': 'Major blood protein made by the liver. Low = liver disease or malnutrition.',
  'Total Protein': 'Albumin + globulins. General marker of liver and immune function.',

  // Kidney
  'Creatinine': 'Muscle metabolism waste product filtered by kidneys. High = impaired kidney function.',
  'BUN': 'Blood urea nitrogen. Kidney filtration marker. Elevated by high protein intake or dehydration.',
  'eGFR': 'Estimated glomerular filtration rate. Kidney efficiency score. Above 90 is normal.',
  'BUN/Creatinine Ratio': 'Helps distinguish dehydration from kidney disease.',
  'Uric Acid': 'Purine breakdown product. High levels cause gout and kidney stones.',
  'Cystatin C': 'More precise kidney function marker than creatinine, not affected by muscle mass.',

  // Electrolytes & Minerals
  'Sodium': 'Key electrolyte for fluid balance and nerve function.',
  'Potassium': 'Critical for heart rhythm and muscle function. Both high and low are dangerous.',
  'Chloride': 'Electrolyte that maintains fluid balance and acid-base status.',
  'CO2': 'Carbon dioxide / bicarbonate. Reflects acid-base balance in the blood.',
  'Calcium': 'Essential for bones, muscles, and nerve signaling. Tightly regulated.',
  'Magnesium': 'Involved in 300+ enzyme reactions. Deficiency causes cramps, anxiety, and arrhythmias.',
  'Phosphorus': 'Works with calcium for bone health. Also critical for energy production (ATP).',
  'Iron': 'Essential for oxygen transport. Low = fatigue, high = organ damage risk.',
  'TIBC': 'Total iron-binding capacity. High when iron stores are low (iron deficiency).',
  'Iron Saturation': 'Percentage of transferrin carrying iron. Low = deficiency, high = overload.',

  // Vitamins
  'Vitamin D, 25-Hydroxy': 'The main circulating form of vitamin D. Below 30 is insufficient; aim for 40-60.',
  'Vitamin D': 'The main circulating form of vitamin D. Below 30 is insufficient; aim for 40-60.',
  'Vitamin B12': 'Essential for nerve function and red blood cell production. Deficiency causes fatigue and neuropathy.',
  'Folate': 'B vitamin critical for DNA synthesis and red blood cell production.',
  'Zinc': 'Essential mineral for testosterone production, immunity, and wound healing.',

  // Cardiac
  'NT-proBNP': 'Heart failure marker. Rises when the heart is under strain.',
  'BNP': 'Brain natriuretic peptide. Elevated in heart failure or cardiac stress.',
  'Troponin': 'Heart muscle damage marker. Any elevation warrants immediate attention.',

  // PSA
  'PSA': 'Prostate-specific antigen. Screening marker for prostate health. Context-dependent.',
  'PSA, Total': 'Prostate-specific antigen. Screening marker for prostate health. Context-dependent.',

  // Advanced Lipids
  'LDL Particle Number': 'Total count of LDL particles. Better predictor of heart risk than LDL-C alone.',
  'LDL Small': 'Small dense LDL particles — more atherogenic and damaging to artery walls.',
  'LDL Medium': 'Medium-sized LDL particles. Moderate atherogenic potential.',
  'LDL Peak Size': 'Predominant LDL particle size. Larger is better; small dense pattern = higher risk.',
  'LDL Pattern': 'Pattern A (large buoyant) is favorable; Pattern B (small dense) carries higher risk.',
  'HDL Large': 'Large HDL particles — the most protective subfraction for reverse cholesterol transport.',
  'LP-PLA2 Activity': 'Lipoprotein-associated phospholipase A2. Marker of vascular inflammation and plaque instability.',
  'Lipoprotein (a)': 'Genetic risk factor for heart disease. Largely unmodifiable by lifestyle.',

  // Metabolic (additional)
  'C-Peptide': 'Byproduct of insulin production. Measures how much insulin your pancreas actually makes.',
  'Insulin Resistance Score': 'Calculated score estimating insulin sensitivity. Lower is better.',
  'Creatine Kinase': 'Muscle enzyme. Elevated after intense exercise or with muscle damage.',
  'FIB-4 Index': 'Calculated liver fibrosis score using age, AST, ALT, and platelets. Below 1.3 is low risk.',

  // Alternate names / aliases
  'Alkaline Phosphatase': 'Elevated in liver or bone disease. Also rises during growth or healing.',
  'Total Bilirubin': 'Breakdown product of red blood cells. Mildly elevated = Gilbert syndrome (benign).',
  'Platelet Count': 'Blood clotting cells. Low = bleeding risk, high = clotting risk.',
  'Vitamin D, 25-OH': 'The main circulating form of vitamin D. Below 30 is insufficient; aim for 40-60.',
  'Vitamin D, 25-OH Total': 'Combined D2 + D3. Below 30 is insufficient; optimal range is 40-60.',
  'Mercury, Blood': 'Heavy metal from fish and environmental exposure. Elevated levels cause neurological symptoms.',
  'Free T': 'Free testosterone — the unbound, biologically active form.',
  'hsCRP': 'High-sensitivity C-reactive protein. Marker of systemic inflammation and cardiac risk.',
  'eGFR (Cystatin C)': 'Kidney filtration rate based on cystatin C — more accurate than creatinine-based eGFR.',
};

/**
 * Get explanation for a marker name (case-insensitive fuzzy match).
 */
export function getMarkerExplanation(name: string): string | null {
  // Exact match first
  if (markerExplanations[name]) return markerExplanations[name];

  // Case-insensitive match
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(markerExplanations)) {
    if (key.toLowerCase() === lower) return val;
  }

  // Partial match (marker name contains the key or vice versa)
  for (const [key, val] of Object.entries(markerExplanations)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return val;
    }
  }

  return null;
}
