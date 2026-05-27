'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import type { Assignment } from '@/types';

const USER_NAME = 'John Doe';

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isSameMonth(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await api.getAssignments(1, 100);
        if (!active) return;

        setAssignments(response.assignments);
        setTotalAssignments(response.total);
      } catch {
        if (!active) return;

        setAssignments([]);
        setTotalAssignments(0);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const now = new Date();
  const generatedThisMonth = assignments.filter(
    (assignment) =>
      assignment.status === 'completed' &&
      isSameMonth(new Date(assignment.updatedAt), now)
  ).length;
  const recentActivity = assignments.filter((assignment) =>
    isSameDay(new Date(assignment.updatedAt), now)
  ).length;
  const recentAssignments = assignments.slice(0, 3);

  const statsCards = [
    {
      title: 'Total Assignments',
      value: totalAssignments.toString(),
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Generated This Month',
      value: generatedThisMonth.toString(),
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Recent Activity',
      value: `${recentActivity} today`,
      icon: Clock,
      color: 'bg-orange-50 text-vedaai-accent',
      iconBg: 'bg-orange-100',
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-vedaai-text">
          Welcome back, <span className="text-vedaai-accent">{USER_NAME}</span>{' '}
          👋
        </h1>
        <p className="text-vedaai-text-secondary text-sm lg:text-base">
          Create and manage AI-powered assessments for your students.
        </p>
      </motion.div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-vedaai-border p-5 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-24 rounded bg-gray-100" />
                  <div className="h-6 w-16 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                variants={item}
                className="bg-white rounded-xl border border-vedaai-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-xl ${stat.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color.split(' ')[1]}`} />
                  </div>
                  <div>
                    <p className="text-xs text-vedaai-text-secondary font-medium uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-vedaai-text">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-gradient-to-br from-vedaai-primary to-gray-800 rounded-2xl p-6 lg:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-vedaai-accent" />
              <h2 className="text-lg font-semibold">
                Create a New Assignment
              </h2>
            </div>
            <p className="text-sm text-gray-300 max-w-lg">
              Use AI to generate a professional question paper in seconds.
              Choose your subject, grade, and question types — we'll handle
              the rest.
            </p>
          </div>

          <Link href="/assignments/create">
            <Button
              className="bg-vedaai-accent hover:bg-orange-700 text-white focus:ring-vedaai-accent whitespace-nowrap"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Assignments Peek */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-vedaai-text">
            Recent Assignments
          </h2>
          <Link
            href="/assignments"
            className="text-sm font-medium text-vedaai-accent hover:text-orange-700 transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-vedaai-border divide-y divide-vedaai-border">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-5 py-4 animate-pulse"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-gray-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-56 rounded bg-gray-100" />
                    <div className="h-3 w-32 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="hidden sm:block h-3 w-24 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : recentAssignments.length === 0 ? (
          <EmptyState
            title="No assignments yet"
            description="Create your first assignment and let AI generate a professional question paper for you."
            actionLabel="Create Assignment"
            icon={<img src="/illustrations.png" alt="No Assignments" />}
            onAction={() => router.push('/assignments/create')}
          />
        ) : (
          <div className="bg-white rounded-xl border border-vedaai-border divide-y divide-vedaai-border">
            {recentAssignments.map((assignment) => (
              <Link
                key={assignment._id}
                href={`/assignments/${assignment._id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-50">
                    <FileText className="h-5 w-5 text-vedaai-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-vedaai-text">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-vedaai-text-secondary">
                      {assignment.subject} • Class {assignment.grade}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-vedaai-text-secondary hidden sm:block">
                  {new Date(assignment.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Link
          href="/assignments/create"
          className="group flex items-center gap-4 bg-white rounded-xl border border-vedaai-border p-5 hover:shadow-md hover:border-vedaai-accent/30 transition-all"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-vedaai-accent/10 group-hover:bg-vedaai-accent/20 transition-colors">
            <Plus className="h-6 w-6 text-vedaai-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-vedaai-text">
              New Assignment
            </p>
            <p className="text-xs text-vedaai-text-secondary">
              Create from scratch with AI
            </p>
          </div>
        </Link>

        <Link
          href="/assignments"
          className="group flex items-center gap-4 bg-white rounded-xl border border-vedaai-border p-5 hover:shadow-md hover:border-vedaai-accent/30 transition-all"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-vedaai-text">
              My Assignments
            </p>
            <p className="text-xs text-vedaai-text-secondary">
              View and manage all papers
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
