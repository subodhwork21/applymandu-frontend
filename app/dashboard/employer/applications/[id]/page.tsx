'use client'
import React from "react";
import ApplicationDetailClient from "@/components/application-detail-client";
import useSWR from "swr";
import { useParams } from "next/navigation";

// export async function generateStaticParams() {
//   // Generate for first 10 applications as an example
//   return Array.from({ length: 10 }, (_, i) => ({
//     id: (i + 1).toString(),
//   }));
// }

const ApplicationDetailPage = () => {
  const id  = useParams()?.id;

  return <ApplicationDetailClient id={id as string}/>;
};

export default ApplicationDetailPage;
