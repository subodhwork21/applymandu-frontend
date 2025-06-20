"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MessageModal from "@/components/message-modal";
import InterviewScheduleModal from "@/components/interview-schedule-modal";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { format } from "date-fns";
import InterviewWithdrawModal from "@/components/interview-withdraw-modal";
import DataNavigation from "@/components/ui/data-navigation";
import Image from "next/image";

interface SalaryRange {
  min: string;
  max: string;
  formatted: string;
}

interface Application {
  id: number;
  job_id: number;
  user_id: number;
  year_of_experience: number;
  expected_salary: number;
  notice_period: number;
  cover_letter: string | null;
  applied_at: string;
  formatted_applied_at: string;
  updated_at: string;
  status: number;
  job_title: string;
  company_name: string;
  applied_user: string;
  skills?: string[];
  user_image: string;
  status_history: {
    status: string;
    created_at: string;
  }[];
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
  employer_id: number;
  employer_name: string;
  image: string;
  created_at: string;
  updated_at: string;
  viewed: any;
  saved: any;
  is_applied: any;
  status: number;
  slug: string | null;
  applications: Application[];
}

interface JobApplicationsResponse {
  success: boolean;
  message: string;
  data: Job[];
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
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Create a separate component that uses useSearchParams
function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewWithdrawCandidate, setInterviewWithdrawCandidate] = useState<Record<string, any> | null>(null);

  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string;
    name: string;
    position: string;
    avatar: string;
  } | null>(null);

  const [interviewCandidate, setInterviewCandidate] = useState<{
    id: string;
    name: string;
    position: string;
    avatar: string;
  } | null>(null);

  const [expandedJobs, setExpandedJobs] = useState<number[]>([]);

  const handleOpenMessage = (candidate: {
    name: string;
    position: string;
    avatar: string;
    id: string;
  }) => {
    setSelectedCandidate(candidate);
  };



  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const urlsearchParams = new URLSearchParams(searchParams.toString());
  const url = `api/employer/job/applications?${urlsearchParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<JobApplicationsResponse>(
    url,
    defaultFetcher
  );

  const { data: applicationSummary, isLoading: applicationSummaryLoading, mutate: applicationSummaryMutate } = useSWR<Record<string, string>>("api/employer/job/application-summary", defaultFetcher);

  // Process the API data to match the expected format for the component
  const jobApplications = React.useMemo(() => {
    if (!data) return [];

    return data.data.map(job => {
      // Process applications to add missing fields
      const processedApplications = job.applications.map(app => {
        // Generate a random avatar seed based on user ID
        // const avatarSeed = `user-${app.user_id}`;

        // Extract skills from requirements (first 3 for display)
        const skills = app.skills || job.requirements.slice(0, 3).map(req => {
          // Extract just the first few words for each skill
          return req.split(' ').slice(0, 3).join(' ');
        });
        return {
          ...app,
          name: app.applied_user,
          position: job.title,
          appliedDate: app.formatted_applied_at,
          skills,
          user_id: app.user_id,
          status: app?.status_history[0]?.status.split("_").join(" "),
          avatar: app?.user_image,
        };
      });

      return {
        jobId: job.id,
        title: job.title,
        company: job.employer_name,
        location: job.location,
        type: job.employment_type,
        applications: processedApplications,
      };
    });
  }, [data]);

  // Filter jobs based on jobId parameter
  const filteredJobs = jobIdParam
    ? jobApplications.filter((job) => job.jobId.toString() === jobIdParam)
    : jobApplications;

  // Initialize expanded jobs based on filtered results
  useEffect(() => {
    if (jobIdParam) {
      setExpandedJobs([parseInt(jobIdParam)]);
    } else if (jobApplications.length > 0) {
      setExpandedJobs(jobApplications.map((job) => job.jobId));
    }
  }, [jobIdParam, jobApplications]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading applications: {error.message}</div>;
  }
  const handleOpenInterview = (candidate: {
    id: string;
    name: string;
    position: string;
    avatar: string;
    status: string
  }) => {
    if (candidate?.status === "interview scheduled") {
      setInterviewWithdrawCandidate(candidate);
      setInterviewModalOpen(true);
    }
    else {
      setInterviewCandidate(candidate);
    }
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl text-manduSecondary font-normal font-nasalization">All Applications</h2>
                <div className="flex space-x-2">
                  <Select
                    value={jobIdParam || "all"}
                    onValueChange={(value) => {
                      if (value === "all") {
                        router.push("/dashboard/employer/applications");
                      } else {
                        router.push(
                          `/dashboard/employer/applications?jobId=${value}`
                        );
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Jobs" />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value="all">All Jobs</SelectItem>
                      {jobApplications.map((job) => (
                        <SelectItem
                          key={job.jobId}
                          value={job.jobId.toString()}
                        >
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue={searchParams.get("status") || "all"} onValueChange={(value) => {
                    if (value === "all") {
                      router.push("/dashboard/employer/applications");
                    } else {
                      router.push(
                        `/dashboard/employer/applications?status=${value}`
                      );
                    }
                    mutate();
                  }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  No applications found for the selected criteria.
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.jobId}
                      className="border border-neutral-200 rounded-lg overflow-hidden"
                    >
                      <div
                        className="bg-neutral-50 p-4 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleJobExpansion(job.jobId)}
                      >
                        <div>
                          <h3 className="text-lg font-medium">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                            <span>{job.company}</span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                            <span>{job.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-neutral-600">
                            {job.applications.length} Applications
                          </span>
                          {expandedJobs.includes(job.jobId) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>

                      {expandedJobs.includes(job.jobId) && (
                        <div className="divide-y divide-neutral-200">
                          {job.applications.length === 0 ? (
                            <div className="p-6 text-center text-neutral-500">
                              No applications received for this job yet.
                            </div>
                          ) : (
                            job.applications.map((application) => (
                              <div key={application.id} className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex gap-4">
                                    <Image
                                    width={48}
                                    height={48}
                                      src={application?.avatar}
                                      alt="Candidate"
                                      className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                      <h3 className="text-lg">
                                        {application.name}
                                      </h3>
                                      <p className="text-sm text-neutral-600">
                                        {application.position} • Applied on{" "}
                                        {application.appliedDate}
                                      </p>
                                      <div className="flex space-x-2 mt-2">
                                        {application.skills.map(
                                          (skill, skillIndex) => (
                                            <span
                                              key={skillIndex}
                                              className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs"
                                            >
                                              {skill}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm capitalize">
                                    {application.status}
                                  </span>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/employer/applications/${application.id}`
                                      )
                                    }
                                  >
                                    View Application
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenMessage({
                                      name: application.name,
                                      position: application.position,
                                      avatar: application.avatar,
                                      id: application?.user_id.toString()!,
                                    })}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-black text-white hover:bg-neutral-800"
                                    onClick={() => handleOpenInterview({
                                      id: application.id.toString()!,
                                      name: application.name,
                                      position: application.position,
                                      avatar: application.avatar,
                                      status: application.status,
                                    })}
                                  >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {application?.status === "interview scheduled" ? "Withdraw Interview" : "Schedule Interview"}
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredJobs.length > 0 && data?.meta && (
                    <div className="mt-8">
                      <DataNavigation
                        meta={data.meta}
                        onPageChange={(url) => {
                          if (url) {
                            const urlObj = new URL(url);
                            const page = urlObj.searchParams.get('page');

                            // Preserve existing query parameters
                            const currentParams = new URLSearchParams(searchParams.toString());
                            currentParams.set('page', page || '1');

                            router.push(`/dashboard/employer/applications?${currentParams.toString()}`);
                            mutate();
                          }
                        }}
                        className="justify-center"
                      />
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4 text-manduSecondary font-medium">Applications Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">
                    Total Applications
                  </span>
                  <span className="text-sm text-grayColor font-bold">
                    {/* {jobApplications.reduce(
                      (total, job) => total + job.applications.length,
                      0
                    )} */}
                    {
                      applicationSummary && applicationSummary.total_applications
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">Applied</span>
                  <span className="text-sm text-grayColor font-bold">
                    {
                      applicationSummary && applicationSummary.applied_applications
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">Shortlisted</span>
                  <span className="text-sm text-grayColor font-bold">
                    {
                      applicationSummary && applicationSummary.shortlisted_applications
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">
                    Interview Scheduled
                  </span>
                  <span className="text-sm text-grayColor font-bold">
                    {
                      applicationSummary && applicationSummary.interview_scheduled_applications
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">Rejected</span>
                  <span className="text-sm text-grayColor font-bold">
                    {
                      applicationSummary && applicationSummary.rejected_applications
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4 font-medium text-manduSecondary">Quick Filters</h2>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    router.push("/dashboard/employer/applications?orderby=newest");
                    applicationSummaryMutate()
                    mutate();
                  }}
                  variant="ghost"
                  className="w-full justify-start text-manduNeutral hover:text-neutral-900"
                >
                  <Star className="h-4 w-4 mr-2" />
                  New Applications
                </Button>
                <Button
                  onClick={() => {
                    router.push("/dashboard/employer/applications?orderby=today");
                    mutate();
                  }}
                  variant="ghost"
                  className="w-full justify-start text-manduNeutral hover:text-neutral-900"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Today's Applications
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/dashboard/employer/applications?status=shortlisted");
                    mutate();
                  }}
                  className="w-full justify-start text-manduNeutral hover:text-neutral-900"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Shortlisted
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/dashboard/employer/applications?status=applied");
                    mutate();
                  }}
                  className="w-full justify-start text-manduNeutral hover:text-neutral-900"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCandidate && (
        <MessageModal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          candidate={selectedCandidate}
        />
      )}

      {interviewCandidate && (
        <InterviewScheduleModal
          isOpen={!!interviewCandidate}
          onClose={() => setInterviewCandidate(null)}
          candidate={interviewCandidate}
          application_id={interviewCandidate?.id}
          mutate={mutate}
        />
      )}
      {interviewModalOpen && (
        <InterviewWithdrawModal
          application_id={interviewWithdrawCandidate?.id!}
          isOpen={interviewModalOpen}
          onClose={() => setInterviewModalOpen(false)}
          mutate={mutate}
        />
      )}
    </section>
  );
}

// Main component with Suspense boundary
const ApplicationsPage = () => {
  return (
    <Suspense fallback={<div>Loading applications...</div>}>
      <ApplicationsContent />
    </Suspense>
  );
};

export default ApplicationsPage;
