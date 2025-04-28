"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Copy,
  Share,
  Download,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PostJobModal from "@/components/post-job-modal";

const JobListingsPage = () => {
  const router = useRouter();
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    setIsPostJobModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPostJobModalOpen(false);
    setSelectedJob(null);
  };

  const handleViewApplications = (jobId: number) => {
    router.push(`/dashboard/employer/applications?jobId=${jobId}`);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Job Listings</h1>
          <Button
            className="bg-black text-white hover:bg-neutral-800"
            onClick={() => setIsPostJobModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "Senior Frontend Developer",
                    type: "Full-time",
                    location: "Remote",
                    salary: "$80k-$100k",
                    applicants: 32,
                    expires: "Apr 30, 2025",
                    status: "Active",
                  },
                  {
                    id: 2,
                    title: "UI/UX Designer",
                    type: "Full-time",
                    location: "On-site",
                    salary: "$60k-$80k",
                    applicants: 18,
                    expires: "May 15, 2025",
                    status: "Active",
                  },
                ].map((job) => (
                  <div
                    key={job.id}
                    className="border border-neutral-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg mb-2">{job.title}</h3>
                        <div className="flex space-x-2 mb-3">
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                            {job.type}
                          </span>
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                            {job.location}
                          </span>
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                            {job.salary}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-neutral-600">
                          <p className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {job.applicants} Applicants
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Expires {job.expires}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                        {job.status}
                      </span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditJob(job)}
                      >
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Pause
                      </Button>
                      <Button
                        size="sm"
                        className="bg-black text-white hover:bg-neutral-800"
                        onClick={() => handleViewApplications(job.id)}
                      >
                        View Applications
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Listings Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Active Jobs</span>
                  <span className="text-sm">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Paused</span>
                  <span className="text-sm">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Closed</span>
                  <span className="text-sm">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Total Views</span>
                  <span className="text-sm">1,234</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Job
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Job
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={handleCloseModal}
        editJob={selectedJob}
      />
    </section>
  );
};

export default JobListingsPage;
