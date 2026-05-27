import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-vedaai-text-secondary">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-medium text-vedaai-accent">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div className="flex h-full gap-0.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 rounded-full transition-all duration-500',
                i < currentStep ? 'bg-vedaai-accent' : 'bg-gray-200'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface LinearProgressProps {
  value: number;
  className?: string;
}

export function LinearProgress({ value, className }: LinearProgressProps) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-gray-200 overflow-hidden', className)}>
      <div
        className="h-full rounded-full bg-vedaai-accent transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
