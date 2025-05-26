"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LayoutDashboardIcon,
  CalendarCheck,
  InfoIcon,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockUserProfile } from "@/lib/constants";
import { jobs } from "@/lib/constants";
import { useApplication } from "@/lib/application-context";
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { ApplicationResponse } from "@/types/application-type";
import { Activity } from "@/types/activity-type";
import { Job } from "@/types/job-type";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";
import JobSeekerDashboardSkeleton from "@/components/ui/jobseeker-dashboard-skeleton";

const isServer = () => typeof window === "undefined";

const DashboardPage = () => {
  const { openApplicationPanel } = useApplication();
  const pathname = usePathname();
  // const profile = mockUserProfile;
  const { user, isAuthenticated, isEmployer, openLoginModal } = useAuth();
  const router = useRouter();

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

  const { data: profile, isLoading: profileLoading } = useSWR<
    Record<string, any>
  >("api/jobseeker/user-profile", defaultFetcher);

  const { data: recentApplications } = useSWR<ApplicationResponse>(
    "api/dashboard/jobseeker/recent-applications",
    defaultFetcher
  );

const recentActivityIcons = {
    profile_viewed: { icon: Eye, color: "text-manduSecondary", bg: "bg-iconHeart/40" },
    job_viewed: { icon: Eye, color: "text-manduSecondary", bg: "bg-iconHeart/40" },
    interview_scheduled: { icon: Calendar, color: "text-manduPrimary" , bg: "bg-iconCalendar/40 " },
    application_status_update: { icon: Briefcase, color: "text-purple-500" , bg: "bg-iconCalendar/40" },
    job_match_found: { icon: BookmarkCheck, color: "text-amber-500", bg: "bg-iconCalendar/40" },
    job_saved: { icon: Heart, color: "text-red-500",  bg: "bg-iconHeart/40"  },
    default: { icon: Calendar, color: "text-gray-500", bg: "bg-iconCalendar/40" },
  };

  const {
    data: recentActivity,
    error,
    isLoading: activityLoading,
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

  const handleApply = (e: React.MouseEvent<HTMLButtonElement>, job: any) => {
    if (isAuthenticated && !isEmployer) {
      if (job?.is_applied) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this job.",
        });
        return;
      }
      openApplicationPanel(job);
    } else {
      openLoginModal();
    }
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

  const {
    data: completionPercentage,
    isLoading: completionLoading,
    mutate: completionMutate,
  } = useSWR<Record<string, any>>(
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

  const {
    data: recommendedJobs,
    isLoading: recommendedJobsLoading,
    mutate: recommendedJobsMutate,
  } = useSWR<Record<string, any>>(
    "api/dashboard/recommended-jobs",
    defaultFetcher
  );

  const handleSaveJob = async (id: number, saved: boolean) => {
    const { response, result } = await baseFetcher(
      saved ? "api/activity/unsave-job/" + id : "api/activity/save-job/" + id,
      {
        method: "GET",
      }
    );

    if (response?.ok) {
      toast({
        title: "Success",
        description: result?.message,
        variant: "default",
      });
      recommendedJobsMutate();
    } else {
      toast({
        title: "Error",
        description: result?.message,
        variant: "destructive",
      });
    }
  };

  if (activityLoading || isServer()) {
    return <JobSeekerDashboardSkeleton />;
  }

  return (
    <main className="min-h-screen bg-neutral-50 2xl:px-0 lg:px-12 px-4">
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl mb-5 text-manduSecondary font-nasalization font-normal">
              Dashboard
            </h1>
            <p className="text-manduBorder text-sm font-poppins">
              Track your job search progress and activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white py-6 border border-gray-400/40 rounded-[15.5px] duration-700 hover:shadow-xl">
                  <div className="flex items-center justify-center gap-4 mb-2 pb-4 border-b border-manduBorder/40">
                    <h3 className="text-2xl text-dashboardTitle font-medium">
                      Applications
                    </h3>
                    <LayoutDashboardIcon className="w-5 h-5 text-manduPrimary" />
                  </div>
                  <div className="text-center">
                    {" "}
                    <span className="text-3xl text-dashboardTitle font-semibold mb-6">
                      {totalApplications?.count?.total_applications}
                    </span>
                    <p className="text-lg text-dashboardTitleLight font-normal">
                      Total jobs applied
                    </p>
                  </div>
                </div>
                <div className="bg-white py-6 rounded-[15.5px] border border-gray-400/40 duration-700 hover:shadow-xl">
                  <div className="flex items-center justify-center gap-4 mb-2 pb-4 border-b border-manduBorder/40">
                    <h3 className="text-2xl text-dashboardTitle font-medium">
                      Interviews
                    </h3>
                    <CalendarCheck className="w-5 h-5 text-manduPrimary" />
                  </div>
                  <div className="text-center">
                     <span className="text-3xl text-dashboardTitle font-semibold mb-6">
                      {totalApplications?.count?.total_interviews}
                    </span>
                  <p className="text-lg text-dashboardTitleLight font-normal">
                    Scheduled this month
                  </p>
                  </div>
                </div>
                <div className="bg-white py-6 border border-gray-400/40 rounded-[15.5px] duration-700 hover:shadow-xl">
                  <div className="flex items-center justify-center gap-4 mb-2 pb-4 border-b border-manduBorder/40">
                    <h3 className="text-2xl text-dashboardTitle font-medium">
                      Saved
                    </h3>
                    <InfoIcon className="w-5 h-5 text-manduPrimary" />
                  </div>
                  <div className="text-center">
                    <span className="text-3xl text-dashboardTitle font-semibold mb-6">
                      {totalApplications?.count?.saved_jobs}
                    </span>
                  <p className="text-lg text-dashboardTitleLight font-normal">Bookmarked jobs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white py-6 rounded-lg border border-neutral-200">
                <h2 className="mb-4 pl-8 text-manduSecondary font-normal text-xl">Recent Applications</h2>
                <div className="grid pl-8 pt-6  grid-cols-1 md:grid-cols-2 gap-4 border-t-[2px] border-grayText">
                  {recentApplications &&
                  recentApplications?.data?.length > 0 ? (
                    recentApplications?.data?.map((application) => (
                      // <Link
                      //   key={application.id}
                      //   href={`/dashboard/jobseeker/applications/${application.id}`}
                      // >
                        <div className="py-4 px-5 border border-neutral-200 rounded-lg transition-colors cursor-pointer">
                          <div>
                            <div className="font-semibold text-sm text-black mb-3 flex justify-between items-center w-full">
                              <h3>
                                {application.job_title}
                              </h3>
                              <span onClick={() => router.push(`/dashboard/jobseeker/applications/${application.id}`)} className="flex justify-end items-center gap-1 text-manduSecondary font-medium">
                                  View Detail
                                    <ArrowRight className="h-4 w-4 font-[900] text-base text-manduSecondary" />
                              </span>
                            </div>
                            <p className="text-sm text-black font-medium mb-3 capitalize">
                              {application.company_name}
                            </p>
                            <p className="text-sm text-black mt-1 font-normal">
                              Applied on {application.formatted_applied_at}
                            </p>
                          </div>
                         
                        </div>
                      // </Link>
                    ))
                  ) : (
                    <p>No recent applications</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white py-6 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-center mb-2 px-6">
                    <h2 className="text-xl text-manduSecondary font-normal">Recent Activity</h2>
                    <Button variant="ghost" size="sm" className="text-manduSecondary font-semibold hover:text-manduSecondary">
                      View All
                      <ArrowRight className="ml-1 h-4 w-4 font-bold text-manduSecondary" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px] px-6 pt-[14px] border-t-[1px] ">
                    <div className="space-y-4">
                      {recentActivity?.data?.map((activity: Activity) => {
                        let {icon:IconComponent, color, bg} =
                          recentActivityIcons[
                            activity.type as keyof typeof recentActivityIcons
                          ] || recentActivityIcons.default;
                        return (
                          <div
                            key={activity.id}
                            className="flex items-start gap-3"
                          >
                            <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                             <IconComponent className={`h-5 w-5 ${color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-activityText">
                                {activity.description}
                              </p>
                              <span className="text-xs text-activityTextLight">
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
                  <h2 className="text-xl mb-4 text-manduSecondary font-normal">Application Stats</h2>
                  <div className="space-y-6 border-t border-gray-200 pt-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-600">
                          Success Rate
                        </span>
                        <span className="text-sm font-medium">
                          {applicationStats?.data?.success_rate || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{
                            width: `${
                              applicationStats?.data?.success_rate || 0
                            }%`,
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
                          {applicationStats?.data?.response_rate || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{
                            width: `${
                              applicationStats?.data?.response_rate || 0
                            }%`,
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
                          {applicationStats?.data?.interview_rate || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{
                            width: `${
                              applicationStats?.data?.interview_rate || 0
                            }%`,
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
                            {job?.saved === true ? (
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveJob(job?.id, job?.saved!);
                                }}
                                variant="ghost"
                                size="icon"
                                className="text-neutral-400 hover:text-neutral-600"
                              >
                                <Heart className={`text-blue-500 h-5 w-5`} />
                              </Button>
                            ) : job?.saved === false ? (
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveJob(job?.id, job?.saved!);
                                }}
                                variant="ghost"
                                size="icon"
                                className="text-neutral-400 hover:text-neutral-600"
                              >
                                <Heart className="h-5 w-5" />
                              </Button>
                            ) : null}
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
                            className={`w-full bg-black text-white hover:bg-neutral-800 ${
                              job?.is_applied
                                ? "bg-neutral-300 text-neutral-600 hover:bg-neutral-400 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={(e) => handleApply(e, job)}
                          >
                            {isAuthenticated && !isEmployer
                              ? job?.is_applied
                                ? "Applied"
                                : "Apply Now"
                              : "Sign in to Apply"}
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
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-neutral-600 mt-1">
                    {user?.position_title}
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    {profile?.data?.social_links?.some(
                      (item: { platform: string; link: string }) =>
                        item?.platform === "linkedin"
                    ) && (
                      <a
                        href={
                          profile?.data?.social_links?.find(
                            (item: { platform: string; link: string }) =>
                              item?.platform === "linkedin"
                          ).url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {profile?.data?.social_links?.some(
                      (item: { platform: string; link: string }) =>
                        item?.platform === "github"
                    ) && (
                      <a
                        href={
                          profile?.data?.social_links?.find(
                            (item: { platform: string; link: string }) =>
                              item?.platform === "github"
                          ).url
                        }
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
                      {
                        completionPercentage?.data?.profile_completion
                          ?.overall_percentage
                      }
                      %
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-black"
                      style={{
                        width: `${completionPercentage?.data?.profile_completion?.overall_percentage}%`,
                      }}
                    />
                  </div>
                  {completionPercentage?.data?.profile_completion
                    ?.overall_percentage === 100 ? (
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
