import React from "react";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Eye, FileText, Users, Briefcase, TrendingUp, PieChart, BarChart4, MapPin, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { AreaChart, DonutChart, BarChart } from "@tremor/react";

const OverviewTab = ({ data }) => (
  <>
    {/* Overview Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Job Views */}
      <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grayColor">Total Job Views</p>
              <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                {data?.overview?.totalViews?.toLocaleString()}
              </h3>
              <p
                className={`text-xs mt-1 flex items-center ${
                  data?.overview?.viewsChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data?.overview?.viewsChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data?.overview?.viewsChange)}% from last period
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Total Applications */}
      <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grayColor">Total Applications</p>
              <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                {data?.overview?.totalApplications?.toLocaleString()}
              </h3>
              <p
                className={`text-xs mt-1 flex items-center ${
                  data?.overview?.applicationsChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data?.overview?.applicationsChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data?.overview?.applicationsChange)}% from last period
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Total Hires */}
      <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grayColor">Total Hires</p>
              <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                {data?.overview?.totalHires?.toLocaleString()}
              </h3>
              <p
                className={`text-xs mt-1 flex items-center ${
                  data?.overview?.hiresChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data?.overview?.hiresChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data?.overview?.hiresChange)}% from last period
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Active Job Postings */}
      <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grayColor">Active Job Postings</p>
              <h3 className="text-2xl font-bold text-manduSecondary mt-1">
                {data?.overview?.totalJobPostings?.toLocaleString()}
              </h3>
              <p
                className={`text-xs mt-1 flex items-center ${
                  data?.overview?.jobPostingsChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data?.overview?.jobPostingsChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data?.overview?.jobPostingsChange)}% from last period
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Application Trends & Applications by Job Type */}
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
            data={data?.applicationTrends?.byMonth}
            index="date"
            categories={["applications", "views"]}
            colors={["purple", "blue"]}
            valueFormatter={(value) => `${value?.toLocaleString?.()}`}
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
            data={data?.applicationTrends?.byJobType}
            category="value"
            index="name"
            colors={["blue", "violet", "amber", "emerald"]}
            valueFormatter={(value) => `${value?.toLocaleString?.()} applications`}
            showAnimation={true}
            showTooltip={true}
          />
        </CardContent>
      </Card>
    </div>

    {/* Performance Metrics & Applications by Location */}
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
            {/* Conversion Rate */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p
                  className={`text-xs flex items-center ${
                    data?.performanceMetrics?.conversionRateChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {data?.performanceMetrics?.conversionRateChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(data?.performanceMetrics?.conversionRateChange)}%
                </p>
              </div>
              <h4 className="text-2xl font-bold text-manduSecondary">
                {data?.performanceMetrics?.conversionRate}%
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Views to applications
              </p>
            </div>
            {/* Time to Hire */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Time to Hire</p>
                <p
                  className={`text-xs flex items-center ${
                    data?.performanceMetrics?.timeToHireChange <= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {data?.performanceMetrics?.timeToHireChange <= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(data?.performanceMetrics?.timeToHireChange)}%
                </p>
              </div>
              <h4 className="text-2xl font-bold text-manduSecondary">
                {data?.performanceMetrics?.averageTimeToHire} days
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Average hiring time
              </p>
            </div>
            {/* Completion Rate */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p
                  className={`text-xs flex items-center ${
                    data?.performanceMetrics?.completionRateChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {data?.performanceMetrics?.completionRateChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(data?.performanceMetrics?.completionRateChange)}%
                </p>
              </div>
              <h4 className="text-2xl font-bold text-manduSecondary">
                {data?.performanceMetrics?.applicationCompletionRate}%
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Application completion
              </p>
            </div>
            {/* Quality Score */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Quality Score</p>
                <p
                  className={`text-xs flex items-center ${
                    data?.performanceMetrics?.qualityScoreChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {data?.performanceMetrics?.qualityScoreChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(data?.performanceMetrics?.qualityScoreChange)}
                </p>
              </div>
              <h4 className="text-2xl font-bold text-manduSecondary">
                {data?.performanceMetrics?.applicantQualityScore}/10
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Avg. applicant quality
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Applications by Location */}
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
            data={data?.applicationTrends?.byLocation}
            index="name"
            categories={["value"]}
            colors={["blue"]}
            valueFormatter={(value) => `${value?.toLocaleString?.()} applications`}
            showLegend={false}
            showGridLines={true}
            showAnimation={true}
          />
        </CardContent>
      </Card>
    </div>
  </>
);

export default OverviewTab;
