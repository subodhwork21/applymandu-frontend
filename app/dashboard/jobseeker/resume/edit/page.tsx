"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import PersonalDetails from "../components/personal-details";
import Experiences from "../components/experience";
import Educations from "../components/education";
import AdditionalDetails from "../components/additional-details";
import useSWR from "swr";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
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

const EditResumePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Updated state to match API response structure
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      user_id: 1,
      position_title: "",
      company_name: "",
      industry: "",
      job_level: "",
      roles_and_responsibilities: "",
      start_date: "",
      end_date: null,
      currently_work_here: false,
      created_at: "",
      updated_at: "",
    },
  ]);

  const [educations, setEducations] = useState<Education[] | undefined>([
    {
      id: 1,
      user_id: 1,
      degree: "",
      subject_major: "",
      institution: "",
      university_board: "",
      grading_type: "",
      joined_year: "",
      passed_year: null,
      currently_studying: false,
      created_at: "",
      updated_at: "",
    },
  ]);

  const [personalDetails, setPersonalDetails] = useState<JobSeekerProfile>({
    id: null,
    user_id: null,
    first_name: "",
    middle_name: "",
    last_name: "",
    district: "",
    municipality: "",
    city_tole: "",
    date_of_birth: "",
    mobile: "",
    industry: "",
    preferred_job_type: "",
    gender: "",
    has_driving_license: false,
    has_vehicle: false,
    career_objectives: "",
    looking_for: "",
    salary_expectations: "",
    created_at: "",
    updated_at: "",
  });

  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetailsState>({
    skills: [],
    languages: [],
    trainings: [],
    certificates: [],
    social_links: [],
    references: [],
  });

  // Fetch user profile data using SWR
  const {user} = useAuth();
  const { data: resume, mutate } = useSWR<JobSeekerProfileResponse>(
    user?.id !== undefined ? `api/jobseeker/resume/${user.id}` : null, 
    defaultFetcher
  );

  // Set states when resume data is loaded
  useEffect(() => {
    if (resume?.data) {
      setPersonalDetails(resume.data.jobseekerProfile);
      setExperiences(resume.data.experiences.length > 0 
        ? resume.data.experiences 
        : [{ 
            id: 1, 
            user_id: user?.id ? Number(user.id) : 1, 
            position_title: "", 
            company_name: "", 
            industry: "", 
            job_level: "", 
            roles_and_responsibilities: "", 
            start_date: "", 
            end_date: null, 
            currently_work_here: false, 
            created_at: new Date().toISOString(), 
            updated_at: new Date().toISOString() 
          }]
      );
      setEducations(resume.data.educations.length > 0 
        ? resume.data.educations 
        : [{ 
            id: 1, 
            user_id: user?.id ? Number(user.id) : 1, 
            degree: "", 
            subject_major: "", 
            institution: "", 
            university_board: "", 
            grading_type: "", 
            joined_year: "", 
            passed_year: null, 
            currently_studying: false, 
            created_at: new Date().toISOString(), 
            updated_at: new Date().toISOString() 
          }]
      );
      setAdditionalDetails({
        skills: resume.data.skills || [],
        languages: resume.data.languages || [],
        trainings: resume.data.trainings || [],
        certificates: resume.data.certificates || [],
        social_links: resume.data.social_links || [],
        references: resume.data.references || [],
      });
    }
  }, [resume, user]);

  // Helper function to prepare form data for submission
