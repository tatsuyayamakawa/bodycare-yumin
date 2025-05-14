import type { MediaData, ProfileData, ProfileStyles } from "../types";

export const profileData: ProfileData = {
  title: "整体師",
  name: "山川 達也",
  education: "東洋カイロプラクティック専門学院卒",
  description: [
    "当サロンは一軒家の一室で施術を行っている整体サロンです。",
    "ご提供している東洋整体術（東洋カイロプラクティック）は、カイロプラクティックと整体に、中国の推拿の技術を取り入れた技術となります。",
    "お客様一人ひとりの要望をお聞きしながら、手もみ中心の施術を行いますので、どなたでも安心して施術を受けていただけます。",
  ],
} as const;

export const mediaData: MediaData = {
  heading: "メディア掲載",
  subheading: "Media Listing",
  title: "はつらつ元気 2014年9月号 - 芸文社",
  description: [
    "不眠症改善の専門家として掲載されています。",
    "首の歪みから起こる不眠症の対策、自宅で出来るタオル枕の作り方などを紹介させていただきました。",
  ],
  link: {
    url: process.env.NEXT_PUBLIC_GEIBUNSHA_URL,
    title: "はつらつ元気 2014年 09月号 - 芸文社-GEIBUNSHA-",
    text: "芸文社-GEIBUNSHA-",
  },
} as const;

export const profileStyles: ProfileStyles = {
  container: {
    base: "",
  },
  intro: {
    base: "",
  },
  media: {
    base: "",
  },
} as const;
