'use client';

import React from 'react';

import { useReadingProgress } from 'src/hooks/useReadingProgress';

export const ProgressBar = () => {
  const completion = useReadingProgress();

  return <span style={{ width: `${completion}%` }} className="absolute h-1 w-full bg-accent" />;
};
