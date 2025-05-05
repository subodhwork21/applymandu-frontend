"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { defaultFetcher } from '@/lib/fetcher';
import useSWR from 'swr';
import { format, parseISO } from 'date-fns';

// Define interfaces for the API response
interface Employer {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  company_name: string;
  email?: string;
  phone?: string | null;
  image?: string | null;
  email_verified_at?: string;
  is_active?: number;
  reset_password_token?: string | null;
  verify_email_token?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApplicationStatusHistory {
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
  latest_status?: string;
  application_status_history: ApplicationStatusHistory[];
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
  applications?: Application[];
}

interface ApplicationWithJob extends Application {
  job: Job;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    application: ApplicationWithJob;
  };
}

interface OtherApplicationsResponse {
  success: boolean;
  message: string;
  data: Job[];
}

const ApplicationDetails = ({id}: {id: string}) => {
  const { data, isLoading, error } = useSWR<ApiResponse>(`api/jobseeker/application/show/${id}`, defaultFetcher);
  const { data: otherApplicationsData } = useSWR<OtherApplicationsResponse>(`api/jobseeker/application`, defaultFetcher);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p>Loading application details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading application details. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const application = data.data.application;
  const job = application.job;
  const employer = job.employer;
  const statusHistory = application.application_status_history;
  
  // Parse JSON strings to arrays
  const requirements = JSON.parse(job.requirements) as string[];
  const responsibilities = JSON.parse(job.responsibilities) as string[];
  const benefits = JSON.parse(job.benefits) as string[];

  // Map status codes to readable strings
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      "applied": "Applied",
      "shortlisted": "Shortlisted",
      "rejected": "Rejected",
      "interview": "Interview",
      "hired": "Hired",
      // Add more status mappings as needed
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status style classes
  const getStatusStyles = (status: string): string => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "applied":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-blue-100 text-blue-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return format(parseISO(dateString), "MMM dd, yyyy");
  };

  // Format date with time for display
  const formatDateTime = (dateString: string): string => {
    return format(parseISO(dateString), "MMM dd, yyyy - h:mm a");
  };
  
  // Get current application status
  const currentStatus = statusHistory.length > 0 
    ? statusHistory[0].status 
    : "applied";

  // Get other applications (excluding the current one)
  const otherApplications = otherApplicationsData?.data
    .filter(jobItem => {
      // Only include jobs that have applications
      return jobItem.applications && jobItem.applications.length > 0;
    })
    .flatMap(jobItem => {
      // Convert job applications to a format with job details included
      return jobItem.applications!.map(app => ({
        id: app.id,
        job_id: jobItem.id,
        position: jobItem.title,
        company: jobItem.employer.company_name,
        location: jobItem.location,
        appliedDate: app.applied_at,
        status: app.latest_status || app.application_status_history[0]?.status || "applied",
        companyInitial: jobItem.employer.company_name.charAt(0)
      }));
    })
    .filter(app => app.id.toString() !== id) // Exclude current application
    .slice(0, 3); // Limit to 3 other applications
  
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Application Details</h1>
          <p className="text-neutral-600">Track the progress of your job application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center gap-4 mb-8">
                  <Link href="/dashboard/jobseeker/applications">
                    <Button variant="ghost" className="text-neutral-600 p-2 h-auto">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <h2 className="text-xl font-semibold">Back to Applications</h2>
                </div>
                
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white text-2xl">{employer.company_name.charAt(0)}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{job.title}</h3>
                      <p className="text-neutral-600 mb-2">{employer.company_name}</p>
                      <div className="flex space-x-4 text-sm text-neutral-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Applied on {formatDate(application.applied_at)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(currentStatus)}`}>
                    {getStatusText(currentStatus)}
                  </span>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-medium mb-6">Application Status Timeline</h4>
                    <div className="relative">
                      <div className="absolute left-[17px] top-0 h-full w-[2px] bg-neutral-200"></div>
                      <div className="space-y-8">
                        {statusHistory.map((status, index) => (
                          <div key={status.id} className="relative flex gap-6">
                            <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                              <CheckCircle2 className="h-5 w-5 text-black" />
                            </div>
                            <div>
                              <p className="text-neutral-900 font-medium">{getStatusText(status.status)}</p>
                              <p className="text-neutral-500 text-sm">{formatDateTime(status.changed_at)}</p>
                              {status.remarks && (
                                <p className="text-neutral-600 text-sm mt-1">{status.remarks}</p>
                              )}
                              {!status.remarks && status.status === "applied" && (
                                <p className="text-neutral-600 text-sm mt-1">Your application was successfully submitted</p>
                              )}
                              {!status.remarks && status.status === "shortlisted" && (
                                <p className="text-neutral-600 text-sm mt-1">Congratulations! You've been shortlisted for the next round</p>
                              )}
                              {!status.remarks && status.status === "interview" && (
                                <p className="text-neutral-600 text-sm mt-1">You've been selected for an interview</p>
                              )}
                              {!status.remarks && status.status === "rejected" && (
                                <p className="text-neutral-600 text-sm mt-1">Unfortunately, your application was not selected</p>
                              )}
                              {!status.remarks && status.status === "hired" && (
                                <p className="text-neutral-600 text-sm mt-1">Congratulations! You've been hired for this position</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Application Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <p className="text-sm text-neutral-500 mb-1">Years of Experience</p>
                          <p className="text-sm font-medium">{application.year_of_experience} years</p>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <p className="text-sm text-neutral-500 mb-1">Expected Salary</p>
                          <p className="text-sm font-medium">${application.expected_salary}</p>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <p className="text-sm text-neutral-500 mb-1">Notice Period</p>
                          <p className="text-sm font-medium">{application.notice_period} days</p>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <p className="text-sm text-neutral-500 mb-1">Employment Type</p>
                          <p className="text-sm font-medium">{job.employment_type}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {application.cover_letter && (
                    <div>
                      <h4 className="text-sm font-medium mb-4">Cover Letter</h4>
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: application.cover_letter }} />
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-4">Job Requirements</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {requirements.map((req, index) => (
                        <li key={index} className="text-sm text-neutral-700">{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Job Responsibilities</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {responsibilities.map((resp, index) => (
                        <li key={index} className="text-sm text-neutral-700">{resp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Benefits</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-neutral-700">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-6">Other Applications</h3>
                <div className="space-y-6 flex flex-col">
                  {otherApplications && otherApplications.length > 0 ? (
                    otherApplications.map((app) => (
                      <Link key={app.id} href={`/dashboard/jobseeker/applications/${app.id}`}>
                        <div className="group p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                              <div className="text-white text-xl">{app.companyInitial}</div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium group-hover:text-neutral-900">{app.position}</h4>
                              <p className="text-sm text-neutral-600">{app.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-xs text-neutral-500">
                              <Clock className="h-3 w-3 mr-1" />
                              Applied on {formatDate(app.appliedDate)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(app.status)}`}>
                              {getStatusText(app.status)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-neutral-500">No other applications found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationDetails;
