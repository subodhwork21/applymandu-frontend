"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Download,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  Building2,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { defaultFetcherAdmin } from "@/lib/fetcher";
import { format, subDays, subMonths } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ReportsData {
  overview: {
    total_users: number;
    total_jobs: number;
    total_applications: number;
    total_employers: number;
    active_jobs: number;
    pending_applications: number;
    hired_applications: number;
    new_users_this_month: number;
    growth_rate: number;
  };
  charts: {
    users_by_month: { date: string; count: number; month: string }[];
    jobs_by_month: { date: string; count: number; month: string }[];
    applications_by_month: { date: string; count: number; month: string }[];
    applications_by_status: { name: string; value: number; color: string }[];
    jobs_by_category: { name: string; value: number }[];
    top_employers: { name: string; jobs_count: number; applications_count: number }[];
    user_activity: { date: string; logins: number; registrations: number }[];
  };
  recent_activities: {
    id: number;
    type: string;
    description: string;
    user_name: string;
    created_at: string;
    status: string;
  }[];
}

const AdminReportsPage = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState("30"); // Last 30 days
  const [reportType, setReportType] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);

  const { data: reportsData, mutate, isLoading } = useSWR<ReportsData>(
    `api/admin/reports?range=${dateRange}&type=${reportType}`,
    defaultFetcherAdmin
  );

  const handleExportReport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/export?format=${format}&range=${dateRange}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-report-${format}-${format(new Date(), 'yyyy-MM-dd')}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Success",
          description: `Report exported as ${format.toUpperCase()} successfully`,
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return <div className="p-8 text-center">Loading reports...</div>;
  }

  if (!reportsData) {
    return <div className="p-8 text-center">No data available</div>;
  }

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl text-manduSecondary font-nasalization">
            Admin Reports & Analytics
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => mutate()}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => handleExportReport('excel')}
              disabled={isExporting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button
              onClick={() => handleExportReport('pdf')}
              disabled={isExporting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="users">User Analytics</SelectItem>
              <SelectItem value="jobs">Job Analytics</SelectItem>
              <SelectItem value="applications">Application Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.overview.total_users.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{reportsData.overview.new_users_this_month} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.overview.total_jobs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {reportsData.overview.active_jobs} active jobs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.overview.total_applications.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {reportsData.overview.hired_applications} hired
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.overview.total_employers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {reportsData.overview.growth_rate > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                {Math.abs(reportsData.overview.growth_rate)}% growth
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Registration Trend */}
          <Card>
            <CardHeader>
              <CardTitle>User Registration Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportsData.charts.users_by_month}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Postings Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Job Postings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportsData.charts.jobs_by_month}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Application Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportsData.charts.applications_by_status}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportsData.charts.applications_by_status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Job Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Job Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportsData.charts.jobs_by_category} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Employers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.charts.top_employers.map((employer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{employer.name}</p>
                      <p className="text-sm text-gray-600">
                        {employer.jobs_count} jobs • {employer.applications_count} applications
                      </p>
                    </div>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {reportsData.recent_activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border-l-2 border-gray-200">
                    <div className="flex-shrink-0">
                      {activity.type === 'job_posted' && <Briefcase className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'user_registered' && <Users className="h-4 w-4 text-green-500" />}
                      {activity.type === 'application_submitted' && <FileText className="h-4 w-4 text-orange-500" />}
                      {activity.type === 'application_hired' && <TrendingUp className="h-4 w-4 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {activity.user_name} • {format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 'secondary'}
                      className="flex-shrink-0"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Trends */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Application Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reportsData.charts.applications_by_month}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    dot={{ fill: '#ff7300' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* User Activity Comparison */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>User Activity: Logins vs Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportsData.charts.user_activity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="logins" fill="#8884d8" name="Logins" />
                  <Bar dataKey="registrations" fill="#82ca9d" name="Registrations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Statistics */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {((reportsData.overview.hired_applications / reportsData.overview.total_applications) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-blue-800">Success Rate</p>
                  <p className="text-xs text-gray-600 mt-1">Applications to Hires</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(reportsData.overview.total_applications / reportsData.overview.active_jobs).toFixed(1)}
                  </div>
                  <p className="text-sm text-green-800">Avg Applications</p>
                  <p className="text-xs text-gray-600 mt-1">Per Active Job</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {(reportsData.overview.total_jobs / reportsData.overview.total_employers).toFixed(1)}
                  </div>
                  <p className="text-sm text-purple-800">Avg Jobs</p>
                  <p className="text-xs text-gray-600 mt-1">Per Employer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push('/admin/users')}
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push('/admin/jobs')}
                >
                  <Briefcase className="h-6 w-6 mb-2" />
                  <span className="text-sm">Manage Jobs</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push('/admin/applications')}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">View Applications</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push('/admin/settings')}
                >
                  <Eye className="h-6 w-6 mb-2" />
                  <span className="text-sm">Platform Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminReportsPage;
