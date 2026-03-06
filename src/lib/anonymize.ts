/**
 * @deprecated — Privacy mode now uses complete fake persona swap.
 * See src/lib/fake-persona.ts instead.
 * This file is kept as a stub to prevent import errors from any straggling references.
 */

export function anonymizeName(name: string): string { return name; }
export function anonymizeAge(age: number): string { return `${age}`; }
export function anonymizeDrugName(name: string): string { return name; }
export function anonymizeProviderName(provider: { specialty?: string; role?: string; name?: string }): string { return provider.name ?? 'Provider'; }
export function anonymizeAlertText(text: string): string { return text; }
export function anonymizeFilename(documentType: string): string { return documentType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
