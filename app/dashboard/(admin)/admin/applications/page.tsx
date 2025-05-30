"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Download, MoreHorizontal, Briefcase, User, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
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
import { defaultFetcher } from "@/lib/fetcher";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  employer_name: string;
  employer_logo: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_profile_picture: string;
  status: string;
  applied_at: string;
  cover_letter: string;
  resume: string;
  viewed: boolean;
}

interface ApplicationsResponse {
  data: Application[];
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

const AdminApplicationsPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const params = searchParams.toString();

  const { data: applicationsResponse, mutate } = useSWR<ApplicationsResponse>(
    `api/admin/applications?${params ? `${params}` : ""}`,
    defaultFetcher
  );

  const { data: stats } = useSWR<Record<string, any>>(
    "api/admin/applications/stats", 
    defaultFetcher
  );

  // Filter applications based on search query and filters
  const filteredApplications = applicationsResponse?.data.filter((application) => {
    if (statusFilter !== "all" && application.status !== statusFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        application.job_title.toLowerCase().includes(query) ||
        application.employer_name.toLowerCase().includes(query) ||
        application.user_name.toLowerCase().includes(query) ||
        application.user_email.toLowerCase().includes(query)
      );
    }

    return true;
  }) || [];

  if (!applicationsResponse) {
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "shortlisted":
        return <Badge className="bg-blue-100 text-blue-800">Shortlisted</Badge>;
      case "interviewed":
        return <Badge className="bg-purple-100 text-purple-800">Interviewed</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">All Applications</h1>
          <Button
            className="bg-manduPrimary text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => router.push("/dashboard/admin/applications/export")}
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
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
                        let searchParam = new URLSearchParams(searchParams).toString();
                        searchParam = "";
                        searchParam += `search=${searchQuery}`;
                        router.push(`/dashboard/admin/applications?${searchParam}`, {
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
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No applications found matching your criteria.
                  </div>
                ) : (
                  filteredApplications.map((application) => (
                    <Card 
                      key={application.id} 
                      className="w-full rounded-[15px] border-[0.5px] border-manduSecondary/30 shadow-[0px_2px_5px_#00000040]"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {application.user_profile_picture ? (
                              <img 
                                src={application.user_profile_picture} 
                                alt={application.user_name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-manduPrimary/10 text-manduPrimary">
                                <User className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h2 className="font-['Poppins'] font-semibold text-manduPrimary text-xl leading-6">
                                  {application.user_name}
                                </h2>
                                <p className="text-grayColor text-sm mt-1">
                                  Applied for: <span className="font-medium">{application.job_title}</span>
                                </p>
                                <p className="text-grayColor text-sm">
                                  at <span className="font-medium">{application.employer_name}</span>
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-3 mt-2 md:mt-0">
                                {getStatusBadge(application.status)}
                                {application.viewed ? (
                                  <Badge className="bg-blue-100 text-blue-800">Viewed</Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-800">Unviewed</Badge>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/applications/${application.id}`)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/jobs/${application.job_id}`)}>
                                      View Job
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/users/${application.user_id}`)}>
                                      View Applicant
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-grayColor" />
                                <span className="text-sm text-grayColor">
                                  Applied: {format(new Date(application.applied_at), "MMM dd, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-grayColor" />
                                <span className="text-sm text-grayColor">
                                  Job ID: {application.job_id}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {application.status === 'pending' ? (
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                ) : application.status === 'accepted' ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : application.status === 'rejected' ? (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-blue-600" />
                                )}
                                <span className="text-sm text-grayColor capitalize">
                                  Status: {application.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3">
                              {application.resume && (
                                <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                  Has Resume
                                </Badge>
                              )}
                              {application.cover_letter && (
                                <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                  Has Cover Letter
                                </Badge>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="ml-auto"
                                onClick={() => router.push(`/dashboard/admin/applications/${application.id}`)}
                              >
                                View Application
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
              {applicationsResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6 overflow-x-auto">
                  <div className="flex flex-wrap space-x-1">
                    {applicationsResponse.meta.links.map((link, i) => (
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
                              router.push(`/dashboard/admin/applications?page=${page}`, {
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
                  Applications Overview
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[26px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Pending</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.pending_applications || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Shortlisted</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.shortlisted_applications || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Interviewed</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.interviewed_applications || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Accepted</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.accepted_applications || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Rejected</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.rejected_applications || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Total</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.total_applications || 0}</span>
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
                      setStatusFilter("pending");
                      router.push("/dashboard/admin/applications?status=pending", {
                        scroll: false,
                      });
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                    Pending Applications
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => {
                      setStatusFilter("shortlisted");
                      router.push("/dashboard/admin/applications?status=shortlisted", {
                        scroll: false,
                      });
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                    Shortlisted Applications
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => {
                      setStatusFilter("accepted");
                      router.push("/dashboard/admin/applications?status=accepted", {
                        scroll: false,
                      });
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Accepted Applications
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/applications/export")}
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

