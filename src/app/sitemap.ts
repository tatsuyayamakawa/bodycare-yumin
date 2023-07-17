import { MetadataRoute } from 'next'
import Data from "@/data/data.json";

const data = Data.data;

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${data.info.domain}`,
			lastModified: new Date(),
		},
	]
}
