'use client';

import React from 'react';
import { FeatureUpcoming } from '@/components/ui/FeatureUpcoming';

export default function LibraryPage() {
  return (
    <FeatureUpcoming
      title="My Library"
      description="A reusable question and resource library is coming soon. You’ll be able to save, browse, and reuse content here."
      backHref="/assignments"
      backLabel="Back to Assignments"
    />
  );
}
