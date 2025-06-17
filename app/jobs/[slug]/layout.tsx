import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "api/seo/job-slugs"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return (
      data?.job_slugs?.map((item: any) => ({
        slug: item,
      })) || []
    );
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "api/seo/job-info/" + params?.slug
  );
  if (!response.ok) {
    notFound()
  }
  const data = await response.json();
  return {
    title: data?.title,
    description: data?.description
      ? data.description.length > 155
        ? data.description.slice(0, 155) + "..."
        : data.description
      : "Job opportunity available",
    openGraph: {
      images: data?.image
        ? [
            {
              url: data.image,
              width: 800,
              height: 600,
            },
          ]
        : [],
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return <>{children}</>;
}
