
export enum ParticipationType {
  Quran = 'تلاوة القرآن الكريم',
  Inshad = 'الإنشاد الديني'
}

export enum ParticipationStatus {
  Pending = 'قيد المراجعة',
  Accepted = 'مقبول',
  Rejected = 'مرفوض',
  Qualified = 'متأهل'
}

export interface Rating {
  judgeId: string;
  judgeName: string;
  score: number; // 1-10
}

export interface Participant {
  id: string;
  fullName: string;
  age: number;
  country: string;
  whatsapp: string;
  email: string;
  type: ParticipationType;
  fileUrl: string;
  status: ParticipationStatus;
  ratings: Rating[];
  averageScore: number;
  submittedAt: Date;
}

export interface User {
  id: string;
  role: 'admin' | 'judge' | 'user';
  name: string;
}
