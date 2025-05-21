"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  Download,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MessageModal from "@/components/message-modal";
import InterviewScheduleModal from "@/components/interview-schedule-modal";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { format } from "date-fns";
import { employerToken } from "@/lib/tokens";

interface Skill {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    user_id: number;
    skill_id: number;
  };
}

interface Experience {
  id: number;
  user_id: number;
  position_title: string;
  company_name: string;
  industry: string;
  job_level: string;
  roles_and_responsibilities: string;
  start_date: string;
  end_date: string | null;
  currently_work_here: boolean;
  created_at: string;
  updated_at: string;
}

interface Education {
  id: number;
  user_id: number;
  subject_major: string;
  institution: string;
  university_board: string;
  grading_type: string;
  joined_year: string;
  passed_year: string;
  currently_studying: boolean;
  created_at: string;
  updated_at: string;
  degree: string;
}

interface Language {
  id: number;
  user_id: number;
  language: string;
  proficiency: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: number;
  user_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  district: string;
  municipality: string;
  city_tole: string;
  date_of_birth: string;
  mobile: string;
  preferred_job_type: string;
  gender: string;
  has_driving_license: boolean;
  has_vehicle: boolean;
  career_objectives: string;
  created_at: string;
  updated_at: string;
  looking_for: string;
  salary_expectations: string;
  industry: string;
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
  cover_letter: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  restore_until: null | string;
}

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string;
  phone: string;
  image_path: string;
  profile: Profile;
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
  skills: Skill[];
  preferences: any;
  immediate_availability: any;
  availability_date: any;
  applications: Application[];
}

const CandidateProfileClient = ({ id }: { id: string }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Fetch candidate data
  const { data, error, isLoading } = useSWR<Candidate>(
    `api/candidate/${id}`,
    defaultFetcher
  );

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    return format(new Date(dateString), "MMM yyyy");
  };

  const handleDownloadResume = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
       const baseUrl = process.env.NEXT_PUBLIC_API_URL;
   
       const res = await fetch(`${baseUrl}api/employer/download-document-by-profile/` + id, {
         method: "GET",
         headers: {
           Authorization: `Bearer ${employerToken()}`,
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

  const {data: calculateProfileCompletion, mutate} = useSWR<Record<string,any>>(`api/dashboard/jobseeker-profile-completion/${id}`, defaultFetcher)

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p>Loading candidate profile...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading candidate profile. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const candidate = data;
  if (!candidate) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p>Candidate not found.</p>
          </div>
        </div>
      </section>
    );
  }

  const profileCompletionPercentage = calculateProfileCompletion?.data?.profile_completion?.overall_percentage;

  // Check availability status
  const isImmediatelyAvailable = candidate.immediate_availability && 
    typeof candidate.immediate_availability === 'object' && 
    Object.keys(candidate.immediate_availability).length > 0;
  
  const hasAvailabilityDate = candidate.availability_date && 
    typeof candidate.availability_date === 'object' && 
    Object.keys(candidate.availability_date).length > 0;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/dashboard/employer/candidates"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Candidates
        </Link>

        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="relative h-48 bg-neutral-100 rounded-t-lg">
            <div className="absolute -bottom-16 left-8">
              <img
                src={candidate.image_path || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.id}`}
                alt={`${candidate.first_name} ${candidate.last_name}`}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl">{`${candidate.first_name} ${candidate.last_name}`}</h1>
                <p className="text-neutral-600">{candidate.profile?.looking_for || "No position specified"}</p>
                <div className="flex items-center mt-2 text-sm text-neutral-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{`${candidate.profile?.city_tole || ""}, ${candidate.profile?.district || "Nepal"}`}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button
                  className="bg-black text-white hover:bg-neutral-800"
                  onClick={() => setIsInterviewModalOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl mb-4">About</h2>
                  <p className="text-neutral-600">
                    {candidate.profile?.career_objectives || 
                     "No career objectives provided."}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl mb-4">Experience</h2>
                  <div className="space-y-4">
                    {candidate.experiences && candidate.experiences.length > 0 ? (
                      candidate.experiences.map((exp) => (
                        <div key={exp.id} className="border-l-2 border-neutral-200 pl-4">
                          <h3 className="text-lg">{exp.position_title}</h3>
                          <p className="text-neutral-600">
                            {exp.company_name} • {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                          </p>
                          <p className="text-sm text-neutral-600 mt-2">
                            {exp.roles_and_responsibilities}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-neutral-600">No experience listed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills && candidate.skills.length > 0 ? (
                      candidate.skills.map((skill) => (
                        <span key={skill.id} className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-neutral-600">No skills listed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl mb-4">Education</h2>
                  {candidate.educations && candidate.educations.length > 0 ? (
                    candidate.educations.map((edu) => (
                      <div key={edu.id} className="border-l-2 border-neutral-200 pl-4 mb-4">
                        <h3 className="text-lg">
                          {edu.degree.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} in {edu.subject_major}
                        </h3>
                        <p className="text-neutral-600">
                          {edu.institution} • {formatDate(edu.joined_year)} - {formatDate(edu.passed_year)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-600">No education listed.</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h2 className="text-xl mb-4">Details</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-neutral-600">Email</p>
                      <p className="text-sm">{candidate.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Phone</p>
                      <p className="text-sm">{candidate.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Experience</p>
                      <p className="text-sm">
                        {candidate.experiences && candidate.experiences.length > 0
                          ? `${candidate.experiences.length} ${candidate.experiences.length === 1 ? 'position' : 'positions'}`
                          : "No experience"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Availability</p>
                      <p className="text-sm">
                        {candidate?.immediate_availability   
                          ? "Immediately available" 
                          : candidate?.availability_date 
                            ? `Available after ${candidate?.availability_date} days` 
                            : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h2 className="text-xl mb-4">Profile Completion</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-600">
                        Completion Status
                      </span>
                      <span className="text-sm font-medium">{profileCompletionPercentage}%</span>
                    </div>
                    <Progress value={profileCompletionPercentage} className="h-2" />
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h2 className="text-xl mb-4">Languages</h2>
                  <div className="space-y-3">
                    {candidate.languages && candidate.languages.length > 0 ? (
                      candidate.languages.map((lang) => (
                        <div key={lang.id} className="flex justify-between">
                          <span className="text-sm">{lang.language}</span>
                          <span className="text-sm text-neutral-600">{lang.proficiency}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-neutral-600">No languages listed.</p>
                    )}
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h2 className="text-xl mb-4">Documents</h2>
                  <Button onClick={handleDownloadResume} variant="default" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        candidate={{
          id: candidate.id.toString(),
          name: `${candidate.first_name} ${candidate.last_name}`,
          position: candidate.profile?.looking_for || "No position specified",
          avatar: candidate?.image_path
        }}
      />


      <InterviewScheduleModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        candidate={{
          name: `${candidate.first_name} ${candidate.last_name}`,
          position: candidate.profile?.looking_for || "No position specified",
          avatar: candidate?.image_path || ""
        }}
        application_id={candidate?.applications[0]?.id.toString()}
        mutate={mutate}
      />
    </section>
  );
};

export default CandidateProfileClient;
