import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AnalyticsHeaderProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (tf: string) => void;
  handleExportData: (format: string) => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  selectedYear,
  setSelectedYear,
  selectedTimeframe,
  setSelectedTimeframe,
  handleExportData,
}) => {
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl text-manduSecondary font-nasalization">
        Advanced Analytics
      </h1>
      <div className="flex md:flex-row flex-col md:items-center items-start gap-2">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedYear.toString()} onValueChange={v => setSelectedYear(parseInt(v))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={selectedYear.toString()} />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => handleExportData('csv')}>
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
