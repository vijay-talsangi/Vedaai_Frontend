'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { LinearProgress } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

interface GenerationStatusProps {
  status: 'idle' | 'started' | 'processing' | 'completed' | 'failed';
  progress: number;
  onRetry?: () => void;
}

export function GenerationStatus({
  status,
  progress,
  onRetry,
}: GenerationStatusProps) {
  if (status === 'idle') return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-xl border border-vedaai-border p-8 text-center space-y-6">
        {/* Icon */}
        <div className="flex items-center justify-center">
          {(status === 'started' || status === 'processing') && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="relative"
            >
              <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-vedaai-accent" />
              <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-vedaai-accent animate-spin" />
            </motion.div>
          )}

          {status === 'completed' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            >
              <CheckCircle className="h-16 w-16 text-vedaai-success" />
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            >
              <XCircle className="h-16 w-16 text-vedaai-error" />
            </motion.div>
          )}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-vedaai-text">
            {status === 'started' && 'Starting Generation...'}
            {status === 'processing' && 'Generating Question Paper...'}
            {status === 'completed' && 'Question Paper Ready!'}
            {status === 'failed' && 'Generation Failed'}
          </h3>
          <p className="text-sm text-vedaai-text-secondary">
            {status === 'started' &&
              'Preparing your question paper. This may take a moment.'}
            {status === 'processing' &&
              `AI is crafting your question paper... ${Math.round(progress)}% complete`}
            {status === 'completed' &&
              'Your question paper has been generated successfully.'}
            {status === 'failed' &&
              'Something went wrong. Please try again.'}
          </p>
        </div>

        {/* Progress bar */}
        {(status === 'started' || status === 'processing') && (
          <LinearProgress value={progress} className="max-w-xs mx-auto" />
        )}

        {/* Retry button */}
        {status === 'failed' && onRetry && (
          <Button
            onClick={onRetry}
            variant="secondary"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
}
