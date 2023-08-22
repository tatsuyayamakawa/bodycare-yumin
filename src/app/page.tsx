'use client';

import React, { useEffect } from 'react';

import { Footer } from 'src/components/common/Footer';
import { Header } from 'src/components/common/Header';
import { Main } from 'src/components/common/Main';
import { registerServiceWorker } from 'src/utils/registerServiceWorker';

export default function Home() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
