'use client'
import React from "react";
import { notFound } from "next/navigation";
import JobDetailPageClient from "@/components/job-detail-page-client";
import {
  jobs,
  getFeaturedJobs,
  getPopularJobs,
  getClosingJobs,
} from "@/lib/constants";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { Job } from "@/types/job-type";

// Get all jobs for lookup
const allJobs = [
  ...jobs,
  ...getFeaturedJobs(),
  ...getPopularJobs(),
  ...getClosingJobs(),
];

// export async function generateStaticParams() {
//   return allJobs.map((job) => ({
//     id: job.id.toString(),
//   }));
// }

const Page = ({ params }: { params: { id: string } }) => {
  const job = allJobs.find((j) => j.id.toString() === params.id);


  const {data: jobDesc, isLoading, error, mutate} = useSWR("api/job/description/"+params?.id, defaultFetcher);

  console.log(jobDesc);
  if (!job) {
    notFound();
  }

  // return <></>

  return <JobDetailPageClient job={jobDesc?.data} />;
};

export default Page;
