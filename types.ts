
export enum UserRole {
  PATIENT = 'PATIENT',
  DENTIST = 'DENTIST'
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  currentAnxietyLevel: number; // 1-10
  completedModules: string[];
}

export interface Procedure {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  scaryRating: number;
}

export interface AnxietyRecord {
  timestamp: Date;
  score: number;
  note?: string;
}

export interface PatientData extends UserProfile {
  anxietyHistory: AnxietyRecord[];
  specificFears: string[];
}
