"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Heart,
  MoreVertical,
  MapPinIcon,
  ClockIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApplication } from "@/lib/application-context";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import useSWR from "swr";
import Link from "next/link";

// Define interfaces for the API response
interface SalaryRange {
  min: string;
  max: string;
  formatted: string;
}

interface Skill {
  id: number;
  name: string;
}

interface SavedJob {
  id: number;
  title: string;
  experience_level: string;
  location: string;
  description: string;
  is_remote: boolean;
  employment_type: string;
  salary_range: SalaryRange;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  slug: string;
  posted_date: string;
  posted_date_formatted: string;
  employer_id: number;
  employer_name: string;
  image: string;
  skills: Skill[];
  created_at: string;
  updated_at: string;
  viewed: boolean;
  saved: boolean;
  is_applied: boolean;
  year_of_experience: string;
  expected_salary: string;
  notice_period: string;
  cover_letter: string;
  job_label: string;
}

interface SavedJobsResponse {
  success: boolean;
  message: string;
  data: SavedJob[];
}

const SavedJobsPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { openApplicationPanel } = useApplication();

  const {
    data: savedJobsResponse,
    isLoading,
    error,
    mutate,
  } = useSWR<SavedJobsResponse>("api/activity/all-saved-job", defaultFetcher);

  const filteredJobs = useMemo(() => {
    if (!savedJobsResponse?.data) return [];

    return savedJobsResponse.data
      .filter((job) => {
        if (filter === "all") return true;
        return job.employment_type.toLowerCase() === filter.toLowerCase();
      })
      .filter((job) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchLower) ||
          job.employer_name.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          job.skills.some((skill) =>
            skill.name.toLowerCase().includes(searchLower)
          )
        );
      });
  }, [filter, search, savedJobsResponse]);

  const handleRemove = async (id: number) => {
    try {
      // Call API to remove the job from saved list
      const { response } = await baseFetcher(`api/activity/unsave-job/${id}`, {
        method: "GET",
      });

      if (response?.ok) {
        // Refresh the data after successful removal
        mutate();
      } else {
        console.error("Failed to remove job:");
      }
    } catch (error) {
      console.error("Error removing job:", error);
    }
  };

  const handleApply = (e: React.MouseEvent, job: SavedJob) => {
    e.preventDefault();
    openApplicationPanel({
      id: job.id,
      title: job.title,
      employer_name: job.employer_name,
      location: job.location,
      employment_type: job.employment_type,

      salary_range: job.salary_range,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      benefits: job.benefits,
      posted_date_formatted: job.posted_date_formatted,
      is_remote: job.is_remote,
      skills: job.skills,

      experience_level: job.experience_level || "",
      year_of_experience: job.year_of_experience || "",
      expected_salary: job.expected_salary || "",
      notice_period: job.notice_period || "",
      cover_letter: job.cover_letter || "",
      posted_date: job.posted_date || "",
      employer_id: job.employer_id || 0,
      image: job.image || "",
      created_at: job.created_at || "",
      updated_at: job.updated_at || "",
      viewed: job.viewed || false,
      saved: true, // Since this is from saved jobs
      is_applied: job.is_applied || false,
    });
  };

  if (isLoading) {
    return (
      <section className="py-8 2xl:px-0 lg:px-12 px-4">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p>Loading saved jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 2xl:px-0 lg:px-12 px-4">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500">
              Error loading saved jobs. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-normal font-nasalization text-manduSecondary mb-1">
            Saved Jobs
          </h1>
          <p className="text-manduNeutral">
            Review and apply to your bookmarked positions
          </p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-manduSecondary">Saved Jobs</h2>
              <div className="flex space-x-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-3 p-8 text-center text-neutral-600">
                No saved jobs found matching your criteria
              </div>
            ) : (
              filteredJobs.map((job) => (
                // <div
                //   key={job.id}
                //   className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-neutral-200"
                // >
                //   <div className="flex items-start gap-4">
                //     <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden">
                //       {job.image ? (
                //         <Image width={48} height={48} src={job.image} alt={job.employer_name} className="w-full h-full object-cover" />
                //       ) : (
                //         <div className="text-white text-xl">{job.employer_name[0]}</div>
                //       )}
                //     </div>
                //     <div className="flex-1 min-w-0">
                //       <div className="flex justify-between items-start">
                //         <div className="min-w-0">
                //           <h3 className="text-lg font-medium truncate">
                //             {job.title}
                //           </h3>
                //           <p className="text-neutral-600 truncate capitalize">
                //             {job.employer_name}
                //           </p>
                //         </div>
                //         <DropdownMenu>
                //           <DropdownMenuTrigger asChild>
                //             <Button
                //               variant="ghost"
                //               size="icon"
                //               className="h-8 w-8 flex-shrink-0"
                //             >
                //               <MoreVertical className="h-4 w-4" />
                //             </Button>
                //           </DropdownMenuTrigger>
                //           <DropdownMenuContent
                //             align="end"
                //             className="w-[200px]"
                //           >
                //             <Link href={`/jobs/${job?.slug}`}>
                //               <DropdownMenuItem>View Details</DropdownMenuItem>
                //             </Link>
                //             <DropdownMenuItem
                //               onClick={() => handleRemove(job.id)}
                //               className="text-red-600"
                //             >
                //               Remove from Saved
                //             </DropdownMenuItem>
                //           </DropdownMenuContent>
                //         </DropdownMenu>
                //       </div>
                //       <div className="flex flex-wrap gap-2 my-3">
                //         {/* Prioritize showing skills if available */}
                //         {job.skills && job.skills.length > 0 ? (
                //           job.skills.map((skill) => (
                //             <span
                //               key={skill.id}
                //               className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
                //             >
                //               {skill.name}
                //             </span>
                //           ))
                //         ) : (
                //           // Fallback to requirements if no skills are available
                //           job.requirements.slice(0, 3).map((req, index) => {
                //             const words = req.split(' ').slice(0, 3).join(' ');
                //             const tag = words.length > 20 ? words.substring(0, 20) + '...' : words;

                //             return (
                //               <span
                //                 key={index}
                //                 className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
                //               >
                //                 {tag}
                //               </span>
                //             );
                //           })
                //         )}
                //       </div>
                //       <div className="space-y-2">
                //         <div className="flex items-center gap-4 text-sm text-neutral-600">
                //           <span className="flex items-center gap-1">
                //             <MapPin className="h-4 w-4" />
                //             {job.location}
                //             {job.is_remote && " (Remote)"}
                //           </span>
                //           <span className="flex items-center gap-1">
                //             <Clock className="h-4 w-4" />
                //             {job.employment_type}
                //           </span>
                //         </div>
                //         <div className="flex items-center gap-1 text-sm text-neutral-600">
                //           {/* <DollarSign className="h-4 w-4" /> */}
                //           {job.salary_range.formatted}
                //         </div>
                //       </div>
                //       <div className="mt-4">
                //         <Button
                //           className={`w-full ${job.is_applied ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300' : 'bg-black text-white hover:bg-neutral-800'}`}
                //           onClick={(e) => handleApply(e, job)}
                //           disabled={job.is_applied}
                //         >
                //           {job.is_applied ? 'Already Applied' : 'Apply Now'}
                //         </Button>
                //       </div>
                //     </div>
                //   </div>
                // </div>
                <div
                  key={job?.id}
                  className="bg-white rounded-xl shadow-xl p-6 border-[2px] border-manduSecondary/40 hover:shadow-[inset_1px_0_0_0_rgb(220,20,60,1),inset_0_1px_0_0_rgb(220,20,60,1),inset_0_-1px_0_0_rgb(220,20,60,1),inset_-1px_0_0_0_rgb(220,20,60,1)] transition-all duration-200 h-full flex flex-col"
                >
                  <div className="flex items-start flex-col gap-y-[10px] w-full">
                    <div className="flex items-start gap-x-4 w-full">
                      <div className="w-16 h-16 p-2 bg-white rounded-xl justify-center flex-shrink-0">
                        <div className="text-white text-xl">
                          <Image
                            src={job?.image}
                            alt="Company Logo"
                            width={64}
                            height={64}
                            className="h-[40px] w-[60px]"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-text-20 font-semibold feat-text">
                              {job?.title}
                              <span className="bg-manduSecondary-10  text-sm  font-medium ml-2 rounded-3xl px-2 py-1  text-manduSecondary capitalize">
                                {job?.job_label}
                              </span>
                            </h3>
                            <p className="text-sm capitalize text-manduCustom-secondary-blue font-semibold">
                              {job?.employer_name}
                            </p>
                          </div>
                          <div>
                              <Link href={`/jobs/${job?.slug}`} className="flex justify-start items-center gap-2 font-medium">
                            <p className="text-manduSecondary flex justify-start items-center gap-2 font-medium">
                              View Job
                                <ChevronRightIcon className="h-4 w-4 text-manduSecondary" />
                            </p>
                              </Link>
                          </div>
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
                        className={` ${
                          job.is_applied
                            ? "bg-manduSecondary text-white"
                            : "bg-manduSecondary text-white hover:bg-manduSecondary"
                        }`}
                        onClick={(e) => handleApply(e, job)}
                        disabled={job.is_applied}
                      >
                        {job.is_applied ? "Already Applied" : "Apply Now"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                Showing {filteredJobs.length} of{" "}
                {savedJobsResponse?.data.length || 0} saved jobs
              </div>
              <div className="flex space-x-2">
                <Button className="bg-white border border-manduSecondary text-manduSecondary " variant="outline" size="sm" disabled={true}>
                  Previous
                </Button>
                <Button className="bg-manduSecondary text-white" size="sm" disabled={true}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavedJobsPage;
