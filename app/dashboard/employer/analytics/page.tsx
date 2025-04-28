"use client";

import React, { useState } from 'react';
import { Users, Briefcase, UserCheck, TrendingUp } from 'lucide-react';
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

const data = [
  { name: 'Jan 1', value: 45 },
  { name: 'Jan 5', value: 65 },
  { name: 'Jan 10', value: 55 },
  { name: 'Jan 15', value: 85 },
  { name: 'Jan 20', value: 75 },
  { name: 'Jan 25', value: 90 },
  { name: 'Jan 30', value: 100 },
];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30');

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-600">Total Applications</p>
                    <h3 className="text-2xl mt-2">1,234</h3>
                  </div>
                  <Users className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-xs text-green-600 mt-4">+12% from last month</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-600">Active Jobs</p>
                    <h3 className="text-2xl mt-2">45</h3>
                  </div>
                  <Briefcase className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-xs text-green-600 mt-4">+5 new this week</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-600">Hired Candidates</p>
                    <h3 className="text-2xl mt-2">89</h3>
                  </div>
                  <UserCheck className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-xs text-green-600 mt-4">+8 this month</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">Application Trends</h2>
                <Select 
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 3 Months</SelectItem>
                    <SelectItem value="180">Last 6 Months</SelectItem>
                    <SelectItem value="365">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#000" 
                      strokeWidth={2}
                      dot={{ fill: '#000' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-6">Popular Job Positions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                  <div>
                    <h3 className="text-lg">Frontend Developer</h3>
                    <p className="text-sm text-neutral-600">156 applications</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">45% hire rate</p>
                    <Progress value={45} className="w-32 h-2 mt-2" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                  <div>
                    <h3 className="text-lg">UI/UX Designer</h3>
                    <p className="text-sm text-neutral-600">98 applications</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">38% hire rate</p>
                    <Progress value={38} className="w-32 h-2 mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Quick Insights</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Avg. Time to Hire</span>
                  <span className="text-sm">15 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Interview Rate</span>
                  <span className="text-sm">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Offer Acceptance</span>
                  <span className="text-sm">78%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h2 className="text-xl mb-4">Top Sources</h2>
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
                    <span className="text-sm">{source.name}</span>
                    <span className="text-sm">{source.value}</span>
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