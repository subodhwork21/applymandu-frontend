"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  Briefcase,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { JobSeekerProfileResponse } from "@/types/jobseeker-resume";
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { useAuth } from "@/lib/auth-context";
import { jobSeekerToken } from "@/lib/tokens";
import Image from "next/image";

const ResumeView = () => {
  const { user } = useAuth();

  const [resumePdf, setResumePdf] = useState<string | null>(null);

  const { data: resume, mutate } = useSWR<JobSeekerProfileResponse>(
    user?.id !== undefined ? `api/jobseeker/resume/${user.id}` : null,
    defaultFetcher
  );

  const { data: resumeCompletion } = useSWR<Record<string, any>>(
    user?.id !== undefined ? "api/dashboard/profile-completion" : null,
    defaultFetcher
  );

  const {
    data: resumeStats,
    isLoading,
    mutate: statsMutate,
  } = useSWR<Record<string, any>>(
    "api/jobseeker/resume-stats/",
    defaultFetcher
  );

  if (!resume?.data) {
    return (
      <div className="py-8 text-center">
        <p>No resume data available...</p>
        <p className="text-sm text-neutral-600 mb-6">
          Complete your resume to increase visibility to employers
        </p>
        <Link href="/dashboard/jobseeker/resume/edit">
          <Button className="bg-black text-white hover:bg-neutral-800">
            Add Resume
          </Button>
        </Link>
      </div>
    );
  }

  const profile = resume.data;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    try {
      return format(new Date(dateString), "MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Calculate resume completion percentage from API response
  const getCompletionPercentage = () => {
    if (!resumeCompletion?.data?.profile_completion?.overall_percentage) {
      return 0;
    }
    return resumeCompletion.data.profile_completion.overall_percentage;
  };

  const completionPercentage = getCompletionPercentage();

  const downloadResume = async (id: number) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${baseUrl}api/jobseeker/generate-resume`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jobSeekerToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch PDF");
      return;
    }

    const blob = await res.blob();
    const fileUrl = URL.createObjectURL(blob);

    window.open(fileUrl);
  };

  return (
    <section id="resume" className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl text-manduSecondary font-nasalization font-normal mb-2.5">
            My Resume
          </h1>
          <p className="text-manduBorder font-medium text-sm">
            Manage and update your professional profile
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Professional Summary */}
            <div className="bg-white p-6 rounded-[8px] border border-borderLine">
              <div className="flex justify-between items-center mb-3.5">
                <h2 className="text-xl text-statsValue font-medium">
                  Professional Summary
                </h2>
                <Link href="/dashboard/jobseeker/resume/edit">
                  <Button className="bg-manduSecondary text-white hover:bg-manduSecondary/80 text-sm font-bold">
                    Edit Resume
                  </Button>
                </Link>
              </div>
              <p className="text-grayColor text-base font-normal">
                {profile.jobseekerProfile.career_objectives ||
                  "No career objectives provided."}
              </p>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="bg-grayBg/30 p-7">
                <h2 className="text-xl text-manduSecondary font-medium">
                  Personal Details
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-manduBorder mb-1">Full Name</h3>
                    <p className="text-activityText font-medium">
                      {profile.jobseekerProfile.first_name}{" "}
                      {profile.jobseekerProfile.middle_name}{" "}
                      {profile.jobseekerProfile.last_name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-manduBorder mb-1">
                      Date of Birth
                    </h3>
                    <p className="text-activityText font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-activityText font-medium" />
                      {profile.jobseekerProfile.date_of_birth
                        ? format(
                            new Date(profile.jobseekerProfile.date_of_birth),
                            "PPP"
                          )
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-manduBorder mb-1">Gender</h3>
                    <p className="text-activityText capitalize font-medium">
                      {profile.jobseekerProfile.gender}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-manduBorder mb-1">
                      Industry & Job Type
                    </h3>
                    <div className="space-y-2">
                      <p className="text-activityText font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-manduPrimary" />
                        {profile.jobseekerProfile.industry}
                      </p>
                      <p className="text-activityText font-medium flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-manduPrimary" />
                        {profile.jobseekerProfile.preferred_job_type}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-manduBorder mb-1">
                      Transportation
                    </h3>
                    <div className="space-y-1">
                      {profile.jobseekerProfile.has_driving_license && (
                        <p className="text-activityText font-medium">
                          Has Driving License
                        </p>
                      )}
                      {profile.jobseekerProfile.has_vehicle && (
                        <p className="text-activityText font-medium">
                          Has Vehicle
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-manduBorder mb-1">
                      Expected Salary
                    </h3>
                    <p className="text-activityText font-medium">
                      {profile.jobseekerProfile.salary_expectations}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience  */}
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="bg-grayBg/30 p-7">
                <h2 className="text-xl text-manduSecondary font-medium">
                  Work Experience
                </h2>
              </div>
              <div className="p-6">
                {profile.experiences && profile.experiences.length > 0 ? (
                  <div className="py-[14px]">
                    {profile.experiences.map((exp, index) => (
                      <div
                        key={exp.id}
                        className={`${
                          index !== profile.experiences.length - 1
                            ? "border-b border-neutral-200"
                            : ""
                        } pb-6`}
                      >
                        <h3 className="text-lg font-normal mb-4 text-statsValue">{exp.position_title}</h3>
                        <p className="text-neutral-600 mb-2">
                          {exp.company_name}
                        </p>
                        <p className="text-sm text-neutral-500 mb-2">
                          {exp.industry} • {exp.job_level} Level
                        </p>
                        <p className="text-sm text-neutral-500 mb-4">
                          {formatDate(exp.start_date)} -{" "}
                          {formatDate(exp.end_date)}
                          {exp.currently_work_here && " (Current)"}
                        </p>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2">
                          {exp?.roles_and_responsibilities
                            ?.split("\n")
                            .map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500">
                    No work experience added yet.
                  </p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="bg-grayBg/30 p-7">
                <h2 className="text-xl text-manduSecondary font-medium">
                  Education
                </h2>
              </div>
              <div className="p-6">
                {profile.educations && profile.educations.length > 0 ? (
                  <div className="space-y-6">
                    {profile.educations.map((edu, index) => (
                      <div
                        key={edu.id}
                        className={`${
                          index !== profile.educations.length - 1
                            ? "border-b border-neutral-200"
                            : ""
                        } pb-6`}
                      >
                        <h3 className="text-lg">
                          {edu.degree} in {edu.subject_major}
                        </h3>
                        <p className="text-neutral-600">{edu.institution}</p>
                        <p className="text-sm text-neutral-500">
                          {formatDate(edu.joined_year)} -{" "}
                          {formatDate(edu.passed_year)}
                          {edu.currently_studying && " (Current)"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500">
                    No education history added yet.
                  </p>
                )}
              </div>
            </div>

            {/* Skills and Languages Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Skills */}
              <div className="bg-white rounded-lg border border-neutral-200 h-full">
                <div className="bg-grayBg/30 p-7">
                  <h2 className="text-xl text-manduSecondary font-medium">
                    Skills
                  </h2>
                </div>
                <div className="p-6">
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 bg-neutral-100 rounded-full text-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-lg border border-neutral-200 h-full">
                <div className="bg-grayBg/30 p-7">
                  <h2 className="text-xl text-manduSecondary font-medium">
                    Languages
                  </h2>
                </div>
                <div className="p-6">
                  {profile.languages && profile.languages.length > 0 ? (
                    <div className="space-y-4">
                      {profile.languages.map((lang) => (
                        <div
                          key={lang.id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-neutral-600">
                            {lang.language}
                          </span>
                          <span className="text-sm text-neutral-500 capitalize">
                            {lang.proficiency}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500">No languages added yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Training & Certificates */}
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="bg-grayBg/30 p-7">
                <h2 className="text-xl text-manduSecondary font-medium">
                  Training & Certificates
                </h2>
              </div>
              <div className="p-6">
                {/* Training */}
                {profile.trainings && profile.trainings.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg mb-4 text-activityText font-medium">
                      Training
                    </h3>
                    <div className="space-y-4">
                      {profile.trainings.map((train) => (
                        <div
                          key={train.id}
                          className="border-b border-neutral-200 pb-4"
                        >
                          <h4 className="font-medium">{train.title}</h4>
                          <p className="text-neutral-600 text-sm">
                            {train.institution}
                          </p>
                          <p className="text-neutral-500 text-sm mt-2">
                            {train.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {profile.certificates && profile.certificates.length > 0 && (
                  <div>
                    <h3 className="text-lg mb-4 text-activityText font-medium">
                      Certificates
                    </h3>
                    <div className="space-y-4">
                      {profile.certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="border-b border-neutral-200 pb-4"
                        >
                          <h4 className="font-medium">{cert.title}</h4>
                          <p className="text-neutral-600 text-sm">
                            {cert.issuer} • {cert.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!profile.trainings || profile.trainings.length === 0) &&
                  (!profile.certificates ||
                    profile.certificates.length === 0) && (
                    <p className="text-neutral-500">
                      No training or certificates added yet.
                    </p>
                  )}
              </div>
            </div>

            {/* References */}
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="bg-grayBg/30 p-7">
                <h2 className="text-xl text-manduSecondary font-medium">
                  References
                </h2>
              </div>
              <div className="p-6">
                {profile.references && profile.references.length > 0 ? (
                  <div className="space-y-6">
                    {profile.references.map((ref) => (
                      <div
                        key={ref.id}
                        className="border-b border-neutral-200 pb-6"
                      >
                        <h3 className="text-lg">{ref.name}</h3>
                        <p className="text-neutral-600">{ref.position}</p>
                        <p className="text-neutral-600">{ref.company}</p>
                        <div className="mt-2 space-y-1 text-sm text-neutral-500">
                          <p>{ref.email}</p>
                          <p>{ref.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500">No references added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="text-center mb-6">
                <Image
                  width={96}
                  height={96}
                  src={user?.image_path!}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl">
                  {profile.jobseekerProfile.first_name}{" "}
                  {profile.jobseekerProfile.middle_name}{" "}
                  {profile.jobseekerProfile.last_name}
                </h2>
                <p className="text-neutral-600">
                  {profile.jobseekerProfile.looking_for}
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {profile.social_links && profile.social_links.length > 0 && (
                  <>
                    {profile.social_links.find(
                      (link) => link.platform === "portfolio"
                    ) && (
                      <a
                        href={
                          profile.social_links.find(
                            (link) => link.platform === "portfolio"
                          )?.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {profile.social_links.find(
                      (link) => link.platform === "linkedin"
                    ) && (
                      <a
                        href={
                          profile.social_links.find(
                            (link) => link.platform === "linkedin"
                          )?.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {profile.social_links.find(
                      (link) => link.platform === "github"
                    ) && (
                      <a
                        href={
                          profile.social_links.find(
                            (link) => link.platform === "github"
                          )?.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </>
                )}
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => downloadResume(profile?.id)}
                  className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-neutral-800"
                >
                  Download Resume
                </Button>
              </div>
            </div>

            {/* Resume Completion */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Resume Completion</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">
                    Completion Status
                  </span>
                  <span className="text-sm font-medium">
                    {completionPercentage}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                {completionPercentage === 100 ? (
                  <p className="text-sm text-green-600">
                    Your profile is complete!
                  </p>
                ) : (
                  <p className="text-sm text-neutral-600">
                    Complete your resume to increase visibility to employers
                  </p>
                )}
              </div>
            </div>

            {/* Resume Privacy */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Resume Privacy</h2>
              <RadioGroup defaultValue="public">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Resume Stats */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Resume Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Profile Views
                  </span>
                  <span className="text-sm">
                    {resumeStats?.data?.profile_views || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Downloads</span>
                  <span className="text-sm">
                    {resumeStats?.data?.resume_downloads}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Last Updated</span>
                  <span className="text-sm">
                    {resumeStats?.data?.resume_updated_at
                      ? format(
                          new Date(resumeStats?.data?.resume_updated_at),
                          "MMM d, yyyy"
                        )
                      : "Not updated yet"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeView;

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="text-sm">
      {children}
    </label>
  );
};
