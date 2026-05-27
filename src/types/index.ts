export interface QuestionTypeConfig {
  id: string;
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface Question {
  question: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  marks: number;
  options?: string[];
  answer?: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  sections: Section[];
  answerKey?: Section[];
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  schoolName: string;
  dueDate?: string;
  timeAllowed?: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions?: string;
  totalQuestions: number;
  totalMarks: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper?: GeneratedPaper;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentPayload {
  title: string;
  subject: string;
  grade: string;
  schoolName: string;
  dueDate?: string;
  timeAllowed?: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions?: string;
  totalQuestions: number;
  totalMarks: number;
}
