import Image from 'next/image';

import heroImage from 'public/images/hero.jpg';

export const Hero = () => {
  return (
    <section className="relative mx-auto flex max-w-screen-xl flex-col items-center justify-center">
      <figure>
        <Image src={heroImage} alt="手もみ整体 癒眠 待合室写真" sizes="100vw" quality={75} priority className="mx-auto h-auto xl:rounded-lg" />
      </figure>
      <div className="absolute bottom-4 h-10 w-10 animate-popping">
        <span className="absolute left-[33%] top-[25%] z-10 h-5 w-5 translate-y-0 -rotate-45 border-b-2 border-l-2 border-b-white border-l-white"></span>
      </div>
    </section>
  );
};
