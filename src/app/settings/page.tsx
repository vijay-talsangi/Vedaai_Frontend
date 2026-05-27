'use client';

import React from 'react';
import { FeatureUpcoming } from '@/components/ui/FeatureUpcoming';

export default function SettingsPage() {
  return (
    <FeatureUpcoming
      title="Settings"
      description="Settings and workspace preferences are coming soon. You’ll be able to manage account and app options here."
      backHref="/"
      backLabel="Back to Home"
    />
  );
}
