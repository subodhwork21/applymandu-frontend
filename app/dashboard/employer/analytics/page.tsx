"use client";

import React, { useState } from 'react';
import { Users, Briefcase, UserCheck, TrendingUp, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import useSWR from 'swr';
import { employerToken } from '@/lib/tokens';

// Define the types for our API responses
interface ApplicationStats {
  active_jobs: number;
  active_applications: number;
  hired_applications: number;
  application_trends: {
    date: string;
    applications: number;
  }[];
  timeframe: string;
  stats: {
    application_change_percent: number;
    new_jobs_this_week: number;
    new_hires_this_month: number;
  };
}

interface PopularJob {
  id: number;
  title: string;
  slug: string | null;
  location: string;
  company_name: string | null;
  applications_count: number;
  skills: string[];
  posted_date: string;
  views_count: number;
}

interface PopularJobsResponse {
  success: boolean;
  popular_jobs: PopularJob[];
}

// SWR fetcher function
const fetcher = async (url: string) => {
  const token = employerToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('5days');
  
  // Fetch application stats data using SWR
  const { data: statsData, error: statsError, isLoading: statsLoading } = useSWR<ApplicationStats>(
    `${process.env.NEXT_PUBLIC_API_URL}api/dashboard/application-trends?timeframe=${timeRange}`,
    fetcher
  );
  
  // Fetch popular jobs data using SWR
  const { data: jobsData, error: jobsError, isLoading: jobsLoading } = useSWR<PopularJobsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}api/dashboard/popular-jobs`,
    fetcher
  );

  // Handle timeframe change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  // Format percentage for display
  const formatPercentage = (value: number) => {
    return value > 0 ? `+${value}%` : `${value}%`;
  };
  
  // Calculate hire rate (applications / views) as a percentage
  const calculateHireRate = (applications: number, views: number) => {
    if (views === 0) return 0;
    return Math.round((applications / views) * 100);
  };

  return (
    <section className="py-8 2xl:px-0 lg:px-12 px-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg border border-borderLine">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-manduNeutral">Total Applications</p>
                    <h3 className="text-2xl mt-2 text-manduNeutral font-medium">{statsLoading ? '...' : statsData?.active_applications.toLocaleString()}</h3>
                  </div>
                  <Users className="h-8 w-8 text-manduCustom-secondary-blue" />
                </div>
                <p className={`text-xs mt-4 ${statsData && statsData?.stats?.application_change_percent >= 0 ? 'text-dashboardTitleLight' : 'text-red-600'}`}>
                  {statsLoading ? '...' : formatPercentage(statsData?.stats?.application_change_percent || 0)} from last period
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-borderLine">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-manduNeutral">Active Jobs</p>
                    <h3 className="text-2xl mt-2 text-manduNeutral font-medium">{statsLoading ? '...' : statsData?.active_jobs}</h3>
                  </div>
                  <Briefcase className="h-8 w-8 text-manduCustom-secondary-blue" />
                </div>
                <p className="text-xs text-dashboardTitleLight mt-4">
                  {statsLoading ? '...' : `+${statsData?.stats.new_jobs_this_week || 0} new this week`}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-borderLine">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-manduNeutral">Hired Candidates</p>
                    <h3 className="text-2xl mt-2 text-manduNeutral font-medium">{statsLoading ? '...' : statsData?.hired_applications}</h3>
                  </div>
                  <UserCheck className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-xs text-dashboardTitleLight mt-4">
                  {statsLoading ? '...' : `+${statsData?.stats.new_hires_this_month || 0} this month`}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-manduSecondary">Application Trends</h2>
                <Select 
                  value={timeRange}
                  onValueChange={handleTimeRangeChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent className='border border-manduCustom-secondary-grey text-manduNeutral'>
                    <SelectItem value="5days">Last 5 Days</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="60days">Last 60 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="180days">Last 180 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {statsLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-manduNeutral">Loading chart data...</p>
                </div>
              ) : statsError ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-manduError">Error loading chart data. Please try again.</p>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statsData?.application_trends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis 
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} applications`, 'Applications']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="applications" 
                        name="Applications"
                        stroke="#001C4A" 
                        strokeWidth={2}
                        dot={{ fill: '#5388D8', r: 4 }}
                        activeDot={{ r: 6, fill: '#5388D8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-6 text-manduSecondary">Popular Job Positions</h2>
              {jobsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-manduNeutral">Loading popular jobs...</p>
                </div>
              ) : jobsError ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-manduError">Error loading popular jobs. Please try again.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobsData?.popular_jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border-b border-neutral-200">
                      <div>
                        <h3 className="text-lg text-manduCustom-secondary-blue">{job.title}</h3>
                        <p className="text-sm text-pureGray">{job.applications_count} applications</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Eye className="h-3 w-3 text-grayColor" />
                          <span className="text-xs text-grayColor">{job.views_count} views</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-text-12 bg-[#3174A5] px-1 py-1 rounded-[4px] font-semibold text-white">{calculateHireRate(job.applications_count, job.views_count)}% application rate</p>
                        <Progress 
                          value={calculateHireRate(job.applications_count, job.views_count)} 
                          className="w-32 h-2 mt-2" 
                        />
                      </div>
                    </div>
                  ))}
                  
                  {jobsData?.popular_jobs.length === 0 && (
                    <div className="text-center py-6 text-manduNeutral">
                      No job positions available yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-borderLine">
              <h2 className="text-xl mb-4 text-manduSecondary font-medium">Quick Insights</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base text-grayColor">Avg. Time to Hire</span>
                  <span className="text-base text-grayColor font-bold">15 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-grayColor">Interview Rate</span>
                  <span className="text-base text-grayColor font-bold">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-grayColor">Offer Acceptance</span>
                  <span className="text-base text-grayColor font-bold">78%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4 text-manduSecondary font-medium">Top Sources</h2>
              <div className="space-y-2">
                {[
                  { name: 'LinkedIn', value: '45%' },
                  { name: 'Website', value: '30%' },
                  { name: 'Referrals', value: '15%' },
                  { name: 'Others', value: '10%' }
                ].map((source, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-2 hover:bg-neutral-50 rounded transition-colors"
                  >
                    <span className="text-base text-grayColor ">{source.name}</span>
                    <span className="text-base text-grayColor font-bold">{source.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
