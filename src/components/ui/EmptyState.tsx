import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, Plus } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No assignments yet',
  description = 'Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.',
  actionLabel = 'Create Your First Assignment',
  onAction,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="flex items-center justify-center h-55 w-55 rounded-full bg-orange-50 mb-6">
        {icon || <FileText className="h-10 w-10 text-vedaai-accent" />}
      </div>

      <h3 className="text-lg font-semibold text-vedaai-text mb-2">
        {title}
      </h3>

      <p className="text-sm text-vedaai-text-secondary max-w-sm mb-8">
        {description}
      </p>

      {onAction && (
        <Button
          onClick={onAction}
          leftIcon={<Plus className="h-4 w-4" />}
          className="rounded-full"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