const prepareFormData = () => {
  // Extract personal details from the personalDetails object
  const {
    first_name,
    middle_name,
    last_name,
    district,
    municipality,
    city_tole,
    date_of_birth,
    mobile,
    industry,
    preferred_job_type,
    gender,
    has_driving_license,
    has_vehicle,
    career_objectives,
    looking_for,
    salary_expectations
  } = personalDetails;

  // Format experiences as work_experiences
  const work_experiences = experiences.map(exp => ({
    position_title: exp.position_title,
    company_name: exp.company_name,
    industry: exp.industry,
    job_level: exp.job_level,
    roles_and_responsibilities: exp.roles_and_responsibilities,
    start_date: typeof exp.start_date === 'object' ? exp.start_date.toISOString().split('T')[0] : exp.start_date,
    end_date: exp.currently_work_here ? null : 
      (typeof exp.end_date === 'object' && exp.end_date ? 
        exp.end_date.toISOString().split('T')[0] : exp.end_date),
    currently_work_here: exp.currently_work_here
  }));

  // Format educations
  const formattedEducations = educations?.map(edu => ({
    degree: edu.degree,
    subject_major: edu.subject_major,
    institution: edu.institution,
    university_board: edu.university_board,
    grading_type: edu.grading_type,
    joined_year: typeof edu.joined_year === 'object' ? 
      edu.joined_year.toISOString().split('T')[0] : edu.joined_year,
    passed_year: edu.currently_studying ? null : 
      (typeof edu.passed_year === 'object' && edu.passed_year ? 
        edu.passed_year.toISOString().split('T')[0] : edu.passed_year),
    currently_studying: edu.currently_studying
  }));

  // Extract skill names from skill objects
  const skillNames = additionalDetails.skills.map(skill => skill.name);

  // Format languages
  const formattedLanguages = additionalDetails.languages.map(lang => ({
    language: lang.language,
    proficiency: lang.proficiency
  }));

  // Format trainings
  const formattedTrainings = additionalDetails.trainings.map(train => ({
    title: train.title,
    description: train.description,
    institution: train.institution
  }));

  // Format certificates
  const formattedCertificates = additionalDetails.certificates.map(cert => ({
    title: cert.title,
    year: cert.year,
    issuer: cert.issuer
  }));

  // Format social links
  const formattedSocialLinks = additionalDetails.social_links.map(link => ({
    platform: link.platform,
    url: link.url
  }));

  // Format references
  const formattedReferences = additionalDetails.references.map(ref => ({
    name: ref.name,
    position: ref.position,
    company: ref.company,
    email: ref.email,
    phone: ref.phone
  }));

  // Return the formatted data matching the API's expected structure
  return {
    first_name,
    middle_name,
    last_name,
    district,
    municipality,
    city_tole,
    date_of_birth: typeof date_of_birth === 'object' ? 
      date_of_birth.toISOString().split('T')[0] : date_of_birth,
    mobile,
    industry,
    preferred_job_type,
    gender,
    has_driving_license,
    has_vehicle,
    career_objectives,
    looking_for,
    salary_expectations,
    work_experiences,
    educations: formattedEducations,
    skills: skillNames,
    languages: formattedLanguages,
    trainings: formattedTrainings,
    certificates: formattedCertificates,
    social_links: formattedSocialLinks,
    references: formattedReferences
  };
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
    } else {
      // On completion, navigate back to the resume view
      router.push("/dashboard/jobseeker/resume");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/jobseeker/resume");
  };

  

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        console.error("User ID is not available");
        return;
      }

      
      
      // Prepare data for submission
      const profileData = prepareFormData();
      
      // Send the data to the API
      const {response, result} = await baseFetcher(`api/jobseeker/resume`, {
        method: 'POST',
        body: JSON.stringify(profileData),
      });
      
      if (response.ok) {
        // Revalidate the data cache
        await mutate();
        // Navigate back to resume view
        router.push("/dashboard/jobseeker/resume");
      } else {
        const errorData = await response.json();
        console.error("Failed to update profile:", errorData);
        // Here you could add toast or alert to notify the user
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      // Here you could add toast or alert to notify the user
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Edit Your Resume</h2>
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

          {/* Form Steps */}
          {currentStep === 1 && (
            <PersonalDetails
              personalDetails={personalDetails}
              updatePersonalDetails={(field, value) =>
                setPersonalDetails((prev) => ({ ...prev, [field]: value }))
              }
            />
          )}

          {currentStep === 2 && (
            <Experiences
              experiences={experiences}
              addExperience={() => {
                const newId = experiences.length ? Math.max(...experiences.map(exp => exp.id)) + 1 : 1;
                setExperiences([
                  ...experiences,
                  {
                    id: newId,
                    user_id: user?.id ? Number(user.id) : 1, 
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
              }}
              removeExperience={(id) => {
                if (experiences.length > 1) {
                  setExperiences(experiences.filter((exp) => exp.id !== id));
                }
              }}
              updateExperience={(id, field, value) => {
                setExperiences(
                  experiences.map((exp) =>
                    exp.id === id ? { ...exp, [field]: value } : exp
                  )
                );
              }}
            />
          )}

          {currentStep === 3 && (
            <Educations
              educations={educations!}
              addEducation={() => {
                const newId = educations?.length ? Math.max(...educations.map(edu => edu.id)) + 1 : 1;
                setEducations(resume?.data?.educations?.length! > 0 
                  ? resume?.data.educations 
                  : [{ 
                      id: 1, 
                      user_id: user?.id ? Number(user.id) : 1, 
                      degree: "", 
                      subject_major: "", 
                      institution: "", 
                      university_board: "", 
                      grading_type: "", 
                      joined_year: "", 
                      passed_year: null, 
                      currently_studying: false, 
                      created_at: new Date().toISOString(), 
                      updated_at: new Date().toISOString() 
                    }] as Education[]
                );
              }}
              removeEducation={(id) => {
                if (educations && educations?.length > 1) {
                  setEducations(educations.filter((edu) => edu.id !== id));
                }
              }}
              updateEducation={(id, field, value) => {
                setEducations(
                  educations && educations.map((edu) =>
                    edu.id === id ? { ...edu, [field]: value } : edu
                  )
                );
              }}
            />
          )}

          {currentStep === 4 && (
            <AdditionalDetails
              additionalDetails={additionalDetails}
              updateAdditionalDetails={(field, value) =>
                setAdditionalDetails((prev) => ({ ...prev, [field]: value }))
              }
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? handleCancel : handlePrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? "Cancel" : "Previous"}
            </Button>
            <Button onClick={currentStep === totalSteps ? handleSubmit : handleNext}>
              {currentStep === totalSteps ? "Save Changes" : "Next"}
              {currentStep !== totalSteps && (
                <ChevronRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditResumePage;
