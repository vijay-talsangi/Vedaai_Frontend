'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  Users,
  FileText,
  Monitor,
  Clock,
  Settings,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutGrid },
  { href: '/groups', label: 'My Groups', icon: Users },
  { href: '/assignments', label: 'Assignments', icon: FileText },
  { href: '/toolkit', label: "AI Teacher's Toolkit", icon: Monitor },
  { href: '/library', label: 'My Library', icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col sidebar-width h-[calc(100vh-2rem)] bg-white/96 border border-white/70 radius-lg fixed left-5 top-4 z-30 card-surface backdrop-blur overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-5">
        <div className="flex items-center justify-center h-10 w-10 radius-md bg-vedaai-accent shadow-sm">
          <img src="vedaai.png" alt="logo" />
        </div>
        <span className="text-2xl font-bold text-vedaai-text">VedaAI</span>
      </div>

      {/* Create Assignment Button */}
      <div className="px-5 mb-5">
        <Link href="/assignments/create">
          <button className="w-full flex items-center justify-center gap-2 rounded-full bg-vedaai-primary text-white py-3.5 px-4 text-sm font-medium hover:bg-[#222] transition-all duration-200 shadow-[0_10px_20px_rgba(0,0,0,0.14)] ring-2 ring-vedaai-accent/80 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            Create Assignment
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#efefef] text-vedaai-text shadow-inner'
                  : 'text-vedaai-text-secondary hover:bg-gray-50 hover:text-vedaai-text'
              )}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 mb-4 mt-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-vedaai-text-secondary hover:bg-gray-50 hover:text-vedaai-text transition-all duration-200"
        >
          <Settings className="h-[18px] w-[18px]" />
          <span>Settings</span>
        </Link>
      </div>

      {/* School Profile Card */}
      <div className="mx-4 mb-4 rounded-2xl bg-[#f4f4f4] border border-[#e8e8e8] p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-vedaai-accent/10 text-vedaai-accent font-bold text-sm flex-shrink-0 overflow-hidden">
            <span>🏫</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-vedaai-text truncate">
              Delhi Public School
            </p>
            <p className="text-xs text-vedaai-text-secondary truncate">
              School workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
