import { MetadataRoute } from 'next'
import Data from "@/data/data.json";

const data = Data.data;

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/private/',
		},
		sitemap: `${data.info.domain}/sitemap.xml`,
	}
}
