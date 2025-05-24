"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import PersonalDetails from "./components/personal-details";
import Experiences from "./components/experience";
import Educations from "./components/education";
import AdditionalDetails from "./components/additional-details";
import ResumeView from "./view/page";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { useAuth } from "@/lib/auth-context";

// Updated interfaces to match the API response
interface Skill {
  id: number;
  name: string;
}

interface Language {
  id: number;
  user_id: number;
  language: string;
  proficiency: string;
  created_at: string;
  updated_at: string;
}

interface Training {
  id: number;
  user_id: number;
  title: string;
  institution: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Certificate {
  id: number;
  user_id: number;
  title: string;
  issuer: string;
  year: string;
  created_at: string;
  updated_at: string;
}

interface SocialLink {
  id: number;
  user_id: number;
  platform: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface Reference {
  id: number;
  user_id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
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
  degree: string;
  subject_major: string;
  institution: string;
  university_board: string;
  grading_type: string;
  joined_year: string;
  passed_year: string | null;
  currently_studying: boolean;
  created_at: string;
  updated_at: string;
}

interface JobSeekerProfile {
  id: number | null;
  user_id: number | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  district: string;
  municipality: string;
  city_tole: string;
  date_of_birth: string;
  mobile: string;
  industry: string;
  preferred_job_type: string;
  gender: string;
  has_driving_license: boolean;
  has_vehicle: boolean;
  career_objectives: string;
  looking_for: string;
  salary_expectations: string;
  created_at: string;
  updated_at: string;
}

interface JobSeekerProfileData {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  jobseekerProfile: JobSeekerProfile;
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
  trainings: Training[];
  certificates: Certificate[];
  social_links: SocialLink[];
  references: Reference[];
  skills: Skill[];
  created_at: string;
  updated_at: string;
}

interface JobSeekerProfileResponse {
  data: JobSeekerProfileData;
}

interface AdditionalDetailsState {
  skills: Skill[];
  languages: Language[];
  trainings: Training[];
  certificates: Certificate[];
  social_links: SocialLink[];
  references: Reference[];
}

const ResumePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  const {user} = useAuth();

  const {data: resume, mutate} = useSWR<JobSeekerProfileResponse>(
    user?.id !== undefined ? `api/jobseeker/resume/${user.id}` : null, 
    defaultFetcher
  );

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [personalDetails, setPersonalDetails] = useState<JobSeekerProfile | undefined>();
  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetailsState>({
    skills: [],
    languages: [],
    trainings: [],
    certificates: [],
    social_links: [],
    references: [],
  });

  // Fetch profile completion data
  const {data: resumeComplete, mutate: mutateResumeComplete} = useSWR<Record<string,any>>(
    user?.id !== undefined ? "api/dashboard/profile-completion" : null, 
    defaultFetcher
  );

  // Refetch data when user changes
  useEffect(() => {
    if(user?.id){
      mutate();
      mutateResumeComplete();
    }
  }, [user, mutate, mutateResumeComplete]);

  // Load data from API response
  useEffect(() => {
    if (!resume?.data) return;
    
    setPersonalDetails(resume.data.jobseekerProfile);
    setExperiences(resume.data.experiences || []);
    setEducations(resume.data.educations || []);
    
    setAdditionalDetails({
      skills: resume.data.skills || [],
      languages: resume.data.languages || [],
      trainings: resume.data.trainings || [],
      certificates: resume.data.certificates || [],
      social_links: resume.data.social_links || [],
      references: resume.data.references || [],
    });
  }, [resume]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!resumeComplete?.data?.profile_completion?.section_weights) {
      return 0;
    }
    
    const weights = resumeComplete.data.profile_completion.section_weights;
    return (
      (weights.personal_info / 25) * 100 + 
      (weights.work_experience / 20) * 100 + 
      (weights.education / 20) * 100
    ) / 3;
  };

  const steps = [
    { number: 1, title: "Personal Details" },
    { number: 2, title: "Experience" },
    { number: 3, title: "Education" },
    { number: 4, title: "Additional Info" },
  ];

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveForLater = () => {
    console.log("Saving as draft...");
    // Add your save logic here
  };

  const addExperience = () => {
    if (!user?.id) return;
    
    const newId = experiences.length ? Math.max(...experiences.map(exp => exp.id)) + 1 : 1;
    setExperiences([
      ...experiences,
      {
        id: newId,
        user_id: Number(user.id),
        position_title: "",
        company_name: "",
        industry: "",
        job_level: "",
        roles_and_responsibilities: "",
        start_date: "",
        end_date: null,
        currently_work_here: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  };

  const removeExperience = (id: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const updateExperience = (id: number, field: string, value: any) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addEducation = () => {
    if (!user?.id) return;
    
    const newId = educations.length ? Math.max(...educations.map(edu => edu.id)) + 1 : 1;
    setEducations([
      ...educations,
      {
        id: newId,
        user_id: Number(user.id),
        degree: "",
        subject_major: "",
        institution: "",
        university_board: "",
        grading_type: "",
        joined_year: "",
        passed_year: null,
        currently_studying: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  };

  const removeEducation = (id: number) => {
    if (educations.length > 1) {
      setEducations(educations.filter((edu) => edu.id !== id));
    }
  };

  const updateEducation = (id: number, field: string, value: any) => {
    setEducations(
      educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const updatePersonalDetails = (field: string, value: any) => {
    if (!personalDetails) return;
    setPersonalDetails({ ...personalDetails, [field]: value });
  };

  const updateAdditionalDetails = (field: string, value: any) => {
    setAdditionalDetails((prev) => ({ ...prev, [field]: value }));
  };

  // If required steps are complete, show the resume view
  const profileCompletionPercentage = calculateProfileCompletion();
  if (profileCompletionPercentage >= 100) {
    return <ResumeView />;
  }

  // Otherwise, show the resume creation form
  return (
    <main className="min-h-screen bg-neutral-50 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Complete Your Resume</h2>
              <span className="text-sm text-neutral-600">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-4">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => handleStepClick(step.number)}
                  className={cn(
                    "text-sm transition-colors",
                    currentStep === step.number
                      ? "text-black font-medium"
                      : "text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Personal Details */}
          {currentStep === 1 && personalDetails && (
            <PersonalDetails
              personalDetails={personalDetails}
              updatePersonalDetails={updatePersonalDetails}
            />
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <Experiences
              experiences={experiences}
              addExperience={addExperience}
              removeExperience={removeExperience}
              updateExperience={updateExperience}
            />
          )}

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <Educations
              educations={educations}
              addEducation={addEducation}
              removeEducation={removeEducation}
              updateEducation={updateEducation}
            />
          )}

          {/* Step 4: Additional Details */}
          {currentStep === 4 && (
            <AdditionalDetails
              additionalDetails={additionalDetails}
              updateAdditionalDetails={updateAdditionalDetails}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveForLater}>
                Save for Later
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === totalSteps}
              >
                {currentStep === totalSteps ? "Complete" : "Next"}
                {currentStep !== totalSteps && (
                  <ChevronRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResumePage;
