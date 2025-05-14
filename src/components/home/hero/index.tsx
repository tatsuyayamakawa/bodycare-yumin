import HeroDesktop from "./components/desktop";
import HeroMobile from "./components/mobile";
import { heroStyles } from "./constants";

export default function Hero() {
  const { container, desktop, mobile } = heroStyles;

  return (
    <div className={container.base}>
      <HeroDesktop className={desktop.base} />
      <HeroMobile className={mobile.base} />
    </div>
  );
}
