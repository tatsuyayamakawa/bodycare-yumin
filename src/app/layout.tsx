import React from 'react';

import '../styles/globals.css';
import { data } from '../constants/data';
import { notojp, zenmincho, allura, b612mono } from '../constants/fonts';
import { GoogleTagManager } from '../lib/google-tagmanager/google-tagmanager';
import { googleTagManagerId } from '../lib/google-tagmanager/google-tagmanager-id';

import type { GoogleTagManagerId } from '../lib/google-tagmanager/google-tagmanager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? `${data.info.domain}`),
  manifest: '/manifest.json',
  themeColor: '#F9F9F9',
  title: data.info.title,
  description: data.info.description,
  openGraph: {
    title: data.info.title,
    description: data.info.description,
    siteName: data.info.title,
    locale: 'ja_JP',
    type: 'website',
    images: '/opengraph-image.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: data.info.title,
    description: data.info.description,
    images: '/opengraph-image.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE,
  },
  alternates: {
    canonical: data.info.domain,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja-JP" className={`${notojp.variable} ${zenmincho.variable} ${allura.variable} ${b612mono.variable}`}>
      <GoogleTagManager googleTagManagerId={googleTagManagerId as GoogleTagManagerId} />
      <body id="header">{children}</body>
    </html>
  );
}
