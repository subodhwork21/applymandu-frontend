import { MetadataRoute } from "next";

export default async function siteMap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "api/seo/job-slugs"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const jobsSlug = await response.json();

  const jobEntries: MetadataRoute.Sitemap = jobsSlug?.job_slugs?.map((slug: string) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}jobs/` + slug,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}` + "about",
      lastModified: new Date(),
      priority: 0.5
    },
    ...jobEntries,
  ];
}
