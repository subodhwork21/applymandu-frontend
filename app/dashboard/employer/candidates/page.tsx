"use client";

import React, { Suspense, useState } from "react";
import { Search, Filter, Mail, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import CandidatesFilterModal from "@/components/candidates-filter-modal";
import ContactModal from "@/components/contact-modal";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { useRouter, useSearchParams } from "next/navigation";

interface Skill {
  name: string;
  pivot: {
    user_id: number;
    skill_id: number;
  };
}

interface JobSeekerProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  looking_for: string;
immediate_availability: boolean;
availability_date: string;
}

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  image_path: string;
  profile: JobSeekerProfile | null;
  skills: Skill[];
  immediate_availability: boolean;
availability_date: string;
}

interface CandidatesResponse {
  data: Candidate[];
  message: string;
}

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

  const router = useRouter();

  const searchParams = useSearchParams();
  // const search = searchParams.get("search") || "";

  const urlParams = new URLSearchParams(searchParams);


  const { data: candidatesResponse, isLoading, error, mutate } = useSWR<CandidatesResponse>(
    `api/candidate/all-candidates?${urlParams.toString()}`, 
    defaultFetcher
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading candidates: {error.message}</div>;
  }

  // Filter candidates based on search query
  const filteredCandidates = candidatesResponse?.data.filter(candidate => {
    const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
    const position = candidate.profile?.looking_for?.toLowerCase() || "";
    const skills = candidate.skills.map(skill => skill.name.toLowerCase()).join(" ");
    
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || position.includes(query) || skills.includes(query);
  });

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
                    onKeyDown={(e)=>{
                      if(e.key === "Enter" && e.target instanceof HTMLInputElement) {
                        e.preventDefault();
                        // urlParams.set("search", e.target.value); 
                        router.push(`?search=${e.target.value}`);
                        mutate();
                      }
                    }}
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
                {filteredCandidates && filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="border border-neutral-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={`${candidate?.image_path}`}
                          alt={`${candidate.first_name} ${candidate.last_name}`}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-lg">{`${candidate.first_name} ${candidate.last_name}`}</h3>
                            <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                              {candidate?.immediate_availability ? "Available" : candidate?.availability_date ? "Available after " + candidate?.availability_date+ " days" : "Not Available"}
                            </span>
                          </div>
                          <p className="text-neutral-600 text-sm">
                            {candidate.profile?.looking_for || "No position specified"}
                          </p>
                          <div className="flex flex-wrap space-x-2 mt-2">
                            {candidate.skills.length > 0 ? (
                              candidate.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs mr-2 mb-2"
                                >
                                  {skill.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-neutral-500 text-xs">No skills listed</span>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Link href={`/dashboard/employer/candidates/${candidate.id}`}>
                              <Button variant="outline">View Profile</Button>
                            </Link>
                            <Button
                              className="bg-black text-white hover:bg-neutral-800"
                              onClick={() => 
                                handleContact({
                                  name: `${candidate.first_name} ${candidate.last_name}`,
                                  position: candidate.profile?.looking_for || "No position specified",
                                  avatar: candidate.id.toString()
                                })
                              }
                            >
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    No candidates found matching your search criteria.
                  </div>
                )}
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
                  <span className="text-sm">{candidatesResponse?.data.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Active</span>
                  <span className="text-sm">
                    {candidatesResponse?.data.filter(c => c.profile !== null).length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">With Skills</span>
                  <span className="text-sm">
                    {candidatesResponse?.data.filter(c => c.skills.length > 0).length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    Incomplete Profiles
                  </span>
                  <span className="text-sm">
                    {candidatesResponse?.data.filter(c => c.profile === null).length || 0}
                  </span>
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
        mutate={mutate}
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
