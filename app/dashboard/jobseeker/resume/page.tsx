"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import PersonalDetails from "./components/personal-details";
import Experience from "./components/experience";
import Education from "./components/education";
import AdditionalDetails from "./components/additional-details";
import ResumeView from "./view/page";
import { mockUserProfile } from "@/lib/constants";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { useAuth } from "@/lib/auth-context";
import { JobSeekerProfile, JobSeekerProfileResponse } from "@/types/jobseeker-resume";

const ResumePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  const {user} = useAuth();

  const {data: resume, mutate} = useSWR<JobSeekerProfileResponse>(user?.id != undefined ? "api/jobseeker/resume/"+user?.id : null, defaultFetcher);


  useEffect(()=>{
    if(user?.id){
      mutate();
    }
  }, [user])

  console.log(resume);

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      position: "",
      company: "",
      industry: "",
      jobLevel: "",
      responsibilities: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      currentlyWorking: false,
    },
  ]);

  const [educations, setEducations] = useState([
    {
      id: 1,
      degree: "",
      subject: "",
      institution: "",
      university: "",
      gradingType: "",
      joinedYear: null as Date | null,
      passedYear: null as Date | null,
      currentlyStudying: false,
    },
  ]);

  const [personalDetails, setPersonalDetails] = useState<JobSeekerProfile['jobseekerProfile']>({
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

  const [additionalDetails, setAdditionalDetails] = useState({
    skills: [] as string[],
    languages: [] as Array<{
      id: number;
      language: string;
      proficiency: string;
    }>,
    training: [] as Array<{
      id: number;
      title: string;
      institution: string;
      description: string;
    }>,
    certificates: [] as Array<{
      id: number;
      title: string;
      issuer: string;
      year: string;
    }>,
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
    },
    references: [] as Array<{
      id: number;
      name: string;
      position: string;
      company: string;
      email: string;
      phone: string;
    }>,
  });

  // Check if required steps are completed
  const isPersonalDetailsComplete = () => {
    return (
      personalDetails.firstName &&
      personalDetails.lastName &&
      personalDetails.industry
    );
  };

  const isExperienceComplete = () => {
    return experiences.some((exp) => exp.position && exp.company);
  };

  const isEducationComplete = () => {
    return educations.some((edu) => edu.degree && edu.institution);
  };

  const areRequiredStepsComplete = () => {
    return (
      isPersonalDetailsComplete() &&
      isExperienceComplete() &&
      isEducationComplete()
    );
  };

  // Load mock data for demonstration
  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const loadMockData = () => {
      setPersonalDetails(resume?.data?.jobseekerProfile!);
      // setPersonalDetails(mockUserProfile.personalDetails);
      // setExperiences(mockUserProfile.experiences);
      // setEducations(mockUserProfile.education);
      // setAdditionalDetails(mockUserProfile.additionalDetails);

    };

    loadMockData();
  }, [resume]);

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
    setExperiences([
      ...experiences,
      {
        id: experiences.length + 1,
        position: "",
        company: "",
        industry: "",
        jobLevel: "",
        responsibilities: "",
        startDate: null,
        endDate: null,
        currentlyWorking: false,
      },
    ]);
  };

  // const removeExperience = (id: number) => {
  //   if (experiences.length > 1) {
  //     setExperiences(experiences.filter((exp) => exp.id !== id));
  //   }
  // };

  // const updateExperience = (id: number, field: string, value: any) => {
  //   setExperiences(
  //     experiences.map((exp) =>
  //       exp.id === id ? { ...exp, [field]: value } : exp
  //     )
  //   );
  // };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        id: educations.length + 1,
        degree: "",
        subject: "",
        institution: "",
        university: "",
        gradingType: "",
        joinedYear: null,
        passedYear: null,
        currentlyStudying: false,
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
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
  };

  const updateAdditionalDetails = (field: string, value: any) => {
    setAdditionalDetails((prev) => ({ ...prev, [field]: value }));
  };

  // If required steps are complete, show the resume view
  if (areRequiredStepsComplete()) {
    return <ResumeView />;
  }




  // Otherwise, show the resume creation form
  return (
    <main className="min-h-screen bg-neutral-50">
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
          {currentStep === 1 && (
            <PersonalDetails
              personalDetails={personalDetails}
              updatePersonalDetails={updatePersonalDetails}
            />
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <Experience
              experiences={resume?.data?.experiences!}
              addExperience={addExperience}
              removeExperience={removeExperience}
              updateExperience={updateExperience}
            />
          )}

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <Education
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
