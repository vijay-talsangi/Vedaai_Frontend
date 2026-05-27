'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Menu,
  X,
  LayoutGrid,
  FileText,
  Clock,
  Sparkles,
  Settings,
  Users,
  Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileMenuItems = [
  { href: '/', label: 'Home', icon: LayoutGrid },
  { href: '/groups', label: 'My Groups', icon: Users },
  { href: '/assignments', label: 'Assignments', icon: FileText },
  { href: '/toolkit', label: "AI Teacher's Toolkit", icon: Monitor },
  { href: '/library', label: 'My Library', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function getBreadcrumb(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Home';
  const labels: Record<string, string> = {
    assignments: 'Assignments',
    create: 'Create Assignment',
    groups: 'My Groups',
    toolkit: "AI Teacher's Toolkit",
    library: 'My Library',
    settings: 'Settings',
  };
  return segments
    .map((s) => labels[s] || s)
    .join(' / ');
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const breadcrumb = getBreadcrumb(pathname);
  const showBack = pathname !== '/';

  return (
    <>
      <header className="sticky top-3 z-20 mx-3 radius-lg border border-white/70 bg-white/95 card-surface backdrop-blur no-print lg:mx-0 lg:top-4">
        <div className="flex items-center justify-between topbar-height px-4 lg:px-6">
          {/* Left: Mobile logo OR desktop back + breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-2">
              <div className="flex items-center justify-center h-9 w-9 radius-md bg-vedaai-accent">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-bold text-vedaai-text">VedaAI</span>
            </div>

            {/* Desktop back + breadcrumb */}
              <div className="hidden lg:flex items-center gap-3">
              {showBack && (
                <button
                  onClick={() => router.back()}
                  className="flex items-center justify-center h-9 w-9 radius-md hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-5 w-5 text-vedaai-text" />
                </button>
              )}
              <h1 className="text-sm font-medium text-vedaai-text-secondary">
                {breadcrumb}
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
              <Bell className="h-5 w-5 text-vedaai-text" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-vedaai-accent border-2 border-white" />
            </button>

            {/* User avatar + name */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-vedaai-border">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-vedaai-accent to-orange-400 text-white text-sm font-bold shadow-sm">
                JD
              </div>
              <span className="text-sm font-medium text-vedaai-text">
                John Doe
              </span>
              <ChevronDown className="h-4 w-4 text-vedaai-text-secondary" />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex lg:hidden items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {menuOpen ? (
                <X className="h-5 w-5 text-vedaai-text" />
              ) : (
                <Menu className="h-5 w-5 text-vedaai-text" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-4 border-b border-vedaai-border">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-vedaai-accent to-orange-400 text-white text-xs font-bold shadow-sm">
                  JD
                </div>
                <span className="text-sm font-semibold text-vedaai-text">
                  John Doe
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-3 space-y-1">
              {mobileMenuItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-orange-50 text-vedaai-accent'
                        : 'text-vedaai-text-secondary hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-20 left-0 right-0 px-4">
              <Link
                href="/assignments/create"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-vedaai-primary text-white py-3 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4" />
                Create Assignment
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
