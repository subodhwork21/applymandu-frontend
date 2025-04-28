"use client";

import React from "react";
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
import { mockUserProfile } from "@/lib/constants";
import { format } from "date-fns";

const ResumeView = () => {
  const profile = mockUserProfile;

  const formatDate = (date: Date | null) => {
    if (!date) return "Present";
    return format(date, "MMM yyyy");
  };

  // Calculate resume completion percentage
  const calculateCompletion = () => {
    let total = 0;
    let completed = 0;

    // Personal Details (25%)
    const personalFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "mobile",
      "email",
      "district",
      "municipality",
      "industry",
      "preferredJobType",
      "careerObjectives",
    ];
    total += personalFields.length;
    completed += personalFields.filter((field) =>
      Boolean(
        profile.personalDetails[field as keyof typeof profile.personalDetails]
      )
    ).length;

    // Experience (25%)
    if (profile.experiences.length > 0) {
      const expFields = [
        "position",
        "company",
        "startDate",
        "responsibilities",
      ];
      profile.experiences.forEach((exp) => {
        total += expFields.length;
        completed += expFields.filter((field) =>
          Boolean(exp[field as keyof typeof exp])
        ).length;
      });
    } else {
      total += 4; // Minimum required experience fields
    }

    // Education (25%)
    if (profile.education.length > 0) {
      const eduFields = ["degree", "institution", "joinedYear"];
      profile.education.forEach((edu) => {
        total += eduFields.length;
        completed += eduFields.filter((field) =>
          Boolean(edu[field as keyof typeof edu])
        ).length;
      });
    } else {
      total += 3; // Minimum required education fields
    }

    // Additional Details (25%)
    // Skills
    total += 5; // Expecting at least 5 skills
    completed += Math.min(profile.additionalDetails.skills.length, 5);

    // Languages
    total += 2; // Expecting at least 2 languages
    completed += Math.min(profile.additionalDetails.languages.length, 2);

    // Social Links
    const socialFields = ["linkedin", "github", "portfolio"];
    total += socialFields.length;
    completed += socialFields.filter((field) =>
      Boolean(
        profile.additionalDetails.socialLinks[
          field as keyof typeof profile.additionalDetails.socialLinks
        ]
      )
    ).length;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <section id="resume" className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">My Resume</h1>
          <p className="text-neutral-600">
            Manage and update your professional profile
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Professional Summary */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">Professional Summary</h2>
                <Link href="/dashboard/jobseeker/resume/edit">
                  <Button className="bg-black text-white hover:bg-neutral-800">
                    Edit Resume
                  </Button>
                </Link>
              </div>
              <p className="text-neutral-600">
                {profile.personalDetails.careerObjectives}
              </p>
            </div>

            {/* Personal Details */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-6">Personal Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-neutral-500 mb-1">Full Name</h3>
                    <p className="text-neutral-800">
                      {profile.personalDetails.firstName}{" "}
                      {profile.personalDetails.middleName}{" "}
                      {profile.personalDetails.lastName}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-neutral-500 mb-1">
                      Date of Birth
                    </h3>
                    <p className="text-neutral-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      {profile.personalDetails.dateOfBirth
                        ? format(profile.personalDetails.dateOfBirth, "PPP")
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-neutral-500 mb-1">Gender</h3>
                    <p className="text-neutral-800 capitalize">
                      {profile.personalDetails.gender}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-neutral-500 mb-1">
                      Industry & Job Type
                    </h3>
                    <div className="space-y-2">
                      <p className="text-neutral-800 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-neutral-500" />
                        {profile.personalDetails.industry}
                      </p>
                      <p className="text-neutral-800 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-neutral-500" />
                        {profile.personalDetails.preferredJobType}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-neutral-500 mb-1">
                      Transportation
                    </h3>
                    <div className="space-y-1">
                      {profile.personalDetails.hasLicense && (
                        <p className="text-neutral-800">Has Driving License</p>
                      )}
                      {profile.personalDetails.hasVehicle && (
                        <p className="text-neutral-800">Has Vehicle</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-neutral-500 mb-1">
                      Expected Salary
                    </h3>
                    <p className="text-neutral-800">
                      {profile.personalDetails.salaryExpectations}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-6">Work Experience</h2>
              <div className="space-y-6">
                {profile.experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className={`${
                      index !== profile.experiences.length - 1
                        ? "border-b border-neutral-200"
                        : ""
                    } pb-6`}
                  >
                    <h3 className="text-lg mb-2">{exp.position}</h3>
                    <p className="text-neutral-600 mb-2">{exp.company}</p>
                    <p className="text-sm text-neutral-500 mb-2">
                      {exp.industry} • {exp.jobLevel} Level
                    </p>
                    <p className="text-sm text-neutral-500 mb-4">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      {exp.currentlyWorking && " (Current)"}
                    </p>
                    <ul className="list-disc list-inside text-neutral-600 space-y-2">
                      {exp.responsibilities.split("\n").map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-6">Education</h2>
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className={`${
                      index !== profile.education.length - 1
                        ? "border-b border-neutral-200"
                        : ""
                    } pb-6`}
                  >
                    <h3 className="text-lg">
                      {edu.degree} in {edu.subject}
                    </h3>
                    <p className="text-neutral-600">{edu.institution}</p>
                    <p className="text-sm text-neutral-500">
                      {formatDate(edu.joinedYear)} -{" "}
                      {formatDate(edu.passedYear)}
                      {edu.currentlyStudying && " (Current)"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills and Languages Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Skills */}
              <div className="bg-white p-6 rounded-lg border border-neutral-200 h-full">
                <h2 className="text-xl mb-6">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.additionalDetails.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-neutral-100 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white p-6 rounded-lg border border-neutral-200 h-full">
                <h2 className="text-xl mb-6">Languages</h2>
                <div className="space-y-4">
                  {profile.additionalDetails.languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-neutral-600">{lang.language}</span>
                      <span className="text-sm text-neutral-500 capitalize">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Training & Certificates */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-6">Training & Certificates</h2>

              {/* Training */}
              {profile.additionalDetails.training.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg mb-4">Training</h3>
                  <div className="space-y-4">
                    {profile.additionalDetails.training.map((train) => (
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
              {profile.additionalDetails.certificates.length > 0 && (
                <div>
                  <h3 className="text-lg mb-4">Certificates</h3>
                  <div className="space-y-4">
                    {profile.additionalDetails.certificates.map((cert) => (
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
            </div>

            {/* References */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-6">References</h2>
              <div className="space-y-6">
                {profile.additionalDetails.references.map((ref) => (
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
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="text-center mb-6">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl">
                  {profile.personalDetails.firstName}{" "}
                  {profile.personalDetails.middleName}{" "}
                  {profile.personalDetails.lastName}
                </h2>
                <p className="text-neutral-600">
                  {profile.personalDetails.lookingFor}
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {profile.additionalDetails.socialLinks.portfolio && (
                  <a
                    href={profile.additionalDetails.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
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
              <div className="mt-6">
                <Button className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-neutral-800">
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
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-black"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
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
                  <span className="text-sm">245</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Downloads</span>
                  <span className="text-sm">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Last Updated</span>
                  <span className="text-sm">Apr 15, 2025</span>
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
