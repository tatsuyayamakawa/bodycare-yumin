'use client';

import { Footer } from 'src/components/common/Footer';
import { Header } from 'src/components/common/Header';
import { About } from 'src/components/lp/About';
import { Access } from 'src/components/lp/Access';
import { Faq } from 'src/components/lp/Faq';
import { Hero } from 'src/components/lp/Hero';
import { Media } from 'src/components/lp/Media';
import { Menu } from 'src/components/lp/Menu';
import { Profile } from 'src/components/lp/Profile';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Profile />
        <Media />
        <Menu />
        <Faq />
        <Access />
      </main>
      <Footer />
    </>
  );
}
