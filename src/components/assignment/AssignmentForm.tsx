'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, ArrowLeft, Plus, Sparkles } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionTypeRow } from './QuestionTypeRow';
import { assignmentSchema, type AssignmentFormData } from '@/lib/validators';
import { api } from '@/lib/api';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { generateId } from '@/lib/utils';
import type { QuestionTypeConfig } from '@/types';

const GRADE_OPTIONS = [
  { value: '', label: 'Select Grade' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: `${i + 1}`,
    label: `Class ${i + 1}`,
  })),
];

const SUBJECT_OPTIONS = [
  { value: '', label: 'Select Subject' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Science', label: 'Science' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Biology', label: 'Biology' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Social Science', label: 'Social Science' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Economics', label: 'Economics' },
  { value: 'History', label: 'History' },
  { value: 'Geography', label: 'Geography' },
];

const defaultQuestionType: () => QuestionTypeConfig = () => ({
  id: generateId(),
  type: 'MCQ',
  numberOfQuestions: 5,
  marksPerQuestion: 1,
});

export function AssignmentForm() {
  const router = useRouter();
  const { setCurrentAssignment, setGenerationStatus } = useAssignmentStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeConfig[]>([
    defaultQuestionType(),
  ]);

  const totalQuestions = useMemo(
    () => questionTypes.reduce((sum, qt) => sum + qt.numberOfQuestions, 0),
    [questionTypes]
  );

  const totalMarks = useMemo(
    () =>
      questionTypes.reduce(
        (sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion,
        0
      ),
    [questionTypes]
  );

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      subject: '',
      grade: '',
      schoolName: 'Delhi Public School',
      dueDate: '',
      timeAllowed: '',
      additionalInstructions: '',
    },
  });

  const handleNextStep = async () => {
    const valid = await trigger(['title', 'subject', 'grade', 'schoolName']);
    if (valid) setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const addQuestionType = () => {
    setQuestionTypes((prev) => [...prev, defaultQuestionType()]);
  };

  const removeQuestionType = (id: string) => {
    setQuestionTypes((prev) => prev.filter((qt) => qt.id !== id));
  };

  const updateQuestionType = (
    id: string,
    field: keyof QuestionTypeConfig,
    value: string | number
  ) => {
    setQuestionTypes((prev) =>
      prev.map((qt) => (qt.id === id ? { ...qt, [field]: value } : qt))
    );
  };

  const onSubmit = useCallback(
    async (data: AssignmentFormData) => {
      setIsSubmitting(true);
      setGenerationStatus('started');

      try {
        const payload = {
          ...data,
          questionTypes,
          totalQuestions,
          totalMarks,
        };

        const assignment = await api.createAssignment(payload);
        setCurrentAssignment(assignment);
        toast.success('Assignment created! Generating question paper...');
        router.push(`/assignments/${assignment._id}`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to create assignment';
        toast.error(message);
        setGenerationStatus('failed');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      questionTypes,
      totalQuestions,
      totalMarks,
      router,
      setCurrentAssignment,
      setGenerationStatus,
    ]
  );

  return (
    <div className="w-full max-w-[880px] mx-auto">
      {/* Progress */}
      <ProgressBar currentStep={step} totalSteps={2} className="mb-6 lg:mb-8 px-1" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="radius-lg border border-vedaai-border bg-white card-strong p-6 space-y-5 lg:p-8">
                <h2 className="text-[18px] font-semibold text-vedaai-text">
                  Basic Information
                </h2>

                <Input
                  label="Assignment Title"
                  placeholder="Enter assignment title"
                  error={errors.title?.message}
                  {...register('title')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Select
                    label="Subject"
                    options={SUBJECT_OPTIONS}
                    error={errors.subject?.message}
                    {...register('subject')}
                  />

                  <Select
                    label="Grade / Class"
                    options={GRADE_OPTIONS}
                    error={errors.grade?.message}
                    {...register('grade')}
                  />
                </div>

                <Input
                  label="School Name"
                  placeholder="Enter school or college name"
                  error={errors.schoolName?.message}
                  {...register('schoolName')}
                />
              </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 sm:flex-none" />
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="w-full sm:w-auto rounded-full px-6 py-3"
                  >
                    Next Step
                  </Button>
                </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* File Upload (Optional) */}
              <div className="radius-lg border border-vedaai-border bg-white card-strong p-6 space-y-4 lg:p-8">
                <div className="space-y-1">
                  <h2 className="text-[18px] font-semibold text-vedaai-text">
                    Assignment Details
                  </h2>
                  <p className="text-sm text-vedaai-text-secondary">
                    Basic information about your assignment
                  </p>
                </div>
                <FileUpload />
                <p className="text-center text-sm text-vedaai-text-secondary">
                  Upload images of your preferred document/image
                </p>
              </div>

              {/* Due Date & Time */}
              <div className="radius-lg border border-vedaai-border bg-white card-strong p-6 space-y-5 lg:p-8">
                <h2 className="text-[18px] font-semibold text-vedaai-text">
                  Due Date
                </h2>
                <DatePicker
                  label="Due Date"
                  error={errors.dueDate?.message}
                  {...register('dueDate')}
                />
                {/* Time Allowed Dropdown */}
                <Select
                  label="Time Allowed"
                  options={[
                    { value: '30 minutes', label: '30 minutes' },
                    { value: '1 hour', label: '1 hour' },
                    { value: '90 minutes', label: '90 minutes' },
                    { value: '2 hours', label: '2 hours' },
                  ]}
                  placeholder="Select time allowed for the assignment"
                  error={errors.timeAllowed?.message}
                  {...register('timeAllowed')}
                />
              </div>

              {/* Question Types */}
              <div className="radius-lg border border-vedaai-border bg-white card-strong p-6 space-y-4 lg:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-semibold text-vedaai-text">
                    Question Types
                  </h2>
                </div>

                {/* Header row */}
                <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_36px] gap-3 border-b border-vedaai-border pb-2 text-[11px] font-medium uppercase tracking-wide text-vedaai-text-secondary">
                  <span>Question Type</span>
                  <span className="w-[140px] text-center">No. of Questions</span>
                  <span className="w-[140px] text-center">Marks</span>
                  <span />
                </div>

                {/* Question type rows */}
                <div className="space-y-3">
                  {questionTypes.map((qt) => (
                    <QuestionTypeRow
                      key={qt.id}
                      type={qt.type}
                      numberOfQuestions={qt.numberOfQuestions}
                      marksPerQuestion={qt.marksPerQuestion}
                      onTypeChange={(type) =>
                        updateQuestionType(qt.id, 'type', type)
                      }
                      onQuestionsChange={(count) =>
                        updateQuestionType(qt.id, 'numberOfQuestions', count)
                      }
                      onMarksChange={(marks) =>
                        updateQuestionType(qt.id, 'marksPerQuestion', marks)
                      }
                      onRemove={() => removeQuestionType(qt.id)}
                      canRemove={questionTypes.length > 1}
                    />
                  ))}
                </div>

                {/* Add Question Type */}
                <button
                  type="button"
                  onClick={addQuestionType}
                  className="mt-1 flex items-center gap-2 text-sm font-medium text-vedaai-accent hover:text-orange-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Question Type
                </button>

                {/* Summary */}
                <div className="flex items-center justify-end gap-6 pt-4 border-t border-vedaai-border text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-vedaai-text-secondary">
                      Total Questions:
                    </span>
                    <span className="text-sm font-bold text-vedaai-text">
                      {totalQuestions}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-vedaai-text-secondary">
                      Total Marks:
                    </span>
                    <span className="text-sm font-bold text-vedaai-text">
                      {totalMarks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Instructions */}
              <div className="radius-lg border border-vedaai-border bg-white card-strong p-6 space-y-4 lg:p-8">
                <h2 className="text-[18px] font-semibold text-vedaai-text">
                  Additional Information{' '}
                  <span className="text-sm font-normal text-vedaai-text-secondary">
                    (Optional)
                  </span>
                </h2>
                <textarea
                  placeholder="Add any special instructions, topics to focus on, or difficulty preferences"
                  rows={4}
                  className="w-full rounded-lg border border-vedaai-border bg-white px-3.5 py-2.5 text-sm text-vedaai-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-vedaai-accent focus:border-vedaai-accent transition-all duration-200 resize-none"
                  {...register('additionalInstructions')}
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrevStep}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  className="w-full sm:w-auto rounded-full px-6 py-3 shadow-sm"
                >
                  Previous
                </Button>

                <Button
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  isLoading={isSubmitting}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  className="w-full sm:w-auto rounded-full bg-vedaai-primary px-6 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)] hover:bg-[#111] focus:ring-vedaai-primary"
                >
                  Generate Question Paper
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
