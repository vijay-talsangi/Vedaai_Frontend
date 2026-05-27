'use client';

import React from 'react';
import { FeatureUpcoming } from '@/components/ui/FeatureUpcoming';

export default function GroupsPage() {
  return (
    <FeatureUpcoming
      title="My Groups"
      description="Group management is coming soon. You’ll be able to organize classes, assign work, and track progress from one place."
      backHref="/"
      backLabel="Back to Home"
    />
  );
}
