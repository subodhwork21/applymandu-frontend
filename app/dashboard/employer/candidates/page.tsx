"use client";

import React, { useState } from "react";
import { Search, Filter, Mail, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import CandidatesFilterModal from "@/components/candidates-filter-modal";
import ContactModal from "@/components/contact-modal";

const CandidatesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    name: string;
    position: string;
    avatar: string;
  } | null>(null);

  const handleContact = (candidate: {
    name: string;
    position: string;
    avatar: string;
  }) => {
    setSelectedCandidate(candidate);
    setIsContactModalOpen(true);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Candidates</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsFilterModalOpen(true)}
                  className="h-12 px-6"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: "Sarah Johnson",
                    position: "Senior Frontend Developer",
                    skills: ["React", "TypeScript", "Node.js"],
                    status: "Available",
                    avatar: "456",
                  },
                  {
                    name: "Michael Chen",
                    position: "UI/UX Designer",
                    skills: ["Figma", "Adobe XD", "Sketch"],
                    status: "Open to Work",
                    avatar: "789",
                  },
                ].map((candidate, index) => (
                  <div
                    key={index}
                    className="border border-neutral-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.avatar}`}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg">{candidate.name}</h3>
                          <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                            {candidate.status}
                          </span>
                        </div>
                        <p className="text-neutral-600 text-sm">
                          {candidate.position}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          {candidate.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Link
                            href={`/dashboard/employer/candidates/${index + 1}`}
                          >
                            <Button variant="outline">View Profile</Button>
                          </Link>
                          <Button
                            className="bg-black text-white hover:bg-neutral-800"
                            onClick={() => handleContact(candidate)}
                          >
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Candidate Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Total Candidates
                  </span>
                  <span className="text-sm">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Active</span>
                  <span className="text-sm">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Hired</span>
                  <span className="text-sm">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    New This Week
                  </span>
                  <span className="text-sm">12</span>
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
                  <Mail className="h-4 w-4 mr-2" />
                  Send Bulk Message
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Export Candidates
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-600 hover:text-neutral-900"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Manage Tags
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CandidatesFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {selectedCandidate && (
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
        />
      )}
    </section>
  );
};

export default CandidatesPage;
