'use client';

import React from 'react';
import { Badge, getDifficultyVariant } from '@/components/ui/Badge';
import type { GeneratedPaper } from '@/types';

interface PaperOutputProps {
  paper: GeneratedPaper;
  schoolName: string;
  subject: string;
  grade: string;
  timeAllowed?: string;
  totalMarks: number;
}

export function PaperOutput({
  paper,
  schoolName,
  subject,
  grade,
  timeAllowed,
  totalMarks,
}: PaperOutputProps) {
  let questionCounter = 0;

  return (
    <div className="paper-output mx-auto max-w-[920px] overflow-hidden radius-lg border border-[#ededed] bg-white card-strong">
      <div className="space-y-7 p-6 sm:p-12 lg:p-16">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-[24px] font-bold text-vedaai-text uppercase tracking-normal sm:text-[30px]">
            {schoolName}
          </h1>
          <p className="text-[15px] font-semibold text-vedaai-text sm:text-[16px]">
            Subject: {subject}
          </p>
          <p className="text-[15px] font-semibold text-vedaai-text sm:text-[16px]">
            Class: {grade}{grade === '1' ? 'st' : grade === '2' ? 'nd' : grade === '3' ? 'rd' : 'th'}
          </p>
        </div>

        {/* Divider */}
        <hr className="border-vedaai-text/80" />

        {/* Time & Marks Row */}
        <div className="flex items-center justify-between text-[14px] text-vedaai-text sm:text-sm">
          <span>
            <strong>Time Allowed:</strong> {timeAllowed || 'As instructed'}
          </span>
          <span>
            <strong>Maximum Marks:</strong> {totalMarks}
          </span>
        </div>

        {/* General Instructions */}
        <div className="border-l-4 border-vedaai-accent pl-4 text-[13px] italic text-vedaai-text sm:text-sm">
          All questions are compulsory unless stated otherwise.
        </div>

        {/* Student Info */}
        <div className="flex flex-col gap-3 radius-md p-4 text-sm text-vedaai-text">
          <div className="flex items-end gap-2">
            <span className="shrink-0">Name:</span>
            <span className="flex-1 border-b border-vedaai-text translate-y-[-2px]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="shrink-0">Roll Number:</span>
            <span className="w-34 border-b border-vedaai-text translate-y-[-2px]" />
          </div>
          <div className="flex items-end gap-2">
            <span className="shrink-0">Class:</span>
            {grade}{grade === '1' ? 'st' : grade === '2' ? 'nd' : grade === '3' ? 'rd' : 'th'}
            <span className="shrink-0">Section:</span>
            <span className="w-14 border-b border-vedaai-text translate-y-[-2px]" />
          </div>
        </div>

        {/* Sections */}
        {paper.sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="space-y-4">
            {/* Section Title */}
            <div className="text-center">
              <h2 className="text-[17px] font-bold text-vedaai-text sm:text-[18px]">
                {section.title}
              </h2>
            </div>

            {/* Section Instruction */}
            {section.instruction && (
              <p className="text-sm italic text-vedaai-text-secondary">
                {section.instruction}
              </p>
            )}

            {/* Questions */}
            <div className="space-y-4">
              {section.questions.map((question, qIdx) => {
                questionCounter += 1;

                return (
                  <div
                    key={qIdx}
                    className="flex gap-3 text-sm text-vedaai-text"
                  >
                    <span className="font-semibold text-vedaai-text-secondary flex-shrink-0 w-8">
                      {questionCounter}.
                    </span>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2 flex-wrap">
                        <Badge
                          variant={getDifficultyVariant(question.difficulty)}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {question.difficulty}
                        </Badge>
                        <span className="flex-1">{question.question}</span>
                        <span className="flex-shrink-0 text-xs font-medium text-vedaai-text-secondary ml-2">
                          [{question.marks} {question.marks === 1 ? 'mark' : 'marks'}]
                        </span>
                      </div>

                      {/* MCQ Options */}
                      {question.options && question.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-2">
                          {question.options.map((opt, optIdx) => (
                            <div key={optIdx} className="text-sm text-vedaai-text-secondary">
                              ({String.fromCharCode(97 + optIdx)}) {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* End of Paper */}
        <div className="border-t border-vedaai-border pt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-vedaai-text">
            — End of Question Paper —
          </p>
        </div>

        {/* Answer Key */}
        {paper.answerKey && paper.answerKey.length > 0 && (
          <div className="mt-12 border-t-2 border-dashed border-vedaai-border pt-8">
            <h2 className="mb-6 text-center text-xl font-bold text-vedaai-text">
              Answer Key
            </h2>
            {paper.answerKey.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4 mb-6">
                <h3 className="text-base font-semibold text-vedaai-text">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="flex gap-3 text-sm"
                    >
                      <span className="font-semibold text-vedaai-text-secondary w-8 flex-shrink-0">
                        {qIdx + 1}.
                      </span>
                      <span className="text-vedaai-text">
                        {q.answer || 'Answer not provided'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
