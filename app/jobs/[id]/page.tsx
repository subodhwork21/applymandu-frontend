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
import {JobDescription } from "@/types/job-type";

// Get all jobs for lookup
const allJobs = [
  ...jobs,
  ...getFeaturedJobs(),
  ...getPopularJobs(),
  ...getClosingJobs(),
];



const Page = ({ params }: { params: { id: string } }) => {


  const {data: jobDesc, isLoading, error, mutate} = useSWR<JobDescription>("api/job/description/"+params?.id, defaultFetcher);

  if (error) {
    // notFound();
  }


  return <JobDetailPageClient job={jobDesc?.data!} mutate={mutate}/>;
};

export default Page;
