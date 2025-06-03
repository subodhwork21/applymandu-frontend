"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Plus, UserPlus, Download, Ban, CheckCircle, MoreHorizontal } from "lucide-react";
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
import { baseFetcher, baseFetcherAdmin, defaultFetcher, defaultFetcherAdmin } from "@/lib/fetcher";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCookie, setCookie } from "cookies-next";

interface JobSeekerProfile {
  id: number;
  user_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  district: string;
  municipality: string;
  city_tole: string;
  date_of_birth: string;
  mobile: string;
  preferred_job_type: string;
  gender: string;
  has_driving_license: boolean;
  has_vehicle: boolean;
  career_objectives: string;
  created_at: string;
  updated_at: string;
  looking_for: string;
  salary_expectations: string;
  industry: string;
}

interface Jobseeker {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  image_path: string | null;
  profile: JobSeekerProfile | null;
  status?: boolean;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
  applications_count?: number;
  saved_jobs_count?: number;
  resume?: string;
}

interface JobseekersResponse {
  data: Jobseeker[];
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

const AdminJobseekersPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [selectedJobseekerId, setSelectedJobseekerId] = useState<number | null>(null);
  const [blockAction, setBlockAction] = useState<"block" | "unblock">("block");

  const searchParams = useSearchParams();
  const params = searchParams.toString();

  const { data: jobseekersResponse, mutate } = useSWR<JobseekersResponse>(
    `api/admin/job-seekers?${params ? `${params}` : ""}`,
    defaultFetcherAdmin
  );

  const { data: stats } = useSWR<Record<string, any>>(
    "api/admin/jobseekers/stats", 
    defaultFetcherAdmin
  );

  const handleToggleJobseekerStatus = async (jobseekerId: number, currentStatus: boolean) => {
    setSelectedJobseekerId(jobseekerId);
    setBlockAction(currentStatus ? "block" : "unblock");
    setIsBlockDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedJobseekerId) return;
    
