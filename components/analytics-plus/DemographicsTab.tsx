import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, BarChart4, Clock } from "lucide-react";
import { DonutChart, BarChart } from "@tremor/react";

const DemographicsTab = ({ data }) => (
  <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Applicants by Gender */}
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
            data={data?.applicantDemographics?.byGender ?? []}
            category="value"
            index="name"
            colors={["blue", "pink", "purple"]}
            valueFormatter={(value) => `${value?.toLocaleString?.() ?? "0"} applicants`}
            showAnimation={true}
            showTooltip={true}
          />
        </CardContent>
      </Card>
      {/* Applicants by Age Group */}
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
            data={data?.applicantDemographics?.byAge ?? []}
            index="name"
            categories={["value"]}
            colors={["amber"]}
            valueFormatter={(value) => `${value?.toLocaleString?.() ?? "0"} applicants`}
            showLegend={false}
            showGridLines={true}
            showAnimation={true}
          />
        </CardContent>
      </Card>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Applicants by Education */}
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
            data={data?.applicantDemographics?.byEducation ?? []}
            index="name"
            categories={["value"]}
            colors={["green"]}
            valueFormatter={(value) => `${value?.toLocaleString?.() ?? "0"} applicants`}
            showLegend={false}
            showGridLines={true}
            showAnimation={true}
          />
        </CardContent>
      </Card>
      {/* Applicants by Experience */}
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
            data={data?.applicantDemographics?.byExperience ?? []}
            index="name"
            categories={["value"]}
            colors={["indigo"]}
            valueFormatter={(value) => `${value?.toLocaleString?.() ?? "0"} applicants`}
            showLegend={false}
            showGridLines={true}
            showAnimation={true}
          />
        </CardContent>
      </Card>
    </div>
    {/* Demographic Insights */}
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
              {(data?.applicantDemographics?.byGender?.[0]?.value ?? 0) > (data?.applicantDemographics?.byGender?.[1]?.value ?? 0)
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
  </>
);

export default DemographicsTab;
