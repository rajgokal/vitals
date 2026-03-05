const DRUG_CLASS_MAP: Record<string, string> = {
  'atorvastatin': 'Statin',
  'rosuvastatin': 'Statin',
  'simvastatin': 'Statin',
  'metformin': 'Biguanide',
  'lisinopril': 'ACE Inhibitor',
  'enalapril': 'ACE Inhibitor',
  'losartan': 'ARB',
  'valsartan': 'ARB',
  'omeprazole': 'PPI',
  'pantoprazole': 'PPI',
  'levothyroxine': 'Thyroid Hormone',
  'sertraline': 'SSRI',
  'escitalopram': 'SSRI',
  'fluoxetine': 'SSRI',
  'adderall': 'Stimulant',
  'vyvanse': 'Stimulant',
  'ritalin': 'Stimulant',
  'testosterone': 'Hormone',
  'finasteride': '5-alpha Reductase Inhibitor',
  'dutasteride': '5-alpha Reductase Inhibitor',
};

/** "Raj Gokal" → "R.G." */
export function anonymizeName(name: string): string {
  if (!name) return '';
  return name
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase() + '.')
    .join('');
}

/** 37 → "35–40" */
export function anonymizeAge(age: number): string {
  const lower = Math.floor(age / 5) * 5;
  return `${lower}–${lower + 5}`;
}

/** "Atorvastatin 20mg" → "Statin" */
export function anonymizeDrugName(name: string): string {
  const firstWord = name.split(/[\s\d]/)[0].toLowerCase();
  return DRUG_CLASS_MAP[firstWord] ?? 'Medication';
}

/** Provider name → specialty/role fallback */
export function anonymizeProviderName(provider: { specialty?: string; role?: string }): string {
  return provider.role || provider.specialty || 'Provider';
}

/** Replace provider/med names in alert text */
export function anonymizeAlertText(
  text: string,
  providers?: string[],
  medications?: string[],
): string {
  let result = text;

  if (providers) {
    for (const name of providers) {
      if (name) result = result.replaceAll(name, 'Provider');
    }
  }

  if (medications) {
    for (const med of medications) {
      if (med) {
        const drugClass = anonymizeDrugName(med);
        result = result.replaceAll(med, drugClass);
      }
    }
  }

  return result;
}

/** "lab_report" → "Lab Report" */
export function anonymizeFilename(documentType: string): string {
  return documentType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
