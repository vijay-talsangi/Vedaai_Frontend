import { create } from 'zustand';
import type { Assignment } from '@/types';

interface AssignmentState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  generationStatus: 'idle' | 'started' | 'processing' | 'completed' | 'failed';
  generationProgress: number;
  isLoading: boolean;
  error: string | null;

  setAssignments: (assignments: Assignment[]) => void;
  setCurrentAssignment: (assignment: Assignment | null) => void;
  setGenerationStatus: (
    status: 'idle' | 'started' | 'processing' | 'completed' | 'failed'
  ) => void;
  setGenerationProgress: (progress: number) => void;
  addAssignment: (assignment: Assignment) => void;
  removeAssignment: (id: string) => void;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  currentAssignment: null,
  generationStatus: 'idle',
  generationProgress: 0,
  isLoading: false,
  error: null,

  setAssignments: (assignments) => set({ assignments }),

  setCurrentAssignment: (assignment) =>
    set({ currentAssignment: assignment }),

  setGenerationStatus: (status) => set({ generationStatus: status }),

  setGenerationProgress: (progress) => set({ generationProgress: progress }),

  addAssignment: (assignment) =>
    set((state) => ({
      assignments: [assignment, ...state.assignments],
    })),

  removeAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((a) => a._id !== id),
    })),

  updateAssignment: (id, data) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a._id === id ? { ...a, ...data } : a
      ),
      currentAssignment:
        state.currentAssignment?._id === id
          ? { ...state.currentAssignment, ...data }
          : state.currentAssignment,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      generationStatus: 'idle',
      generationProgress: 0,
      error: null,
    }),
}));
