// Workaround related to: https://github.com/vercel/next.js/issues/29788
declare type StaticImageData = {
	src: string;
	height: number;
	width: number;
	placeholder?: string;
};

// ImageWrapper.tsx
type ImageWrapperProps = {
	src: StaticImageData;
	alt: string;
	className?: string;
};

// Nav.tsx
type NavProps = {
	to: string;
	title: string;
	className: string;
	toggle?: any;
};

// SectionHeader.tsx
type SectionProps = {
	heading2: string;
	heading3: string;
	isAlign: boolean;
};

// Menu.tsx
type MenuItem = {
	id: number;
	src: StaticImageData;
	title: string;
	time: string;
	price: string;
	content: string;
};

// Faq.tsx
type IconProps = {
	id: number;
	open: number;
};

type QuestionItem = {
	id: number;
	question: string;
	answer: string;
};

// GoogleMaps.tsx
type Coordinates = {
	lat: number;
	lng: number;
};

type MapProps = {
	googleMapsApiKey: string;
};
