'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-vedaai-text mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type="date"
            className={cn(
              'w-full rounded-lg border border-vedaai-border bg-white px-3.5 py-2.5 pr-10 text-sm text-vedaai-text transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-vedaai-accent focus:border-vedaai-accent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-vedaai-error focus:ring-vedaai-error',
              className
            )}
            {...props}
          />
          <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {error && (
          <p className="mt-1 text-xs text-vedaai-error">{error}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
