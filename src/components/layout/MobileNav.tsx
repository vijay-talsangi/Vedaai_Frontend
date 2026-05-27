'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutGrid, FileText, Clock, Sparkles } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: LayoutGrid },
  { href: '/assignments', label: 'Assignments', icon: FileText },
  { href: '/library', label: 'Library', icon: Clock },
  { href: '/toolkit', label: 'AI Toolkit', icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-2 right-2 z-30 lg:hidden no-print">
      <div className="radius-lg bg-black border border-vedaai-border shadow-[0_10px_30px_rgba(0,0,0,0.08)] px-2 py-3">
        <div className="flex items-center justify-around h-14 px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
                className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all duration-200 min-w-[56px]',
                isActive
                  ? 'text-vedaai-accent'
                  : 'text-vedaai-text-secondary'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      </div>
    </nav>
  );
}
