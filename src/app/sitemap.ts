import { MetadataRoute } from 'next';

import { data } from '../constants/data';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${data.info.domain}`,
      lastModified: new Date(),
    },
  ];
}
