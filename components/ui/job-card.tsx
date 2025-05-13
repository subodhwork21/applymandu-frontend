import React from "react";
import Link from "next/link";
import { MapPin, Clock, DollarSign, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplication } from "@/lib/application-context";
import { useAuth } from "@/lib/auth-context";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  postedTime: string;
  isAuthenticated: boolean;
  job: any;
}

const JobCard = ({
  id,
  title,
  company,
  location,
  jobType,
  salary,
  postedTime,
  isAuthenticated,
  job,
}: JobCardProps) => {
  const { openApplicationPanel } = useApplication();
  const { openLoginModal } = useAuth();

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      openApplicationPanel(
        job,
      ); 
      // openApplicationPanel({
      //   id,
      //   title,
      //   company,
      //   location,
      //   type: jobType,
      //   salary,
      //   postedTime,
      //   shortDescription: "",
      //   fullDescription: "",
      //   skills: [],
      //   featured: false,
      //   closingDate: "",
      //   views: 0,
      //   applications: 0,
      //   requirements: [],
      //   responsibilities: [],
      //   benefits: [],
      // });
    } else {
      openLoginModal();
    }
  };

  return (
    <Link href={`/jobs/${id}`}>
      <div className="bg-white rounded-lg p-6 border border-neutral-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="text-white text-xl">{company[0]}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-neutral-600 text-sm">{company}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-neutral-600"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {jobType}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {salary}
              </span>
            </div>
            <div className="mt-auto">
              <Button
                className="w-full bg-black text-white hover:bg-neutral-800"
                onClick={handleApply}
              >
                {isAuthenticated ? "Apply Now" : "Sign in to Apply"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
