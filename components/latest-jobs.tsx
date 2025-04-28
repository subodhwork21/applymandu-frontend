"use client";

import React from "react";
import JobCard from "./ui/job-card";
import { ArrowRightIcon } from "./ui/icons";
import Link from "next/link";
import { jobs } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

const LatestJobs = () => {
  const { isAuthenticated } = useAuth();
  const latestJobs = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()
    )
    .slice(0, 3);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Latest Jobs</h2>
          <Link
            href="/jobs"
            className="text-sm flex items-center hover:underline cursor-pointer group"
          >
            View all <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              jobType={job.type}
              salary={job.salary}
              postedTime={job.postedTime}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
