'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
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
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-vedaai-border bg-white px-3.5 py-2.5 text-sm text-vedaai-text placeholder:text-gray-400 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-vedaai-accent focus:border-vedaai-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            error && 'border-vedaai-error focus:ring-vedaai-error focus:border-vedaai-error',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-vedaai-text-secondary">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-vedaai-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
