'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AssignmentForm } from '@/components/assignment/AssignmentForm';

export default function CreateAssignmentPage() {
  return (
    <div className="space-y-5 px-1 pb-24 pt-6 lg:px-0 lg:pb-6 lg:pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-vedaai-success" />
          <h1 className="text-[18px] font-bold text-vedaai-text lg:text-[22px]">
            Create Assignment
          </h1>
        </div>
        <p className="text-[13px] text-vedaai-text-secondary lg:text-sm">
          Set up a new assignment for your students
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AssignmentForm />
      </motion.div>
    </div>
  );
}
