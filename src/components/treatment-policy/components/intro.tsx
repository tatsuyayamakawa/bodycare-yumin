export default function Intro() {
  return (
    <div className="text-brand-primary">
      <h2 className="relative mx-auto w-fit text-center text-lg/normal font-medium md:text-3xl/normal">
        <span className="block pb-1 before:absolute before:bottom-3 before:-left-14 before:inline-block before:h-[5px] before:w-12 before:rotate-[50deg] before:bg-[radial-gradient(circle_farthest-side,_#71645D,_#71645D_50%,_transparent_60%,_transparent)] before:[background-size:5px] before:content-[''] md:pb-2">
          お悩みの症状に
        </span>
        <span className="after:absolute after:-right-14 after:bottom-3 after:inline-block after:h-[5px] after:w-12 after:-rotate-[50deg] after:bg-[radial-gradient(circle_farthest-side,_#71645D,_#71645D_50%,_transparent_60%,_transparent)] after:[background-size:5px] after:content-['']">
          効果のある施術を行います
        </span>
      </h2>
      <h3 className="mx-auto my-6 w-fit text-lg/normal font-semibold after:-mt-[8px] after:block after:content-[''] after:[border-top:6px_solid_#FB923C] md:my-[50px] md:text-4xl/normal md:after:-mt-[6px] md:after:[border-top:12px_solid_#FB923C] lg:text-5xl/normal">
        機械を使わない安心安全の整体です
      </h3>
      <div className="text-sm/normal md:text-center md:text-base/normal lg:text-lg/normal [&>p]:mb-4 lg:[&>p]:mb-6 [&>p:last-child]:mb-0">
        <p>手もみ整体 癒眠は「手もみ専門」の整体サロンです。</p>
        <p>
          <span className="md:block">
            一軒家の一室でお客様同士が重ならないよう時間調整を行っており、
          </span>
          お客様一人ひとり充分な時間をかけた丁寧な施術を心がけております。
        </p>
        <p>
          <span className="md:block">
            手技矯正は希望者にのみ実施いたしますので、
          </span>
          ボキボキが苦手な方や整体が初めての方も安心してご利用いただけます。
        </p>
      </div>
    </div>
  );
}
