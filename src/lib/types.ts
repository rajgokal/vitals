export interface Profile {
  id: string;
  name: string;
  dob: string;
  age: number;
  sex: string;
  conditions: string[];
  allergies: string[];
  bodyMetrics: { height: string; weight: string; bmi?: number; bodyFat?: number };
  geneticFlags: string[];
  updatedAt: string;
  isActive?: boolean;
  // Additional fields from multi-profile spec
  relationship?: string;
  avatar?: string | null;
  color?: string;
  isDefault?: boolean;
  isDemo?: boolean;
  pediatric?: boolean;
  createdAt?: string;
}

export interface ProfileRegistry {
  profiles: Profile[];
  defaultProfileId: string;
  lastUpdated: string;
}

export interface Medication {
  name: string;
  dosage?: string;
  dose?: string;
  frequency: string;
  prescriber?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  status?: "current" | "stopped";
  notes?: string;
}

export interface Supplement {
  name: string;
  dosage?: string;
  dose?: string;
  frequency?: string;
  timing?: string;
  reason?: string;
  active?: boolean;
  status?: "current" | "stopped";
  stoppedReason?: string;
}

export interface GeneticsPanel {
  enzymes: { 
    gene: string; 
    variant?: string;
    genotype?: string;
    metabolizerStatus?: string;
    phenotype?: string;
    implications?: string;
    impact?: string;
  }[];
  hlaTypes: { gene?: string; marker?: string; variant?: string; result?: string; risk: string }[];
  coagulation?: any;
  flags?: string[];
  sources?: any;
  actionableFlags?: string[];
  updatedAt?: string;
}

export interface Interaction {
  drug1?: string;
  drug2?: string;
  drugA?: string;
  drugB?: string;
  severity: 'critical' | 'high' | 'moderate' | 'medium' | 'low';
  description?: string;
  recommendation?: string;
  action?: string;
}

export interface LabDraw {
  date: string;
  source: string;
  orderedBy?: string;
  markers: LabMarker[];
}

export interface LabMarker {
  name: string;
  value: number | string;
  unit: string;
  referenceRange?: { low?: number; high?: number; text?: string } | null;
  range?: string;
  flag?: 'high' | 'low' | 'critical';
  category?: string;
}

export interface Provider {
  name: string;
  specialty?: string;
  role?: string;
  facility?: string;
  practice?: string;
  address?: string;
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

export interface MedicalRecord {
  id: string;
  filename: string;
  documentType: string;
  source?: string;
  dateRange?: { start: string; end: string };
  uploadedAt: string;
  status: 'complete' | 'partial' | 'error';
  description: string;
  recordCount?: number;
  errors?: string[];
}

export interface Immunization {
  name?: string;
  vaccine?: string;
  date: string;
  provider?: string;
  location?: string;
  lot?: string;
  notes?: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'dismissed' | 'resolved' | 'expired';
export type AlertCategory = 
  | 'lab_out_of_range' | 'lab_trend' | 'medication_safety' 
  | 'genetic_safety' | 'screening_due' | 'wearable_anomaly' | 'body_composition';

export interface Alert {
  id: string;
  createdAt: string;
  updatedAt: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  source?: {
    type: string;
    markers?: string[];
    dates?: string[];
  };
  relatedProviders?: string[];
  relatedMedications?: string[];
  actionItems?: string[];
  dismissedAt?: string | null;
  dismissedBy?: string | null;
  expiresAt?: string | null;
  tags?: string[];
}
