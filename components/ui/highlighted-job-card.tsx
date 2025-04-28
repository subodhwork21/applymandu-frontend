import React from "react";
import { BuildingIcon, LocationIcon, ClockIcon, DollarIcon } from "./icons";
import Link from "next/link";

interface HighlightedJobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  postedTime: string;
  description: string;
}

const HighlightedJobCard = ({
  id,
  title,
  company,
  location,
  jobType,
  salary,
  postedTime,
  description,
}: HighlightedJobCardProps) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="w-14 h-14 bg-neutral-200 rounded-md flex items-center justify-center mr-4 text-white">
          <BuildingIcon />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium mb-1">{title}</h3>
              <p className="text-neutral-600 mb-2">{company}</p>
            </div>
            <span className="bg-neutral-200 text-neutral-800 text-xs px-2 py-1 rounded">
              Featured
            </span>
          </div>
          <div className="flex flex-wrap items-center text-sm text-neutral-500 mb-3 gap-y-2">
            <div className="flex items-center mr-4">
              <LocationIcon />
              <span className="ml-1">{location}</span>
            </div>
            <div className="flex items-center mr-4">
              <ClockIcon />
              <span className="ml-1">{jobType}</span>
            </div>
            <div className="flex items-center">
              <DollarIcon />
              <span className="ml-1">{salary}</span>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-4">{description}</p>
          <div className="flex justify-between items-center">
            <Link
              href={`/jobs/${id}`}
              className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-neutral-800 transition-colors"
            >
              Apply Now
            </Link>
            <span className="text-xs text-neutral-500">
              Posted {postedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightedJobCard;
