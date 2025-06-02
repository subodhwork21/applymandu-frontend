"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  Ban,
  MoreHorizontal,
  Building,
  Mail,
  Phone,
  Calendar,
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
import {
  baseFetcher,
  baseFetcherAdmin,
  defaultFetcher,
  defaultFetcherAdmin,
} from "@/lib/fetcher";
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
import { Toast } from "@/components/ui/toast";
import { Cookie } from "next/font/google";
import { deleteCookie, setCookie } from "cookies-next";

// Updated interface to match the Laravel API response
interface EmployerProfile {
  id: number;
  user_id: number;
  address: string;
  website: string;
  logo: string;
  description: string;
  industry: string;
  size: string;
  founded_year: string;
  two_fa: number;
  notification: number;
  created_at: string;
  updated_at: string;
}

interface Employer {
  id: number;
  company_name: string;
  email: string;
  phone: string;
  image: string;
  email_verified_at: string | null;
  employer_profile: EmployerProfile;
  created_at: string;
  updated_at: string;
  jobs_count: number;
  active_jobs_count: number;
  total_applicants: number;
}

interface EmployersResponse {
  data: Employer[];
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

const AdminEmployersPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState<number | null>(
    null
  );
  const [blockAction, setBlockAction] = useState<"block" | "unblock">("block");

  const searchParams = useSearchParams();
  const params = searchParams.toString();

  const { data: employersResponse, mutate } = useSWR<EmployersResponse>(
    `api/admin/employers?${params ? `${params}` : ""}`,
    defaultFetcherAdmin
  );

  const { data: industries } = useSWR<string[]>(
    "api/admin/industries",
    defaultFetcherAdmin
  );

  const { data: stats } = useSWR<Record<string, any>>(
    "api/admin/employers/stats",
    defaultFetcherAdmin
  );

  const handleToggleEmployerStatus = (
    employerId: number,
    currentStatus: boolean
  ) => {
    setSelectedEmployerId(employerId);
    setBlockAction(currentStatus ? "block" : "unblock");
    setIsBlockDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedEmployerId) return;

    const { response, result, errors } = await baseFetcher(
      `api/admin/employers/${selectedEmployerId}/toggle-status`,
      {
        method: "POST",
      }
    );

