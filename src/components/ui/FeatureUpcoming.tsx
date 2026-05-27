'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeatureUpcomingProps {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}

export function FeatureUpcoming({
  title,
  description,
  backHref = '/',
  backLabel = 'Go Home',
}: FeatureUpcomingProps) {
  return (
    <div className="page-container py-6 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-white/70 bg-white p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.08)] lg:p-12"
      >
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-vedaai-accent">
          <Sparkles className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-[28px] font-bold text-vedaai-text lg:text-[34px]">
            {title}
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-6 text-vedaai-text-secondary lg:text-base">
            {description}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={backHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-vedaai-primary px-6 py-3 text-sm font-medium text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-transform hover:scale-[1.02]"
          >
            {backLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}