import { MetadataRoute } from "next";

export default async function siteMap(): Promise<MetadataRoute.Sitemap> {
  // Fetch job slugs for individual job pages
  const jobResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/seo/job-slugs`
  );
  
  if (!jobResponse.ok) {
    throw new Error("Failed to fetch job data");
  }
  
  const jobsSlug = await jobResponse.json();
  
  // Individual job pages
  const jobEntries: MetadataRoute.Sitemap = jobsSlug.job_slugs.map((slug: string) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}jobs/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  // Job listing pages with filters
  const searchEntries: MetadataRoute.Sitemap = [];
  
  // Fetch popular searches
  const searchResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/job/search`
  );
  
  if (searchResponse.ok) {
    const searchData = await searchResponse.json();
    const popularSearches = searchData.popular_searches || [];
    
    popularSearches.forEach((search: { query: string }) => {
      const encodedQuery = encodeURIComponent(search.query);
      searchEntries.push({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}jobs/browse/search/${encodedQuery}`,
        lastModified: new Date(),
        priority: 0.6,
      });
    });
  }

  // Common filter combinations
  const commonLocations = ['kathmandu', 'pokhara', 'lalitpur', 'bhaktapur'];
  const locationEntries: MetadataRoute.Sitemap = commonLocations.map(location => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}jobs/browse/location/${location}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const experienceLevels = ['entry-level', 'mid-level', 'senior-level'];
  const experienceEntries: MetadataRoute.Sitemap = experienceLevels.map(level => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}jobs/browse/experience/${level}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
  const typeEntries: MetadataRoute.Sitemap = jobTypes.map(type => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}jobs/browse/type/${type}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}about`,
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}jobs/browse/all`,
      lastModified: new Date(),
      priority: 0.9,
    },
    ...jobEntries,        // Individual job pages: /jobs/job-slug
    ...searchEntries,     // Search pages: /jobs/browse/search/react
    ...locationEntries,   // Location pages: /jobs/browse/location/kathmandu
    ...experienceEntries, // Experience pages: /jobs/browse/experience/mid-level
    ...typeEntries,       // Type pages: /jobs/browse/type/full-time
  ];
}
