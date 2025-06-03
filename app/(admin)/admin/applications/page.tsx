"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  MoreHorizontal,
  Briefcase,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  FileText,
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
import { defaultFetcher, defaultFetcherAdmin } from "@/lib/fetcher";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SalaryRange {
  min: string;
  max: string;
  formatted: string;
}

interface StatusHistory {
  id: number;
  application_id: number;
  status: string;
  remarks: string | null;
  changed_at: string;
  created_at: string;
  updated_at: string;
}

interface Application {
  id: number;
  job_id: number;
  user_id: number;
  year_of_experience: number;
  expected_salary: number;
  notice_period: number;
  cover_letter: string;
  applied_at: string;
  formatted_applied_at: string;
  updated_at: string;
  status: number;
  job_title: string;
  company_name: string;
  location: string;
  applied_user: string;
  user_image: string;
  skills: string[];
  status_history: StatusHistory[];
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
  salary_range: SalaryRange;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  posted_date: string;
  posted_date_formatted: string;
  employer_id: number | null;
  employer_name: string | null;
  image: string;
  created_at: string;
  updated_at: string;
  viewed: boolean | null;
  saved: boolean | null;
  is_applied: boolean | null;
  status: number;
  slug: string;
  applications: Application[];
  deleted_at: string | null;
  job_label: string;
}

interface ApplicationsResponse {
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
  success: boolean;
  message: string;
}

const AdminApplicationsPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const params = searchParams.toString();

  const { data: applicationsResponse, mutate } = useSWR<ApplicationsResponse>(
    `api/admin/all-applications?${params ? `${params}` : ""}`,
    defaultFetcherAdmin
  );

  const { data: stats } = useSWR<Record<string, any>>(
    "api/admin/applications/stats",
    defaultFetcher
  );

  // Filter applications based on search query and filters
  const filteredJobs =
    applicationsResponse?.data.filter((job) => {
      if (statusFilter !== "all") {
        if (statusFilter === "active" && job.status !== 1) return false;
        if (statusFilter === "inactive" && job.status === 1) return false;
      }

      if (departmentFilter !== "all" && job.department !== departmentFilter) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          job.title.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.department.toLowerCase().includes(query) ||
          (job.employer_name && job.employer_name.toLowerCase().includes(query))
        );
      }

      return true;
    }) || [];

  if (!applicationsResponse) {
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  const getStatusBadge = (status: number, label: string) => {
    if (status !== 1) {
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
    }

    switch (label) {
      case "highlighted":
        return (
          <Badge className="bg-purple-100 text-purple-800">Highlighted</Badge>
        );
      case "featured":
        return <Badge className="bg-blue-100 text-blue-800">Featured</Badge>;
      case "new":
        return <Badge className="bg-green-100 text-green-800">New</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Active</Badge>;
    }
  };

  const getApplicationStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>;
      case 2:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Reviewing</Badge>
        );
      case 3:
        return (
          <Badge className="bg-purple-100 text-purple-800">Shortlisted</Badge>
        );
      case 4:
        return <Badge className="bg-green-100 text-green-800">Selected</Badge>;
      case 5:
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">
            All Applications
          </h1>
          <Button
            className="bg-manduCustom-secondary-blue text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => router.push("/admin/applications/export")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Applications
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
                    placeholder="Search applications..."
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
                          `/admin/applications?${searchParam}`,
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
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No applications found matching your criteria.
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <Accordion
                      key={job.id}
                      type="single"
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem
                        value={`job-${job.id}`}
                        className="border-none"
                      >
                        <Card className="w-full rounded-[15px] border-[0.5px] border-manduSecondary/30 shadow-[0px_2px_5px_#00000040]">
                          <CardContent className="p-0">
                            <AccordionTrigger className="p-6 hover:no-underline">
                              <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {job.image ? (
                                    <img
                                      src={job.image}
                                      alt={job.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-manduCustom-secondary-blue/10 text-manduCustom-secondary-blue">
                                      <Briefcase className="h-8 w-8" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row justify-between">
                                    <div>
                                      <h2 className="font-['Poppins'] font-semibold text-manduCustom-secondary-blue text-xl leading-6 text-left">
                                        {job.title}
                                      </h2>
                                      <p className="text-grayColor text-sm mt-1 text-left">
                                        Department:{" "}
                                        <span className="font-medium capitalize">
                                          {job.department}
                                        </span>
                                      </p>
                                      <p className="text-grayColor text-sm text-left">
                                        {job.employer_name
                                          ? `at ${job.employer_name}`
                                          : "No employer assigned"}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                                      {getStatusBadge(
                                        job.status,
                                        job.job_label
                                      )}
                                      <Badge className="bg-blue-100 text-blue-800">
                                        {job.applications.length} Applications
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-grayColor" />
                                      <span className="text-sm text-grayColor">
                                        Posted: {job.posted_date_formatted}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-grayColor" />
                                      <span className="text-sm text-grayColor">
                                        Deadline:{" "}
                                        {format(
                                          new Date(job.application_deadline),
                                          "MMM dd, yyyy"
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Briefcase className="h-4 w-4 text-grayColor" />
                                      <span className="text-sm text-grayColor">
                                        {job.employment_type} •{" "}
                                        {job.location_type}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 mt-3">
                                    <Badge
                                      variant="outline"
                                      className="bg-[#f1f1f1b2] text-manduBorder"
                                    >
                                      {job.experience_level}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-[#f1f1f1b2] text-manduBorder"
                                    >
                                      {job.location}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-[#f1f1f1b2] text-manduBorder"
                                    >
                                      {job.salary_range.formatted}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-6 pb-6 pt-0">
                              <Separator className="my-4" />

                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-manduSecondary mb-2">
                                  Applications ({job.applications.length})
                                </h3>

                                {job.applications.length === 0 ? (
                                  <div className="text-center py-4 text-neutral-500 bg-neutral-50 rounded-lg">
                                    No applications received for this job yet.
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {job.applications.map((application) => (
                                      <Card
                                        key={application.id}
                                        className="border-[0.5px] border-manduSecondary/20"
                                      >
                                        <CardContent className="p-4">
                                          <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-shrink-0">
                                              <Avatar className="h-16 w-16">
                                                <AvatarImage
                                                  src={application.user_image}
                                                  alt={application.applied_user}
                                                />
                                                <AvatarFallback className="bg-manduCustom-secondary-blue text-white">
                                                  {application.applied_user
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                                </AvatarFallback>
                                              </Avatar>
                                            </div>

                                            <div className="flex-1">
                                              <div className="flex flex-col md:flex-row justify-between">
                                                <div>
                                                  <h4 className="font-semibold text-manduCustom-secondary-blue">
                                                    {application.applied_user}
                                                  </h4>
                                                  <p className="text-sm text-grayColor">
                                                    Applied on:{" "}
                                                    {
                                                      application.formatted_applied_at
                                                    }
                                                  </p>
                                                </div>

                                                <div className="flex items-center gap-2 mt-2 md:mt-0">
                                                  {getApplicationStatusBadge(
                                                    application.status
                                                  )}
                                                  <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                      asChild
                                                    >
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                      >
                                                        <MoreHorizontal className="h-5 w-5" />
                                                      </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                      <DropdownMenuItem
                                                        onClick={() =>
                                                          router.push(
                                                            `/admin/applications/${application.id}`
                                                          )
                                                        }
                                                      >
                                                        View Application
                                                      </DropdownMenuItem>
                                                      <DropdownMenuItem
                                                        onClick={() =>
                                                          router.push(
                                                            `/admin/users/${application.user_id}`
                                                          )
                                                        }
                                                      >
                                                        View Applicant Profile
                                                      </DropdownMenuItem>
                                                      <DropdownMenuItem
                                                        onClick={() =>
                                                          window.open(
                                                            application.user_image,
                                                            "_blank"
                                                          )
                                                        }
                                                      >
                                                        View Resume
                                                      </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                  </DropdownMenu>
                                                </div>
                                              </div>

                                              <div className="mt-2">
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                  {application.skills.map(
                                                    (skill, index) => (
                                                      <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="bg-[#f1f1f1b2] text-manduBorder"
                                                      >
                                                        {skill}
                                                      </Badge>
                                                    )
                                                  )}
                                                </div>
                                              </div>

                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                                                <div className="flex items-center gap-1">
                                                  <Briefcase className="h-4 w-4 text-grayColor" />
                                                  <span className="text-sm text-grayColor">
                                                    {
                                                      application.year_of_experience
                                                    }{" "}
                                                    years experience
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Clock className="h-4 w-4 text-grayColor" />
                                                  <span className="text-sm text-grayColor">
                                                    {application.notice_period}{" "}
                                                    days notice
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <FileText className="h-4 w-4 text-grayColor" />
                                                  <span className="text-sm text-grayColor">
                                                    Expected: Rs.{" "}
                                                    {application.expected_salary.toLocaleString()}
                                                  </span>
                                                </div>
                                              </div>

                                              <div className="mt-3 flex justify-end">
                                                <Button
                                                  size="sm"
                                                  className="bg-manduSecondary text-white"
                                                  onClick={() =>
                                                    router.push(
                                                      `/admin/applications/${application.id}`
                                                    )
                                                  }
                                                >
                                                  View Details
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-end mt-4">
                                <Button
                                  variant="outline"
                                  className="mr-2"
                                  onClick={() =>
                                    router.push(
                                      `/admin/jobs/${job.id}`
                                    )
                                  }
                                >
                                  View Job Details
                                </Button>
                                <Button
                                  className="bg-manduCustom-secondary-blue text-white"
                                  onClick={() =>
                                    router.push(
                                      `/admin/jobs/${job.id}/applications`
                                    )
                                  }
                                >
                                  Manage Applications
                                </Button>
                              </div>
                            </AccordionContent>
                          </CardContent>
                        </Card>
                      </AccordionItem>
                    </Accordion>
                  ))
                )}
              </div>

              {/* Pagination */}
              {applicationsResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6 overflow-x-auto">
                  <div className="flex flex-wrap space-x-1">
                    {applicationsResponse.meta.links.map((link, i) => (
                      <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        className={
                          link.active ? "bg-manduCustom-secondary-blue text-white" : ""
                        }
                        onClick={() => {
                          if (link.url) {
                            const url = new URL(link.url);
                            const page = url.searchParams.get("page");

                            if (page) {
                              router.push(
                                `/admin/applications?page=${page}`,
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
                  Applications Overview
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[26px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Total Jobs
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {applicationsResponse.meta.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Jobs with Applications
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {applicationsResponse.data.filter(
                        (job) => job.applications.length > 0
                      ).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Jobs without Applications
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {applicationsResponse.data.filter(
                        (job) => job.applications.length === 0
                      ).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Total Applications
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {applicationsResponse.data.reduce(
                        (total, job) => total + job.applications.length,
                        0
                      ) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">
                      Active Jobs
                    </span>
                    <span className="text-sm text-grayColor font-bold">
                      {applicationsResponse.data.filter(
                        (job) => job.status === 1
                      ).length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full rounded-[15.54px] border-[1.94px] border-solid border-slate-200">
              <div className="bg-[#fcfcfc] rounded-t-[13px] border-t-[1.86px] border-r-[1.86px] border-l-[1.86px] border-slate-200 p-[13px_29px]">
                <h2 className="font-medium text-manduSecondary text-xl leading-[30px]">
                  Quick Filters
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[20px]">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => {
                      setStatusFilter("active");
                      router.push(
                        "/admin/applications?status=active",
                        {
                          scroll: false,
                        }
                      );
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Active Jobs
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => {
                      setDepartmentFilter("engineering");
                      router.push(
                        "admin/applications?department=engineering",
                        {
                          scroll: false,
                        }
                      );
                    }}
                  >
                    <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                    Engineering Jobs
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => {
                      setDepartmentFilter("design");
                      router.push(
                        "/admin/applications?department=design",
                        {
                          scroll: false,
                        }
                      );
                    }}
                  >
                    <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
                    Design Jobs
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() =>
                      router.push("/admin/applications/export")
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Applications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminApplicationsPage;
