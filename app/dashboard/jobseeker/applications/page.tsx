"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, MoreVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApplication } from "@/lib/application-context";
import { defaultFetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { format } from "date-fns";

// Define interfaces for the API response
interface Application {
  id: number;
  user_id: number;
  job_id: number;
  year_of_experience: number;
  expected_salary: number;
  notice_period: number;
  status: number;
  applied_at: string;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  position?: string;
  company?: string;
  location?: string;
}

interface UserWithApplications {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  email_verified_at: string;
  is_active: number;
  reset_password_token: string | null;
  verify_email_token: string;
  created_at: string;
  updated_at: string;
  applications: Application[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: UserWithApplications[];
}

const ApplicationsPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { openApplicationPanel } = useApplication();
  const { data, isLoading, error } = useSWR<ApiResponse>("api/jobseeker/application", defaultFetcher);

  // Process applications to add necessary display information
  const processedApplications = useMemo(() => {
    if (!data?.data || data.data.length === 0) return [];

    // Flatten the nested applications from all users
    const allApplications: Application[] = [];
    
    data.data.forEach(user => {
      user.applications.forEach(app => {
        // Map status codes to readable strings
        const statusMap: Record<number, string> = {
          0: "Pending",
          1: "Shortlisted",
          2: "Rejected",
          // Add more status mappings as needed
        };

        // Add additional fields needed for display
        allApplications.push({
          ...app,
          position: `Job #${app.job_id}`, // Replace with actual job title when available
          company: user.company_name || "Company Name Not Available",
          location: "Location Not Available", // Replace with actual location when available
          status: statusMap[app.status] || "Unknown",
          appliedDate: format(new Date(app.applied_at), "MMM dd, yyyy")
        });
      });
    });

    return allApplications;
  }, [data]);

  const filteredApplications = useMemo(() => {
    if (!processedApplications) return [];
    
    return processedApplications
      .filter((app) => {
        if (filter === "all") return true;
        return app.status.toLowerCase() === filter.toLowerCase();
      })
      .filter((app) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
          app.position.toLowerCase().includes(searchLower) ||
          app.company.toLowerCase().includes(searchLower) ||
          (app.location && app.location.toLowerCase().includes(searchLower))
        );
      });
  }, [filter, search, processedApplications]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const handleReapply = (e: React.MouseEvent, application: any) => {
    e.preventDefault();
    // Implementation for reapply functionality
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p>Loading your applications...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading applications. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">My Applications</h1>
          <p className="text-neutral-600">
            Track and manage your job applications
          </p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Applications</h2>
              <div className="flex space-x-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Applications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredApplications.length === 0 ? (
              <div className="text-center text-neutral-600">
                No applications found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((application: Application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg mb-2">{application.position}</h3>
                        <p className="text-neutral-600 mb-2">
                          {application.company}
                        </p>
                        <div className="flex space-x-4 text-sm text-neutral-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Applied on {application.appliedDate}
                          </span>
                          {application.location && (
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {application.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusStyles(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[200px]"
                          >
                            <Link
                              href={`/dashboard/jobseeker/applications/${application.id}`}
                            >
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={(e) => handleReapply(e, application)}
                            >
                              Reapply
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Withdraw Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                Showing {filteredApplications.length} of {processedApplications.length}{" "}
                applications
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationsPage;
