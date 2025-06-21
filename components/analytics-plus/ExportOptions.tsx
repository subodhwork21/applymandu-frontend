import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { employerToken } from "@/lib/tokens";

const ExportOptions = () => {
  const handleExportData = async (format: "csv" | "pdf" | "json") => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/analytics/export`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employerToken()}`,
          },
          body: JSON.stringify({ format }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      // Get filename from Content-Disposition header if present
      const disposition = response.headers.get("Content-Disposition");
      let filename = `analytics-export.${format}`;
      if (disposition && disposition.includes("filename=")) {
        filename = disposition
          .split("filename=")[1]
          .replace(/"/g, "")
          .trim();
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + (err as Error).message);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-manduSecondary/5 to-manduCustom-secondary-blue/5 rounded-lg">
      <h3 className="text-lg font-semibold text-manduSecondary mb-4">Export Analytics Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-auto py-3"
          onClick={() => handleExportData("csv")}
        >
          <Download className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">CSV Format</div>
            <div className="text-xs text-gray-500">For spreadsheet analysis</div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-auto py-3"
          onClick={() => handleExportData("pdf")}
        >
          <Download className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">PDF Report</div>
            <div className="text-xs text-gray-500">For presentations</div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 h-auto py-3"
          onClick={() => handleExportData("json")}
        >
          <Download className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">JSON Format</div>
            <div className="text-xs text-gray-500">For developers</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;
