"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Linkedin,
  Users,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Heart,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useApplication } from "@/lib/application-context";
import { useAuth } from "@/lib/auth-context";
import { JobDescription } from "@/types/job-type";
import { baseFetcher } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
// import { Job } from "@/types/job-type";

interface JobDetailPageClientProps {
  job: JobDescription["data"];
}

const JobDetailPageClient = ({
  job,
  mutate,
}: JobDetailPageClientProps & { mutate: () => void }) => {
  const { openApplicationPanel } = useApplication();
  const { isAuthenticated, openLoginModal, user, isEmployer } = useAuth();

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated && !isEmployer) {
      openApplicationPanel(job);
    } else {
      openLoginModal();
    }
  };

  if (!job) {
    return null;
  }

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
    } else {
      toast({
        title: "Error",
        description: result?.message,
        variant: "destructive",
      });
    }
    mutate();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/jobs"
          className="inline-flex items-center text-base gap-2 font-semibold mb-8 text-manduSecondary"
        >
          <ArrowLeft className="h-4 w-4 text-manduSecondary" />
          Back to Jobs
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Job Header */}
            <div className="bg-white rounded-lg p-6 shadow-xl border border-manduSecondary/20 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                  <Image
                    src={job.image ?? "/logo.png"}
                    alt={job.image ?? "Company Logo"}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-xl mb-[6px] font-semibold text-manduPrimary">
                        {job.title}
                      </h1>
                      <p className="text-pureGray text-sm font-semibold mb-[11px]">
                        {job.employer_name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-grayColor mb-[11px]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.employment_type}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-manduSecondary font-semibold">
                        {job.salary_range.formatted}
                      </span>
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
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6 border border-patternPrimary/10">
              <h2 className="text-xl mb-4 text-bluePrime font-semibold">
                Job Description
              </h2>
              <p className="text-manduBorder text-base mb-6">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6 border border-patternPrimary/10">
              <h2 className="text-xl mb-4 font-semibold text-bluePrime">
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {job?.responsibilities?.map((responsibility, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-grayColor text-base"
                  >
                    <Check className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6 border border-patternPrimary/10">
              <h2 className="text-xl mb-4 font-semibold text-bluePrime">
                Requirements
              </h2>
              <ul className="space-y-3">
                {job?.requirements?.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-grayColor"
                  >
                    <Check className="h-5 w-5 text-grayColor mt-0.5 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6 border border-patternPrimary/10">
              <h2 className="text-xl mb-4 font-semibold text-bluePrime">
                Required Skills
              </h2>
              {job.skills && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, id) => (
                    <span
                      key={id}
                      className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full"
                    >
                      {skill?.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6 border border-patternPrimary/10">
              <h2 className="text-xl mb-4 font-semibold text-bluePrime">
                Benefits
              </h2>
              <ul className="space-y-3">
                {job?.benefits?.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-grayColor"
                  >
                    <Check className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="border bg-white border-patternPrimary/10 rounded-lg p-6 shadow-sm mb-6">
              <Button
                className={`w-full bg-manduSecondary text-white text-base font-semibold mb-3 ${
                  job?.is_applied
                    ? "bg-manduSecondary text-white cursor-not-allowed"
                    : ""
                }`}
                onClick={handleApply}
              >
                {isAuthenticated && !isEmployer
                  ? job?.is_applied
                    ? "Applied"
                    : "Apply Now"
                  : "Sign in to Apply"}
              </Button>

              {job?.saved === true ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveJob(job?.id, job?.saved!);
                  }}
                  variant="ghost"
                  size="icon"
                  className="w-full border border-neutral-200 rounded-lg py-3 text-neutral-700 hover:bg-neutral-50"
                >
                  Job Saved
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
                  className="w-full border hover:text-white border-manduSecondary rounded-lg py-3 text-base font-medium text-manduSecondary hover:bg-manduSecondary"
                >
                  Save Job
                </Button>
              ) : null}
            </div>

            <div className="border bg-white border-patternPrimary/10 rounded-lg p-6 shadow-sm mb-6">
              <h3 className="mb-4 font-medium text-manduPrimary text-lg">
                Job Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-neutral-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-bluePrime">Posted Date</p>
                    <p className="text-manduBorder">
                      {job.posted_date_formatted}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-bluePrime">
                  <Clock className="text-neutral-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-bluePrime">Job Type</p>
                    <p className="text-manduBorder">{job.employment_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-bluePrime w-5 h-5" />
                  <div>
                    <p className="text-sm text-bluePrime">Location</p>
                    <p className="text-manduBorder">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p>रू</p>
                  <div>
                    <p className="text-sm text-bluePrime">Salary Range</p>
                    <p className="text-manduBorder">
                      {job.salary_range.formatted}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border bg-white border-patternPrimary/10 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg mb-4 text-bluePrime font-semibold">
                About Company
              </h3>
              <p className="mb-4 font-normal text-grayColor">
                {job.employer_name} is a leading technology company specializing
                in innovative solutions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Globe className="w-5 h-5 text-patternText" />
                  <span className="text-grayColor text-base cursor-pointer">
                    Website
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Linkedin className="w-5 h-5 text-patternText" />
                  <span className="text-grayColor text-base cursor-pointer">
                    LinkedIn
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Users className="w-5 h-5 text-patternText" />
                  <span className="text-grayColor text-base">
                    51-200 employees
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetailPageClient;
