import { About } from 'src/components/lp/About';
import { Access } from 'src/components/lp/Access';
import { Faq } from 'src/components/lp/Faq';
import { Hero } from 'src/components/lp/Hero';
import { Media } from 'src/components/lp/Media';
import { Menu } from 'src/components/lp/Menu';
import { Profile } from 'src/components/lp/Profile';

export const Main = () => {
  return (
    <main>
      <Hero />
      <About />
      <Profile />
      <Media />
      <Menu />
      <Faq />
      <Access />
    </main>
  );
};
