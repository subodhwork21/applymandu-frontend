"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart4,
  PieChart,
  TrendingUp,
  Users,
  Briefcase,
  FileText,
  Calendar,
  Download,
  Filter,
  Eye,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { AreaChart, BarChart, DonutChart } from "@tremor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

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

// Mock data for development
const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalViews: 12450,
    totalApplications: 843,
    totalHires: 32,
    totalJobPostings: 18,
    viewsChange: 15.2,
    applicationsChange: 8.7,
    hiresChange: -2.3,
    jobPostingsChange: 5.5,
  },
  applicantDemographics: {
    byGender: [
      { name: "Male", value: 485 },
      { name: "Female", value: 352 },
      { name: "Other", value: 6 },
    ],
    byAge: [
      { name: "18-24", value: 124 },
      { name: "25-34", value: 412 },
      { name: "35-44", value: 215 },
      { name: "45-54", value: 78 },
      { name: "55+", value: 14 },
    ],
    byEducation: [
      { name: "High School", value: 95 },
      { name: "Bachelor's", value: 456 },
      { name: "Master's", value: 243 },
      { name: "PhD", value: 49 },
    ],
    byExperience: [
      { name: "0-1 years", value: 156 },
      { name: "2-5 years", value: 324 },
      { name: "6-10 years", value: 278 },
      { name: "10+ years", value: 85 },
    ],
  },
  applicationTrends: {
    byMonth: [
      { date: "Jan 2024", applications: 45, views: 720 },
      { date: "Feb 2024", applications: 52, views: 810 },
      { date: "Mar 2024", applications: 68, views: 940 },
      { date: "Apr 2024", applications: 75, views: 1050 },
      { date: "May 2024", applications: 82, views: 1120 },
      { date: "Jun 2024", applications: 95, views: 1280 },
      { date: "Jul 2024", applications: 110, views: 1450 },
      { date: "Aug 2024", applications: 125, views: 1620 },
      { date: "Sep 2024", applications: 140, views: 1780 },
      { date: "Oct 2024", applications: 155, views: 1950 },
      { date: "Nov 2024", applications: 170, views: 2120 },
      { date: "Dec 2024", applications: 185, views: 2310 },
    ],
    byJobType: [
      { name: "Full-time", value: 520 },
      { name: "Part-time", value: 145 },
      { name: "Contract", value: 98 },
      { name: "Internship", value: 80 },
    ],
    byLocation: [
      { name: "Kathmandu", value: 425 },
      { name: "Pokhara", value: 156 },
      { name: "Lalitpur", value: 112 },
      { name: "Bhaktapur", value: 85 },
      { name: "Other", value: 65 },
    ],
  },
  performanceMetrics: {
    conversionRate: 6.8,
    averageTimeToHire: 28,
    applicationCompletionRate: 78.5,
    applicantQualityScore: 7.2,
    conversionRateChange: 0.5,
    timeToHireChange: -2.5,
    completionRateChange: 3.2,
    qualityScoreChange: 0.3,
  },
  topPerformingJobs: [
    {
      id: 1,
      title: "Senior Software Engineer",
      views: 1245,
      applications: 87,
      conversionRate: 7.0,
    },
    {
      id: 2,
      title: "Marketing Manager",
      views: 980,
      applications: 72,
      conversionRate: 7.3,
    },
    {
      id: 3,
      title: "Product Designer",
      views: 865,
      applications: 65,
      conversionRate: 7.5,
    },
    {
      id: 4,
      title: "Sales Representative",
      views: 750,
      applications: 48,
      conversionRate: 6.4,
    },
    {
      id: 5,
      title: "Customer Support Specialist",
      views: 680,
      applications: 42,
      conversionRate: 6.2,
    },
  ],
};

