"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, MoreVertical, Briefcase } from "lucide-react";
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
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

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
}

interface Employer {
  id: number;
  company_name: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  is_remote: number;
  employment_type: string;
  experience_level: string;
  location: string;
  salary_min: string;
  salary_max: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  status: number;
  posted_date: string;
  employer_id: number;
  created_at: string;
  updated_at: string;
  job_label: string;
  employer: Employer;
  applications: Application[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Job[];
}

// Interface for processed application data for display
interface ProcessedApplication {
  id: number;
  job_id: number;
  position: string;
  company: string;
  location: string;
  appliedDate: string;
  status: string;
  employmentType: string;
  salaryRange: string;
  year_of_experience: number;
  expected_salary: number;
  notice_period: number;
  cover_letter: string | null;
}

const ApplicationsPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { openApplicationPanel } = useApplication();
  const { data, isLoading, error, mutate } = useSWR<ApiResponse>(
    "api/jobseeker/application",
    defaultFetcher
  );

  // Process applications to add necessary display information
  const processedApplications = useMemo(() => {
    if (!data?.data || data.data.length === 0) return [];

    // Flatten the nested applications from all jobs
    const allApplications: ProcessedApplication[] = [];

    data.data.forEach((job) => {
      if (job.applications && Array.isArray(job.applications)) {
        job.applications.forEach((app) => {
          // Map status codes to readable strings
          const statusMap: Record<number, string> = {
            0: "Pending",
            1: "Shortlisted",
            2: "Rejected",
            // Add more status mappings as needed
          };

          // Add additional fields needed for display
          allApplications.push({
            id: app.id,
            job_id: job.id,
            position: job.title,
            company: job.employer?.company_name || "Unknown Company",
            location:
              job.location || (job.is_remote ? "Remote" : "Not specified"),
            appliedDate: format(new Date(app.applied_at), "MMM dd, yyyy"),
            status: statusMap[app.status] || "Unknown",
            employmentType: job.employment_type,
            salaryRange: `${job.salary_min} - ${job.salary_max}`,
            year_of_experience: app.year_of_experience,
            expected_salary: app.expected_salary,
            notice_period: app.notice_period,
            cover_letter: app.cover_letter,
          });
        });
      }
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
          app.location.toLowerCase().includes(searchLower)
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

  const handleWithdraw = async (id: number) => {
    const { response, result } = await baseFetcher(
      "api/jobseeker/application/delete/"+id,
      {
        method: "DELETE",
      }
    );

    if (response.status === 200) {
      toast({
        title: "Success",
        description: "Application withdrawn successfully",
        variant: "default",
      });
      mutate();
    } else {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleReapply = (
    e: React.MouseEvent,
    application: ProcessedApplication
  ) => {
    e.preventDefault();
    // Implementation for reapply functionality
    openApplicationPanel({
      id: application.job_id,
      title: application.position,
      employer_name: application.company,
      location: application.location,
      employment_type: application.employmentType,
      experience_level: application.year_of_experience.toString(),
      // salary_min: application.salaryRange.split(" - ")[0],
      // salary_max: application.salaryRange.split(" - ")[1],
      year_of_experience: application.year_of_experience.toString(),
      expected_salary: application.expected_salary,
      notice_period: application.notice_period,
      cover_letter: application.cover_letter,
    });
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
            <p className="text-red-500">
              Error loading applications. Please try again later.
            </p>
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
              <div className="text-center text-neutral-600 py-12">
                No applications found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2">
                          {application.position}
                        </h3>
                        <p className="text-neutral-600 mb-2">
                          {application.company}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-3">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Applied on {application.appliedDate}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {application.location}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            {application.employmentType}
                          </span>
                        </div>
                        {/* <div className="text-sm text-neutral-600">
                          <p>Experience: {application.year_of_experience} years</p>
                          <p>Expected Salary: ${application.expected_salary}</p>
                          <p>Notice Period: {application.notice_period} days</p>
                        </div> */}
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
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleWithdraw(application.id)}
                            >
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
                Showing {filteredApplications.length} of{" "}
                {processedApplications.length} applications
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled={true}>
                  Previous
                </Button>
                <Button size="sm" disabled={true}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationsPage;
