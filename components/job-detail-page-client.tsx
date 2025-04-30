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
// import { Job } from "@/types/job-type";

interface JobDetailPageClientProps {
  job: JobDescription["data"];
}

const JobDetailPageClient = ({ job }: JobDetailPageClientProps) => {
  const { openApplicationPanel } = useApplication();
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      openApplicationPanel(job);
    } else {
      openLoginModal();
    }
  };

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Job Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-neutral-200 rounded-lg flex items-center justify-center">
                  <div className="text-white text-3xl">
                    {job.employer_name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl mb-2">{job.title}</h1>
                      <p className="text-neutral-600 text-lg mb-3">
                        {job.employer_name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.employment_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary_range.formatted}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <Heart className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl mb-4">Job Description</h2>
              <p className="text-neutral-600 mb-6">{job.description}</p>
              <div className="whitespace-pre-line text-neutral-600">
                {job.description}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job?.responsibilities?.map((responsibility, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-neutral-600"
                  >
                    <Check className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job?.requirements?.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-neutral-600"
                  >
                    <Check className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl mb-4">Required Skills</h2>
              {job.skills && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill,id) => (
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
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl mb-4">Benefits</h2>
              <ul className="space-y-3">
                {job?.benefits?.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-neutral-600"
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
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <Button
                className="w-full bg-black text-white rounded-lg py-3 mb-4 hover:bg-neutral-800"
                onClick={handleApply}
              >
                {isAuthenticated ? "Apply Now" : "Sign in to Apply"}
              </Button>
              <Button
                variant="outline"
                className="w-full border border-neutral-200 rounded-lg py-3 text-neutral-700 hover:bg-neutral-50"
              >
                Save Job
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-neutral-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-neutral-500">Posted Date</p>
                    <p className="text-neutral-700">{job.posted_date_formatted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-neutral-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-neutral-500">Job Type</p>
                    <p className="text-neutral-700">{job.employment_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-neutral-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-neutral-500">Location</p>
                    <p className="text-neutral-700">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="text-neutral-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-neutral-500">Salary Range</p>
                    <p className="text-neutral-700">{job.salary_range.formatted}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg mb-4">About Company</h3>
              <p className="text-neutral-600 mb-4">
                {job.employer_name} is a leading technology company specializing in
                innovative solutions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Globe className="w-5 h-5" />
                  <span className="hover:text-black cursor-pointer">
                    Website
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Linkedin className="w-5 h-5" />
                  <span className="hover:text-black cursor-pointer">
                    LinkedIn
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Users className="w-5 h-5" />
                  <span>51-200 employees</span>
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
