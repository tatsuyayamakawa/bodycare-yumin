import type { MetadataRoute } from "next";

import { getBaseURL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getBaseURL(),
      lastModified: new Date(),
    },
    {
      url: `${getBaseURL()}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${getBaseURL()}/privacy`,
      lastModified: new Date(),
    },
  ];
}
