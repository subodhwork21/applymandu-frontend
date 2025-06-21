import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

const PerformanceTab = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {/* KPI Metrics */}
    <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Key Performance Indicators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {/* Conversion Rate */}
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
          {/* Average Time to Hire */}
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
          {/* Application Completion Rate */}
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
          {/* Applicant Quality Score */}
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
    {/* Performance Analysis */}
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
);

export default PerformanceTab;
