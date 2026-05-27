'use client';

import { useEffect, useCallback } from 'react';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import type { Assignment } from '@/types';

export function useSocket(assignmentId?: string) {
  const {
    setGenerationStatus,
    setGenerationProgress,
    setCurrentAssignment,
    updateAssignment,
  } = useAssignmentStore();

  const handleGenerationStarted = useCallback(() => {
    setGenerationStatus('started');
    setGenerationProgress(0);
  }, [setGenerationStatus, setGenerationProgress]);

  const handleGenerationProgress = useCallback(
    (data: { progress: number; message?: string }) => {
      setGenerationStatus('processing');
      setGenerationProgress(data.progress);
    },
    [setGenerationStatus, setGenerationProgress]
  );

  const handleGenerationCompleted = useCallback(
    (data: { assignment?: Assignment; assignmentId?: string }) => {
      setGenerationStatus('completed');
      setGenerationProgress(100);
      if (data.assignment) {
        setCurrentAssignment(data.assignment);
        updateAssignment(data.assignment._id, data.assignment);
      }
    },
    [
      setGenerationStatus,
      setGenerationProgress,
      setCurrentAssignment,
      updateAssignment,
    ]
  );

  const handleGenerationFailed = useCallback(
    (data: { error?: string; message?: string }) => {
      setGenerationStatus('failed');
      console.error('Generation failed:', data.error ?? data.message ?? 'Unknown error');
    },
    [setGenerationStatus]
  );

  useEffect(() => {
    const socket = connectSocket();

    if (assignmentId) {
      socket.emit('join_assignment', assignmentId);
    }

    socket.on('generation_started', handleGenerationStarted);
    socket.on('generation_progress', handleGenerationProgress);
    socket.on('generation_completed', handleGenerationCompleted);
    socket.on('generation_failed', handleGenerationFailed);

    return () => {
      socket.off('generation_started', handleGenerationStarted);
      socket.off('generation_progress', handleGenerationProgress);
      socket.off('generation_completed', handleGenerationCompleted);
      socket.off('generation_failed', handleGenerationFailed);

      if (assignmentId) {
        socket.emit('leave_assignment', assignmentId);
      }

      disconnectSocket();
    };
  }, [
    assignmentId,
    handleGenerationStarted,
    handleGenerationProgress,
    handleGenerationCompleted,
    handleGenerationFailed,
  ]);
}
