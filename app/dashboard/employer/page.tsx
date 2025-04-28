"use client";

import React, { useState } from "react";
import {
  Building,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Eye,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PostJobModal from "@/components/post-job-modal";
import UpgradePlanModal from "@/components/upgrade-plan-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EmployerDashboardPage = () => {
  const router = useRouter();
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    setIsPostJobModalOpen(true);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">Active Jobs</h3>
                  <span className="text-2xl">15</span>
                </div>
                <p className="text-sm text-neutral-600">Currently posted</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">Applications</h3>
                  <span className="text-2xl">147</span>
                </div>
                <p className="text-sm text-neutral-600">Total received</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">Hired</h3>
                  <span className="text-2xl">8</span>
                </div>
                <p className="text-sm text-neutral-600">This month</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Recent Applications</h2>
                <Button
                  className="bg-black text-white hover:bg-neutral-800"
                  onClick={() => setIsPostJobModalOpen(true)}
                >
                  Post New Job
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=456"
                      alt="Candidate"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg">Sarah Smith</h3>
                      <p className="text-sm text-neutral-600">
                        Frontend Developer • 5 years experience
                      </p>
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs mt-2">
                        Under Review
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push("/dashboard/employer/applications/1")
                    }
                  >
                    Start Review
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Active Job Listings</h2>
              <div className="space-y-4">
                <div className="p-4 border border-neutral-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg mb-2">
                        Senior Frontend Developer
                      </h3>
                      <div className="space-y-2 text-sm text-neutral-600">
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          32 Applicants
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Posted 5 days ago
                        </p>
                        <p className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          245 Views
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEditJob({
                            title: "Senior Frontend Developer",
                            type: "Full-time",
                            location: "Remote",
                            salary: "$80k-$100k",
                            expires: "2025-04-30",
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-neutral-200 rounded-full mb-4 flex items-center justify-center">
                  <Building className="h-8 w-8 text-neutral-600" />
                </div>
                <h2 className="text-xl mb-2">TechCorp Nepal</h2>
                <p className="text-neutral-600 mb-6">
                  IT Services & Consulting
                </p>
                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-neutral-600" />
                    <span>hr@techcorp.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-neutral-600" />
                    <span>+977 01-XXXXXXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neutral-600" />
                    <span>Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Recruitment Analytics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Application Rate
                  </span>
                  <span className="text-sm">21.5/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Time to Hire</span>
                  <span className="text-sm">15 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Cost per Hire
                  </span>
                  <span className="text-sm">$450</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Subscription Plan</h2>
              <div className="p-4 bg-neutral-50 rounded-md">
                <h3 className="text-lg mb-2">Premium Plan</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Valid until May 2025
                </p>
                <Button
                  className="w-full bg-black text-white hover:bg-neutral-800"
                  onClick={() => setIsUpgradeModalOpen(true)}
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => {
          setIsPostJobModalOpen(false);
          setSelectedJob(null);
        }}
        editJob={selectedJob}
      />

      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </section>
  );
};

export default EmployerDashboardPage;