    if (response?.ok) {
      toast({
        title: "Success",
        description:
          result.message ||
          `Employer ${
            blockAction === "block" ? "blocked" : "unblocked"
          } successfully`,
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

  const handleToggleEmployerVerification = async (employerId: number) => {
    const { response, result, errors } = await baseFetcher(
      `api/admin/employers/${employerId}/toggle-verification`,
      {
        method: "POST",
      }
    );

    if (response?.ok) {
      toast({
        title: "Success",
        description:
          result.message || "Employer verification status updated successfully",
      });
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  // Filter employers based on search query and filters
  const filteredEmployers =
    employersResponse?.data.filter((employer) => {
      // For status filter, we need to determine status from email_verified_at
      if (statusFilter !== "all") {
        // Assuming an employer is active if they have a verified email
        const employerStatus = employer.email_verified_at
          ? "active"
          : "blocked";
        if (statusFilter !== employerStatus) return false;
      }

      if (verificationFilter !== "all") {
        // Assuming an employer is verified if they have a verified email
        const employerVerification = employer.email_verified_at
          ? "verified"
          : "unverified";
        if (verificationFilter !== employerVerification) return false;
      }

      if (
        industryFilter !== "all" &&
        employer.employer_profile?.industry !== industryFilter
      ) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          employer.company_name.toLowerCase().includes(query) ||
          employer.email.toLowerCase().includes(query) ||
          employer.employer_profile?.industry.toLowerCase().includes(query) ||
          employer.employer_profile?.address.toLowerCase().includes(query)
        );
      }

      return true;
    }) || [];

  if (!employersResponse) {
    return <div className="p-8 text-center">Loading employers...</div>;
  }

  const handleImpersonateEmployer = async (employerId: number) => {
    const { response, result, errors } = await baseFetcherAdmin(
      "api/admin/impersonate/" + employerId,
      {
        method: "POST",
      }
    );
    if (response?.ok) {
     
      deleteCookie("IMP_TOKEN");
      setCookie("IMP_TOKEN", result.token);
       toast({
        title: "Success",
        description:
          result.message || "You are now impersonating this employer",
      });
      router.push(`/dashboard/employer/`);
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">
            Manage Employers
          </h1>
          <Button
            className="bg-manduPrimary text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => router.push("/dashboard/admin/employers/export")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Employers
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
                    value={verificationFilter}
                    onValueChange={setVerificationFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] border border-grayText">
                      <SelectValue placeholder="All Verification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Verification</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    defaultValue="all"
                    value={industryFilter}
                    onValueChange={setIndustryFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] border border-grayText">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries?.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search employers..."
                    className="pl-10 w-full md:w-64"
                    value={searchQuery}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        let searchParam = new URLSearchParams(
                          searchParams
                        ).toString();
                        searchParam = "";
                        searchParam += `search=${searchQuery}`;
                        router.push(
                          `/dashboard/admin/employers?${searchParam}`,
                          {
                            scroll: false,
                          }
                        );
                        mutate();
                      }
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 flex flex-col gap-6">
                {filteredEmployers.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No employers found matching your criteria.
                  </div>
                ) : (
                  filteredEmployers.map((employer) => (
                    <Card
                      key={employer.id}
                      className="w-full rounded-[15px] border-[0.5px] border-manduSecondary/30 shadow-[0px_2px_5px_#00000040]"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {employer.image ? (
                              <img
                                src={employer.image}
                                alt={employer.company_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-manduPrimary/10 text-manduPrimary">
                                <Building className="h-8 w-8" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h2 className="font-['Poppins'] font-semibold text-manduPrimary text-xl leading-6">
                                  {employer.company_name}
                                </h2>
                                <p className="text-grayColor text-sm mt-1">
                                  {employer.employer_profile?.industry} •{" "}
                                  {employer.employer_profile?.address}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 mt-2 md:mt-0">
                                <Badge
                                  className={`
                                  ${
                                    employer.email_verified_at
                                      ? "bg-[#14dc14]/10 text-[#006B24]"
                                      : "bg-red-100 text-red-800"
                                  } 
                                  font-semibold text-sm px-4 py-0.5 rounded-full
                                `}
                                >
                                  {employer.email_verified_at
                                    ? "Active"
                                    : "Blocked"}
                                </Badge>
                                <Badge
                                  className={`
                                  ${
                                    employer.email_verified_at
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  } 
                                  font-semibold text-sm px-4 py-0.5 rounded-full
                                `}
                                >
                                  {employer.email_verified_at
                                    ? "Verified"
                                    : "Unverified"}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/admin/employers/${employer.id}`
                                        )
                                      }
                                    >
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/admin/employers/${employer.id}/jobs`
                                        )
                                      }
                                    >
                                      View Jobs
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleEmployerVerification(
                                          employer.id
                                        )
                                      }
                                    >
                                      {employer.email_verified_at
                                        ? "Remove Verification"
                                        : "Verify Employer"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className={
                                        employer.email_verified_at
                                          ? "text-red-600"
                                          : "text-green-600"
                                      }
                                      onClick={() =>
                                        handleToggleEmployerStatus(
                                          employer.id,
                                          Boolean(employer.email_verified_at)
                                        )
                                      }
                                    >
                                      {employer.email_verified_at
                                        ? "Block Employer"
                                        : "Unblock Employer"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className={"text-manduPrimary"}
                                      onClick={() =>
                                        handleImpersonateEmployer(employer.id)
                                      }
                                    >
                                      {employer.id && "Impersonate Employer"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-grayColor" />
                                <span className="text-sm text-grayColor">
                                  {employer.email}
                                </span>
                              </div>
                              {employer.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-grayColor" />
                                  <span className="text-sm text-grayColor">
                                    {employer.phone}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-grayColor" />
                                <span className="text-sm text-grayColor">
                                  Joined:{" "}
                                  {format(
                                    new Date(employer.created_at),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-3">
                              <Badge
                                variant="outline"
                                className="bg-[#f1f1f1b2] text-manduBorder"
                              >
                                {employer.jobs_count} Total Jobs
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-[#f1f1f1b2] text-manduBorder"
                              >
                                {employer.active_jobs_count} Active Jobs
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-[#f1f1f1b2] text-manduBorder"
                              >
                                {employer.employer_profile?.size}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              {employersResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6 overflow-x-auto">
                  <div className="flex flex-wrap space-x-1">
                    {employersResponse.meta.links.map((link, i) => (
                      <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        className={
                          link.active ? "bg-manduPrimary text-white" : ""
                        }
                        onClick={() => {
                          if (link.url) {
                            const url = new URL(link.url);
                            const page = url.searchParams.get("page");

                            if (page) {
                              router.push(
                                `/dashboard/admin/employers?page=${page}`,
                                {
                                  scroll: false,
                                }
                              );
                              mutate();
                            }
                          }
                        }}
                      >
                        <span
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
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
                  Employers Overview
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[26px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Active Employers
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {stats?.active_employers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Blocked Employers
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {stats?.blocked_employers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Verified Employers
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {stats?.verified_employers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Total Employers
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {stats?.total_employers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      New This Month
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {stats?.new_employers_this_month || 0}
                    </span>
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
                    onClick={() =>
                      router.push(
                        "/dashboard/admin/employers/verification-requests"
                      )
                    }
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Verification Requests
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() =>
                      router.push("/dashboard/admin/employers/export")
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Employers
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
              {blockAction === "block" ? "Block Employer" : "Unblock Employer"}
            </DialogTitle>
            <DialogDescription>
              {blockAction === "block"
                ? "Are you sure you want to block this employer? They will no longer be able to post jobs or access their account."
                : "Are you sure you want to unblock this employer? They will regain access to their account and be able to post jobs."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBlockDialogOpen(false)}
            >
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

export default AdminEmployersPage;
