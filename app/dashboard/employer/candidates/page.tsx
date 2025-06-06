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
import Image from "next/image";

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

  const {data:candidateStats, mutate:mutateCandidateStats} = useSWR<Record<string,any>>(
    `api/candidate/stats/all`,
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
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-nasalization text-manduSecondary">Candidates</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-borderLine">
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
                  className="h-10 px-6 bg-manduCustom-secondary-blue text-white"
                >
                  <Filter className="h-5 w-5 mr-2 " />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {filteredCandidates && filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="border border-borderLine rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <Image
                        width={48}
                        height={48}
                          src={`${candidate?.image_path}`}
                          alt={`${candidate.first_name} ${candidate.last_name}`}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-lg text-bluePrime font-medium">{`${candidate.first_name} ${candidate.last_name}`}</h3>
                            <span className="px-3 py-1 bg-manduSuccess text-white rounded-full text-sm">
                              {candidate?.immediate_availability ? "Available" : candidate?.availability_date ? "Available after " + candidate?.availability_date+ " days" : "Not Available"}
                            </span>
                          </div>
                          <p className="text-grayColor text-sm">
                            {candidate.profile?.looking_for || "No position specified"}
                          </p>
                          <div className="flex flex-wrap space-x-2 mt-2">
                            {candidate.skills.length > 0 ? (
                              candidate.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-2 py-1 rounded-[4px] bg-manduCustom-secondary-blue text-white text-xs mr-2 mb-2"
                                >
                                  {skill.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-manduNeutral text-xs">No skills listed</span>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Link href={`/dashboard/employer/candidates/${candidate.id}`}>
                              <Button className="bg-white border border-manduSecondary text-manduSecondary font-semibold" variant="outline">View Profile</Button>
                            </Link>
                            <Button
                              className="bg-manduSecondary text-white hover:text-white"
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
            <div className="bg-white p-6 rounded-lg border border-borderLine">
              <h2 className="text-xl mb-4 text-manduSecondary font-medium">Candidate Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">
                    Total Candidates
                  </span>
                  <span className="text-sm text-grayColor font-bold">{candidateStats?.total_candidates || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">Active</span>
                  <span className="text-sm">
                    {candidateStats?.active_candidates || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">With Skills</span>
                  <span className="text-sm text-grayColor font-bold">
                    {candidateStats?.candidates_with_skills || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-grayColor">
                    Incomplete Profiles
                  </span>
                  <span className="text-sm text-grayColor font-bold">
                    {candidateStats?.incomplete_profile_candidates || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4 text-manduSecondary font-medium">Quick Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-manduNeutral hover:text-neutral-900"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Bulk Message
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-manduNeutral hover:text-neutral-900"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Export Candidates
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-manduNeutral hover:text-neutral-900"
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
