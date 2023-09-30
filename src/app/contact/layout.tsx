import React from 'react';

import { data } from '../../constants/data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: data.contact.title,
  description: data.contact.description,
  openGraph: {
    title: data.contact.title,
    description: data.contact.description,
  },
  twitter: {
    title: data.contact.title,
    description: data.contact.description,
  },
  alternates: {
    canonical: data.contact.domain,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
