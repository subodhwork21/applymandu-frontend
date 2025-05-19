import React from "react";
import Link from "next/link";
import { MapPin, Clock, DollarSign, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplication } from "@/lib/application-context";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";
import { baseFetcher } from "@/lib/fetcher";
import Image from "next/image";

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
  mutate: () => void;
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
  mutate,
}: JobCardProps) => {
  const { openApplicationPanel } = useApplication();
  const { openLoginModal, isEmployer } = useAuth();

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated && !isEmployer) {
      if (job?.is_applied) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this job.",
        });
        return;
      }
      openApplicationPanel(job);
    } else {
      openLoginModal();
    }
  };

  const handleSaveJob = async (id: number, saved: boolean) => {
    const { response, result } = await baseFetcher(saved ? "api/activity/unsave-job/" + id : "api/activity/save-job/" + id, {
      method: "GET",
    })

    if (response?.ok) {
      toast({
        title: "Success",
        description: result?.message,
        variant: "default",
      });
    }
    else {
      toast({
        title: "Error",
        description: result?.message,
        variant: "destructive",
      });
    }
    mutate();

  }

  return (
    <Link href={`/jobs/${id}`}>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-manduBorder/40 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 p-2 bg-white rounded-xl border-b-2 shadow-lg justify-center flex-shrink-0">
            <div className="text-white text-xl">
              <Image
                src={job?.image}
                alt="Company Logo"
                width={48}
                height={48}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium">{title}
                <span className="bg-manduSecondary-opacity opacity-20 text-sm font-medium ml-2  text-white">
                    {
                      jobType
                    }
                </span>
                </h3>
                <p className="text-neutral-600 text-sm">{company}</p>
              </div>
              {job?.saved === true ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveJob(job?.id, job?.saved!);
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <Heart className={`text-blue-500 h-5 w-5`} />
                </Button>
              ) : job?.saved === false ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveJob(job?.id, job?.saved!);
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              ) : null}
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
                {/* <DollarSign className="h-4 w-4" /> */}
                {salary}
              </span>
            </div>
            <div className="mt-auto">
              <Button
                className={`w-full bg-black text-white hover:bg-neutral-800 ${job?.is_applied ? "bg-neutral-300 text-neutral-600 cursor-not-allowed" : ""}`}
                onClick={handleApply}
              >
                {isAuthenticated && !isEmployer
                  ? job?.is_applied
                    ? "Applied"
                    : "Apply Now"
                  : "Sign in to Apply"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
