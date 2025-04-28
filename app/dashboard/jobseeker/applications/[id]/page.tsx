import React from "react";
import ApplicationDetails from "@/components/application-details";

// This needs to be a Server Component to use generateStaticParams
export const generateStaticParams = async () => {
  // Mock IDs for static generation
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
};

const ApplicationDetailsPage = () => {
  return <ApplicationDetails />;
};

export default ApplicationDetailsPage;
