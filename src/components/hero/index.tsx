import HeroDesktop from "./components/desktop";
import HeroMobile from "./components/mobile";

const Hero = () => {
  return (
    <>
      <HeroDesktop className="hidden md:block" />
      <HeroMobile className="md:hidden" />
    </>
  );
};

export default Hero;
