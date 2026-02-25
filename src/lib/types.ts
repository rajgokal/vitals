export interface Profile {
  name: string;
  dob: string;
  age: number;
  sex: string;
  conditions: string[];
  allergies: string[];
  bodyMetrics: { height: string; weight: string; bmi?: number; bodyFat?: number };
  geneticFlags: string[];
  updatedAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescriber?: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  notes?: string;
}

export interface Supplement {
  name: string;
  dosage: string;
  frequency: string;
  reason?: string;
  active: boolean;
  stoppedReason?: string;
}

export interface GeneticsPanel {
  enzymes: { gene: string; variant: string; metabolizerStatus: string; implications: string }[];
  hlaTypes: { gene: string; variant: string; risk: string }[];
  actionableFlags: string[];
  updatedAt: string;
}

export interface Interaction {
  drug1: string;
  drug2: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

export interface LabDraw {
  date: string;
  source: string;
  markers: LabMarker[];
}

export interface LabMarker {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: { low?: number; high?: number; text?: string };
  flag?: 'high' | 'low' | 'critical';
  category?: string;
}

export interface Provider {
  name: string;
  specialty: string;
  facility?: string;
  phone?: string;
  email?: string;
  lastVisit?: string;
}

export interface Encounter {
  date: string;
  provider: string;
  type: string;
  summary: string;
}

export interface Immunization {
  name: string;
  date: string;
  provider?: string;
  lot?: string;
}
