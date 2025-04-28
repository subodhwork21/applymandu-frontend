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

const CandidateProfileClient = () => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const candidate = {
    name: "Sarah Johnson",
    position: "Senior Frontend Developer",
    avatar: "456",
  };

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
                src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.avatar}`}
                alt={candidate.name}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl">{candidate.name}</h1>
                <p className="text-neutral-600">{candidate.position}</p>
                <div className="flex items-center mt-2 text-sm text-neutral-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Kathmandu, Nepal</span>
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
                    Experienced Frontend Developer with 5+ years of expertise in
                    building responsive web applications. Passionate about
                    creating user-friendly interfaces and implementing modern
                    web technologies.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl mb-4">Experience</h2>
                  <div className="space-y-4">
                    <div className="border-l-2 border-neutral-200 pl-4">
                      <h3 className="text-lg">Senior Frontend Developer</h3>
                      <p className="text-neutral-600">
                        TechCorp Nepal • 2023 - Present
                      </p>
                      <p className="text-sm text-neutral-600 mt-2">
                        Led frontend development team in building enterprise
                        applications using React and TypeScript.
                      </p>
                    </div>
                    <div className="border-l-2 border-neutral-200 pl-4">
                      <h3 className="text-lg">Frontend Developer</h3>
                      <p className="text-neutral-600">
                        WebSolutions • 2020 - 2023
                      </p>
                      <p className="text-sm text-neutral-600 mt-2">
                        Developed and maintained client websites using modern
                        JavaScript frameworks.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      React
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      Node.js
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      Next.js
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      Tailwind CSS
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      Git
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl mb-4">Education</h2>
                  <div className="border-l-2 border-neutral-200 pl-4">
                    <h3 className="text-lg">Bachelor in Computer Science</h3>
                    <p className="text-neutral-600">
                      Tribhuvan University • 2016 - 2020
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h2 className="text-xl mb-4">Details</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-neutral-600">Email</p>
                      <p className="text-sm">sarah.j@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Phone</p>
                      <p className="text-sm">+977 98XXXXXXXX</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Experience</p>
                      <p className="text-sm">5+ years</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Availability</p>
                      <p className="text-sm">Available for hire</p>
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
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h2 className="text-xl mb-4">Social Links</h2>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="flex items-center text-sm hover:bg-neutral-100 p-2 rounded cursor-pointer"
                    >
                      <Linkedin className="h-4 w-4 text-neutral-600 mr-3" />
                      LinkedIn
                    </a>
                    <a
                      href="#"
                      className="flex items-center text-sm hover:bg-neutral-100 p-2 rounded cursor-pointer"
                    >
                      <Github className="h-4 w-4 text-neutral-600 mr-3" />
                      GitHub
                    </a>
                    <a
                      href="#"
                      className="flex items-center text-sm hover:bg-neutral-100 p-2 rounded cursor-pointer"
                    >
                      <Globe className="h-4 w-4 text-neutral-600 mr-3" />
                      Portfolio
                    </a>
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h2 className="text-xl mb-4">Documents</h2>
                  <Button variant="default" className="w-full">
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
        candidate={candidate}
      />

      <InterviewScheduleModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        candidate={candidate}
      />
    </section>
  );
};

export default CandidateProfileClient;
