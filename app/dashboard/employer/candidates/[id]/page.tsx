'use client'
import React from "react";
import CandidateProfileClient from "@/components/candidate-profile-client";
import { useParams } from "next/navigation";


const CandidateProfilePage = () => {
  const {id} = useParams();
  return <CandidateProfileClient id={id as string} />;
};

export default CandidateProfilePage;
