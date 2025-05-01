import { YouTubeEmbed } from "@next/third-parties/google";

export default function VideoDialog() {
  return (
    <YouTubeEmbed videoid={String(process.env.NEXT_PUBLIC_YOUTUBE_VIDEO)} />
  );
}
