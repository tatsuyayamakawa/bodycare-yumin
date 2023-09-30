import React from 'react';

import { data } from '../../constants/data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: data.privacy.title,
  description: data.privacy.description,
  openGraph: {
    title: data.privacy.title,
    description: data.privacy.description,
  },
  twitter: {
    title: data.privacy.title,
    description: data.privacy.description,
  },
  alternates: {
    canonical: data.privacy.domain,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
