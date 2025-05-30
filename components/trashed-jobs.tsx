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
  BuildingIcon,
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
import { Badge } from "./ui/badge";
import { BriefcaseIcon, MapPinIcon } from "@heroicons/react/24/solid";

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl">Trashed Job Listings</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/employer/jobs")}
            className="w-full sm:w-auto"
          >
            Back to Active Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 lg:col-span-3">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-neutral-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="w-full sm:w-auto">
                  <Select 
                    defaultValue="all"
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
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
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search trashed jobs..."
                    className="pl-10 w-full sm:w-64"
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
                    <Card
                      key={job.id}
                      className="w-full border-[0.5px] border-solid border-[#dc143c]/30 rounded-[15px] shadow-[0px_2px_5px_#00000040]"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                            <h2 className="text-xl font-semibold text-manduPrimary">
                              {job.title}
                            </h2>
                            <Badge className="bg-manduSecondary/30 hover:bg-manduSecondary/60 text-manduSecondary font-semibold px-4 py-2 rounded-full">
                              Trashed
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span className="text-sm text-grayColor font-normal font-['Poppins']">
                                {job.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <BriefcaseIcon className="h-4 w-4" />
                              <span className="text-sm text-grayColor font-['Poppins']">
                                {job.experience_level}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <BuildingIcon className="h-4 w-4" />
                              <span className="text-sm text-grayColor font-['Poppins']">
                                {job.employment_type}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge className="px-5 py-2 bg-grayTag text-manduBorder hover:bg-grayTag/80 rounded-[50px] text-xs">
                                {job.employment_type}
                              </Badge>
                              <Badge className="px-5 py-2 bg-grayTag text-manduBorder hover:bg-grayTag/80 rounded-[50px] text-xs">
                                {job.location_type}
                              </Badge>
                              <Badge className="px-5 py-2 bg-grayTag text-manduBorder hover:bg-grayTag/80 rounded-[50px] text-xs">
                                {job.salary_range.formatted}
                              </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <Button
                                onClick={() => handleRestoreJob(job.id)}
                                variant="outline"
                                className="border-[2px] border-[#006b24] text-[#006b24] rounded-md flex items-center gap-2 w-full sm:w-auto"
                              >
                                <RefreshCwIcon className="h-4 w-4" />
                                Restore
                              </Button>

                              <Button 
                                onClick={() => {
                                  setJobToDelete(job);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="bg-manduSecondary rounded-[6px] text-white border-[2px] flex items-center gap-2 w-full sm:w-auto"
                              >
                                <Trash2Icon className="h-4 w-4" />
                                Delete Permanently
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
                    <div className="font-semibold text-grayColor text-base">
                      Total Trash Jobs
                    </div>
                    <div className="font-semibold text-brand-colorsecondary-color text-base text-right">
                      {jobsResponse.meta.total}
                    </div>
                  </div>

                  <div className="flex items-center w-full">
                    <div className="font-normal text-grayColor text-base">
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
              variant="outline"
              className="w-full flex items-center justify-center gap-[9px] py-2.5 bg-white border-[2.04px] border-[#006a23] rounded-[6.13px] text-colorcard-box-color-g"
            >
              <RefreshCwIcon className="w-4 h-4" />
              <span className=" font-normal text-[14.3px]">
                Restore All Jobs
              </span>
            </Button>

            <Button
             onClick={() => {
                    setJobToDelete({ id: -1 } as Job);
                    setIsDeleteDialogOpen(true);
                  }}
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
                  const { response, result, errors } = await baseFetcher("api/job/batch-force-delete", {
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
