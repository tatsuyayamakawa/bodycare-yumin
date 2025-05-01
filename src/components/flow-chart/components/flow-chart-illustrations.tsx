import { images } from "../assets";

export default function FlowChartIllustrations() {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${images.flow_illust_01.src})`,
          backgroundSize: "290px 290px",
          backgroundRepeat: "no-repeat",
        }}
        className="pointer-events-none hidden xl:absolute xl:top-[600px] xl:left-[500px] xl:z-10 xl:block xl:h-[290px] xl:w-[290px]"
        role="presentation"
      />
      <div
        style={{
          backgroundImage: `url(${images.flow_illust_02.src})`,
          backgroundSize: "290px 290px",
          backgroundRepeat: "no-repeat",
        }}
        className="pointer-events-none hidden xl:absolute xl:right-[550px] xl:bottom-[650px] xl:z-10 xl:block xl:h-[290px] xl:w-[290px]"
        role="presentation"
      />
      <div
        style={{
          backgroundImage: `url(${images.flow_bg.src})`,
          backgroundSize: `${images.flow_bg.width}px ${images.flow_bg.height}px`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="pointer-events-none hidden xl:absolute xl:top-1/2 xl:left-1/2 xl:block xl:h-[1200px] xl:w-[1200px] xl:-translate-x-1/2 xl:-translate-y-1/2"
        role="presentation"
      />
    </>
  );
}
