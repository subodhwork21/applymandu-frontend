import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Eye, FileText } from "lucide-react";

const TopJobsTab = ({ data, router }) => (
  <>
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
              {(data?.topPerformingJobs ?? []).map((job, index) => (
                <tr key={job?.id ?? index} className={index !== (data?.topPerformingJobs?.length ?? 0) - 1 ? "border-b" : ""}>
                  <td className="py-3 px-4">
                    <div className="font-medium">{job?.title ?? "Untitled Job"}</div>
                  </td>
                  <td className="py-3 px-4 text-center">{job?.views?.toLocaleString?.() ?? "0"}</td>
                  <td className="py-3 px-4 text-center">{job?.applications?.toLocaleString?.() ?? "0"}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      (job?.conversionRate ?? 0) >= 7 ? "bg-green-100 text-green-800" :
                      (job?.conversionRate ?? 0) >= 5 ? "bg-blue-100 text-blue-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {(job?.conversionRate ?? 0)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router?.push?.(`/dashboard/employer/jobs/${job?.id}`)}
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
      {/* Job Visibility Analysis */}
      <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Job Visibility Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
            {(data?.topPerformingJobs ?? []).slice(0, 3).map((job, index) => (
              <div key={job?.id ?? index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? "bg-yellow-500" :
                      index === 1 ? "bg-gray-400" :
                      "bg-amber-600"
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium ml-2">{job?.title ?? "Untitled Job"}</span>
                  </div>
                  <span className="text-sm text-gray-500">{job?.views?.toLocaleString?.() ?? "0"} views</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      index === 0 ? "bg-yellow-500" :
                      index === 1 ? "bg-gray-400" :
                      "bg-amber-600"
                    }`}
                    style={{ width: `${((job?.views ?? 0) / ((data?.topPerformingJobs?.[0]?.views ?? 1))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">Visibility Insights</h4>
            <p className="text-sm text-gray-700">
              Your top-performing job receives {(data?.topPerformingJobs?.[0]?.views?.toLocaleString?.() ?? "0")} views, 
              which is {(((data?.topPerformingJobs?.[0]?.views ?? 0) / ((data?.topPerformingJobs?.[data?.topPerformingJobs?.length - 1]?.views ?? 1))) * 100).toFixed(0)}% more 
              than your lowest-performing job. Consider applying similar strategies to improve visibility across all postings.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Application Conversion Analysis */}
      <Card className="border-[1px] border-solid border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-manduSecondary flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Application Conversion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
            {(data?.topPerformingJobs ?? []).slice(0, 3).map((job, index) => (
              <div key={job?.id ?? index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? "bg-green-500" :
                      index === 1 ? "bg-blue-500" :
                      "bg-purple-500"
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium ml-2">{job?.title ?? "Untitled Job"}</span>
                  </div>
                  <span className="text-sm text-gray-500">{job?.conversionRate ?? 0}% conversion</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      index === 0 ? "bg-green-500" :
                      index === 1 ? "bg-blue-500" :
                      "bg-purple-500"
                    }`}
                    style={{ width: `${((job?.conversionRate ?? 0) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700 mb-2">Conversion Insights</h4>
            <p className="text-sm text-gray-700">
              Your highest converting job ({[...(data?.topPerformingJobs ?? [])].sort((a, b) => (b?.conversionRate ?? 0) - (a?.conversionRate ?? 0))[0]?.title ?? "Untitled Job"}) 
              has a {[...(data?.topPerformingJobs ?? [])].sort((a, b) => (b?.conversionRate ?? 0) - (a?.conversionRate ?? 0))[0]?.conversionRate ?? 0}% conversion rate. 
              Analyze its job description, requirements, and benefits to understand what attracts quality candidates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
);

export default TopJobsTab;