    const { response, result, errors } = await baseFetcher(`api/admin/jobseekers/${selectedJobseekerId}/toggle-status`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || `Jobseeker ${blockAction === "block" ? "blocked" : "unblocked"} successfully`,
      });
      setIsBlockDialogOpen(false);
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  const handleImpersonateJobseeker = async(jobseekerId: number) => {
    const {response, result, errors} = await baseFetcherAdmin("api/admin/impersonate/"+jobseekerId, {
      method: "POST",
    });
    if(response?.ok){
     
      deleteCookie("IMP_TOKEN");
      setCookie("IMP_TOKEN", result.token);
       toast({
        title: "Success",
        description: result.message || "You are now impersonating this jobseeker",
      });
      router.push(`/dashboard/jobseeker/`);
    }
    else{
      toast({
        title: "Error",
        description: errors || "Something went wrong"
      });
    }
  };

  // Filter jobseekers based on search query and filters
  const filteredJobseekers = jobseekersResponse?.data.filter((jobseeker) => {
    if (statusFilter !== "all") {
      const jobseekerStatus = jobseeker.status ? "active" : "blocked";
      if (statusFilter !== jobseekerStatus) return false;
    }

    if (experienceFilter !== "all" && jobseeker.profile?.preferred_job_type !== experienceFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        jobseeker.first_name.toLowerCase().includes(query) ||
        jobseeker.last_name.toLowerCase().includes(query) ||
        jobseeker.email.toLowerCase().includes(query) ||
        jobseeker.profile?.district?.toLowerCase().includes(query) ||
        jobseeker.profile?.industry?.toLowerCase().includes(query)
      );
    }

    return true;
  }) || [];

  if (!jobseekersResponse) {
    return <div className="p-8 text-center">Loading jobseekers...</div>;
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">Manage Jobseekers</h1>
          <Button
            className="bg-manduCustom-secondary-blue text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => router.push("/dashboard/admin/jobseekers/export")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Jobseekers
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
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    defaultValue="all"
                    value={experienceFilter}
                    onValueChange={setExperienceFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] border border-grayText">
                      <SelectValue placeholder="All Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Experience</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search jobseekers..."
                    className="pl-10 w-full md:w-64"
                    value={searchQuery}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        let searchParam = new URLSearchParams(searchParams).toString();
                        searchParam = "";
                        searchParam += `search=${searchQuery}`;
                        router.push(`/dashboard/admin/jobseekers?${searchParam}`, {
                          scroll: false,
                        });
                        mutate();
                      }
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 flex flex-col gap-6">
                {filteredJobseekers.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No jobseekers found matching your criteria.
                  </div>
                ) : (
                  filteredJobseekers.map((jobseeker) => (
                    <Card 
                      key={jobseeker.id} 
                      className="w-full rounded-[15px] border-[0.5px] border-manduSecondary/30 shadow-[0px_2px_5px_#00000040]"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                              {jobseeker.image_path ? (
                                <img 
                                  src={jobseeker.image_path} 
                                  alt={`${jobseeker.first_name} ${jobseeker.last_name}`} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-manduCustom-secondary-blue text-white text-xl font-bold">
                                  {jobseeker.first_name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h2 className="font-['Poppins'] font-semibold text-manduCustom-secondary-blue text-xl leading-6">
                                {jobseeker.first_name} {jobseeker.last_name}
                              </h2>
                              <p className="text-grayColor text-sm mt-1">{jobseeker.email}</p>
                              <div className="flex items-center gap-2 mt-2">
                                {jobseeker.profile?.preferred_job_type && (
                                  <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                    {jobseeker.profile.preferred_job_type}
                                  </Badge>
                                )}
                                {jobseeker.profile?.district && (
                                  <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                    {jobseeker.profile.district}
                                  </Badge>
                                )}
                                {jobseeker.profile?.industry && (
                                  <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                    {jobseeker.profile.industry}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`${jobseeker.status ? "bg-[#14dc14]/10 text-[#006B24]" : "bg-red-100 text-manduSecondary"} font-semibold text-sm px-4 py-0.5 rounded-full`}>
                              {jobseeker.status ? "Active" : "Blocked"}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/jobseekers/${jobseeker.id}`)}>
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/jobseekers/${jobseeker.id}/applications`)}>
                                  View Applications
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleJobseekerStatus(jobseeker.id, !!jobseeker.status)}>
                                  {jobseeker.status ? "Block User" : "Unblock User"}
                                </DropdownMenuItem>
                                                               <DropdownMenuItem
                                  className="text-manduCustom-secondary-blue"
                                  onClick={() => handleImpersonateJobseeker(jobseeker.id)}
                                >
                                  Impersonate User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                          {jobseeker.phone && (
                            <div className="text-sm text-grayColor">
                              <span className="font-medium">Phone:</span> {jobseeker.phone}
                            </div>
                          )}
                          {jobseeker.created_at && (
                            <div className="text-sm text-grayColor">
                              <span className="font-medium">Joined:</span> {format(new Date(jobseeker.created_at), "MMM dd, yyyy")}
                            </div>
                          )}
                          {jobseeker.applications_count !== undefined && (
                            <div className="text-sm text-grayColor">
                              <span className="font-medium">Applications:</span> {jobseeker.applications_count}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/admin/jobseekers/${jobseeker.id}`)}
                          >
                            View Profile
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/admin/jobseekers/${jobseeker.id}/applications`)}
                          >
                            View Applications
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 border-blue-600"
                            onClick={() => handleImpersonateJobseeker(jobseeker.id)}
                          >
                            Impersonate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              {jobseekersResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6 overflow-x-auto">
                  <div className="flex flex-wrap space-x-1">
                    {jobseekersResponse.meta.links.map((link, i) => (
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
                              router.push(`/dashboard/admin/jobseekers?page=${page}`, {
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

          <div className="lg:col-span-1 md:col-span-1 space-y-6">
            <Card className="w-full rounded-[15.54px] border-[1.94px] border-solid border-slate-200">
              <div className="bg-[#fcfcfc] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 p-[13px_29px]">
                <h2 className="font-medium text-manduSecondary text-xl leading-[30px]">
                  Jobseekers Overview
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[26px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Active Jobseekers</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.active_jobseekers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Blocked Jobseekers</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.blocked_jobseekers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Total Jobseekers</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.total_jobseekers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">New This Month</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.new_jobseekers_this_month || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">With Complete Profiles</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.complete_profiles || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full rounded-[15.54px] border-[1.94px] border-solid border-slate-200">
              <div className="bg-[#fcfcfc] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 p-[13px_29px]">
                <h2 className="font-medium text-manduSecondary text-xl leading-[30px]">
                  Quick Actions
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[20px]">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/jobseekers/export")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Jobseekers
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/jobseekers/blocked")}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    View Blocked Users
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/jobseekers/verification-requests")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verification Requests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {blockAction === "block" ? "Block User" : "Unblock User"}
            </DialogTitle>
            <DialogDescription>
              {blockAction === "block" 
                ? "Are you sure you want to block this user? They will no longer be able to access their account."
                : "Are you sure you want to unblock this user? They will regain access to their account."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={blockAction === "block" ? "destructive" : "default"}
              onClick={confirmStatusChange}
            >
              {blockAction === "block" ? "Block" : "Unblock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminJobseekersPage;

