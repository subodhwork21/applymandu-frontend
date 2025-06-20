'use client'
import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "./ui/icons";
import { MapPin, DollarSign, Users, Heart, HeartIcon } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { Button } from "./ui/button";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";

// Define interfaces for the job data based on the actual API response
interface PopularJob {
  id: number;
  title: string;
  slug: string | null;
  location: string;
  company_logo: string | null;
  applications_count: number;
  salary: string;
  company_name: string;
  skills: string[];
  posted_date: string;
saved: boolean;
}

interface PopularJobsResponse {
  success: boolean;
  popular_jobs: PopularJob[];
}

interface ExpiringJob {
  id: number;
  title: string;
  slug: string | null;
  location: string;
  company_logo: string | null;
  applications_count: number;
  salary: string;
  company_name: string;
  skills: string[];
  posted_date: string;
  application_deadline: string;
  days_remaining: number;
  expiring_soon: boolean;
  saved: boolean;
}

interface ExpiringJobsResponse {
  success: boolean;
  expiring_jobs: ExpiringJob[];
}

 


// Create a fetcher function for SWR

const PopularClosingJobs = () => {
  // Fetch popular jobs data
  const { data: popularJobsData, error: popularJobsError, mutate: mutatePopular } = useSWR<PopularJobsResponse>("api/job/popular",
    defaultFetcher
  );

  // Fetch closing jobs data
  const { data: closingJobsData, error: closingJobsError, mutate: mutateClosing } = useSWR<ExpiringJobsResponse>("api/job/expiring",
    defaultFetcher
  );

  // Handle loading state
  const isLoadingPopular = !popularJobsData;
  const isLoadingClosing = !closingJobsData;
  
  // Handle error state
  const hasError = popularJobsError || closingJobsError;

  if (hasError) {
    return <div className="py-12 text-center">Failed to load jobs data</div>;
  }
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
    mutatePopular();
    mutateClosing();
  };

  return (
    <section className="py-12 bg-white 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${closingJobsData?.expiring_jobs?.length === 0 ? "lg:grid-cols-1 gap-8" : "lg:grid-cols-2 gap-8"}`}>
          {/* Most Popular */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-manduSecondary uppercase font-nasalization font-normal">
                Most Popular
              </h2>
              <Link
                href="#"
                className="text-sm flex uppercase text-manduSecondary font-semibold items-center hover:underline cursor-pointer"
              >
                View all <ArrowRightIcon />
              </Link>
            </div>

           {popularJobsData && popularJobsData?.popular_jobs?.length > 0 && <div className="space-y-4 gap-2 flex flex-col w-full justify-between items-start">
              {isLoadingPopular ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <div key={`popular-skeleton-${index}`} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 w-full animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-300 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-neutral-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-neutral-300 rounded w-1/2 mb-3"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-neutral-300 rounded w-1/3"></div>
                          <div className="h-4 bg-neutral-300 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                popularJobsData?.popular_jobs.map((job) => (
                  <Link 
                    key={job.id} 
                    href={`/jobs/${job?.slug}`} 
                    className="w-full"
                  >
                    <div className="bg-white rounded-lg p-4 shadow-sm transition-shadow border border-neutral-200 hover:shadow-[inset_4px_0_0_0_rgb(220,20,60),inset_0_1px_0_0_rgb(220,20,60),inset_0_-1px_0_0_rgb(220,20,60),inset_-1px_0_0_0_rgb(220,20,60)]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                          <div className="text-sm">
                            <Image
                              src={job.company_logo || "/placeholder-logo.png"}
                              alt={`${job.company_name} Logo`}
                              width={45}
                              height={45}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold feat-text text-base leading-[24px]">
                                {job.title}
                              </h3>
                              <p className="text-grayColor text-sm mb-1">
                                {job.company_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* <Button
                                variant="ghost"
                                size="icon"
                                className="text-neutral-400 hover:text-neutral-600"
                              >
                                <Heart className="h-5 w-5" fill="grayText"/>
                              </Button> */}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm  justify-between">
                            <div className="flex gap-8 text-grayColor">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-grayColor" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1 text-[14px] font-semibold text-manduSecondary">
                                {job.salary}
                              </span>
                            </div>
                            <span className="flex items-center text-sm text-manduSecondary">
                              <Users className="h-4 w-4 mr-1" />
                              {job.applications_count} applied
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>}
          </div>

          {/* Closing Soon */}
          <div>
            {
                closingJobsData && closingJobsData?.expiring_jobs?.length > 0 && (
                    <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-manduSecondary font-nasalization font-normal">
                Closing Soon
              </h2>
              <Link
                href="#"
                className="text-sm flex text-manduSecondary font-semibold items-center hover:underline cursor-pointer"
              >
                View all <ArrowRightIcon />
              </Link>
            </div>
                )
            }
          

        { closingJobsData && closingJobsData?.expiring_jobs?.length > 0 ?   <div className="space-y-4">
              {isLoadingClosing ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <div key={`closing-skeleton-${index}`} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 w-full animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-300 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-neutral-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-neutral-300 rounded w-1/2 mb-3"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-neutral-300 rounded w-1/3"></div>
                          <div className="h-4 bg-neutral-300 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (

             closingJobsData &&  closingJobsData?.expiring_jobs.map((job) => (
              <> 
                  <Link 
                    key={job.id} 
                    href={`/jobs/${job?.slug}`} 
                    className="w-full"
                  >
                    <div className={`bg-white p-4 mb-6 hover:shadow-[inset_4px_0_0_0_rgb(220,20,60),inset_0_1px_0_0_rgb(220,20,60),inset_0_-1px_0_0_rgb(220,20,60),inset_-1px_0_0_0_rgb(220,20,60)] rounded-lg shadow-sm transition-shadow border ${job.expiring_soon ? 'border-orange-300' : 'border-neutral-200'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                          <div className="text-xl">
                            <Image
                              src={job.company_logo || "/placeholder-logo.png"}
                              alt={`${job.company_name} Logo`}
                              width={45}
                              height={45}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold feat-text text-base">
                                {job.title}
                              </h3>
                              <p className="text-grayColor text-sm mb-1">
                                {job.company_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* {job?.saved === true ? (
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
                                              <HeartIcon fill="grayText" size={20} />
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
                                              className="text-neutral-400 border-1px border-grayText rounded-full"
                                            >
                                              <HeartIcon />
                                            </Button>
                                          ) : null} */}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600 justify-between">
                            <div className="flex gap-8 text-grayColor">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1 text-manduSecondary">
                                {job.salary}
                              </span>
                            </div>
                            <span className={`flex items-center text-sm ${job.expiring_soon ? 'text-orange-500 font-medium' : 'text-manduSecondary'}`}>
                              {job.expiring_soon ? (
                                <>
                                  <Users className="h-4 w-4 mr-1" />
                                  Expires in {job.days_remaining} days
                                </>
                              ) : (
                                <>
                                  <Users className="h-4 w-4 mr-1" />
                                  {job.applications_count} applied
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  </>
                ))
              )}
            </div> : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularClosingJobs;
