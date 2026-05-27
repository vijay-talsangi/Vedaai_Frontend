'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Download, RefreshCw, Sparkles } from 'lucide-react';

import { PaperOutput } from '@/components/assignment/PaperOutput';
import { GenerationStatus } from '@/components/assignment/GenerationStatus';
import { Badge } from '@/components/ui/Badge';
import { SkeletonPaper } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { useSocket } from '@/hooks/useSocket';
import type { Assignment } from '@/types';

export default function AssignmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    currentAssignment,
    setCurrentAssignment,
    generationStatus,
    generationProgress,
    setGenerationStatus,
    reset,
  } = useAssignmentStore();
  const [isLoading, setIsLoading] = useState(true);

  // Connect socket for real-time updates
  useSocket(id);

  const fetchAssignment = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getAssignment(id);
      setCurrentAssignment(data);

      // Set generation status based on assignment status
      if (data.status === 'completed' && data.generatedPaper) {
        setGenerationStatus('completed');
      } else if (data.status === 'processing') {
        setGenerationStatus('processing');
      } else if (data.status === 'failed') {
        setGenerationStatus('failed');
      } else {
        setGenerationStatus('started');
      }
    } catch {
      toast.error('Failed to load assignment');
    } finally {
      setIsLoading(false);
    }
  }, [id, setCurrentAssignment, setGenerationStatus]);

  useEffect(() => {
    fetchAssignment();
    return () => {
      reset();
    };
  }, [fetchAssignment, reset]);

  const handlePrint = () => {
    window.print();
  };

  const handleRetry = async () => {
    reset();
    setGenerationStatus('started');
    try {
      const data = await api.createAssignment({
        title: currentAssignment?.title || '',
        subject: currentAssignment?.subject || '',
        grade: currentAssignment?.grade || '',
        schoolName: currentAssignment?.schoolName || '',
        questionTypes: currentAssignment?.questionTypes || [],
        totalQuestions: currentAssignment?.totalQuestions || 0,
        totalMarks: currentAssignment?.totalMarks || 0,
        dueDate: currentAssignment?.dueDate,
        timeAllowed: currentAssignment?.timeAllowed,
        additionalInstructions: currentAssignment?.additionalInstructions,
      });
      setCurrentAssignment(data);
    } catch {
      toast.error('Failed to regenerate');
      setGenerationStatus('failed');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <SkeletonPaper />
      </div>
    );
  }

  const assignment = currentAssignment;
  const showPaper =
    generationStatus === 'completed' &&
    assignment?.generatedPaper;
  const statusLabel =
    assignment?.status === 'completed'
      ? 'Completed'
      : assignment?.status === 'processing'
        ? 'Generating'
        : assignment?.status === 'failed'
          ? 'Failed'
          : 'Created';

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {assignment && !showPaper && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-[920px] rounded-2xl border border-vedaai-border bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    assignment.status === 'completed'
                      ? 'success'
                      : assignment.status === 'processing'
                        ? 'info'
                        : assignment.status === 'failed'
                          ? 'error'
                          : 'warning'
                  }
                >
                  {statusLabel}
                </Badge>
                <span className="text-sm text-vedaai-text-secondary">
                  Assignment created
                </span>
              </div>
              <h2 className="text-[22px] font-bold text-vedaai-text">
                {assignment.title}
              </h2>
              <p className="text-sm text-vedaai-text-secondary">
                {assignment.subject} • Class {assignment.grade}
                {assignment.dueDate ? ` • Due ${assignment.dueDate}` : ''}
              </p>
            </div>
            <div className="rounded-xl bg-[#fafafa] px-4 py-3 text-sm text-vedaai-text-secondary">
              {assignment.status === 'completed'
                ? 'Your question paper is ready.'
                : assignment.status === 'processing'
                  ? 'Question paper is being generated now.'
                  : assignment.status === 'failed'
                    ? 'Generation failed. You can retry below.'
                    : 'Assignment saved successfully. Generation is starting.'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Banner */}
      {showPaper && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-vedaai-primary to-gray-800 rounded-2xl p-6 text-white no-print"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-vedaai-accent flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold">
                  Your Question Paper is Ready!
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  Here is the customized Question Paper for your{' '}
                  <strong>{assignment?.subject}</strong> Class{' '}
                  <strong>{assignment?.grade}</strong> students.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRetry}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="text-white border-white/30 bg-white/10 hover:bg-white/20"
              >
                Regenerate
              </Button>
              <Button
                size="sm"
                onClick={handlePrint}
                leftIcon={<Download className="h-4 w-4" />}
                className="bg-vedaai-accent hover:bg-orange-700"
              >
                Download as PDF
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Generation Status (when still processing) */}
      {!showPaper && (
        <GenerationStatus
          status={generationStatus}
          progress={generationProgress}
          onRetry={handleRetry}
        />
      )}

      {/* Paper Output */}
      {showPaper && assignment?.generatedPaper && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PaperOutput
            paper={assignment.generatedPaper}
            schoolName={assignment.schoolName}
            subject={assignment.subject}
            grade={assignment.grade}
            timeAllowed={assignment.timeAllowed}
            totalMarks={assignment.totalMarks}
          />
        </motion.div>
      )}
    </div>
  );
}
