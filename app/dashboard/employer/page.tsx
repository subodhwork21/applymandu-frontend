"use client";

import React, { useState } from "react";
import {
  Building,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Eye,
  Clock,
  Users,
  Loader,
  LayoutDashboard,
  CalendarCheck,
  InfoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PostJobModal from "@/components/post-job-modal";
import UpgradePlanModal from "@/components/upgrade-plan-modal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { format, formatDistanceToNow } from "date-fns";
import RecentApplications from "@/components/recent-applications";
import SoftDeleteModal from "@/components/ui/soft-delete-job-modal";
import Image from "next/image";
import DataNavigation from "@/components/ui/data-navigation";

// Define interfaces for the API response
interface ActiveJob {
  id: number;
  title: string;
  location: string;
  department: string;
  company_name: string | null;
  description: string;
  location_type: string;
  employment_type: string;
  salary_min: string;
  salary_max: string;
  posted_date: string;
  status: number;
  applicants_count: number;
  posted: string;
  views_count: number;
  experience_level: string;
  application_deadline: string;
  skills: Record<string,any>[];
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  slug: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ActiveJobsResponse {
  current_page: number;
  data: ActiveJob[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface DashboardData {
  active_jobs: number;
  active_applications: number;
  hired_applications: number;
}

interface DashboardResponse {
  active_jobs: ActiveJobsResponse;
}

const EmployerDashboardPage = () => {
  const router = useRouter();
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

    const [softDeleteId, setSoftDeleteId] = useState<number | null>(null);
  const [softDeleteModal, setSoftDeleteModal] = useState(false);

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    setIsPostJobModalOpen(true);
  };

  const { user } = useAuth();

  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading, mutate: mutateStats } = 
    useSWR<DashboardData>("api/dashboard/active-jobs-applications", defaultFetcher);

  // Fetch active job listings
  const { data: jobsData, isLoading: jobsLoading, mutate: mutateJobs } = 
    useSWR<DashboardResponse>(`api/dashboard/active-job-listing${page ? `?page=${page}` : ""}`, defaultFetcher);

  // Format posted date to relative time (e.g., "5 days ago")
  const getPostedTimeAgo = (postedDate: string) => {
    try {
      return formatDistanceToNow(new Date(postedDate), { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  //soft delete



  const handleCloseJob = async (jobId: number) => {
    setSoftDeleteId(jobId);
    setSoftDeleteModal(true);
  };





  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
              <h1 className="text-manduSecondary font-nasalization text-3xl mb-2.5">Dashboard</h1>
              <p className="text-manduBorder text-sm font-medium">Track your job posting progress</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-neutral-200 w-full">
                <div className="flex items-center flex-col justify-between mb-2 w-full">
                  <div className="flex pt-6 w-full pb-3 justify-center items-center gap-4 border-b-[1px] font-medium">

                  <h3 className="text-lg text-manduBorder">Active Jobs</h3>
                  <LayoutDashboard className="w-4 h-4 text-manduBorder" />
                  </div>
                  <span className="text-3xl font-semibold mt-2 text-darkGrey">{statsData?.active_jobs || 0}</span>
                <p className="text-sm text-dashboardTitleLight">Currently posted</p>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-neutral-200 w-full">
                <div className="flex items-center flex-col justify-between mb-2 w-full">
                  <div className="flex pt-6 w-full pb-3 justify-center items-center gap-4 border-b-[1px] font-medium">

                  <h3 className="text-lg text-manduBorder">Applications</h3>
                  <CalendarCheck className="w-4 h-4 text-manduBorder" />
                  </div>
                  <span className="text-3xl font-semibold mt-2 text-darkGrey">{statsData?.active_applications || 0}</span>
                <p className="text-sm text-dashboardTitleLight">Total received</p>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-neutral-200 w-full">
                <div className="flex items-center flex-col justify-between mb-2 w-full">
                  <div className="flex pt-6 w-full pb-3 justify-center items-center gap-4 border-b-[1px] font-medium">

                  <h3 className="text-lg text-manduBorder">Total received</h3>
                  <InfoIcon className="w-4 h-4 text-manduBorder" />
                  </div>
                  <span className="text-3xl font-semibold mt-2 text-darkGrey">{statsData?.hired_applications || 0}</span>
                <p className="text-sm text-dashboardTitleLight">This month</p>
                </div>
              </div>
            </div>

            <div className="bg-white md:p-6 py-6 rounded-lg border border-neutral-200">
              <div className="flex justify-between items-center mb-4 px-2 md:p-0">
                <h2 className="md:text-xl text-md text-manduSecondary">Recent Applications</h2>
                <Button
                  className="bg-manduCustom-secondary-blue text-white hover:bg-manduCustom-secondary-blue/80 rounded-[9px]"
                  onClick={() => setIsPostJobModalOpen(true)}
                >
                  Post New Job
                </Button>
              </div>
              {/* <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=456"
                      alt="Candidate"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg">Sarah Smith</h3>
                      <p className="text-sm text-neutral-600">
                        Frontend Developer • 5 years experience
                      </p>
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs mt-2">
                        Under Review
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push("/dashboard/employer/applications/1")
                    }
                  >
                    Start Review
                  </Button>
                </div>
              </div> */}
              <RecentApplications/>
            </div>

            <div className="bg-white py-6 px-2 md:p-6  rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4 font-medium text-manduSecondary">Active Job Listings</h2>
              {jobsLoading ? (
                <div className="text-center py-4">Loading job listings...</div>
              ) : jobsData?.active_jobs?.data?.length === 0 ? (
                <div className="text-center py-4 text-neutral-600">
                  No active job listings found. Post a new job to get started!
                </div>
              ) : (
                <div className="space-y-4">
                  {jobsData?.active_jobs?.data?.map((job) => (
                    <div key={job.id} className="p-4 border border-neutral-200 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg mb-2 text-bluePrime font-medium">
                            {job.title}
                          </h3>
                          <div className="space-y-2 text-sm text-neutral-600">
                            <p className="flex items-center gap-2 text-manduBorder text-sm">
                              <Users className="h-6 w-6 bg-patternText rounded-full p-1 text-white" />
                              {job.applicants_count} Applicants
                            </p>
                            <p className="flex items-center gap-2 text-manduBorder">
                              <Clock className="h-6 w-6 bg-patternText rounded-full p-1 text-white"/>
                              Posted {getPostedTimeAgo(job.posted)}
                            </p>
                            <p className="flex items-center gap-2 text-manduBorder">
                              <Eye className="h-6 w-6 bg-patternText rounded-full p-1 text-white"/>
                              {job.views_count} Views
                            </p>
                            <p className="flex items-center gap-2 text-manduBorder">
                              <MapPin className="h-6 w-6 bg-patternText rounded-full p-1 text-white"/>
                              {job?.location_type +" : "+ job.location}
                            </p>
                            <p className="flex items-center gap-2 text-manduBorder">
                              <Briefcase className="h-6 w-6 bg-patternText rounded-full p-1 text-white"/>
                              {job.employment_type}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                          className="bg-manduSecondary text-white"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleEditJob({
                                id: job.id,
                                title: job.title,
                                department: job?.department,
                                employment_type: job.employment_type,
                                experience_level: job?.experience_level,
                                location: job.location,
                                salary_min: parseInt(job.salary_min),
                                salary_max: parseInt(job.salary_max),
                                description: job.description,
                                location_type: job.location_type,
                                application_deadline: job?.application_deadline,
                                skills: job?.skills,
                                requirements: job?.requirements,
                                responsibilities: job?.responsibilities,
                                benefits: job?.benefits,
                                slug: job?.slug,
                              })
                            }
                          >
                            Edit
                          </Button>
                          <Link href={`/jobs/${job?.slug}`}>
                            <Button variant="outline" size="sm" className="w-full bg-manduSecondary text-white">
                              View
                            </Button>
                          </Link>
                          <Button className="bg-manduSecondary text-white" onClick={() => handleCloseJob(job.id)} variant="outline" size="sm">
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {jobsData && jobsData.active_jobs?.last_page > 1 && (
                <div className="mt-6">
                  <DataNavigation 
                    meta={{
                      current_page: jobsData.active_jobs.current_page,
                      from: jobsData.active_jobs.from,
                      last_page: jobsData.active_jobs.last_page,
                      links: jobsData.active_jobs.links,
                      path: jobsData.active_jobs.path,
                      per_page: jobsData.active_jobs.per_page,
                      to: jobsData.active_jobs.to,
                      total: jobsData.active_jobs.total
                    }}
                    onPageChange={(url) => {
                      // Extract page number from URL
                      const urlObj = new URL(url);
                      const page = urlObj.searchParams.get('page');
                     router.push(`/dashboard/employer?page=${page}`, {
                      scroll: false,
                     });
                      // Refresh job listings
                      mutateJobs();
                    }}
                    className="justify-center"
                  />
                </div>
              )}

            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-neutral-200 rounded-full mb-4 flex items-center justify-center">
                 {
                    user?.image_path ? (
                      <Image
                        src={user?.image_path}
                        alt="Company Logo"
                        width={100}
                        height={100}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Building className="w-12 h-12 text-neutral-600" />
                    )
                 }
                </div>
                <h2 className="text-xl mb-2">{user?.company_name}</h2>
                <p className="text-neutral-600 mb-6">
                  {
                    // user?.email
                  }
                </p>
                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-neutral-600" />
                    <span>{user?.email || "email@example.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-neutral-600" />
                    <span>+977 {user?.phone || "98XXXXXXXX"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neutral-600" />
                    <span>Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Recruitment Analytics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Application Rate
                  </span>
                  <span className="text-sm">21.5/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Time to Hire</span>
                  <span className="text-sm">15 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Cost per Hire
                  </span>
                  <span className="text-sm">$450</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Subscription Plan</h2>
              <div className="p-4 bg-neutral-50 rounded-md">
                <h3 className="text-lg mb-2">Premium Plan</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Valid until May 2025
                </p>
                <Button
                  className="w-full bg-black text-white hover:bg-neutral-800"
                  onClick={() => setIsUpgradeModalOpen(true)}
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => {
          setIsPostJobModalOpen(false);
          setSelectedJob(null);
          // Refresh job listings after closing the modal
          mutateJobs();
          mutateStats();
        }}
        editJob={selectedJob}
      />

      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
      {
        softDeleteId && softDeleteModal ? (
          <SoftDeleteModal
            isOpen={softDeleteModal}
            onClose={() => setSoftDeleteModal(false)}
            jobId={softDeleteId}
            mutate={mutateJobs}
          />
        ) : null
      }
    </section>
  );
};

export default EmployerDashboardPage;
