'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export function Counter({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  className,
}: CounterProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <span className="text-xs font-medium text-vedaai-text-secondary mb-1.5">
          {label}
        </span>
      )}
      <div className="inline-flex items-center gap-0 rounded-lg border border-vedaai-border bg-white overflow-hidden">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="flex items-center justify-center h-9 w-9 text-vedaai-text hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-center justify-center h-9 w-10 border-x border-vedaai-border text-sm font-medium text-vedaai-text">
          {value}
        </div>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="flex items-center justify-center h-9 w-9 text-vedaai-text hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
