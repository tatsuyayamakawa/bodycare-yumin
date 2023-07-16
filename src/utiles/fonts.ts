import { Noto_Sans_JP, Zen_Old_Mincho, Allura, B612_Mono } from "next/font/google";

export const notojp = Noto_Sans_JP({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-notojp",
	display: "swap",
});

export const zenmincho = Zen_Old_Mincho({
	weight: "700",
	subsets: ["latin"],
	variable: "--font-zenmincho",
	display: "swap",
});

export const allura = Allura({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-allura",
	display: "swap",
});

export const b612mono = B612_Mono({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-b612mono",
	display: "swap",
});
