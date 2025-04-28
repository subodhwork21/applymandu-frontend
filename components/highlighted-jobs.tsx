"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "./ui/icons";
import { MapPin, Clock, DollarSign, Heart } from "lucide-react";
import { getFeaturedJobs } from "@/lib/constants";
import { Button } from "./ui/button";
import { useApplication } from "@/lib/application-context";
import { useAuth } from "@/lib/auth-context";

const HighlightedJobs = () => {
  const featuredJobs = getFeaturedJobs();
  const { openApplicationPanel } = useApplication();
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleApply = (e: React.MouseEvent, job: any) => {
    e.preventDefault();
    if (isAuthenticated) {
      openApplicationPanel(job);
    } else {
      openLoginModal();
    }
  };

  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Highlighted Jobs</h2>
          <Link
            href="/jobs/featured"
            className="text-sm flex items-center hover:underline cursor-pointer group"
          >
            View all <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-neutral-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <div className="text-white text-2xl">{job.company[0]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-medium mb-1">
                          {job.title}
                        </h3>
                        <p className="text-neutral-600 mb-3">{job.company}</p>
                      </div>
                      <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 my-3">
                      {job.tags &&
                        job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-neutral-600"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800"
                        onClick={(e) => handleApply(e, job)}
                      >
                        {isAuthenticated ? "Apply Now" : "Sign in to Apply"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightedJobs;
