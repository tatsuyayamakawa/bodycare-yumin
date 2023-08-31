'use client';

import { About } from '../ui/about';
import { Access } from '../ui/access';
import { Faq } from '../ui/faq';
import { Footer } from '../ui/footer';
import { Header } from '../ui/header';
import { Hero } from '../ui/hero';
import { Media } from '../ui/media';
import { Menu } from '../ui/menu';
import { Profile } from '../ui/profile';

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
