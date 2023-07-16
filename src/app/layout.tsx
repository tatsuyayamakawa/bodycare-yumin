import Script from "next/script";
import "@/app/globals.css";
import { notojp, zenmincho, allura, b612mono } from "@/utiles/fonts";
import type { Metadata } from "next";
import Data from "@/data/data.json";

const data = Data.data;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL ?? "https://bodycare-yumin.com"),
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
    <html
      lang="jp"
      className={`${notojp.variable} ${zenmincho.variable} ${allura.variable} ${b612mono.variable}`}
    >
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_ID}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_ID}');
        `}
      </Script>
      <body>{children}</body>
    </html>
  );
}
