export interface SymptomEntry {
  id: string;
  date: string;
  label: string;
  description: string;
  severity: number;
  duration: string;
  triggers: string[];
  tags: string[];
  outcome: string;
}

export const symptomsTimeline: SymptomEntry[] = [
  {
    id: 'sleep-insomnia-2024',
    date: '2024-06',
    label: 'Sleep maintenance insomnia',
    description: 'Difficulty staying asleep through the night. Frequent wake-ups at 2-4am with trouble returning to sleep.',
    severity: 7,
    duration: 'Ongoing',
    triggers: ['Stress', 'Screen time', 'Caffeine'],
    tags: ['Sleep', 'Neurology'],
    outcome: 'Sleep medicine consultation initiated',
  },
  {
    id: 'low-t-2024',
    date: '2024-07',
    label: 'Low testosterone symptoms',
    description: 'Fatigue, reduced motivation, decreased libido, difficulty maintaining muscle mass despite consistent training.',
    severity: 6,
    duration: 'Several months',
    triggers: ['Poor sleep', 'Stress'],
    tags: ['Hormones', 'Endocrine'],
    outcome: 'TRT evaluation — labs confirmed low T',
  },
  {
    id: 'adhd-2024',
    date: '2024-08',
    label: 'ADHD diagnosis',
    description: 'Attention and focus difficulties. Started Adderall 5mg, reduced to 1.25mg due to elevated resting heart rate.',
    severity: 5,
    duration: 'Chronic',
    triggers: ['Task switching', 'Low stimulation'],
    tags: ['Neurology', 'Cardiac'],
    outcome: 'Adderall 5mg → reduced to 1.25mg (HR concern)',
  },
  {
    id: 'ed-2024',
    date: '2024-08',
    label: 'ED symptoms',
    description: 'Erectile dysfunction likely related to low testosterone and stress. Evaluated pharmaceutical options.',
    severity: 5,
    duration: 'Intermittent',
    triggers: ['Low T', 'Stress', 'Fatigue'],
    tags: ['Hormones', 'Urology'],
    outcome: 'Tadalafil/Vardenafil prescribed',
  },
  {
    id: 'acne-2024',
    date: '2024-10',
    label: 'Acne flare',
    description: 'Significant acne breakout, potentially related to hormonal changes from TRT initiation.',
    severity: 6,
    duration: '3+ months',
    triggers: ['TRT', 'Hormonal shift'],
    tags: ['Dermatology', 'Hormones'],
    outcome: 'Absorica (isotretinoin) started',
  },
  {
    id: 'trt-monitoring-2024',
    date: '2024-11',
    label: 'TRT monitoring',
    description: 'Follow-up labs to monitor testosterone levels, hematocrit, and estradiol on TRT protocol.',
    severity: 3,
    duration: 'Checkpoint',
    triggers: [],
    tags: ['Hormones', 'Labs'],
    outcome: 'Levels stabilizing, continued protocol',
  },
  {
    id: 'trt-followup-jan-2025',
    date: '2025-01',
    label: 'TRT follow-up',
    description: 'Ongoing TRT management. Lab review for testosterone, estradiol, hematocrit, and PSA.',
    severity: 3,
    duration: 'Checkpoint',
    triggers: [],
    tags: ['Hormones', 'Labs'],
    outcome: 'Protocol maintained, labs within range',
  },
  {
    id: 'therapy-feb-2025',
    date: '2025-02',
    label: 'Therapy — emotional regulation',
    description: 'Addressing feedback sensitivity and emotional regulation patterns. Cognitive behavioral focus.',
    severity: 4,
    duration: 'Ongoing',
    triggers: ['Feedback', 'Interpersonal conflict'],
    tags: ['Mental Health', 'Therapy'],
    outcome: 'Ongoing sessions — building coping frameworks',
  },
  {
    id: 'trt-followup-apr-2025',
    date: '2025-04',
    label: 'TRT follow-up + labs',
    description: 'Quarterly TRT follow-up with comprehensive lab panel. Monitoring hormone levels and metabolic markers.',
    severity: 3,
    duration: 'Checkpoint',
    triggers: [],
    tags: ['Hormones', 'Labs'],
    outcome: 'Labs reviewed, protocol adjusted as needed',
  },
  {
    id: 'mounjaro-2026',
    date: '2026-01',
    label: 'Mounjaro restarted',
    description: 'Restarted Mounjaro (tirzepatide) 5mg for metabolic optimization and weight management.',
    severity: 3,
    duration: 'Ongoing',
    triggers: ['Metabolic goals'],
    tags: ['Metabolic', 'GLP-1'],
    outcome: '5mg weekly — monitoring response',
  },
];
