"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Calendar, MapPin, Clock, CheckCircle2, Briefcase, Building, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { defaultFetcher } from '@/lib/fetcher';
import useSWR from 'swr';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Define interfaces for the API response
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
  created_at: string | null;
  updated_at: string | null;
  jobs_count: number;
  active_jobs_count: number;
  total_applicants: number;
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

interface SalaryRange {
  min: string;
  max: string;
  formatted: string;
}

interface JobApplication {
  id: number;
  job_id: number;
  user_id: number;
  employer: Employer;
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
  employer_id: number;
  employer_name: string;
  image: string;
  created_at: string;
  updated_at: string;
  viewed: boolean;
  saved: boolean;
  is_applied: boolean;
  status: number;
  slug: string;
  applications?: JobApplication[];
  deleted_at: string | null;
  job_label: string;
}

interface ApiResponse {
  data: JobApplication;
}

interface OtherApplicationsResponse {
  data: Job[];
}

const ApplicationDetails = ({id}: {id: string}) => {
  const { data, isLoading, error } = useSWR<ApiResponse>(`api/jobseeker/application/show/${id}`, defaultFetcher);
  const { data: otherApplicationsData } = useSWR<OtherApplicationsResponse>(`api/jobseeker/application`, defaultFetcher);

  if (isLoading) {
    return (
      <section className="py-8 2xl:px-0 lg:px-12 px-4">
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
      <section className="py-8 2xl:px-0 lg:px-12 px-4">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading application details. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const application = data.data;
  const employer = application.employer;
  const statusHistory = application.status_history;
  
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
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "applied":
        return "bg-green-100 text-green-800 border-green-200";
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "hired":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Format date with time for display
  const formatDateTime = (dateString: string): string => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy - h:mm a");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get current application status
  const currentStatus = statusHistory.length > 0 
    ? statusHistory[0].status?.split("_").join(" ")
    : "applied";

  // Get other applications (excluding the current one)
  const otherApplications = otherApplicationsData?.data
    .filter(job => job.applications && job.applications.length > 0)
    .flatMap(job => 
      job.applications!.map(app => ({
        id: app.id,
        position: job.title,
        company: job.employer_name,
        location: job.location,
        appliedDate: app.applied_at,
        status: app.status_history[0]?.status || "applied",
        companyInitial: job.employer_name.charAt(0),
        companyImage: job.image
      }))
    )
    .filter(app => app.id.toString() !== id)
    .slice(0, 3);
  
  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/jobseeker/applications">
              <Button variant="ghost" className="text-manduSecondary p-2 h-auto hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-medium text-manduSecondary">Application Details</h1>
              <p className="text-manduSecondary">Review candidate application</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {employer.image ? (
                        <Image
                        width={16}
                         height={16}
                          src={employer.image} 
                          alt={employer.company_name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-orange-600 text-2xl font-semibold">{employer.company_name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-bluePrime mb-1">{application.job_title}</h3>
                      <p className="text-grayColor mb-2">{employer.company_name}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-activityTextLight">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied on {application.formatted_applied_at}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {application.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1 bg-manduSuccess rounded-full text-sm font-medium ${getStatusStyles(currentStatus)}`}>
                    {getStatusText(currentStatus)}
                  </Badge>
                </div>

                {/* Application Status Timeline */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-manduSecondary">Application Status Timeline</h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      {statusHistory.map((status, index) => (
                        <div key={status.id} className="relative flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#006B24] border-2 border-white flex items-center justify-center z-10 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-manduCustom-blue-prime font-medium">{getStatusText(status.status.split("_").join(" "))}</p>
                              <span className="text-sm text-activityTextLight">{formatDateTime(status.changed_at)}</span>
                            </div>
                            {status.remarks && (
                              <p className="text-grayColor text-sm">{status.remarks}</p>
                            )}
                            {!status.remarks && status.status === "applied" && (
                              <p className="text-grayColor text-sm">Your application was successfully submitted</p>
                            )}
                            {!status.remarks && status.status === "shortlisted" && (
                              <p className="text-grayColor text-sm">Congratulations! You have been shortlisted for the next round</p>
                            )}
                            {!status.remarks && status.status === "interview_scheduled" && (
                              <p className="text-grayColor text-sm">You have been selected for an interview</p>
                            )}
                            {!status.remarks && status.status === "rejected" && (
                              <p className="text-grayColor text-sm">Unfortunately, your application was not selected</p>
                            )}
                            {!status.remarks && status.status === "hired" && (
                              <p className="text-grayColor text-sm">Congratulations! You have been hired for this position</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-manduSecondary">Application Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-manduCustom-secondary-blue/10 p-4 rounded-lg">
                      <p className="text-sm text-bluePrime mb-1">Years of Experience</p>
                      <p className="text-sm font-medium text-activityTextLight">{application.year_of_experience} years</p>
                    </div>
                    <div className="bg-manduCustom-secondary-blue/10 p-4 rounded-lg">
                      <p className="text-sm text-bluePrime mb-1">Expected Salary</p>
                      <p className="text-sm font-medium text-activityTextLight">Rs. {application.expected_salary}</p>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                {application.cover_letter && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 text-bluePrime">Cover Letter</h4>
                    <div className="bg-manduCustom-secondary-blue/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-bluePrime">Cover_Letter.pdf</span>
                        <span className="text-xs text-activityTextLight">PDF File</span>
                      </div>
                      <div className="text-sm text-activityTextLight" dangerouslySetInnerHTML={{ __html: application.cover_letter }} />
                    </div>
                  </div>
                )}

                {/* Job Requirements */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-manduCustom-secondary-blue">Job Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Illum unde consectetur atque ut qui nihil cupiditate.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Sit et molestiae aliquam eligendi.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Nobis tempora assumenda eaque.</span>
                    </div>
                  </div>
                </div>

                {/* Job Responsibilities */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-manduCustom-secondary-blue">Job Responsibilities</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Illum unde consectetur atque ut qui nihil cupiditate.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Sit et molestiae aliquam eligendi.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Nobis tempora assumenda eaque.</span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-manduCustom-blue-prime">Benefits</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Illum unde consectetur atque ut qui nihil cupiditate.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Sit et molestiae aliquam eligendi.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-grayColor">Nobis tempora assumenda eaque.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Other Applications */}
              {otherApplications && otherApplications.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-manduSecondary">Other Applications</h3>
                  </div>
                  <div className="space-y-4">
                    {otherApplications.map((app) => (
                      <Link href={`/dashboard/jobseeker/applications/${app.id}`} key={app.id}>
                        <div className="group cursor-pointer">
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {app.companyImage ? (
                                <img 
                                  src={app.companyImage} 
                                  alt={app.company} 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="text-manduPrimary text-sm font-semibold">{app.companyInitial}</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-manduPrimary truncate">{app.position}</p>
                                <Badge className={`px-2 py-1 text-successProgress rounded-full text-xs font-medium ${getStatusStyles(app.status)}`}>
                                  {getStatusText(app.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-pureGray truncate mb-1">{app.company}</p>
                              <p className="text-xs text-manduNeutral">Applied on {formatDate(app.appliedDate)}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-manduSecondary">Company Information</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {employer.image ? (
                      <img 
                        src={employer.image} 
                        alt={employer.company_name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-manduSecondary text-xl font-semibold">{employer.company_name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-manduCustom-secondary-blue">{employer.company_name}</h4>
                    <p className="text-sm text-pureGray">{employer.employer_profile?.industry}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {employer.employer_profile?.size && (
                    <div>
                      <p className="text-sm text-manduCustom-secondary-blue mb-1">Company Size</p>
                      <p className="text-sm text-pureGray">{employer.employer_profile.size}</p>
                    </div>
                  )}
                  {employer.employer_profile?.founded_year && (
                    <div>
                      <p className="text-sm text-manduCustom-secondary-blue mb-1">Founded</p>
                      <p className="text-sm text-pureGray">{employer.employer_profile.founded_year}</p>
                    </div>
                  )}
                  {employer.employer_profile?.website && (
                    <div>
                      <p className="text-sm text-manduCustom-secondary-blue mb-1">Website</p>
                      <a href={employer.employer_profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-manduSuccess hover:underline">
                        {employer.employer_profile.website}
                      </a>
                    </div>
                  )}
                  {employer.employer_profile?.address && (
                    <div>
                      <p className="text-sm text-manduCustom-secondary-blue mb-1">Location</p>
                      <p className="text-sm text-pureGray">{employer.employer_profile.address}</p>
                    </div>
                  )}
                </div>
                {employer.employer_profile?.description && (
                  <div className="mt-4">
                    <p className="text-sm text-manduCustom-secondary-blue mb-1">About</p>
                    <p className="text-sm text-pureGray">{employer.employer_profile.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status-based alerts */}
        {currentStatus === "rejected" && (
          <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Application Status: Rejected</h3>
            <p className="text-sm text-red-700 mb-4">
              We're sorry, but your application was not selected for this position. Don't be discouraged - keep applying to other opportunities that match your skills.
            </p>
            <Link href="/jobs">
              <Button className="bg-manduPrimary text-white">
                Browse More Jobs
              </Button>
            </Link>
          </div>
        )}

        {currentStatus === "shortlisted" && (
          <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-800 mb-2">Application Status: Shortlisted</h3>
            <p className="text-sm text-green-700 mb-4">
              Congratulations! Your application has been shortlisted. The employer may contact you soon for the next steps in the hiring process.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-100">
              <h4 className="text-sm font-medium text-green-800 mb-2">Next Steps</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-sm text-green-700">Prepare for a potential interview</li>
                <li className="text-sm text-green-700">Research more about the company</li>
                <li className="text-sm text-green-700">Keep your phone and email accessible</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationDetails;