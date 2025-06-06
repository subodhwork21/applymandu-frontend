"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  Building,
  FileText,
  TrendingUp,
  Calendar,
  BarChart4,
  PieChart,
  Eye,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { defaultFetcher, defaultFetcherAdmin } from "@/lib/fetcher";
import { AreaChart, BarChart, DonutChart } from "@tremor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Updated interface to match your Laravel API response
interface DashboardStats {
  totalJobseekers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  totalJobSeekerIncrease: number;
  totalJobsIncrease: number;
  totalApplicationsIncrease: number;
  totalCompaniesIncrease: number;
}

interface ChartData {
  users_by_month: { date: string; count: number }[];
  jobs_by_month: { date: string; count: number }[];
  applications_by_month: { date: string; count: number }[];
  jobs_by_category: { name: string; value: number }[];
  applications_by_status: { name: string; value: number }[];
}

interface JobSeeker {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  image: string | null;
  email_verified_at: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface Job {
  id: number;
  title: string;
  slug: string;
  employment_type: string;
  experience_level: string;
  location: string;
  salary_min: string;
  salary_max: string;
  status: number;
  department: string;
  application_deadline: string;
  location_type: string;
  posted_date: string;
  employer_id: number;
  created_at: string;
  updated_at: string;
  job_label: string;
}

interface RecentListData {
  jobseekersList: JobSeeker[];
  employersList: any[];
  jobsList: Job[];
  applicationsList: any[];
}

// Mock data for charts
const mockChartData: ChartData = {
  users_by_month: [
    { date: "Jan 2024", count: 120 },
    { date: "Feb 2024", count: 180 },
    { date: "Mar 2024", count: 240 },
    { date: "Apr 2024", count: 320 },
    { date: "May 2024", count: 280 },
    { date: "Jun 2024", count: 380 },
    { date: "Jul 2024", count: 420 },
    { date: "Aug 2024", count: 480 },
    { date: "Sep 2024", count: 520 },
    { date: "Oct 2024", count: 580 },
    { date: "Nov 2024", count: 640 },
    { date: "Dec 2024", count: 720 },
  ],
  jobs_by_month: [
    { date: "Jan 2024", count: 45 },
    { date: "Feb 2024", count: 52 },
    { date: "Mar 2024", count: 68 },
    { date: "Apr 2024", count: 75 },
    { date: "May 2024", count: 82 },
    { date: "Jun 2024", count: 95 },
    { date: "Jul 2024", count: 110 },
    { date: "Aug 2024", count: 125 },
    { date: "Sep 2024", count: 140 },
    { date: "Oct 2024", count: 155 },
    { date: "Nov 2024", count: 170 },
    { date: "Dec 2024", count: 185 },
  ],
  applications_by_month: [
    { date: "Jan 2024", count: 320 },
    { date: "Feb 2024", count: 450 },
    { date: "Mar 2024", count: 580 },
    { date: "Apr 2024", count: 720 },
    { date: "May 2024", count: 650 },
    { date: "Jun 2024", count: 890 },
    { date: "Jul 2024", count: 1020 },
    { date: "Aug 2024", count: 1150 },
    { date: "Sep 2024", count: 1280 },
    { date: "Oct 2024", count: 1420 },
    { date: "Nov 2024", count: 1580 },
    { date: "Dec 2024", count: 1750 },
  ],
  jobs_by_category: [
    { name: "Technology", value: 450 },
    { name: "Healthcare", value: 320 },
    { name: "Finance", value: 280 },
    { name: "Education", value: 220 },
    { name: "Marketing", value: 180 },
    { name: "Sales", value: 160 },
    { name: "Engineering", value: 140 },
    { name: "Design", value: 120 },
    { name: "Operations", value: 100 },
    { name: "Others", value: 85 },
  ],
  applications_by_status: [
    { name: "Pending", value: 2450 },
    { name: "Under Review", value: 1850 },
    { name: "Shortlisted", value: 980 },
    { name: "Interview Scheduled", value: 650 },
    { name: "Hired", value: 420 },
    { name: "Rejected", value: 1200 },
    { name: "Withdrawn", value: 280 },
  ],
};



const AdminDashboardPage = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Available years for selection (current year and 4 years back)
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const { data: stats, isLoading: statsLoading } = useSWR<DashboardStats>(
    "api/admin/top-stats",
    defaultFetcherAdmin
  );
  const {data: jobseekerData, isLoading: jobseekerLoading} = useSWR<Record<string, any>>(
  "api/admin/jobseekers-growth",
  defaultFetcherAdmin
);

  // Use mock data instead of API call for charts
  const chartData = mockChartData;
  const chartLoading = false;

  const { data: recentData, isLoading: recentLoading } = useSWR<RecentListData>(
    "api/admin/recent-list",
    defaultFetcherAdmin
  );

  if (statsLoading || chartLoading || recentLoading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }
   const filterDataByYear = (data: { date: string; count: number }[]) => {
    return data.filter(item => item.date.includes(selectedYear.toString()));
  };

