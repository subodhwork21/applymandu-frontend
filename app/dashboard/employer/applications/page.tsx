"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MessageModal from "@/components/message-modal";
import InterviewScheduleModal from "@/components/interview-schedule-modal";

interface JobApplications {
  jobId: number;
  title: string;
  company: string;
  location: string;
  type: string;
  applications: {
    id: number;
    name: string;
    position: string;
    appliedDate: string;
    skills: string[];
    status: string;
    avatar: string;
  }[];
}

// Create a separate component that uses useSearchParams
function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("jobId");

  const [selectedCandidate, setSelectedCandidate] = useState<{
    name: string;
    position: string;
    avatar: string;
  } | null>(null);

  const [interviewCandidate, setInterviewCandidate] = useState<{
    name: string;
    position: string;
    avatar: string;
  } | null>(null);

  const [expandedJobs, setExpandedJobs] = useState<number[]>([]);

  const handleOpenMessage = (candidate: {
    name: string;
    position: string;
    avatar: string;
  }) => {
    setSelectedCandidate(candidate);
  };

  const handleOpenInterview = (candidate: {
    name: string;
    position: string;
    avatar: string;
  }) => {
    setInterviewCandidate(candidate);
  };

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const jobApplications: JobApplications[] = [
    {
      jobId: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Nepal",
      location: "Kathmandu",
      type: "Full-time",
      applications: [
        {
          id: 1,
          name: "John Doe",
          position: "Frontend Developer",
          appliedDate: "Apr 15, 2025",
          skills: ["React", "TypeScript", "5 Years"],
          status: "New",
          avatar: "789",
        },
        {
          id: 2,
          name: "Sarah Smith",
          position: "Frontend Developer",
          appliedDate: "Apr 14, 2025",
          skills: ["Vue.js", "JavaScript", "4 Years"],
          status: "Shortlisted",
          avatar: "456",
        },
      ],
    },
    {
      jobId: 2,
      title: "UI/UX Designer",
      company: "DesignCo",
      location: "Remote",
      type: "Full-time",
      applications: [
        {
          id: 3,
          name: "Emily Brown",
          position: "UI/UX Designer",
          appliedDate: "Apr 14, 2025",
          skills: ["Figma", "Adobe XD", "3 Years"],
          status: "Shortlisted",
          avatar: "101",
        },
      ],
    },
  ];

  // Filter jobs based on jobId parameter
  const filteredJobs = jobIdParam
    ? jobApplications.filter((job) => job.jobId.toString() === jobIdParam)
    : jobApplications;

  // Initialize expanded jobs based on filtered results
  useEffect(() => {
    if (jobIdParam) {
      setExpandedJobs([parseInt(jobIdParam)]);
    } else {
      setExpandedJobs(jobApplications.map((job) => job.jobId));
    }
  }, [jobIdParam]);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">All Applications</h2>
                <div className="flex space-x-2">
                  <Select
                    value={jobIdParam || "all"}
                    onValueChange={(value) => {
                      if (value === "all") {
                        router.push("/dashboard/employer/applications");
                      } else {
                        router.push(
                          `/dashboard/employer/applications?jobId=${value}`
                        );
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Jobs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      {jobApplications.map((job) => (
                        <SelectItem
                          key={job.jobId}
                          value={job.jobId.toString()}
                        >
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.jobId}
                    className="border border-neutral-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-neutral-50 p-4 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleJobExpansion(job.jobId)}
                    >
                      <div>
                        <h3 className="text-lg font-medium">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                          <span>{job.company}</span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-neutral-600">
                          {job.applications.length} Applications
                        </span>
                        {expandedJobs.includes(job.jobId) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    {expandedJobs.includes(job.jobId) && (
                      <div className="divide-y divide-neutral-200">
                        {job.applications.map((application) => (
                          <div key={application.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex gap-4">
                                <img
                                  src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${application.avatar}`}
                                  alt="Candidate"
                                  className="w-12 h-12 rounded-full"
                                />
                                <div>
                                  <h3 className="text-lg">
                                    {application.name}
                                  </h3>
                                  <p className="text-sm text-neutral-600">
                                    {application.position} • Applied on{" "}
                                    {application.appliedDate}
                                  </p>
                                  <div className="flex space-x-2 mt-2">
                                    {application.skills.map(
                                      (skill, skillIndex) => (
                                        <span
                                          key={skillIndex}
                                          className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs"
                                        >
                                          {skill}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                                {application.status}
                              </span>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/employer/applications/${application.id}`
                                  )
                                }
                              >
                                View Application
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenMessage(application)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button
                                size="sm"
                                className="bg-black text-white hover:bg-neutral-800"
                                onClick={() => handleOpenInterview(application)}
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Interview
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Applications Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Total Applications
                  </span>
                  <span className="text-sm">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">New</span>
                  <span className="text-sm">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Shortlisted</span>
                  <span className="text-sm">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Interview Scheduled
                  </span>
                  <span className="text-sm">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Rejected</span>
                  <span className="text-sm">68</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Quick Filters</h2>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Star className="h-4 w-4 mr-2" />
                  New Applications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Todays Applications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Shortlisted
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCandidate && (
        <MessageModal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          candidate={selectedCandidate}
        />
      )}

      {interviewCandidate && (
        <InterviewScheduleModal
          isOpen={!!interviewCandidate}
          onClose={() => setInterviewCandidate(null)}
          candidate={interviewCandidate}
        />
      )}
    </section>
  );
}

// Main component with Suspense boundary
const ApplicationsPage = () => {
  return (
    <Suspense fallback={<div>Loading applications...</div>}>
      <ApplicationsContent />
    </Suspense>
  );
};

export default ApplicationsPage;
