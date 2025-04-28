import React from "react";
import { BuildingIcon } from "./icons";

interface ClosingJobCardProps {
  title: string;
  company: string;
  location: string;
  closingTime: string;
}

const ClosingJobCard = ({
  title,
  company,
  location,
  closingTime,
}: ClosingJobCardProps) => {
  return (
    <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-neutral-200 rounded flex items-center justify-center mr-3 text-white">
          <BuildingIcon />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center text-xs text-neutral-500">
            <span>{company}</span>
            <span className="mx-2">•</span>
            <span>{location}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-800 bg-neutral-200 px-2 py-1 rounded-full">
            {closingTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClosingJobCard;
