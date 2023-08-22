'use client';

import React, { useEffect } from 'react';

import './globals.css';
import { data } from 'src/constants/data';
import { GoogleTagManager } from 'src/libs/google-tagmanager/google-tagmanager';
import { googleTagManagerId } from 'src/libs/google-tagmanager/google-tagmanager-id';
import { registerServiceWorker } from 'src/utils/registerServiceWorker';

import type { Metadata } from 'next';
import type { GoogleTagManagerId } from 'src/libs/google-tagmanager/google-tagmanager';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? `${data.info.domain}`),
  title: data.info.title,
  description: data.info.description,
  openGraph: {
    title: data.info.title,
    description: data.info.description,
    siteName: data.info.title,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: data.info.title,
    description: data.info.description,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE,
  },
  alternates: {
    canonical: data.info.domain,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <html lang="ja-JP">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#F9F9F9" />
      <GoogleTagManager googleTagManagerId={googleTagManagerId as GoogleTagManagerId} />
      <body id="header">{children}</body>
    </html>
  );
}