  const filteredUserData = filterDataByYear(jobseekerData?.data?.users_by_month);
  const filteredJobsData = filterDataByYear(chartData.jobs_by_month);
  const filteredApplicationsData = filterDataByYear(chartData.applications_by_month);

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">
            Admin Dashboard
          </h1>

            <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter by year:</span>
            <Select 
              value={selectedYear.toString()} 
              onValueChange={(value) => 
                setSelectedYear(parseInt(value)
                // router.push("/admin")
  )}
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
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {stats && (
                  <div>
                    <p className="text-sm text-grayColor">Total Jobseekers</p>
                    <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                      {stats.totalJobseekers.toLocaleString()}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        stats.totalJobSeekerIncrease >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stats.totalJobSeekerIncrease >= 0 ? "+" : ""}
                      {stats.totalJobSeekerIncrease}% from last month
                    </p>
                  </div>
                )}
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Total Companies</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {stats?.totalCompanies.toLocaleString()}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      stats?.totalCompaniesIncrease >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats?.totalCompaniesIncrease >= 0 ? "+" : ""}
                    {stats?.totalCompaniesIncrease}% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-grayColor">Total Jobs</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                    {stats?.totalJobs.toLocaleString()}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      stats?.totalJobsIncrease >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats?.totalJobsIncrease >= 0 ? "+" : ""}
                    {stats?.totalJobsIncrease}% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-amber-600" />
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
                    {stats?.totalApplications.toLocaleString()}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      stats?.totalApplicationsIncrease >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats?.totalApplicationsIncrease >= 0 ? "+" : ""}
                    {stats?.totalApplicationsIncrease}% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Jobseekers */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Jobseekers
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/users")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentData?.jobseekersList?.slice(0, 5).map((jobseeker) => (
                  <div
                    key={jobseeker.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {jobseeker.first_name} {jobseeker.last_name}
                        </p>
                        <p className="text-xs text-grayColor flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {jobseeker.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          jobseeker.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {jobseeker.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
                {(!recentData?.jobseekersList ||
                  recentData.jobseekersList.length === 0) && (
                  <p className="text-center text-grayColor py-4">
                    No recent jobseekers
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Recent Jobs
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/jobs")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentData?.jobsList?.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">
                          {job.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-grayColor">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {job.employment_type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          job.job_label === "new"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {job.job_label}
                      </span>
                    </div>
                  </div>
                ))}
                {(!recentData?.jobsList ||
                  recentData.jobsList.length === 0) && (
                  <p className="text-center text-grayColor py-4">
                    No recent jobs
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-manduSecondary">
                  Manage Users
                </h3>
                <Calendar className="h-5 w-5 text-grayColor" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-manduCustom-secondary-blue">
                  {stats?.totalJobseekers || 0}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/users")}
                >
                  View All
                </Button>
              </div>
              <p className="text-sm text-grayColor mt-2">
                Total registered jobseekers
              </p>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-manduSecondary">
                  Manage Companies
                </h3>
                <Calendar className="h-5 w-5 text-grayColor" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-manduCustom-secondary-blue">
                  {stats?.totalCompanies || 0}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/employers")}
                >
                  View All
                </Button>
              </div>
              <p className="text-sm text-grayColor mt-2">
                Total registered companies
              </p>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-manduSecondary">
                  Manage Jobs
                </h3>
                <Calendar className="h-5 w-5 text-grayColor" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-manduCustom-secondary-blue">
                  {stats?.totalJobs || 0}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/jobs")}
                >
                  View All
                </Button>
              </div>
              <p className="text-sm text-grayColor mt-2">Total job postings</p>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-manduSecondary">
                  Applications
                </h3>
                <Calendar className="h-5 w-5 text-grayColor" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-manduCustom-secondary-blue">
                  {stats?.totalApplications || 0}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/applications")}
                >
                  View All
                </Button>
              </div>
              <p className="text-sm text-grayColor mt-2">
                Total job applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Companies and Applications Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Companies */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Recent Companies
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/employers")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentData?.employersList
                  ?.slice(0, 5)
                  .map((employer, index) => (
                    <div
                      key={employer.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Building className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {employer.company_name || employer.name}
                          </p>
                          <p className="text-xs text-grayColor flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {employer.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            employer.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {employer.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  ))}
                {(!recentData?.employersList ||
                  recentData.employersList.length === 0) && (
                  <p className="text-center text-grayColor py-4">
                    No recent companies
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Applications
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/applications")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentData?.applicationsList
                  ?.slice(0, 5)
                  .map((application, index) => (
                    <div
                      key={application.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {application.job_title || "Job Application"}
                          </p>
                          <p className="text-xs text-grayColor">
                            {application.applicant_name ||
                              application.user_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            application.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : application.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {application.status || "New"}
                        </span>
                      </div>
                    </div>
                  ))}
                {(!recentData?.applicationsList ||
                  recentData.applicationsList.length === 0) && (
                  <p className="text-center text-grayColor py-4">
                    No recent applications
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                User Growth ({selectedYear})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                className="h-72 mt-4"
                data={filteredUserData}
                index="date"
                categories={["count"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value.toLocaleString()} users`}
                showLegend={false}
                showGridLines={true}
                showAnimation={true}
                curveType="monotone"
              />
            </CardContent>
          </Card>

          {/* Job Postings Chart */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                Job Postings (2024)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                className="h-72 mt-4"
                data={filteredJobsData}
                index="date"
                categories={["count"]}
                colors={["amber"]}
                valueFormatter={(value) => `${value.toLocaleString()} jobs`}
                showLegend={false}
                showGridLines={true}
                showAnimation={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Applications Growth Chart */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Application Trends (2024)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                className="h-80 mt-4"
                data={filteredApplicationsData}
                index="date"
                categories={["count"]}
                colors={["emerald"]}
                valueFormatter={(value) =>
                  `${value.toLocaleString()} applications`
                }
                showLegend={false}
                showGridLines={true}
                showAnimation={true}
                curveType="monotone"
              />
            </CardContent>
          </Card>
        </div>

        {/* Donut Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Jobs by Category */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Jobs by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart
                className="h-80 mt-4"
                data={chartData.jobs_by_category}
                category="value"
                index="name"
                colors={[
                  "slate",
                  "violet",
                  "indigo",
                  "rose",
                  "cyan",
                  "amber",
                  "emerald",
                  "orange",
                  "purple",
                  "teal",
                ]}
                valueFormatter={(value) => `${value.toLocaleString()} jobs`}
                showAnimation={true}
                showTooltip={true}
              />
            </CardContent>
          </Card>

          {/* Applications by Status */}
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Applications by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart
                className="h-80 mt-4"
                data={chartData.applications_by_status}
                category="value"
                index="name"
                colors={[
                  "yellow",
                  "blue",
                  "green",
                  "indigo",
                  "emerald",
                  "red",
                  "gray",
                ]}
                valueFormatter={(value) =>
                  `${value.toLocaleString()} applications`
                }
                showAnimation={true}
                showTooltip={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Monthly User Growth
                  </p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">
                    +15.2%
                  </h3>
                  <p className="text-xs text-blue-600 mt-1">
                    Average monthly increase
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm bg-gradient-to-r from-amber-50 to-amber-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 font-medium">
                    Job Success Rate
                  </p>
                  <h3 className="text-2xl font-bold text-amber-900 mt-1">
                    68.5%
                  </h3>
                  <p className="text-xs text-amber-600 mt-1">
                    Jobs successfully filled
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    Application Rate
                  </p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">
                    4.2x
                  </h3>
                  <p className="text-xs text-green-600 mt-1">
                    Applications per job
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                Top Job Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.jobs_by_category
                  .slice(0, 5)
                  .map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-amber-600"
                              : "bg-blue-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-manduSecondary">
                          {category.value}
                        </span>
                        <span className="text-sm text-grayColor ml-1">
                          jobs
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
                <Eye className="h-5 w-5 mr-2" />
                Application Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.applications_by_status.slice(0, 5).map((status) => (
                  <div
                    key={status.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          status.name === "Pending"
                            ? "bg-yellow-500"
                            : status.name === "Under Review"
                            ? "bg-blue-500"
                            : status.name === "Shortlisted"
                            ? "bg-green-500"
                            : status.name === "Interview Scheduled"
                            ? "bg-indigo-500"
                            : status.name === "Hired"
                            ? "bg-emerald-500"
                            : status.name === "Rejected"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                      <span className="font-medium">{status.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-manduSecondary">
                        {status.value.toLocaleString()}
                      </span>
                      <div className="text-xs text-grayColor">
                        {(
                          (status.value /
                            chartData.applications_by_status.reduce(
                              (sum, s) => sum + s.value,
                              0
                            )) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-manduSecondary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
              onClick={() => router.push("/admin/jobs/pending")}
            >
              <Briefcase className="h-6 w-6 text-manduCustom-secondary-blue" />
              <span>Review Pending Jobs</span>
              <span className="text-xs text-grayColor">24 pending</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
              onClick={() =>
                router.push("/admin/employers/verification-requests")
              }
            >
              <Building className="h-6 w-6 text-manduCustom-secondary-blue" />
              <span>Employer Verifications</span>
              <span className="text-xs text-grayColor">12 requests</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
              onClick={() => router.push("/admin/users/verification-requests")}
            >
              <Users className="h-6 w-6 text-manduCustom-secondary-blue" />
              <span>User Verifications</span>
              <span className="text-xs text-grayColor">8 requests</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20 hover:bg-manduSecondary/5"
              onClick={() => router.push("/admin/reports")}
            >
              <TrendingUp className="h-6 w-6 text-manduCustom-secondary-blue" />
              <span>View Reports</span>
              <span className="text-xs text-grayColor">Generate new</span>
            </Button>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <h4 className="text-2xl font-bold text-manduSecondary">99.2%</h4>
              <p className="text-sm text-grayColor">System Uptime</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-manduSecondary">2.3s</h4>
              <p className="text-sm text-grayColor">Avg Response Time</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-manduSecondary">4.8/5</h4>
              <p className="text-sm text-grayColor">User Satisfaction</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-manduSecondary">24/7</h4>
              <p className="text-sm text-grayColor">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
