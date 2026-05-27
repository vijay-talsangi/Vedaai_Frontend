'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Assignment } from '@/types';

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete?: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      className="relative min-h-[150px] radius-lg border border-vedaai-border bg-white card-strong p-6 cursor-pointer group page-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <Link href={`/assignments/${assignment._id}`}>
            <h3 className="text-[20px] leading-tight font-semibold text-vedaai-text group-hover:text-vedaai-accent transition-colors truncate">
              {assignment.title}
            </h3>
          </Link>
          <p className="text-sm text-vedaai-text-secondary mt-1">
            {assignment.subject} • Class {assignment.grade}
          </p>
        </div>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }}
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <MoreVertical className="h-4 w-4 text-vedaai-text-secondary" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-44 rounded-xl border border-[#eaeaea] bg-white p-1 shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-10">
              <Link
                href={`/assignments/${assignment._id}`}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-vedaai-text hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View Assignment
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete?.(assignment._id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-vedaai-error hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[13px] text-vedaai-text-secondary">
        <span>
          <strong className="text-vedaai-text">Assigned on :</strong>{' '}
          {formatDate(assignment.createdAt)}
        </span>
        {assignment.dueDate && (
          <span>
            <strong className="text-vedaai-text">Due :</strong>{' '}
            {formatDate(assignment.dueDate)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
