export default function Scroll() {
  return (
    <div className="relative flex items-center">
      <span className="animate-scroll absolute right-5 border-1 border-solid border-[#18181b] after:absolute after:top-full after:-left-[5px] after:block after:h-[10px] after:w-px after:content-[''] after:[border-left:5px_solid_transparent] after:[border-right:5px_solid_transparent] after:[border-top:10px_solid_#18181b]" />
      <span className="absolute -right-3 rotate-90 text-[8px] select-none">
        SCROLL
      </span>
    </div>
  );
}
