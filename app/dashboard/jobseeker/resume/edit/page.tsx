"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import PersonalDetails from "../components/personal-details";
import Experience from "../components/experience";
import Education from "../components/education";
import AdditionalDetails from "../components/additional-details";
import { mockUserProfile } from "@/lib/constants";

const EditResumePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

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

  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    district: "",
    municipality: "",
    cityTole: "",
    dateOfBirth: null as Date | null,
    mobile: "",
    hasLicense: false,
    hasVehicle: false,
    industry: "",
    preferredJobType: "",
    gender: "",
    lookingFor: "",
    salaryExpectations: "",
    careerObjectives: "",
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

  // Load mock data for demonstration
  useEffect(() => {
    const loadMockData = () => {
      setPersonalDetails(mockUserProfile.personalDetails);
      setExperiences(mockUserProfile.experiences);
      setEducations(mockUserProfile.education);
      setAdditionalDetails(mockUserProfile.additionalDetails);
    };

    loadMockData();
  }, []);

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
            <Experience
              experiences={experiences}
              addExperience={() => {
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
            <Education
              educations={educations}
              addEducation={() => {
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
              }}
              removeEducation={(id) => {
                if (educations.length > 1) {
                  setEducations(educations.filter((edu) => edu.id !== id));
                }
              }}
              updateEducation={(id, field, value) => {
                setEducations(
                  educations.map((edu) =>
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
            <Button onClick={handleNext}>
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
