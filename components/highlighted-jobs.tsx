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

  const {data: highlightedJobs, error, isLoading, mutate} = useSWR<JobResponse>("api/job/latest?label=highlighted", defaultFetcher);

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

    const handleApply = (e: React.MouseEvent, job:any) => {
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
      const { response, result } = await baseFetcher(saved ? "api/activity/unsave-job/" + id : "api/activity/save-job/" + id, {
        method: "GET",
      })
  
      if (response?.ok) {
        toast({
          title: "Success",
          description: result?.message,
          variant: "default",
        });
      }
      else {
        toast({
          title: "Error",
          description: result?.message,
          variant: "destructive",
        });
      }
      mutate();
  
    }

  return (
    highlightedJobs &&  highlightedJobs?.data?.length >0  ?   <section className="py-12 bg-neutral-50 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-nasalization uppercase text-manduSecondary">Highlighted Jobs</h2>
          <Link
            href="/jobs/featured"
            className="text-base flex items-center hover:underline cursor-pointer group text-manduSecondary font-semibold"
          >
            View all <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlightedJobs?.data?.map((job) => (
            // <Link key={job.id} href={`/jobs/${job.id}`}>
            //   <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-neutral-200">
            //     <div className="flex items-start gap-4">
            //       <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
            //         <div className="text-white text-2xl">
            //           <Image src={job?.image} alt={job?.title} width={64} height={64} />
            //         </div>
            //       </div>
            //       <div className="flex-1">
            //         <div className="flex justify-between items-start">
            //           <div>
            //             <h3 className="text-xl font-medium mb-1">
            //               {job.title}
            //             </h3>
            //             <p className="text-neutral-600 mb-3">{job.employer_name}</p>
            //           </div>
            //           <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
            //             Featured
            //           </span>
            //         </div>
            //         <div className="flex flex-wrap gap-2 my-3">
            //           {job.skills &&
            //             job.skills.map((skill, id) => (
            //               <span
            //                 key={id}
            //                 className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
            //               >
            //                 {skill?.name}
            //               </span>
            //             ))}
            //         </div>
            //         <div className="flex items-center justify-between mb-4">
            //           <div className="flex items-center gap-4 text-sm text-neutral-600">
            //             <span className="flex items-center gap-1">
            //               <MapPin className="h-4 w-4" />
            //               {job.location}
            //             </span>
            //             <span className="flex items-center gap-1">
            //               <Clock className="h-4 w-4" />
            //               {job.employment_type}
            //             </span>
            //             <span className="flex items-center gap-1">
            //               <DollarSign className="h-4 w-4" />
            //               {job?.salary_range?.formatted}
            //             </span>
            //           </div>
            //           <Button
            //             variant="ghost"
            //             size="icon"
            //             className="text-neutral-400 hover:text-neutral-600"
            //           >
            //             <Heart className="h-5 w-5" />
            //           </Button>
            //         </div>
            //         <div className="flex justify-between items-center">
            //           <Button
            //             className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800"
            //             onClick={(e) => handleApply(e, job)}
            //           >
            //             {isAuthenticated ? "Apply Now" : "Sign in to Apply"}
            //           </Button>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </Link>
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
                <h3 className="text-lg font-semibold feat-text">{job?.title}
                <span className="bg-manduSecondary/10  text-sm  font-medium ml-2 rounded-3xl px-2 py-1  text-manduSecondary capitalize">
                    {
                      "Featured"
                    }
                </span>
                </h3>
                <p className="text-sm capitalize text-manduPrimary font-medium">{job?.employer_name}</p>
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
              ) : null}
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-600 mb-1">
              <span className="flex items-center gap-2 capitalize">
                <MapPinIcon className="h-4 w-4 text-[#4A5568]" />
                {job?.location}
              </span>
              <span className="flex items-center gap-2 capitalize">
                <ClockIcon className="h-4 w-4 text-[#4A5568]" />
                {job?.employment_type}
              </span>
             
            </div>
             <span className="flex items-center mb-4 text-manduSecondary text-[17px] font-bold">
                {job?.salary_range?.formatted}
              </span>
           
          </div>
          </div>
              <Button
                className={`w-full bg-manduPrimary text-white hover:bg-neutral-800  ${isAuthenticated && !isEmployer ? job.is_applied ? "bg-manduSecondary text-white font-semibold cursor-not-allowed" : "bg-manduSecondary": "bg-manduPrimary text-white"}`}
                onClick={(e)=> handleApply(e, job)}
              >
                {isAuthenticated && !isEmployer
                  ? job?.is_applied
                    ? "Applied"
                    : "Apply Now"
                  : "Sign in to Apply"}
              </Button>
            </div>
      </div>
    </Link>
          ))}
        </div>
      </div>
    </section> : <></>
    
  
  );
};

export default HighlightedJobs;
