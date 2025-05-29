"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import InterviewScheduleModal from "@/components/interview-schedule-modal";
import Image from "next/image";

interface ApplicationViewProps {
  onBack: () => void;
}

const ApplicationView = ({ onBack }: ApplicationViewProps) => {
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const candidate = {
    name: "Sarah Smith",
    position: "Frontend Developer",
    avatar: "456",
    application_id: "123",
    mutate: () => {},
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  variant="ghost"
                  className="text-neutral-600 p-2 h-auto"
                  onClick={onBack}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-4">
                  <Image
                    width={48}
                    height={48}
                    src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.avatar}`}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h1 className="text-2xl">{candidate.name}</h1>
                    <p className="text-neutral-600">
                      Frontend Developer • 5 years experience
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg mb-2">Professional Summary</h2>
                  <p className="text-neutral-600">
                    Experienced Frontend Developer with expertise in React,
                    Vue.js, and modern web technologies. Strong focus on
                    creating responsive and accessible user interfaces.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg mb-2">Work Experience</h2>
                  <div className="space-y-4">
                    <div className="border-l-2 border-neutral-200 pl-4">
                      <h3 className="text-base">Senior Frontend Developer</h3>
                      <p className="text-neutral-600">
                        TechStart • 2023 - Present
                      </p>
                      <ul className="list-disc list-inside text-neutral-600 mt-2">
                        <li>
                          Led frontend development for major client projects
                        </li>
                        <li>Mentored junior developers</li>
                        <li>Implemented modern CI/CD practices</li>
                      </ul>
                    </div>
                    <div className="border-l-2 border-neutral-200 pl-4">
                      <h3 className="text-base">Frontend Developer</h3>
                      <p className="text-neutral-600">
                        WebSolutions • 2020 - 2023
                      </p>
                      <ul className="list-disc list-inside text-neutral-600 mt-2">
                        <li>Developed responsive web applications</li>
                        <li>Collaborated with UX team</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      React
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      Vue.js
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      CSS/SASS
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      Git
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg mb-2">Education</h2>
                  <div className="border-l-2 border-neutral-200 pl-4">
                    <h3 className="text-base">Bachelor in Computer Science</h3>
                    <p className="text-neutral-600">
                      Tribhuvan University • 2016 - 2020
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Application Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-neutral-600">Applied For</h3>
                  <p className="text-base">Senior Frontend Developer</p>
                </div>
                <div>
                  <h3 className="text-sm text-neutral-600">Applied Date</h3>
                  <p className="text-base">March 15, 2025</p>
                </div>
                <div>
                  <h3 className="text-sm text-neutral-600">Status</h3>
                  <span className="inline-block px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    Under Review
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-neutral-600" />
                  <span>sarah.smith@email.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-neutral-600" />
                  <span>+977 98XXXXXXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-neutral-600" />
                  <span>Kathmandu, Nepal</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Actions</h2>
              <div className="space-y-3">
                <Button
                  className="w-full bg-black text-white hover:bg-neutral-800"
                  onClick={() => setIsInterviewModalOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InterviewScheduleModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        candidate={candidate}
        application_id={candidate?.application_id || ""}
        mutate={() => {}}

      />
    </section>
  );
};

export default ApplicationView;
