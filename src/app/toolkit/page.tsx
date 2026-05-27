'use client';

import React from 'react';
import { FeatureUpcoming } from '@/components/ui/FeatureUpcoming';

export default function ToolkitPage() {
  return (
    <FeatureUpcoming
      title="AI Teacher's Toolkit"
      description="This workspace is on the way. Soon you’ll have tools for generating, organizing, and refining teaching material faster."
      backHref="/"
      backLabel="Back to Home"
    />
  );
}
