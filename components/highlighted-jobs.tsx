"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "./ui/icons";
import { MapPin, Clock, DollarSign, Heart, HeartIcon } from "lucide-react";
import { getFeaturedJobs } from "@/lib/constants";
import { Button } from "./ui/button";
import { useApplication } from "@/lib/application-context";
import { useAuth } from "@/lib/auth-context";
import useSWR from "swr";
import { JobResponse } from "@/types/job-type";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import Image from "next/image";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { toast } from "@/hooks/use-toast";

const HighlightedJobs = () => {
  // const featuredJobs = getFeaturedJobs();

  const {
    data: highlightedJobs,
    error,
    isLoading,
    mutate,
  } = useSWR<JobResponse>("api/job/latest?label=highlighted", defaultFetcher);

  const { openApplicationPanel } = useApplication();
  const { isAuthenticated, openLoginModal, user, isEmployer } = useAuth();

  // const handleApply = (e: React.MouseEvent, job: any) => {
  //   e.preventDefault();
  //   if (isAuthenticated) {
  //     openApplicationPanel(job);
  //   } else {
  //     openLoginModal();
  //   }
  // };

  const handleApply = (e: React.MouseEvent, job: any) => {
    e.preventDefault();
    if (isAuthenticated && !isEmployer) {
      if (job?.is_applied) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this job.",
        });
        return;
      }
      openApplicationPanel(job);
    } else {
      openLoginModal();
    }
  };

  const handleSaveJob = async (id: number, saved: boolean) => {
    const { response, result } = await baseFetcher(
      saved ? "api/activity/unsave-job/" + id : "api/activity/save-job/" + id,
      {
        method: "GET",
      }
    );

    if (response?.ok) {
      toast({
        title: "Success",
        description: result?.message,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: result?.message,
        variant: "destructive",
      });
    }
    mutate();
  };

  return highlightedJobs && highlightedJobs?.data?.length > 0 ? (
    <section className="py-12 bg-neutral-50 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-text-28 font-normal font-nasalization uppercase text-manduSecondary">
            Highlighted Jobs
          </h2>
          <Link
            href="/jobs/featured"
            className="text-text-16 flex items-center hover:underline cursor-pointer group text-manduSecondary font-semibold"
          >
            View all <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlightedJobs?.data?.map((job) => (
            <Link key={job?.id} href={`/jobs/${job?.slug}`}>
              <div className="bg-white rounded-xl shadow-xl p-6 border-[2px] border-manduSecondary/40 hover:shadow-[inset_1px_0_0_0_rgb(220,20,60,1),inset_0_1px_0_0_rgb(220,20,60,1),inset_0_-1px_0_0_rgb(220,20,60,1),inset_-1px_0_0_0_rgb(220,20,60,1)] transition-all duration-200 h-full flex flex-col">
                <div className="flex items-start flex-col gap-y-[10px] w-full">
                  <div className="flex items-start gap-x-4 w-full">
                    <div className="w-14 h-14 p-2 bg-white rounded-xl justify-center flex-shrink-0">
                      <div className="text-white text-xl">
                        <Image
                          src={job?.image}
                          alt="Company Logo"
                          width={60}
                          height={60}
                          className="h-[60px] w-[60px]"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-text-20 font-semibold feat-text">
                            {job?.title}
                            <span className="bg-manduSecondary-10  text-sm  font-medium ml-2 rounded-3xl px-2 py-1  text-manduSecondary capitalize">
                              {"Highlighted"}
                            </span>
                          </h3>
                          <p className="text-sm capitalize text-manduCustom-secondary-blue font-semibold">
                            {job?.employer_name}
                          </p>
                        </div>
                        {job?.saved === true ? (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSaveJob(job?.id, job?.saved!);
                            }}
                            // variant="ghost"
                            size="icon"
                            className="bg-white border border-grayText rounded-full"
                          >
                            <HeartIcon fill="#D1D1D1" size={25} />
                          </Button>
                        ) : job?.saved === false ? (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSaveJob(job?.id, job?.saved!);
                            }}
                            variant="ghost"
                            size="icon"
                            className="border shadow-sm border-grayText rounded-full"
                          >
                            <HeartIcon size={20} />
                          </Button>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#525252] mb-1">
                        <span className="flex items-center gap-2 capitalize">
                          <MapPinIcon className="h-4 w-4 text-[#525252]" />
                          {job?.location}
                        </span>
                        <span className="flex items-center gap-2 capitalize">
                          <ClockIcon className="h-4 w-4 text-[#525252]" />
                          {job?.employment_type}
                        </span>
                      </div>
                      <span className="flex items-center mb-4 text-manduSecondary text-text-16 font-semibold">
                        {job?.salary_range?.formatted}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2">
                      {job.skills &&
                        job.skills.map((skill, id) => (
                          <span
                            key={id}
                            className="px-4 py-2 font-semibold bg-grayTag/70  rounded-[50px] text-sm capitalize text-manduBorder"
                          >
                            {skill?.name}
                          </span>
                        ))}
                    </div>
                    <Button
                      className={` bg-manduCustom-secondary-blue text-white hover:bg-neutral-800  ${
                        isAuthenticated && !isEmployer
                          ? job.is_applied
                            ? "bg-manduSecondary text-white font-semibold cursor-not-allowed"
                            : "bg-manduSecondary"
                          : "bg-manduCustom-secondary-blue text-white"
                      }`}
                      onClick={(e) => handleApply(e, job)}
                    >
                      {isAuthenticated && !isEmployer
                        ? job?.is_applied
                          ? "Applied"
                          : "Apply Now"
                        : "Sign in to Apply"}
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
};

export default HighlightedJobs;
