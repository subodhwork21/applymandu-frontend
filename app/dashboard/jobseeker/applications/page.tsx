"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  MoreVertical,
  Briefcase,
  MapPinIcon,
  ClockIcon,
  ArrowRight,
  ArrowRightIcon,
} from "lucide-react";
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
import Image from "next/image";

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
  cover_letter: string;
  created_at: string;
  updated_at: string;
  status_history: {
    status: string;
    created_at: string;
  }[];
  skills: string[];
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
  employer_name: string;
  salary_range: {
    formatted: string;
  };
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
  image: string;
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
  cover_letter: string;
  image: string;
  skills: string[];
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
          // Add additional fields needed for display
          allApplications.push({
            id: app.id,
            job_id: job.id,
            position: job.title,
            company: job?.employer_name || "Unknown Company",
            location:
              job.location || (job.is_remote ? "Remote" : "Not specified"),
            appliedDate: format(new Date(app.applied_at), "MMM dd, yyyy"),
            status:
              (app.status_history[0]?.status ===
              "interview_scheduled"
                ? "Shortlisted"
                : app.status_history[0]?.status) || "Applied",
            employmentType: job.employment_type,
            salaryRange: job?.salary_range?.formatted,
            year_of_experience: app.year_of_experience,
            expected_salary: app.expected_salary,
            notice_period: app.notice_period,
            cover_letter: app.cover_letter,
            image: job?.image,
            skills: app?.skills
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
      "api/jobseeker/application/delete/" + id,
      {
        method: "DELETE",
      }
    );

    if (response?.status === 200) {
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
      expected_salary: application.expected_salary.toString(),
      notice_period: application.notice_period.toString(),
      cover_letter: application.cover_letter,
      description: "",
      is_remote: false,
      salary_range: { min: "0", max: "0", formatted: "0" },
      requirements: [],
      responsibilities: [],
      benefits: [],
      posted_date: "",
      posted_date_formatted: "",
      employer_id: 0,
      image: "",
      skills: [],
      created_at: "",
      updated_at: "",
      viewed: false,
      saved: false,
      is_applied: true,
      
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
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2.5 text-manduSecondary font-nasalization">
            My Applications
          </h1>
          <p className="text-manduBorder text-sm">
            Track and manage your job applications
          </p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-borderLine">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-manduSecondary">Applications</h2>
              <div className="flex space-x-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px] text-manduBorder shadow-md">
                    <SelectValue placeholder="All Applications" />
                  </SelectTrigger>
                  <SelectContent className="text-manduBorder">
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
                  className="w-[200px] shadow-md"
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
              // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              //   {filteredApplications.map((application) => (
              //     <div
              //       key={application.id}
              //       className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
              //     >
              //       <div className="flex justify-between items-start">
              //         <div className="flex-1">
              //           <h3 className="text-lg font-medium mb-2">
              //             {application.position}
              //           </h3>
              //           <p className="text-neutral-600 mb-2">
              //             {application.company}
              //           </p>
              //           <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-3">
              //             <span className="flex items-center">
              //               <Calendar className="h-4 w-4 mr-2" />
              //               Applied on {application.appliedDate}
              //             </span>
              //             <span className="flex items-center">
              //               <MapPin className="h-4 w-4 mr-2" />
              //               {application.location}
              //             </span>
              //             <span className="flex items-center">
              //               <Briefcase className="h-4 w-4 mr-2" />
              //               {application.employmentType}
              //             </span>
              //           </div>
              //           {/* <div className="text-sm text-neutral-600">
              //             <p>Experience: {application.year_of_experience} years</p>
              //             <p>Expected Salary: ${application.expected_salary}</p>
              //             <p>Notice Period: {application.notice_period} days</p>
              //           </div> */}
              //         </div>
              //         <div className="flex items-center gap-3">
              //           <span
              //             className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusStyles(
              //               application.status
              //             )}`}
              //           >
              //             {application.status}
              //           </span>
              //           <DropdownMenu>
              //             <DropdownMenuTrigger asChild>
              //               <Button
              //                 variant="ghost"
              //                 size="icon"
              //                 className="h-8 w-8"
              //               >
              //                 <MoreVertical className="h-4 w-4" />
              //               </Button>
              //             </DropdownMenuTrigger>
              //             <DropdownMenuContent
              //               align="end"
              //               className="w-[200px]"
              //             >
              //               <Link
              //                 href={`/dashboard/jobseeker/applications/${application.id}`}
              //               >
              //                 <DropdownMenuItem>View Details</DropdownMenuItem>
              //               </Link>
              //               <DropdownMenuItem
              //                 onClick={(e) => handleReapply(e, application)}
              //               >
              //                 Reapply
              //               </DropdownMenuItem>
              //               <DropdownMenuItem
              //                 className="text-red-600"
              //                 onClick={() => handleWithdraw(application.id)}
              //               >
              //                 Withdraw Application
              //               </DropdownMenuItem>
              //             </DropdownMenuContent>
              //           </DropdownMenu>
              //         </div>
              //       </div>
              //     </div>
              //   ))}
              // </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((application) => {
                  return (
                    <div className="bg-white rounded-xl shadow-xl p-6 border-[2px] border-manduSecondary/30 hover:shadow-[inset_1px_0_0_0_rgb(220,20,60,1),inset_0_1px_0_0_rgb(220,20,60,1),inset_0_-1px_0_0_rgb(220,20,60,1),inset_-1px_0_0_0_rgb(220,20,60,1)] transition-all duration-200 h-full flex flex-col">
                      <div className="flex items-start flex-col gap-y-[10px] w-full">
                        <div className="flex items-start gap-x-4 w-full">
                          <div className="w-15 h-15 p-2 rounded-[8px] bg-white  justify-center flex-shrink-0">
                              <Image
                          src={application?.image}
                          alt="Company Logo"
                          width={60}
                          height={60}
                          className="h-[60px] w-[60px] rounded-[8px]"
                        />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <h3 className="text-text-20 font-semibold feat-text mb-1.5">
                                  {application.position}
                                  <span className="bg-manduSuccess-20  text-sm  font-medium ml-2 rounded-3xl px-3 py-2  text-manduSuccess capitalize">
                                    {application?.status}
                                  </span>
                                </h3>
                                <p className="text-sm capitalize text-manduCustom-secondary-blue font-semibold">
                                  {application.company}
                                </p>
                              </div>
                              <Link href={`/dashboard/jobseeker/applications/${application.id}`} className="flex justify-center gap-2 items-center mb-1.5 text-manduSecondary font-semibold cursor-pointer">
                                <p>View Details</p>
                                <ArrowRightIcon className="h-4 w-4 text-manduSecondary" />
                              </Link>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#525252] mb-1">
                              <span className="flex items-center gap-2 capitalize">
                                <MapPinIcon className="h-4 w-4 text-[#525252]" />
                                {application.location}
                              </span>
                              <span className="flex items-center gap-2 capitalize">
                                <ClockIcon className="h-4 w-4 text-[#525252]" />
                                {application.employmentType}
                              </span>
                            </div>
                            <span className="flex items-center mb-4 text-manduSecondary text-text-16 font-semibold">
                             {application.salaryRange}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <div className="flex gap-2">
                      {application.skills &&
                        application.skills.map((skill, id) => (
                          <span
                            key={id}
                            className="px-4 py-2 font-semibold bg-grayTag/70  rounded-[50px] text-sm capitalize text-manduBorder"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                          <div className="flex gap-5">
                            <Button
                              className={` bg-manduSecondary text-white hover:text-white`}
                              onClick={(e) => handleReapply(e, application)}
                            >
                              Reapply
                            </Button>
                            <Button
                              className={` text-manduSecondary bg-white border border-manduSecondary font-semibold hover:text-white`}
                              onClick={() => handleWithdraw(application.id)}
                            >
                              Withdraw Application
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-borderLine">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#000000]">
                Showing {filteredApplications.length} of{" "}
                {processedApplications.length} applications
              </div>
              <div className="flex space-x-2">
                <Button className="text-manduSecondary border border-manduSecondary" variant="outline" size="sm" disabled={true}>
                  Previous
                </Button>
                <Button size="sm" disabled={true} className="bg-manduSecondary border border-manduSecondary text-white">
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
