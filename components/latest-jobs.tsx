"use client";

import React from "react";
import JobCard from "./ui/job-card";
import { ArrowRightIcon } from "./ui/icons";
import Link from "next/link";
import { jobs } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { JobResponse } from "@/types/job-type";

const LatestJobs = () => {
  const { isAuthenticated } = useAuth();


  const {
    data: latestJobs,
    error,
    isLoading,
    mutate,
  } = useSWR<JobResponse>("api/job/latest?label=new", defaultFetcher);

  return (
    <section className="py-12 bg-white 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-normal text-manduSecondary uppercase font-nasalization">Latest Jobs</h2>
          <Link
            href="/jobs"
            className="flex capitalize items-center hover:underline cursor-pointer group text-manduSecondary font-semibold text-base"
          >
            View all <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestJobs?.data?.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.employer_name}
              location={job.location}
              jobType={job.employment_type}
              salary={job.salary_range?.formatted}
              postedTime={job.posted_date_formatted}
              isAuthenticated={isAuthenticated}
              job={job}
              mutate={mutate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
