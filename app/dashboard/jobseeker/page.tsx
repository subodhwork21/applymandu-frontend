"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  BookmarkCheck,
  Calendar,
  ChevronRight,
  Eye,
  Clock,
  User,
  Heart,
  DollarSign,
  Linkedin,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockUserProfile } from "@/lib/constants";
import { jobs } from "@/lib/constants";
import { useApplication } from "@/lib/application-context";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { ApplicationResponse } from "@/types/application-type";
import { Activity } from "@/types/activity-type";
import { Job } from "@/types/job-type";
import { useAuth } from "@/lib/auth-context";

const DashboardPage = () => {
  const { openApplicationPanel } = useApplication();
  const pathname = usePathname();
  const profile = mockUserProfile;
  const {user} = useAuth();

  // const recentApplications = [
  //   {
  //     id: 1,
  //     title: "Senior Frontend Developer",
  //     company: "TechCorp Nepal",
  //     appliedDate: "Apr 15, 2025",
  //   },
  //   {
  //     id: 2,
  //     title: "UX Designer",
  //     company: "DesignHub",
  //     appliedDate: "Apr 12, 2025",
  //   },
  // ];

  const { data: recentApplications } = useSWR<ApplicationResponse>(
    "api/dashboard/jobseeker/recent-applications",
    defaultFetcher
  );

  const recentActivityIcons = {
    profile_viewed: Eye,
    interview_scheduled: Calendar,
    application_status_update: Briefcase,
    job_match_found: BookmarkCheck,
    job_saved: Heart,
    default: Calendar,
  };

  const {
    data: recentActivity,
    error,
    mutate: activityMutate,
  } = useSWR<Record<string, any>>(
    "api/activity/recent-activity",
    defaultFetcher
  );

  // console.log(recentActivity)

  // Filter recommended jobs based on user's profile
  // const recommendedJobs = useMemo(() => {
  //   // Calculate match score for each job
  //   const jobsWithScores = jobs.map((job) => {
  //     let score = 0;

  //     // Match skills (highest weight)
  //     const matchingSkills = job.skills.filter((skill) =>
  //       profile.additionalDetails.skills.includes(skill)
  //     );
  //     score += (matchingSkills.length / job.skills.length) * 5;

  //     // Match job title with current/past positions
  //     const titleMatch = profile.experiences.some(
  //       (exp) =>
  //         job.title.toLowerCase().includes(exp.position.toLowerCase()) ||
  //         exp.position.toLowerCase().includes(job.title.toLowerCase())
  //     );
  //     if (titleMatch) score += 3;

  //     // Match industry
  //     const industryMatch = job.shortDescription
  //       .toLowerCase()
  //       .includes(profile.personalDetails.industry.toLowerCase());
  //     if (industryMatch) score += 2;

  //     // Match salary expectations
  //     const salaryMatch = job.salary
  //       .toLowerCase()
  //       .includes(
  //         profile.personalDetails.salaryExpectations
  //           .toLowerCase()
  //           .replace(/[^0-9]/g, "")
  //       );
  //     if (salaryMatch) score += 1;

  //     return { ...job, matchScore: score };
  //   });

  //   // Sort by match score and return top 2
  //   return jobsWithScores
  //     .sort((a, b) => b.matchScore - a.matchScore)
  //     .slice(0, 2);
  // }, []);

  const handleApply = (e: React.MouseEvent, job: any) => {
    e.preventDefault();
    openApplicationPanel(job);
  };

  // const calculateCompletion = () => {
  //   let total = 0;
  //   let completed = 0;

  //   const personalFields = [
  //     "firstName",
  //     "lastName",
  //     "dateOfBirth",
  //     "gender",
  //     "mobile",
  //     "email",
  //     "district",
  //     "municipality",
  //     "industry",
  //     "preferredJobType",
  //     "careerObjectives",
  //   ];
  //   total += personalFields.length;
  //   completed += personalFields.filter((field) =>
  //     Boolean(
  //       profile.personalDetails[field as keyof typeof profile.personalDetails]
  //     )
  //   ).length;

  //   if (profile.experiences.length > 0) {
  //     const expFields = [
  //       "position",
  //       "company",
  //       "startDate",
  //       "responsibilities",
  //     ];
  //     profile.experiences.forEach((exp) => {
  //       total += expFields.length;
  //       completed += expFields.filter((field) =>
  //         Boolean(exp[field as keyof typeof exp])
  //       ).length;
  //     });
  //   } else {
  //     total += 4;
  //   }

  //   if (profile.education.length > 0) {
  //     const eduFields = ["degree", "institution", "joinedYear"];
  //     profile.education.forEach((edu) => {
  //       total += eduFields.length;
  //       completed += eduFields.filter((field) =>
  //         Boolean(edu[field as keyof typeof edu])
  //       ).length;
  //     });
  //   } else {
  //     total += 3;
  //   }

  //   total += 5;
  //   completed += Math.min(profile.additionalDetails.skills.length, 5);

  //   total += 2;
  //   completed += Math.min(profile.additionalDetails.languages.length, 2);

  //   const socialFields = ["linkedin", "github", "portfolio"];
  //   total += socialFields.length;
  //   completed += socialFields.filter((field) =>
  //     Boolean(
  //       profile.additionalDetails.socialLinks[
  //         field as keyof typeof profile.additionalDetails.socialLinks
  //       ]
  //     )
  //   ).length;

  //   return Math.round((completed / total) * 100);
  // };

  const {data: completionPercentage, isLoading: completionLoading, mutate:completionMutate} = useSWR<Record<string,any>>(
    "api/dashboard/profile-completion",
    defaultFetcher
  );

  const {
    data: totalApplications,
    isLoading,
    mutate,
  } = useSWR<Record<string, any>>(
    "api/dashboard/all-applications",
    defaultFetcher
  );

  const {
    data: applicationStats,
    isLoading: statsLoading,
    mutate: statsMutate,
  } = useSWR<Record<string, any>>(
    "api/dashboard/application-stats",
    defaultFetcher
  );

  const { data: recommendedJobs, isLoading: recommendedJobsLoading } = useSWR<
    Record<string, any>
  >("api/dashboard/recommended-jobs", defaultFetcher);

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
            <p className="text-neutral-600">
              Track your job search progress and activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg">Applications</h3>
                    <span className="text-2xl">
                      {totalApplications?.count?.total_applications}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">Total jobs applied</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg">Interviews</h3>
                    <span className="text-2xl">
                      {totalApplications?.count?.total_interviews}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Scheduled this month
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg">Saved</h3>
                    <span className="text-2xl">
                      {totalApplications?.count?.saved_jobs}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">Bookmarked jobs</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <h2 className="text-xl mb-4">Recent Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentApplications?.data?.map((application) => (
                    <Link
                      key={application.id}
                      href={`/dashboard/applications/${application.id}`}
                    >
                      <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                        <div>
                          <h3 className="font-medium">
                            {application.job_title}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {application.company_name}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Applied on {application.formatted_applied_at}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">Recent Activity</h2>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-4">
                      {recentActivity?.data?.map((activity: Activity) => {
                        let IconComponent =
                          recentActivityIcons[
                            activity.type as keyof typeof recentActivityIcons
                          ] || recentActivityIcons.default;
                        return (
                          <div
                            key={activity.id}
                            className="flex items-start gap-3"
                          >
                            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <IconComponent className="h-4 w-4 text-neutral-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-neutral-800">
                                {activity.description}
                              </p>
                              <span className="text-xs text-neutral-500">
                                {activity.created_at_formatted}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <h2 className="text-xl mb-6">Application Stats</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-600">
                          Success Rate
                        </span>
                        <span className="text-sm font-medium">
                          {applicationStats?.data?.success_rate}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{
                            width: `${applicationStats?.data?.success_rate}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-600">
                          Response Rate
                        </span>
                        <span className="text-sm font-medium">
                          {applicationStats?.data?.response_rate}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{
                            width: `${applicationStats?.data?.response_rate}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-600">
                          Interview Rate
                        </span>
                        <span className="text-sm font-medium">
                          {applicationStats?.data?.interview_rate}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{
                            width: `${applicationStats?.data?.interview_rate}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <h2 className="text-xl mb-4">Recommended Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedJobs?.data?.map((job: Job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-lg border border-neutral-200"
                    >
                      <div className="flex items-start gap-4 p-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                          <div className="text-white text-2xl">
                            {job.employer_name[0]}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg">{job.title}</h3>
                              <p className="text-neutral-600">
                                {job.employer_name}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-neutral-400 hover:text-neutral-600"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 my-3">
                            {job.skills.slice(0, 3).map((skill, id) => (
                              <span
                                key={id}
                                className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
                              >
                                {skill?.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.employment_type}
                            </span>
                            <span className="flex items-center gap-1">
                              {/* <DollarSign className="h-4 w-4" /> */}
                              {job?.salary_range?.formatted}
                            </span>
                          </div>
                          <Button
                            className="w-full bg-black text-white hover:bg-neutral-800"
                            onClick={(e) => handleApply(e, job)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="text-center mb-6">
                  <img
                    src={user?.image_path}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-xl font-medium">
                    {user?.first_name}{" "}
                    {user?.last_name}
                  </h2>
                  <p className="text-neutral-600 mt-1">
                    {user?.position_title}
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    {profile.additionalDetails.socialLinks.linkedin && (
                      <a
                        href={profile.additionalDetails.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {profile.additionalDetails.socialLinks.github && (
                      <a
                        href={profile.additionalDetails.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <h2 className="text-xl mb-4">Profile Completion</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-600">
                      Completion Status
                    </span>
                    <span className="text-sm font-medium">
                      {completionPercentage?.data?.profile_completion?.overall_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-black"
                      style={{ width: `${completionPercentage?.data?.profile_completion?.overall_percentage}%` }}
                    />
                  </div>
                  {completionPercentage?.data?.profile_completion?.overall_percentage === 100 ? (
                    <p className="text-sm text-green-600">
                      Your profile is complete!
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-neutral-600">
                        Complete your profile to increase visibility to
                        employers
                      </p>
                      <Link href="/dashboard/jobseeker/resume/edit">
                        <Button size="sm" className="w-full">
                          Complete Profile
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
