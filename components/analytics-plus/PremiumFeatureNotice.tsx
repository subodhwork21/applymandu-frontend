import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

const PremiumFeatureNotice = ({ router }) => (
  <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-start">
      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
        <TrendingUp className="h-6 w-6 text-blue-600" />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-manduSecondary">Premium Analytics Feature</h3>
        <p className="text-sm text-gray-600 mt-1">
          You're enjoying our premium analytics as part of your subscription. Access detailed insights about your job postings, 
          applicant demographics, and hiring performance to make data-driven decisions.
        </p>
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
            onClick={() => router.push('/dashboard/employer/api-access')}
          >
            Explore API Access
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default PremiumFeatureNotice;
