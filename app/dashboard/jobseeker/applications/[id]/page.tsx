'use client'
import React from "react";
import ApplicationDetails from "@/components/application-details";
import { useParams } from "next/navigation";



const ApplicationDetailsPage = ({}) => {
  const params = useParams();
  return <ApplicationDetails id={params?.id as string} />;
};

export default ApplicationDetailsPage;
