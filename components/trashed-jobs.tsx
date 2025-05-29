"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Trash2,
  RefreshCw,
  Calendar,
  MapPin,
  Briefcase,
  AlertTriangle,
  RefreshCwIcon,
  Trash2Icon,
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
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

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
  deleted_at: string;
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

const TrashedJobsPage = () => {
  const router = useRouter();
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: jobsResponse, mutate } = useSWR<JobsResponse>(
    "api/job/trash/jobs",
    defaultFetcher
  );

  if (!jobsResponse) {
    return <div className="p-8 text-center">Loading trashed job listings...</div>;
  }

  const handleRestoreJob = async (jobId: number) => {
    const { response, result, errors } = await baseFetcher(`api/job/restore/${jobId}`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "Job restored successfully",
      });
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDeletePermanently = async () => {
    if (!jobToDelete) return;
    
    const { response, result, errors } = await baseFetcher(`api/job/force-delete/${jobToDelete.id}`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "Job permanently deleted",
      });
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Filter jobs based on search query and filters
  const filteredJobs = jobsResponse.data.filter((job) => {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Trashed Job Listings</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/employer/jobs")}
          >
            Back to Active Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
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
                    placeholder="Search trashed jobs..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No trashed job listings found matching your criteria.
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
                              Deleted on: {format(new Date(job.deleted_at), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                          Trashed
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreJob(job.id)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => {
                            setJobToDelete(job);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Permanently
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
                              // Refetch with new page
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
<Card className="w-full border-slate-200 border-[1.94px] rounded-[15.54px]">
        <CardHeader className="bg-[#fdfdfd] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 px-[29px] py-[13px]">
          <CardTitle className="font-medium text-manduSecondary text-xl ">
            Trashed Jobs Info
          </CardTitle>
        </CardHeader>
        <Separator className="w-full" />
        <CardContent className="p-[31px]">
          <div className="flex flex-col gap-[30px]">
            <div className="flex items-center justify-between w-full">
              <div className=" font-semibold text-grayColor  text-base">
                Total Trash Jobs
              </div>
              <div className=" font-semibold text-brand-colorsecondary-color text-base text-right">
               {jobsResponse.meta.total}
              </div>
            </div>

            <div className="flex items-center w-full">
              <div className=" font-normal text-grayColor  text-base">
                 Trashed jobs are kept for 30 days before being permanently deleted. You can restore them anytime during this period.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Card */}
      <Card className="w-full border-slate-200 border-[1.94px] rounded-[15.54px]">
        <CardHeader className="bg-[#fcfcfc] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 px-[29px] py-[13px]">
          <CardTitle className="font-medium text-manduSecondary text-xl ">
            Bulk Actions
          </CardTitle>
        </CardHeader>
        <Separator className="w-full" />
        <CardContent className="p-[31px]">
          <div className="flex flex-col gap-[30px]">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-[9px] py-2.5 bg-white border-[2.04px] border-[#006a23] rounded-[6.13px] text-colorcard-box-color-g"
            >
              <RefreshCwIcon className="w-4 h-4" />
              <span className=" font-normal text-[14.3px]">
                Restore All Jobs
              </span>
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-[9px] py-2.5 bg-white border-[2.04px] border-[#dc143c] rounded-[6.13px] text-brand-colorsecondary-color"
            >
              <Trash2Icon className="w-4 h-4" />
              <span className=" font-normal text-[14.3px]">
                Delete All Jobs
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
          {/* <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Trashed Jobs Info</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Total Trashed Jobs</span>
                  <span className="text-sm">{jobsResponse.meta.total}</span>
                </div>
                <p className="text-sm text-neutral-600">
                  Trashed jobs are kept for 30 days before being permanently deleted. You can restore them anytime during this period.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Bulk Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={async () => {
                    const { response, result, errors } = await baseFetcher("api/job/batch-restore", {
                      method: "POST",
                      body: JSON.stringify({
                        ids: jobsResponse.data.map((job) => job.id),
                      }),
                    });
                    
                    if (response?.ok) {
                      toast({
                        title: "Success",
                        description: result.message || "All jobs restored successfully",
                      });
                      mutate();
                    } else {
                      toast({
                        title: "Error",
                        description: errors || "Something went wrong",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restore All Jobs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    // Show confirmation dialog for emptying trash
                    setJobToDelete({ id: -1 } as Job); // Use -1 as a special ID to indicate "all jobs"
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Empty Trash
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Confirmation Dialog for Permanent Deletion */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {jobToDelete?.id === -1 ? "Empty Trash" : "Delete Job Permanently"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {jobToDelete?.id === -1 
                ? "Are you sure you want to permanently delete all trashed jobs? This action cannot be undone."
                : `Are you sure you want to permanently delete "${jobToDelete?.title}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (jobToDelete?.id === -1) {
                  // Empty trash (delete all trashed jobs)
                  const { response, result, errors } = await baseFetcher("api/job/batch-delete", {
                    method: "POST",
                    body: JSON.stringify({
                      ids: jobsResponse.data.map((job) => job.id),
                    }),
                  });
                  
                  if (response?.ok) {
                    toast({
                      title: "Success",
                      description: result.message || "Trash emptied successfully",
                    });
                    mutate();
                  } else {
                    toast({
                      title: "Error",
                      description: errors || "Something went wrong",
                      variant: "destructive",
                    });
                  }
                } else {
                  // Delete single job permanently
                  handleDeletePermanently();
                }
                setIsDeleteDialogOpen(false);
                setJobToDelete(null);
              }}
            >
              {jobToDelete?.id === -1 ? "Empty Trash" : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default TrashedJobsPage;
