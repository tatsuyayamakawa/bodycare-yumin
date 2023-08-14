import Image from 'next/image';

import heroImage from 'public/images/hero.jpg';

export const Hero = () => {
  return (
    <section className="mx-auto max-w-screen-xl">
      <figure>
        <Image src={heroImage} alt="手もみ整体 癒眠 待合室写真" sizes="100vw" quality={75} priority className="mx-auto h-auto xl:rounded-lg" />
      </figure>
    </section>
  );
};
