import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart4,
  PieChart,
  TrendingUp,
  Users,
  Briefcase,
} from "lucide-react";
import OverviewTab from "./OverviewTab";
import DemographicsTab from "./DemographicsTab";
import TrendsTab from "./TrendsTab";
import PerformanceTab from "./PerformanceTab";
import TopJobsTab from "./TopJobsTab";

const AnalyticsTabs = ({ activeTab, setActiveTab, data, router }) => (
  <div className="mb-6">
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-5 h-auto mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2 md:col-span-1 col-span-5">
          <BarChart4 className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="demographics" className="flex items-center gap-2 md:col-span-1 col-span-5">
          <Users className="h-4 w-4" />
          Demographics
        </TabsTrigger>
        <TabsTrigger value="trends" className="flex items-center gap-2 md:col-span-1 col-span-5">
          <TrendingUp className="h-4 w-4" />
          Trends
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2 md:col-span-1 col-span-5">
          <PieChart className="h-4 w-4" />
          Performance
        </TabsTrigger>
        <TabsTrigger value="jobs" className="flex items-center gap-2 md:col-span-1 col-span-5">
          <Briefcase className="h-4 w-4" />
          Top Jobs
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <OverviewTab data={data} />
      </TabsContent>
      <TabsContent value="demographics">
        <DemographicsTab data={data} />
      </TabsContent>
      <TabsContent value="trends">
        <TrendsTab data={data} />
      </TabsContent>
      <TabsContent value="performance">
        <PerformanceTab data={data} />
      </TabsContent>
      <TabsContent value="jobs">
        <TopJobsTab data={data} router={router} />
      </TabsContent>
    </Tabs>
  </div>
);

export default AnalyticsTabs;
