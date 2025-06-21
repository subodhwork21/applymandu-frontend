import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Briefcase, MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, DonutChart, BarChart } from "@tremor/react";

const TrendsTab = ({ data }) => (
  <>
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
      {/* Applications by Job Type */}
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
      {/* Applications by Location */}
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
  </>
);

export default TrendsTab;
