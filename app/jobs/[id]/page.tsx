import React from "react";
import { notFound } from "next/navigation";
import JobDetailPageClient from "@/components/job-detail-page-client";
import {
  jobs,
  getFeaturedJobs,
  getPopularJobs,
  getClosingJobs,
} from "@/lib/constants";

// Get all jobs for lookup
const allJobs = [
  ...jobs,
  ...getFeaturedJobs(),
  ...getPopularJobs(),
  ...getClosingJobs(),
];

export async function generateStaticParams() {
  return allJobs.map((job) => ({
    id: job.id.toString(),
  }));
}

const JobDetailPage = ({ params }: { params: { id: string } }) => {
  const job = allJobs.find((j) => j.id.toString() === params.id);

  if (!job) {
    notFound();
  }

  return <JobDetailPageClient job={job} />;
};

export default JobDetailPage;
