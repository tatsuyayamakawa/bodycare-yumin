import { SvgInstagram } from 'src/components/elements/icon/SvgIcons';

export const Footer = () => {
  return (
    <footer className="bg-secondary">
      <div className="mx-5 border border-gray-25/20"></div>
      <div className="mx-5 flex flex-col items-center justify-between gap-6 py-[2.5rem] md:mx-10 md:flex-row lg:mx-20">
        <div className="flex items-center justify-center gap-6">
          <span className="font-zenmincho text-base font-normal not-italic leading-relaxed tracking-wide text-gray-75">FOLLOW ME</span>
          <SvgInstagram />
        </div>
        <div className="flex items-center justify-between">
          <small className="font-notojp text-sm font-normal not-italic tracking-wide text-gray-75"> &copy; 2012-2023 手もみ整体 癒眠 </small>
        </div>
      </div>
    </footer>
  );
};
