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
  MoreHorizontal,
  Trash,
  CheckCircle,
  XCircle,
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
  applications_count: number;
  is_featured: boolean;
  is_approved: boolean;
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

const AdminJobsPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const params = searchParams.toString();

  const { data: jobsResponse, mutate } = useSWR<JobsResponse>(
    `api/admin/jobs?${params ? `${params}` : ""}`,
    defaultFetcher
  );

  const { data: stats } = useSWR<Record<string, any>>(
    "api/admin/jobs/stats", 
    defaultFetcher
  );

  const handleToggleJobStatus = async (jobId: number) => {
    const { response, result, errors } = await baseFetcher(`api/admin/jobs/${jobId}/toggle-status`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "Job status updated successfully",
      });
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  const handleToggleJobApproval = async (jobId: number) => {
    const { response, result, errors } = await baseFetcher(`api/admin/jobs/${jobId}/toggle-approval`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "Job approval status updated successfully",
      });
            mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  const handleToggleJobFeatured = async (jobId: number) => {
    const { response, result, errors } = await baseFetcher(`api/admin/jobs/${jobId}/toggle-featured`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "Job featured status updated successfully",
      });
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJobId) return;
    
    const { response, result, errors } = await baseFetcher(`api/admin/jobs/${selectedJobId}`, {
      method: "DELETE",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "Job deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  const confirmDelete = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsDeleteDialogOpen(true);
  };

  // Filter jobs based on search query and filters
  const filteredJobs = jobsResponse?.data.filter((job) => {
    if (statusFilter !== "all") {
      const jobStatus = job.status ? "active" : "inactive";
      if (statusFilter !== jobStatus) return false;
    }

    if (approvalFilter !== "all") {
      const jobApproval = job.is_approved ? "approved" : "pending";
      if (approvalFilter !== jobApproval) return false;
    }

    if (departmentFilter !== "all" && job.department !== departmentFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.employer_name.toLowerCase().includes(query)
      );
    }

    return true;
  }) || [];

  if (!jobsResponse) {
    return <div className="p-8 text-center">Loading job listings...</div>;
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">Manage Jobs</h1>
          <Button
            className="bg-manduPrimary text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => router.push("/dashboard/admin/jobs/export")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Jobs
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
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    defaultValue="all"
                    value={approvalFilter}
                    onValueChange={setApprovalFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] border border-grayText">
                      <SelectValue placeholder="All Approval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
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
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    className="pl-10 w-full md:w-64"
                    value={searchQuery}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        let searchParam = new URLSearchParams(searchParams).toString();
                        searchParam = "";
                        searchParam += `search=${searchQuery}`;
                        router.push(`/dashboard/admin/jobs?${searchParam}`, {
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
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No job listings found matching your criteria.
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <Card 
                      key={job.id} 
                      className="w-full rounded-[15px] border-[0.5px] border-manduSecondary/30 shadow-[0px_2px_5px_#00000040]"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="font-['Poppins'] font-semibold text-manduPrimary text-xl leading-6">
                                {job.title}
                              </h2>
                              {job.is_featured && (
                                <Badge className="bg-amber-100 text-amber-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-grayColor text-sm mt-1">
                              {job.employer_name} • Posted {format(new Date(job.created_at), "MMM dd, yyyy")}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-[11px] mt-3">
                              <div className="flex items-center gap-[11px]">
                                <div className="w-4 h-4">
                                  <Calendar className="h-4 w-4 text-grayColor" />
                                </div>
                                <span className="font-['Poppins'] font-normal text-grayColor text-sm leading-5">
                                  Deadline: {job.application_deadline ? format(new Date(job.application_deadline), "MMM dd, yyyy") : "Not set"}
                                </span>
                              </div>
                              <div className="flex items-center gap-[11px]">
                                <div className="w-4 h-4">
                                  <Users className="h-4 w-4 text-grayColor" />
                                </div>
                                <span className="font-['Poppins'] font-normal text-grayColor text-sm leading-5">
                                  {job.applications_count} Applications
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 items-end">
                            <div className="flex gap-2">
                              <Badge className={`${job.status ? "bg-[#14dc14]/10 text-[#006B24]" : "bg-red-100 text-manduSecondary"} font-semibold text-sm px-4 py-0.5 rounded-full`}>
                                {job.status ? "Active" : "Inactive"}
                              </Badge>
                              <Badge className={`${job.is_approved ? "bg-[#14dc14]/10 text-[#006B24]" : "bg-yellow-100 text-yellow-800"} font-semibold text-sm px-4 py-0.5 rounded-full`}>
                                {job.is_approved ? "Approved" : "Pending"}
                              </Badge>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Actions <MoreHorizontal className="h-4 w-4 ml-2" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/jobs/${job.slug}`)}>
                                  View Job
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/jobs/${job.id}/applications`)}>
                                  View Applications
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleJobStatus(job.id)}>
                                  {job.status ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleJobApproval(job.id)}>
                                  {job.is_approved ? "Unapprove" : "Approve"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleJobFeatured(job.id)}>
                                  {job.is_featured ? "Unfeature" : "Feature"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => confirmDelete(job.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-[5px] mt-4">
                          <Badge
                            variant="outline"
                            className="bg-[#f1f1f1b2] text-manduBorder font-semibold text-sm px-5 py-2 rounded-[50px]"
                          >
                            {job.employment_type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#f1f1f1b2] text-manduBorder font-semibold text-sm px-5 py-2 rounded-[50px]"
                          >
                            {job.location_type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#f1f1f1b2] text-manduBorder font-semibold text-sm px-5 py-2 rounded-[50px]"
                          >
                            {job.salary_range?.formatted}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#f1f1f1b2] text-manduBorder font-semibold text-sm px-5 py-2 rounded-[50px]"
                          >
                            {job.department}
                          </Badge>
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
                        className={link.active ? "bg-manduPrimary text-white" : ""}
                        onClick={() => {
                          if (link.url) {
                            const url = new URL(link.url);
                            const page = url.searchParams.get("page");

                            if (page) {
                              router.push(`/dashboard/admin/jobs?page=${page}`, {
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
                  Jobs Overview
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[26px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Active Jobs</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.active_jobs || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Inactive Jobs</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.inactive_jobs || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Pending Approval</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.pending_approval || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Featured Jobs</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.featured_jobs || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Total Jobs</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.total_jobs || 0}</span>
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
                    onClick={() => router.push("/dashboard/admin/jobs/pending")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Review Pending Jobs
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/jobs/featured")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Featured Jobs
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/jobs/export")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Jobs Report
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/jobs/trashed")}
                  >
                    <Recycle className="h-4 w-4 mr-2" />
                    View Trashed Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteJob}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminJobsPage;

