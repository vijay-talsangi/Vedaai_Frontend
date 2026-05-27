'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Counter } from '@/components/ui/Counter';

const QUESTION_TYPES = [
  { value: 'MCQ', label: 'MCQ' },
  { value: 'Short Questions', label: 'Short Questions' },
  { value: 'Long Answer', label: 'Long Answer' },
  { value: 'Diagram/Graph-Based', label: 'Diagram/Graph-Based' },
  { value: 'Numerical Problems', label: 'Numerical Problems' },
  { value: 'True/False', label: 'True/False' },
  { value: 'Fill in the Blanks', label: 'Fill in the Blanks' },
  { value: 'Match the Following', label: 'Match the Following' },
];

interface QuestionTypeRowProps {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
  onTypeChange: (type: string) => void;
  onQuestionsChange: (count: number) => void;
  onMarksChange: (marks: number) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuestionTypeRow({
  type,
  numberOfQuestions,
  marksPerQuestion,
  onTypeChange,
  onQuestionsChange,
  onMarksChange,
  onRemove,
  canRemove,
}: QuestionTypeRowProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-[18px] border border-[#f0f0f0] bg-white p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:grid-cols-[1fr_auto_auto_32px] sm:items-center">
      {/* Question Type Select */}
      <div className="min-w-0">
        <Select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          options={QUESTION_TYPES}
          placeholder="Select type"
        />
      </div>

      {/* Counters */}
      <div className="flex items-center gap-3 sm:justify-self-end">
        <Counter
          label="No. of Questions"
          value={numberOfQuestions}
          onChange={onQuestionsChange}
          min={1}
          max={50}
        />
        <Counter
          label="Marks"
          value={marksPerQuestion}
          onChange={onMarksChange}
          min={1}
          max={20}
        />
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="flex h-8 w-8 items-center justify-center justify-self-end rounded-full text-gray-400 hover:bg-red-50 hover:text-vedaai-error transition-colors disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
