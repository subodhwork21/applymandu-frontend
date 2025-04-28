import React from "react";
import CandidateProfileClient from "@/components/candidate-profile-client";

export async function generateStaticParams() {
  // Generate for first 10 candidates as an example
  return Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

const CandidateProfilePage = () => {
  return <CandidateProfileClient />;
};

export default CandidateProfilePage;
