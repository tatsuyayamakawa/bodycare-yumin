import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { appInfo } from "@/constants/data";
import { allura, bebas_neue, noto_sans_jp, zen_old_mincho } from "@/lib/fonts";
import { getBaseURL } from "@/lib/utils";
import "./globals.css";

const { name, title, description } = appInfo;

const baseURL = new URL(getBaseURL());

export const metadata: Metadata = {
  metadataBase: baseURL,
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: "/", languages: { "ja-JP": "/ja-JP" } },
  title: {
    default: name,
    template: `%s - ${name}`,
    absolute: title,
  },
  description,
  openGraph: {
    siteName: name,
    locale: "ja_JP",
    type: "website",
    title,
    description,
    url: getBaseURL(),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  verification: { google: process.env.GOOGLE_VERIFICATION },
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

  return (
    <html lang="ja" suppressHydrationWarning>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body
        className={`${noto_sans_jp.variable} ${zen_old_mincho.variable} ${allura.variable} ${bebas_neue.variable} font-noto-sans-jp min-h-dvh antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
