"use client";

import React from "react";
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
  PieChart 
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import { AreaChart, BarChart, DonutChart } from "@tremor/react";

interface DashboardStats {
  total_users: number;
  total_employers: number;
  total_jobs: number;
  total_applications: number;
  active_jobs: number;
  pending_jobs: number;
  users_growth: number;
  employers_growth: number;
  jobs_growth: number;
  applications_growth: number;
  recent_users: number;
  recent_employers: number;
  recent_jobs: number;
  recent_applications: number;
}

interface ChartData {
  users_by_month: { date: string; count: number }[];
  jobs_by_month: { date: string; count: number }[];
  applications_by_month: { date: string; count: number }[];
  jobs_by_category: { name: string; value: number }[];
  applications_by_status: { name: string; value: number }[];
}

const AdminDashboardPage = () => {
  const router = useRouter();
  
  const { data: stats, isLoading: statsLoading } = useSWR<DashboardStats>(
    "api/admin/dashboard/stats",
    defaultFetcher
  );
  
  const { data: chartData, isLoading: chartLoading } = useSWR<ChartData>(
    "api/admin/dashboard/charts",
    defaultFetcher
  );

  if (statsLoading || chartLoading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">Admin Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
               {
                stats && (<div>
                  <p className="text-sm text-grayColor">Total Users</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">{stats?.total_users.toLocaleString()}</h3>
                  <p className={`text-xs mt-1 ${stats?.users_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats?.users_growth >= 0 ? '+' : ''}{stats?.users_growth}% from last month
                  </p>
                </div>)
               }
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
                  <p className="text-sm text-grayColor">Total Employers</p>
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">{stats?.total_employers.toLocaleString()}</h3>
                  <p className={`text-xs mt-1 ${stats?.employers_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats?.employers_growth >= 0 ? '+' : ''}{stats?.employers_growth}% from last month
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
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">{stats?.total_jobs.toLocaleString()}</h3>
                  <p className={`text-xs mt-1 ${stats?.jobs_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats?.jobs_growth >= 0 ? '+' : ''}{stats?.jobs_growth}% from last month
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
                  <h3 className="text-2xl font-bold text-manduSecondary mt-1">{stats?.total_applications.toLocaleString()}</h3>
                  <p className={`text-xs mt-1 ${stats?.applications_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats?.applications_growth >= 0 ? '+' : ''}{stats?.applications_growth}% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-manduSecondary">Recent Users</h3>
                <Calendar className="h-5 w-5 text-grayColor" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-manduPrimary">{stats?.recent_users}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push("/dashboard/admin/users")}
                >
                  View All
                </Button>
              </div>
              <p className="text-sm text-grayColor mt-2">New users in the last 7 days</p>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-manduSecondary">Recent Employers</h3>
                <Calendar className="h-5 w-5 text-grayColor" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-manduPrimary">{stats?.recent_employers}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push("/dashboard/admin/employers")}
                >
                  View All
                </Button>
              </div>
              <p className="text-sm text-grayColor mt-2">New employers in the last 7 days</p>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-manduSecondary">Recent Jobs</h3>
                <Calendar className="h-5 w-5 text-grayColor" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-manduPrimary">{stats?.recent_jobs}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push("/dashboard/admin/jobs")}
                >
                  View All
                </Button>
              </div>
              <p className="text-sm text-grayColor mt-2">New jobs in the last 7 days</p>
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-manduSecondary">Recent Applications</h3>
                <Calendar className="h-5 w-5 text-grayColor" />
              </div>
                            <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-manduPrimary">{stats?.recent_applications}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push("/dashboard/admin/applications")}
                >
                  View All
                </Button>
              </div>
              <p className="text-sm text-grayColor mt-2">New applications in the last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                User Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                className="h-72 mt-4"
                data={chartData?.users_by_month || []}
                index="date"
                categories={["count"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value.toLocaleString()} users`}
                showLegend={false}
                showGridLines={false}
                showAnimation
              />
            </CardContent>
          </Card>

          <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" />
                Job Postings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                className="h-72 mt-4"
                data={chartData?.jobs_by_month || []}
                index="date"
                categories={["count"]}
                colors={["amber"]}
                valueFormatter={(value) => `${value.toLocaleString()} jobs`}
                showLegend={false}
                showGridLines={false}
                showAnimation
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                data={chartData?.jobs_by_category || []}
                category="value"
                index="name"
                colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
                valueFormatter={(value) => `${value.toLocaleString()} jobs`}
                showAnimation
              />
            </CardContent>
          </Card>

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
                data={chartData?.applications_by_status || []}
                category="value"
                index="name"
                colors={["emerald", "yellow", "blue", "rose", "slate"]}
                valueFormatter={(value) => `${value.toLocaleString()} applications`}
                showAnimation
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-manduSecondary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20"
              onClick={() => router.push("/dashboard/admin/jobs/pending")}
            >
              <Briefcase className="h-6 w-6 text-manduPrimary" />
              <span>Review Pending Jobs</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20"
              onClick={() => router.push("/dashboard/admin/employers/verification-requests")}
            >
              <Building className="h-6 w-6 text-manduPrimary" />
              <span>Employer Verifications</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20"
              onClick={() => router.push("/dashboard/admin/users/verification-requests")}
            >
              <Users className="h-6 w-6 text-manduPrimary" />
              <span>User Verifications</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-manduSecondary/20"
              onClick={() => router.push("/dashboard/admin/reports")}
            >
              <TrendingUp className="h-6 w-6 text-manduPrimary" />
              <span>View Reports</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;

