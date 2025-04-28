import React from "react";
import ApplicationDetailClient from "@/components/application-detail-client";

export async function generateStaticParams() {
  // Generate for first 10 applications as an example
  return Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

const ApplicationDetailPage = () => {
  return <ApplicationDetailClient />;
};

export default ApplicationDetailPage;
