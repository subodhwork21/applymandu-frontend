"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Download, Ban, MoreHorizontal, User, Mail, Phone, Calendar } from "lucide-react";
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
import { baseFetcher, defaultFetcher, defaultFetcherAdmin } from "@/lib/fetcher";
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

interface JobSeeker {
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
  job_title?: string;
  location?: string;
}

interface JobSeekersResponse {
  data: JobSeeker[];
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

const AdminUsersPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [blockAction, setBlockAction] = useState<"block" | "unblock">("block");

  const searchParams = useSearchParams();
  const params = searchParams.toString();

  const { data: jobSeekersResponse, mutate } = useSWR<JobSeekersResponse>(
    `api/admin/all-users?${params ? `${params}` : ""}`,
    defaultFetcherAdmin
  );

  const { data: stats } = useSWR<Record<string, any>>(
    "api/admin/users/stats", 
    defaultFetcherAdmin
  );

  const handleToggleUserStatus = (userId: number, currentStatus: boolean) => {
    setSelectedUserId(userId);
    setBlockAction(currentStatus ? "block" : "unblock");
    setIsBlockDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUserId) return;
    
    const { response, result, errors } = await baseFetcher(`api/admin/users/${selectedUserId}/toggle-status`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || `User ${blockAction === "block" ? "blocked" : "unblocked"} successfully`,
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

  const handleToggleUserVerification = async (userId: number) => {
    const { response, result, errors } = await baseFetcher(`api/admin/users/${userId}/toggle-verification`, {
      method: "POST",
    });
    
    if (response?.ok) {
      toast({
        title: "Success",
        description: result.message || "User verification status updated successfully",
      });
      mutate();
    } else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      });
    }
  };

  // Filter users based on search query and filters
  const filteredUsers = jobSeekersResponse?.data.filter((user) => {
    if (statusFilter !== "all") {
      const userStatus = user.status ? "active" : "blocked";
      if (statusFilter !== userStatus) return false;
    }

    if (verificationFilter !== "all") {
      const userVerification = user.verified ? "verified" : "unverified";
      if (verificationFilter !== userVerification) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.profile?.industry?.toLowerCase().includes(query) ||
        user.profile?.district?.toLowerCase().includes(query)
      );
    }

    return true;
  }) || [];

  if (!jobSeekersResponse) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">Manage Users</h1>
          <Button
            className="bg-manduCustom-secondary-blue text-white hover:bg-neutral-800 w-full sm:w-auto"
            onClick={() => router.push("/dashboard/admin/users/export")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Users
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
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 w-full md:w-64"
                    value={searchQuery}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        let searchParam = new URLSearchParams(searchParams).toString();
                        searchParam = "";
                        searchParam += `search=${searchQuery}`;
                        router.push(`/dashboard/admin/users?${searchParam}`, {
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
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No users found matching your criteria.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <Card 
                      key={user.id} 
                      className="w-full rounded-[15px] border-[0.5px] border-manduSecondary/30 shadow-[0px_2px_5px_#00000040]"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {user.image_path ? (
                              <img 
                                src={user.image_path} 
                                alt={`${user.first_name} ${user.last_name}`} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-manduCustom-secondary-blue/10 text-manduCustom-secondary-blue">
                                <User className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h2 className="font-poppins font-semibold text-manduCustom-secondary-blue text-xl leading-6">
                                  {user.first_name} {user.last_name}
                                </h2>
                                <p className="text-grayColor text-sm mt-1">
                                  {user.profile?.preferred_job_type || 'No job preference'} 
                                  {user.profile?.district ? ` • ${user.profile.district}` : ''}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-3 mt-2 md:mt-0">
                                <Badge className={`
                                  ${user.status ? "bg-[#14dc14]/10 text-[#006B24]" : "bg-red-100 text-red-800"} 
                                  font-semibold text-sm px-4 py-0.5 rounded-full
                                `}>
                                  {user.status ? 'Active' : 'Blocked'}
                                </Badge>
                                <Badge className={`
                                  ${user.verified ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"} 
                                  font-semibold text-sm px-4 py-0.5 rounded-full
                                `}>
                                  {user.verified ? 'Verified' : 'Unverified'}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}>
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/users/${user.id}/applications`)}>
                                      View Applications
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleUserVerification(user.id)}>
                                      {user.verified ? 'Remove Verification' : 'Verify User'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className={user.status ? "text-red-600" : "text-green-600"}
                                      onClick={() => handleToggleUserStatus(user.id, !!user.status)}
                                    >
                                      {user.status ? 'Block User' : 'Unblock User'}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-grayColor" />
                                <span className="text-sm text-grayColor">{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-grayColor" />
                                  <span className="text-sm text-grayColor">{user.phone}</span>
                                </div>
                              )}
                              {user.created_at && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-grayColor" />
                                  <span className="text-sm text-grayColor">
                                    Joined: {format(new Date(user.created_at), "MMM dd, yyyy")}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3">
                              <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                {user.applications_count || 0} Applications
                              </Badge>
                              <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                {user.saved_jobs_count || 0} Saved Jobs
                              </Badge>
                              {user.profile?.industry && (
                                <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                  {user.profile.industry}
                                </Badge>
                              )}
                              {user.profile?.gender && (
                                <Badge variant="outline" className="bg-[#f1f1f1b2] text-manduBorder">
                                  {user.profile.gender}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              {jobSeekersResponse.meta.last_page > 1 && (
                <div className="flex justify-center mt-6 overflow-x-auto">
                  <div className="flex flex-wrap space-x-1">
                    {jobSeekersResponse.meta.links.map((link, i) => (
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
                              router.push(`/dashboard/admin/users?page=${page}`, {
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
                  Users Overview
                </h2>
              </div>
              <CardContent className="p-[10px_30px]">
                <div className="flex flex-col gap-[26px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Active Users</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.active_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Blocked Users</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.blocked_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Verified Users</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.verified_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">Total Users</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.total_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-grayColor font-normal leading-[21.4px]">New This Month</span>
                    <span className="text-sm text-grayColor font-bold">{stats?.new_users_this_month || 0}</span>
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
                    onClick={() => router.push("/dashboard/admin/users/verification-requests")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Verification Requests
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-manduBorder hover:text-neutral-900"
                    onClick={() => router.push("/dashboard/admin/users/export")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
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
                ? "Are you sure you want to block this user? They will no longer be able to apply for jobs or access their account."
                : "Are you sure you want to unblock this user? They will regain access to their account and be able to apply for jobs."
              }
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

export default AdminUsersPage;
