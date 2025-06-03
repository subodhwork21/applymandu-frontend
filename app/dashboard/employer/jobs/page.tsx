"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Copy,
  Share,
  Download,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Recycle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PostJobModal from "@/components/post-job-modal";
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface Skill {
  id: number;
  name: string;
}

interface Job {
  id: number;
  title: string;
  experience_level: string;
  location: string;
  description: string;
  location_type: string;
  employment_type: string;
  department: string;
  application_deadline: string;
  salary_range: {
    min: string;
    max: string;
    formatted: string;
  };
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
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
  status: boolean;
  slug: string;
}

interface JobsResponse {
  data: Job[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

const JobListingsPage = () => {
  const router = useRouter();
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {data: listingOverview, isLoading, mutate:listingOverviewMutate} = useSWR<Record<string,any>>(
    "api/job/listing-overview/all", defaultFetcher
  );

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsPostJobModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPostJobModalOpen(false);
    setSelectedJob(null);
  };

  const searchParams = useSearchParams();
  const params = searchParams.toString();

  const handleViewApplications = (jobId: number) => {
    router.push(`/dashboard/employer/applications?jobId=${jobId}`);
  };

  const { data: jobsResponse, mutate } = useSWR<JobsResponse>(
    `api/employer/job/all-employer-job?${params ? `${params}` : ""}`,
    defaultFetcher
  );

  if (!jobsResponse) {
    return <div className="p-8 text-center">Loading job listings...</div>;
  }

  const handleToggleJobStatus = async (jobId: number) => {
   const {response, result, errors} = await baseFetcher("api/job/update-status/"+jobId, {
      method: "POST",
   });
   if(response?.ok){
    toast({
      title: "Success",
      description: result.message || "Job status updated successfully",
    });
    mutate();
   }
   else{
    toast({
      title: "Error",
      description: errors || "Something went wrong",
    })
   }
  };

  // Filter jobs based on search query and filters
  const filteredJobs = jobsResponse.data.filter((job) => {
    if (statusFilter !== "all") {
     
      const jobStatus = job.viewed ? "paused" : "active"; 
      if (statusFilter !== jobStatus) return false;
    }

    if (departmentFilter !== "all" && job.department !== departmentFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">Job Listings</h1>
          <Button
            className="bg-manduCustom-secondary-blue text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => setIsPostJobModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 gap-6">
          <div className="lg:col-span-4 md:col-span-2">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#E5E7EB]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex flex-col sm:flex-row md:flex-row space-y-4 sm:space-y-0 md:space-y-0 space-x-0 sm:space-x-4 md:space-x-4 w-full md:w-auto">
                  <Select 
                    defaultValue="all" 
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] border border-grayText">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    defaultValue="all"
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] border border-grayText">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    className="pl-10 w-full md:w-64"
                    value={searchQuery}
                    onKeyDown={(e)=> {
                      if (e.key === "Enter") {
                        let searchParam = new URLSearchParams(searchParams).toString();
                        searchParam = "";
                          searchParam += `search=${searchQuery}`;
                        router.push(`/dashboard/employer/jobs?${searchParam}`, {
                          scroll: false,
                        });
                        mutate();
                    }}}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 flex flex-col gap-6">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No job listings found matching your criteria.
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <Card 
                      key={job.id} 
                      className="w-full h-auto sm:h-auto md:h-[197px] rounded-[15px] border-[0.5px] border-manduSecondary/30 shadow-[0px_2px_5px_#00000040] relative"
                    >
                      <CardContent className="p-0">
                        <div className="p-4 sm:p-6 md:p-8">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                            <div>
                              <h2 className="font-['Poppins'] font-semibold text-manduCustom-secondary-blue text-xl leading-6">
                                {job.title}
                              </h2>

                              <div className="flex flex-wrap items-center gap-[11px] mt-5">
                                <div className="flex items-center gap-[11px]">
                                  <div className="w-4 h-4">
                                    <Calendar className="h-4 w-4 text-grayColor" />
                                  </div>
                                  <span className="font-['Poppins'] font-normal text-grayColor text-sm leading-5">
                                    Deadline: {job.application_deadline ? format(new Date(job.application_deadline), "MMM dd, yyyy") : "Not set"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Badge className={`${Number(job.status) === 1 ? "bg-[#14dc14]/10 text-[#006B24] hover:text-[#006B24] hover:bg-[#14dc14]/10 " : "bg-red-100 text-manduSecondary hover:bg-red-100 hover:text-manduSecondary"} font-semibold text-sm px-4 py-0.5 rounded-full hover:text-white hover:bg-`}>
                              {Number(job.status) === 1 ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          {/* Bottom section with badges and buttons */}
                          <div className="mt-6 sm:mt-6 md:mt-0 md:absolute md:bottom-0 md:left-0 md:right-0 p-0 md:p-6 flex flex-col sm:flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                            <div className="flex flex-wrap items-center gap-[5px]">
                              <Badge
                                variant="outline"
                                className="bg-[#f1f1f1b2] text-manduBorder font-semibold text-sm px-5 py-2 rounded-[50px] mb-2 md:mb-0"
                              >
                                {job.employment_type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-[#f1f1f1b2] text-manduBorder font-semibold text-sm px-5 py-2 rounded-[50px] mb-2 md:mb-0"
                              >
                                {job.location_type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-[#f1f1f1b2] text-manduBorder font-semibold text-sm px-5 py-2 rounded-[50px] mb-2 md:mb-0"
                              >
                                {job.salary_range?.formatted}
                              </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                              <Button
                                variant="outline"
                                className="border-manduSecondary text-manduSecondary font-semibold w-full sm:w-auto"
                                onClick={() => handleEditJob(job)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="border-manduSecondary text-manduSecondary font-semibold w-full sm:w-auto"
                                onClick={() => handleToggleJobStatus(job?.id)}
                              >
                                {Number(job?.status) === 1 ? "Pause" : "Activate"}
                              </Button>
                              <Button 
                                className="bg-manduSecondary text-white font-semibold w-full sm:w-auto"
                                onClick={() => handleViewApplications(job.id)}
                              >
                                View Applications
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              {jobsResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6 overflow-x-auto">
                  <div className="flex flex-wrap space-x-1">
                    {jobsResponse.meta.links.map((link, i) => (
                      <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        className={link.active ? "bg-manduCustom-secondary-blue text-white" : ""}
                        onClick={() => {
                          if (link.url) {
                            const url = new URL(link.url);
                            const page = url.searchParams.get("page");

                            if (page) {
                              router.push(`/dashboard/employer/jobs?page=${page}`, {
                                scroll: false,
                              });
                              mutate();
                            }
                          }
                        }}
                      >
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 md:col-span-1  space-y-6">
             <Card className="w-full rounded-[15.54px] border-[1.94px] border-solid border-slate-200">
        <CardHeader className="p-0">
          <div className="bg-[#fcfcfc] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 p-[13px_29px]">
            <CardTitle className="font-medium text-manduSecondary text-xl leading-[30px]">
              Listings Overview
            </CardTitle>
          </div>
          <Separator className="w-full" />
        </CardHeader>
        <CardContent className="p-[10px_30px]">
          <div className="flex flex-col gap-[26px]">
   
              <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor font-normal leading-[21.4px]">Active Jobs</span>
                  <span className="text-sm text-grayColor font-bold">{listingOverview && listingOverview?.active_jobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor font-normal leading-[21.4px]">Paused</span>
                  <span className="text-sm text-grayColor font-bold">{listingOverview && listingOverview?.paused_jobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor font-normal leading-[21.4px]">Closed</span>
                  <span className="text-sm text-grayColor font-bold">{listingOverview && listingOverview?.closed_jobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor font-normal leading-[21.4px]">Total Views</span>
                  <span className="text-sm text-grayColor font-bold">{listingOverview && listingOverview?.total_views}</span>
                </div>
          </div>
        </CardContent>
      </Card>

           

            <div className="bg-white p-0 rounded-lg border border-neutral-200">
              <div className="bg-[#fcfcfc] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 p-[13px_29px]">
              <h2 className="font-medium mb-0 text-manduSecondary  text-xl leading-[30px]">Quick Actions</h2>
              </div>
              <div className="space-y-0 px-[16px]">
                 <div className="flex flex-col items-start justify-start gap-[20px] pb-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-manduBorder hover:text-neutral-900"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Job
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-manduBorder hover:text-neutral-900"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Job
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-manduBorder hover:text-neutral-900"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                 <Button
                 onClick={()=> router.push("/dashboard/employer/trashed-jobs")}
                  variant="ghost"
                  className="w-full justify-start text-manduBorder hover:text-neutral-900"
                >
                  <Recycle className="h-4 w-4 mr-2" />
                  Restore Trash Jobs
                </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={handleCloseModal}
        editJob={selectedJob ? {
          id: selectedJob.id.toString(),
          title: selectedJob.title,
          department: selectedJob?.department,
          employment_type: selectedJob.employment_type,
          experience_level: selectedJob?.experience_level,
          location: selectedJob.location,
          salary_min: selectedJob.salary_range.min,
          salary_max: selectedJob.salary_range.max,
          location_type: selectedJob?.location_type,
          application_deadline: selectedJob?.application_deadline,
          skills: selectedJob?.skills.map((skill) => skill.name),
          salary: selectedJob.salary_range.formatted,
          status: selectedJob.status,
          requirements: selectedJob?.requirements,
          responsibilities: selectedJob?.responsibilities,
          benefits: selectedJob?.benefits,
          description: selectedJob.description,
          slug: selectedJob.slug,
        } : undefined}
        mutate={mutate}
      />
    </section>
  );
};

export default JobListingsPage;
