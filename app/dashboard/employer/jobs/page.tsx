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
  const page = searchParams.get("page");

  const handleViewApplications = (jobId: number) => {
    router.push(`/dashboard/employer/applications?jobId=${jobId}`);
  };

  const { data: jobsResponse, mutate } = useSWR<JobsResponse>(
    `api/employer/job/all-employer-job${page ? `?page=${page}` : ""}`,
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
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Job Listings</h1>
          <Button
            className="bg-black text-white hover:bg-neutral-800"
            onClick={() => setIsPostJobModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                  <Select 
                    defaultValue="all" 
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No job listings found matching your criteria.
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-neutral-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                              {job.employment_type}
                            </span>
                            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                              {job.location_type}
                            </span>
                            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                              {job.salary_range.formatted}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-neutral-600">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              {job.experience_level}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Deadline: {format(new Date(job.application_deadline), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 ${job.status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} rounded-full text-sm`}>
                          {job.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditJob(job)}
                        >
                          Edit
                        </Button>
                        <Button onClick={() => handleToggleJobStatus(job.id)} variant="outline" size="sm">
                          {job.status ? "Pause" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-black text-white hover:bg-neutral-800"
                          onClick={() => handleViewApplications(job.id)}
                        >
                          View Applications
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {jobsResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-1">
                    {jobsResponse.meta.links.map((link, i) => (
                      <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        className={link.active ? "bg-black text-white" : ""}
                        onClick={() => {
                          if (link.url) {
                            // Extract page number from URL
                            const url = new URL(link.url);
                            const page = url.searchParams.get("page");
                            if (page) {
                              router.push(`/dashboard/employer/jobs?page=${page}`);
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

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Listings Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Active Jobs</span>
                  <span className="text-sm">{listingOverview && listingOverview?.active_jobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Paused</span>
                  <span className="text-sm">{listingOverview && listingOverview?.paused_jobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Closed</span>
                  <span className="text-sm">{listingOverview && listingOverview?.closed_jobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Total Views</span>
                  <span className="text-sm">{listingOverview && listingOverview?.total_views}</span>
                </div>

              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Job
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Job
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                 <Button
                 onClick={()=> router.push("/dashboard/employer/trashed-jobs")}
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Recycle className="h-4 w-4 mr-2" />
                  Restore Trash Jobs
                </Button>
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
