
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Question {
  id: string;
  topic: string;
  content: string;
  options: string[];
  correctOption: number;
  explanation: string;
  weight: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
  category: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  score: number;
  maxScore: number;
  answers: UserAnswer[];
  completedAt: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
}

export interface Flashcard {
  id: string;
  userId: string;
  topic: string;
  front: string;
  back: string;
  status: 'KNOWN' | 'NEED_REVISION';
  lastReviewedAt: string;
}

export interface Doubt {
  id: string;
  userId: string;
  question: string;
  status: 'PENDING' | 'RESOLVED';
  response?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalExams: number;
  avgScore: number;
  strongTopics: string[];
  weakTopics: string[];
  recentActivity: ExamAttempt[];
}
