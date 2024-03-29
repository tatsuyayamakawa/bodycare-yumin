import { MetadataRoute } from 'next';

import { data } from '../constants/data';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${data.info.domain}/sitemap.xml`,
  };
}
