import "@/app/globals.css";
import GoogleAnalytics from "@/components/parts/GoogleAnalytics";
import type { Metadata } from "next";
import Data from "@/data/data.json";

const data = Data.data;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? `${data.info.domain}`),
  title: data.info.title,
  description: data.info.description,
  openGraph: {
    title: data.info.title,
    description: data.info.description,
    siteName: data.info.title,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja-JP">
      <GoogleAnalytics />
      <body>{children}</body>
    </html>
  );
}
