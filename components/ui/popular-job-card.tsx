import React from "react";
import { BuildingIcon } from "./icons";

interface PopularJobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  applications: string;
}

const PopularJobCard = ({
  title,
  company,
  location,
  salary,
  applications,
}: PopularJobCardProps) => {
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
          <span className="text-sm">{salary}</span>
          <div className="text-xs text-neutral-500">
            {applications} applications
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularJobCard;