const EmployerAdvancedAnalyticsPage = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedTimeframe, setSelectedTimeframe] = useState("yearly");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Available years for selection (current year and 2 years back)
  const availableYears = Array.from({ length: 3 }, (_, i) => currentYear - i);

  // In a real app, you would fetch the analytics data from your API
  // const { data, isLoading } = useSWR<AnalyticsData>(
  //   `api/employer/analytics?year=${selectedYear}&timeframe=${selectedTimeframe}`,
  //   defaultFetcher
  // );
  
  // For now, we'll use mock data
  const data = mockAnalyticsData;
  const isLoading = false;

  const handleExportData = (format: string) => {
    toast({
      title: "Exporting data",
      description: `Your analytics data is being exported as ${format.toUpperCase()}. You'll receive it shortly.`,
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading analytics data...</div>;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl text-manduSecondary font-nasalization">
            Advanced Analytics
          </h1>

          <div className="flex items-center gap-2">
            <Select 
              value={selectedTimeframe} 
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedYear.toString()} 
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={selectedYear.toString()} />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="demographics" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Demographics
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Top Jobs
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-grayColor">Total Job Views</p>
                        <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                          {data.overview.totalViews.toLocaleString()}
                        </h3>
                        <p
                          className={`text-xs mt-1 flex items-center ${
                            data.overview.viewsChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data.overview.viewsChange >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(data.overview.viewsChange)}% from last period
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-grayColor">Total Applications</p>
                        <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                          {data.overview.totalApplications.toLocaleString()}
                        </h3>
                        <p
                          className={`text-xs mt-1 flex items-center ${
                            data.overview.applicationsChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data.overview.applicationsChange >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(data.overview.applicationsChange)}% from last period
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-grayColor">Total Hires</p>
                        <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                          {data.overview.totalHires.toLocaleString()}
                        </h3>
                                              <p
                          className={`text-xs mt-1 flex items-center ${
                            data.overview.hiresChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data.overview.hiresChange >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(data.overview.hiresChange)}% from last period
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-grayColor">Active Job Postings</p>
                        <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                          {data.overview.totalJobPostings.toLocaleString()}
                        </h3>
                        <p
                          className={`text-xs mt-1 flex items-center ${
                            data.overview.jobPostingsChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data.overview.jobPostingsChange >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(data.overview.jobPostingsChange)}% from last period
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Application Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AreaChart
                      className="h-72 mt-4"
                      data={data.applicationTrends.byMonth}
                      index="date"
                      categories={["applications", "views"]}
                      colors={["purple", "blue"]}
                      valueFormatter={(value) => `${value.toLocaleString()}`}
                      showLegend={true}
                      showGridLines={true}
                      showAnimation={true}
                      curveType="monotone"
                    />
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <PieChart className="h-5 w-5 mr-2" />
                      Applications by Job Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DonutChart
                      className="h-72 mt-4"
                      data={data.applicationTrends.byJobType}
                      category="value"
                      index="name"
                      colors={["blue", "violet", "amber", "emerald"]}
                      valueFormatter={(value) => `${value.toLocaleString()} applications`}
                      showAnimation={true}
                      showTooltip={true}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm col-span-1 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <BarChart4 className="h-5 w-5 mr-2" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Conversion Rate</p>
                          <p
                            className={`text-xs flex items-center ${
                              data.performanceMetrics.conversionRateChange >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.performanceMetrics.conversionRateChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(data.performanceMetrics.conversionRateChange)}%
                          </p>
                        </div>
                        <h4 className="text-2xl font-bold text-manduSecondary">
                          {data.performanceMetrics.conversionRate}%
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Views to applications
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Time to Hire</p>
                          <p
                            className={`text-xs flex items-center ${
                              data.performanceMetrics.timeToHireChange <= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.performanceMetrics.timeToHireChange <= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(data.performanceMetrics.timeToHireChange)}%
                          </p>
                        </div>
                        <h4 className="text-2xl font-bold text-manduSecondary">
                          {data.performanceMetrics.averageTimeToHire} days
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Average hiring time
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Completion Rate</p>
                          <p
                            className={`text-xs flex items-center ${
                              data.performanceMetrics.completionRateChange >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.performanceMetrics.completionRateChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(data.performanceMetrics.completionRateChange)}%
                          </p>
                        </div>
                        <h4 className="text-2xl font-bold text-manduSecondary">
                          {data.performanceMetrics.applicationCompletionRate}%
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Application completion
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Quality Score</p>
                          <p
                            className={`text-xs flex items-center ${
                              data.performanceMetrics.qualityScoreChange >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.performanceMetrics.qualityScoreChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(data.performanceMetrics.qualityScoreChange)}
                          </p>
                        </div>
                        <h4 className="text-2xl font-bold text-manduSecondary">
                          {data.performanceMetrics.applicantQualityScore}/10
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Avg. applicant quality
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm col-span-1 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Applications by Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      className="h-72 mt-4"
                      data={data.applicationTrends.byLocation}
                      index="name"
                      categories={["value"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `${value.toLocaleString()} applications`}
                      showLegend={false}
                      showGridLines={true}
                      showAnimation={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Demographics Tab */}
            <TabsContent value="demographics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Applicants by Gender
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DonutChart
                      className="h-72 mt-4"
                      data={data.applicantDemographics.byGender}
                      category="value"
                      index="name"
                      colors={["blue", "pink", "purple"]}
                      valueFormatter={(value) => `${value.toLocaleString()} applicants`}
                      showAnimation={true}
                      showTooltip={true}
                    />
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Applicants by Age Group
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      className="h-72 mt-4"
                      data={data.applicantDemographics.byAge}
                      index="name"
                      categories={["value"]}
                      colors={["amber"]}
                      valueFormatter={(value) => `${value.toLocaleString()} applicants`}
                      showLegend={false}
                      showGridLines={true}
                      showAnimation={true}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <BarChart4 className="h-5 w-5 mr-2" />
                      Applicants by Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      className="h-72 mt-4"
                      data={data.applicantDemographics.byEducation}
                      index="name"
                      categories={["value"]}
                      colors={["green"]}
                      valueFormatter={(value) => `${value.toLocaleString()} applicants`}
                      showLegend={false}
                      showGridLines={true}
                      showAnimation={true}
                    />
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Applicants by Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      className="h-72 mt-4"
                      data={data.applicantDemographics.byExperience}
                      index="name"
                      categories={["value"]}
                      colors={["indigo"]}
                      valueFormatter={(value) => `${value.toLocaleString()} applicants`}
                      showLegend={false}
                      showGridLines={true}
                      showAnimation={true}
                    />
                  </CardContent>
                </Card>
              </div>

              <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Demographic Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">Gender Distribution</h4>
                      <p className="text-sm text-gray-700">
                        Your job postings attract a diverse pool of candidates with a balanced gender distribution. 
                        {data.applicantDemographics.byGender[0].value > data.applicantDemographics.byGender[1].value 
                          ? "Male applicants slightly outnumber female applicants." 
                          : "Female applicants slightly outnumber male applicants."}
                      </p>
                      <div className="mt-3 text-xs text-blue-600">
                        Recommendation: Consider reviewing your job descriptions to ensure they appeal to all genders equally.
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-medium text-amber-700 mb-2">Age Distribution</h4>
                      <p className="text-sm text-gray-700">
                        The majority of your applicants fall within the 25-34 age range, indicating strong appeal to early-career professionals.
                        Consider strategies to attract more experienced candidates if needed.
                      </p>
                      <div className="mt-3 text-xs text-amber-600">
                        Recommendation: Highlight career advancement opportunities to attract more mid-career professionals.
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">Education & Experience</h4>
                      <p className="text-sm text-gray-700">
                        Most of your applicants hold Bachelor's degrees and have 2-5 years of experience, 
                        aligning well with entry to mid-level positions.
                      </p>
                      <div className="mt-3 text-xs text-green-600">
                        Recommendation: For senior roles, consider emphasizing benefits that appeal to highly experienced candidates.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Application & View Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AreaChart
                    className="h-80 mt-4"
                    data={data.applicationTrends.byMonth}
                    index="date"
                    categories={["applications", "views"]}
                    colors={["purple", "blue"]}
                    valueFormatter={(value) => `${value.toLocaleString()}`}
                    showLegend={true}
                    showGridLines={true}
                    showAnimation={true}
                    curveType="monotone"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-manduSecondary mb-2">View-to-Application Conversion</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-manduCustom-secondary-blue">
                          {data.performanceMetrics.conversionRate}%
                        </p>
                        <p
                          className={`text-sm flex items-center ${
                            data.performanceMetrics.conversionRateChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {data.performanceMetrics.conversionRateChange >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(data.performanceMetrics.conversionRateChange)}% from last period
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        This is the percentage of job views that result in applications. 
                        The industry average is around 5-7%.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-manduSecondary mb-2">Monthly Growth Rate</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-manduCustom-secondary-blue">
                          +8.3%
                        </p>
                        <p className="text-sm text-green-600 flex items-center">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          2.1% higher than industry average
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Your application growth rate is consistently above the industry average of 6.2%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Applications by Job Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DonutChart
                      className="h-72 mt-4"
                      data={data.applicationTrends.byJobType}
                      category="value"
                      index="name"
                      colors={["blue", "violet", "amber", "emerald"]}
                      valueFormatter={(value) => `${value.toLocaleString()} applications`}
                      showAnimation={true}
                      showTooltip={true}
                    />
                    
                    <div className="mt-6 space-y-2">
                      {data.applicationTrends.byJobType.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className={`w-3 h-3 rounded-full mr-2 ${
                                index === 0 ? "bg-blue-500" :
                                index === 1 ? "bg-violet-500" :
                                index === 2 ? "bg-amber-500" :
                                "bg-emerald-500"
                              }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">{item.value}</span>
                            <span className="text-gray-500 text-sm ml-1">
                              ({((item.value / data.applicationTrends.byJobType.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Applications by Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      className="h-72 mt-4"
                      data={data.applicationTrends.byLocation}
                      index="name"
                      categories={["value"]}
                      colors={["indigo"]}
                      valueFormatter={(value) => `${value.toLocaleString()} applications`}
                      showLegend={false}
                      showGridLines={true}
                      showAnimation={true}
                    />
                    
                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-medium text-indigo-700 mb-2">Location Insights</h4>
                      <p className="text-sm text-gray-700">
                        Kathmandu dominates your applicant pool, accounting for 
                        {((data.applicationTrends.byLocation[0].value / 
                          data.applicationTrends.byLocation.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}% 
                        of all applications. Consider expanding your reach to other regions for a more diverse talent pool.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Key Performance Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-manduSecondary">Conversion Rate</p>
                          <p
                            className={`text-xs flex items-center ${
                              data.performanceMetrics.conversionRateChange >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.performanceMetrics.conversionRateChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(data.performanceMetrics.conversionRateChange)}%
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(data.performanceMetrics.conversionRate * 10, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{data.performanceMetrics.conversionRate}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Percentage of job views that convert to applications
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-manduSecondary">Average Time to Hire</p>
                          <p
                            className={`text-xs flex items-center ${
                              data.performanceMetrics.timeToHireChange <= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.performanceMetrics.timeToHireChange <= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(data.performanceMetrics.timeToHireChange)}%
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-amber-600 h-2.5 rounded-full" 
                              style={{ width: `${Math.min((data.performanceMetrics.averageTimeToHire / 60) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{data.performanceMetrics.averageTimeToHire} days</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Average time from job posting to hiring
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-manduSecondary">Application Completion Rate</p>
                          <p
                            className={`text-xs flex items-center ${
                              data.performanceMetrics.completionRateChange >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                                                      {data.performanceMetrics.completionRateChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(data.performanceMetrics.completionRateChange)}%
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${data.performanceMetrics.applicationCompletionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{data.performanceMetrics.applicationCompletionRate}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Percentage of started applications that are completed
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-manduSecondary">Applicant Quality Score</p>
                          <p
                            className={`text-xs flex items-center ${
                              data.performanceMetrics.qualityScoreChange >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.performanceMetrics.qualityScoreChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(data.performanceMetrics.qualityScoreChange)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-purple-600 h-2.5 rounded-full" 
                              style={{ width: `${(data.performanceMetrics.applicantQualityScore / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{data.performanceMetrics.applicantQualityScore}/10</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Average quality score of applicants
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <PieChart className="h-5 w-5 mr-2" />
                      Performance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-700 mb-2">Conversion Insights</h4>
                      <p className="text-sm text-gray-700">
                        Your conversion rate of {data.performanceMetrics.conversionRate}% is 
                        {data.performanceMetrics.conversionRate > 6.5 ? " above" : " below"} the industry average of 6.5%. 
                        {data.performanceMetrics.conversionRate > 6.5 
                          ? " Your job descriptions are effectively attracting qualified candidates."
                          : " Consider revising your job descriptions to better attract qualified candidates."}
                      </p>
                      <div className="mt-3 text-xs text-blue-600">
                        Tip: Clear job requirements and competitive benefits can improve conversion rates.
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg mb-4">
                      <h4 className="font-medium text-amber-700 mb-2">Time to Hire Analysis</h4>
                      <p className="text-sm text-gray-700">
                        Your average time to hire is {data.performanceMetrics.averageTimeToHire} days, which is
                        {data.performanceMetrics.averageTimeToHire < 30 ? " better than" : " longer than"} the industry average of 30 days.
                        {data.performanceMetrics.averageTimeToHire < 30 
                          ? " Your efficient hiring process gives you an advantage in securing top talent."
                          : " Streamlining your hiring process could help you secure top talent before competitors."}
                      </p>
                      <div className="mt-3 text-xs text-amber-600">
                        Tip: Automated screening and prompt interview scheduling can reduce hiring time.
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">Quality Score Insights</h4>
                      <p className="text-sm text-gray-700">
                        Your applicant quality score of {data.performanceMetrics.applicantQualityScore}/10 indicates that
                        {data.performanceMetrics.applicantQualityScore >= 7 
                          ? " your job postings are attracting well-qualified candidates."
                          : " there may be room to improve the quality of applicants you're attracting."}
                      </p>
                      <div className="mt-3 text-xs text-green-600">
                        Tip: Clearly defined job requirements and competitive compensation packages attract higher quality candidates.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Top Jobs Tab */}
            <TabsContent value="jobs">
              <Card className="border-[1px] border-solid border-slate-200 shadow-sm mb-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Top Performing Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-manduSecondary">Job Title</th>
                          <th className="text-center py-3 px-4 font-medium text-manduSecondary">Views</th>
                          <th className="text-center py-3 px-4 font-medium text-manduSecondary">Applications</th>
                          <th className="text-center py-3 px-4 font-medium text-manduSecondary">Conversion Rate</th>
                          <th className="text-right py-3 px-4 font-medium text-manduSecondary">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topPerformingJobs.map((job, index) => (
                          <tr key={job.id} className={index !== data.topPerformingJobs.length - 1 ? "border-b" : ""}>
                            <td className="py-3 px-4">
                              <div className="font-medium">{job.title}</div>
                            </td>
                            <td className="py-3 px-4 text-center">{job.views.toLocaleString()}</td>
                            <td className="py-3 px-4 text-center">{job.applications.toLocaleString()}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                job.conversionRate >= 7 ? "bg-green-100 text-green-800" :
                                job.conversionRate >= 5 ? "bg-blue-100 text-blue-800" :
                                "bg-amber-100 text-amber-800"
                              }`}>
                                {job.conversionRate}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => router.push(`/dashboard/employer/jobs/${job.id}`)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      Job Visibility Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-4">
                      {data.topPerformingJobs.slice(0, 3).map((job, index) => (
                        <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                index === 0 ? "bg-yellow-500" :
                                index === 1 ? "bg-gray-400" :
                                "bg-amber-600"
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-medium ml-2">{job.title}</span>
                            </div>
                            <span className="text-sm text-gray-500">{job.views.toLocaleString()} views</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                index === 0 ? "bg-yellow-500" :
                                index === 1 ? "bg-gray-400" :
                                "bg-amber-600"
                              }`}
                              style={{ width: `${(job.views / data.topPerformingJobs[0].views) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">Visibility Insights</h4>
                      <p className="text-sm text-gray-700">
                        Your top-performing job receives {data.topPerformingJobs[0].views.toLocaleString()} views, 
                        which is {((data.topPerformingJobs[0].views / data.topPerformingJobs[data.topPerformingJobs.length - 1].views) * 100).toFixed(0)}% more 
                        than your lowest-performing job. Consider applying similar strategies to improve visibility across all postings.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Application Conversion Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-4">
                      {data.topPerformingJobs.slice(0, 3).map((job, index) => (
                        <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                index === 0 ? "bg-green-500" :
                                index === 1 ? "bg-blue-500" :
                                "bg-purple-500"
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-medium ml-2">{job.title}</span>
                            </div>
                            <span className="text-sm text-gray-500">{job.conversionRate}% conversion</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                index === 0 ? "bg-green-500" :
                                index === 1 ? "bg-blue-500" :
                                "bg-purple-500"
                              }`}
                              style={{ width: `${(job.conversionRate / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">Conversion Insights</h4>
                      <p className="text-sm text-gray-700">
                        Your highest converting job ({data.topPerformingJobs.sort((a, b) => b.conversionRate - a.conversionRate)[0].title}) 
                        has a {data.topPerformingJobs.sort((a, b) => b.conversionRate - a.conversionRate)[0].conversionRate}% conversion rate. 
                        Analyze its job description, requirements, and benefits to understand what attracts quality candidates.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Export Options */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <h3 className="text-lg font-semibold text-manduSecondary mb-4">Export Analytics Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 h-auto py-3"
              onClick={() => handleExportData('csv')}
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">CSV Format</div>
                <div className="text-xs text-gray-500">For spreadsheet analysis</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 h-auto py-3"
              onClick={() => handleExportData('pdf')}
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">PDF Report</div>
                <div className="text-xs text-gray-500">For presentations</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 h-auto py-3"
              onClick={() => handleExportData('json')}
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">JSON Format</div>
                <div className="text-xs text-gray-500">For developers</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Premium Feature Notice */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-manduSecondary">Premium Analytics Feature</h3>
              <p className="text-sm text-gray-600 mt-1">
                You're enjoying our premium analytics as part of your subscription. Access detailed insights about your job postings, 
                applicant demographics, and hiring performance to make data-driven decisions.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  onClick={() => router.push('/dashboard/employer/api-access')}
                >
                  Explore API Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerAdvancedAnalyticsPage;




