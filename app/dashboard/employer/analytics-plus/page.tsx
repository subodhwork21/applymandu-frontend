"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import AnalyticsHeader from "@/components/analytics-plus/AnalyticsHeader";
import AnalyticsTabs from "@/components/analytics-plus/AnalyticsTabs";
import ExportOptions from "@/components/analytics-plus/ExportOptions";
import PremiumFeatureNotice from "@/components/analytics-plus/PremiumFeatureNotice";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";

// --- Place your AnalyticsData interface and mockAnalyticsData here (as in your original file) ---

// ... (copy the AnalyticsData interface and mockAnalyticsData from your original file above) ...
interface AnalyticsData {
  overview: {
    totalViews: number;
    totalApplications: number;
    totalHires: number;
    totalJobPostings: number;
    viewsChange: number;
    applicationsChange: number;
    hiresChange: number;
    jobPostingsChange: number;
  };
  applicantDemographics: {
    byGender: { name: string; value: number }[];
    byAge: { name: string; value: number }[];
    byEducation: { name: string; value: number }[];
    byExperience: { name: string; value: number }[];
  };
  applicationTrends: {
    byMonth: { date: string; applications: number; views: number }[];
    byJobType: { name: string; value: number }[];
    byLocation: { name: string; value: number }[];
  };
  performanceMetrics: {
    conversionRate: number;
    averageTimeToHire: number;
    applicationCompletionRate: number;
    applicantQualityScore: number;
    conversionRateChange: number;
    timeToHireChange: number;
    completionRateChange: number;
    qualityScoreChange: number;
  };
  topPerformingJobs: {
    id: number;
    title: string;
    views: number;
    applications: number;
    conversionRate: number;
  }[];
}




const EmployerAdvancedAnalyticsPage = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedTimeframe, setSelectedTimeframe] = useState("yearly");
  const [activeTab, setActiveTab] = useState("overview");

  // For now, we'll use mock data
  // const data = mockAnalyticsData;
  // const isLoading = false;

  const handleExportData = (format: string) => {
    toast({
      title: "Exporting data",
      description: `Your analytics data is being exported as ${format.toUpperCase()}. You'll receive it shortly.`,
    });
  };

  // if (isLoading) {
  //   return <div className="p-8 text-center">Loading analytics data...</div>;
  // }

   const { data, error, isLoading } = useSWR("api/analytics", defaultFetcher);

  if (isLoading) return <div className="h-screen w-full">Loading analytics...</div>;
  if (error) return <div>Error loading analytics: {error.message}</div>;
  if (!data) return <div>No analytics data found.</div>;

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <AnalyticsHeader
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          handleExportData={handleExportData}
        />

        <AnalyticsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={data?.data}
          router={router}
        />

        <ExportOptions handleExportData={handleExportData} />

        <PremiumFeatureNotice router={router} />
      </div>
    </section>
  );
};

export default EmployerAdvancedAnalyticsPage;
