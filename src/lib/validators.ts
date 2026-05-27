import { z } from 'zod';

export const questionTypeConfigSchema = z.object({
  id: z.string(),
  type: z.string().min(1, 'Question type is required'),
  numberOfQuestions: z.number().min(1, 'At least 1 question required'),
  marksPerQuestion: z.number().min(1, 'Marks must be at least 1'),
});

export const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  grade: z.string().min(1, 'Grade/Class is required'),
  schoolName: z.string().min(2, 'School name is required'),
  dueDate: z.string().optional(),
  timeAllowed: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

export type AssignmentFormData = z.infer<typeof assignmentSchema>;
