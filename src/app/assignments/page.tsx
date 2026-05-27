'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Filter, Plus, Search } from 'lucide-react';

import { AssignmentCard } from '@/components/assignment/AssignmentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import type { Assignment } from '@/types';

export default function AssignmentsPage() {
  const router = useRouter();
  const { assignments, setAssignments, removeAssignment, isLoading, setLoading } =
    useAssignmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const hasAssignments = (assignments ?? []).length > 0;

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAssignments(1, 20);
      setAssignments(data.assignments);
    } catch {
      // If API is not available, show empty state
      setAssignments([]);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [setAssignments, setLoading]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteAssignment(id);
      removeAssignment(id);
      toast.success('Assignment deleted');
    } catch {
      toast.error('Failed to delete assignment');
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredAssignments = (assignments ?? []).filter((assignment) => {
    if (!normalizedQuery) return true;

    return (
      assignment.title.toLowerCase().includes(normalizedQuery) ||
      assignment.subject.toLowerCase().includes(normalizedQuery) ||
      assignment.grade.toLowerCase().includes(normalizedQuery) ||
      assignment.schoolName.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div
      className="space-y-5 px-1 pb-24 lg:px-0 lg:pb-6 page-container"
      style={{ paddingTop: 'calc(var(--topbar-height) - 8px)' }}
    >
      {hasAssignments && (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-vedaai-success" />
              <h1 className="text-[18px] font-bold text-vedaai-text lg:text-[22px]">
                Assignments
              </h1>
            </div>
            <p className="text-[13px] text-vedaai-text-secondary lg:text-sm">
              Manage and create assignments for your classes.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 rounded-lg border border-vedaai-border bg-white px-3 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          >
            <button className="flex h-12 shrink-0 items-center gap-2 rounded-2xl border border-transparent bg-transparent px-3 text-[13px] font-medium text-vedaai-text-secondary hover:bg-gray-50 lg:px-4">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter By</span>
              <span className="sm:hidden">Filter</span>
            </button>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Assignment"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#d9d9d9] bg-white pl-11 pr-4 py-2.5 text-sm text-vedaai-text placeholder:text-gray-400 outline-none transition-all focus:border-vedaai-accent focus:ring-2 focus:ring-vedaai-accent/20"
              />
            </div>
          </motion.div>
        </>
      )}

      {/* Content */}
      {isLoading && !hasLoaded ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !hasAssignments ? (
        <EmptyState
          onAction={() => router.push('/assignments/create')}
        />
      ) : filteredAssignments.length === 0 ? (
        <EmptyState
          title="No matching assignments"
          description="Try a different search term or clear the filter to see all assignments."
          onAction={() => router.push('/assignments/create')}
        />
      ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6"
            >
              {filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>

            <div className="hidden justify-center pt-2 lg:flex">
              <Link href="/assignments/create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 rounded-full bg-vedaai-primary px-6 py-3 text-sm font-medium text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
                >
                  <Plus className="h-4 w-4" />
                  Create Assignment
                </motion.button>
              </Link>
            </div>
          </>
      )}

      {/* Mobile FAB */}
      <Link
        href="/assignments/create"
        className="fixed bottom-29 right-4 lg:hidden z-20"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-vedaai-accent shadow-[0_16px_35px_rgba(0,0,0,0.18)]"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </Link>

        {/* Desktop FAB removed, now integrated above */}
    </div>
  );
}
