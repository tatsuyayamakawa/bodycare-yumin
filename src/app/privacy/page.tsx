'use client';

import { Footer } from '@/ui/footer';
import { Header } from '@/ui/header';
import { PrivacyPolicy } from '@/ui/privacy-policy';

function Privacy() {
  return (
    <>
      <Header />
      <main>
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}

export default Privacy;
