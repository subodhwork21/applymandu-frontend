import React from "react";
import Link from "next/link";
import { DollarSign, CheckCircle, HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplication } from "@/lib/application-context";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";
import { baseFetcher } from "@/lib/fetcher";
import Image from "next/image";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
// import {HeartIcon } from 'lucide-solid';

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
    const { response, result } = await baseFetcher(
      saved ? "api/activity/unsave-job/" + id : "api/activity/save-job/" + id,
      {
        method: "GET",
      }
    );

    if (response?.ok) {
      toast({
        title: "Success",
        description: result?.message,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: result?.message,
        variant: "destructive",
      });
    }
    mutate();
  };

  return (
    <Link href={`/jobs/${job?.slug}`}>
      <div className="bg-[#F5F5F5]/40 rounded-2xl border-manduBorder/40 h-full flex flex-col border border-gray-200 p-6 shadow-none transition-all hover:shadow-[inset_4px_0_0_0_rgb(0,28,74),inset_0_1px_0_0_rgb(0,28,74),inset_0_-1px_0_0_rgb(0,28,74),inset_-1px_0_0_0_rgb(0,28,74)]">
        <div className="flex items-start flex-col gap-y-[10px] w-full">
          <div className="flex items-start gap-x-1.5 w-full">
            <div className="w-14 h-14 p-2 bg-white rounded-xl justify-center flex-shrink-0">
              <div className="text-white text-xl ">
                <Image
                  src={job?.image || "/logo.png"}
                  alt="Company Logo"
                  width={52}
                  className="rounded-[6.8px] h-[35px] w-[52px]"
                  height={52}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-lg font-semibold feat-text">
                    {title}
                    <span className="bg-manduSecondary/10  text-sm  font-medium ml-3 rounded-3xl px-2 py-1  text-manduSecondary capitalize">
                      {"New"}
                    </span>
                  </h3>
                  <p className="text-base capitalize text-manduCustom-secondary-blue font-medium">
                    {company}
                  </p>
                </div>
                {job?.saved === true ? (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveJob(job?.id, job?.saved!);
                    }}
                    // variant="ghost"
                    size="icon"
                    className="bg-white border border-grayText rounded-full"
                  >
                    <HeartIcon fill="#D1D1D1" size={25} />
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
                    className="border shadow-sm border-grayText rounded-full"
                  >
                    <HeartIcon size={20} />
                  </Button>
                ) : null}
              </div>
              <div className="flex items-center justify-start gap-4 text-sm text-neutral-600 mb-1">
                <span className="flex items-center gap-2 capitalize">
                  <MapPinIcon className="h-4 w-4 text-[#4A5568]" />
                  {location}
                </span>
                <span className="flex items-center gap-2 capitalize">
                  <ClockIcon className="h-4 w-4 text-[#4A5568]" />
                  {jobType}
                </span>
              </div>
              <span className="flex items-center mb-4 text-manduSecondary text-[17px] font-bold">
                {salary}
              </span>
            </div>
          </div>
          <Button
            className={`w-full bg-manduCustom-secondary-blue text-white ${
              isAuthenticated && !isEmployer
                ? job.is_applied
                  ? "bg-manduSecondary text-white font-semibold cursor-not-allowed hover:bg-manduSecondary/80"
                  : "bg-manduSecondary hover:bg-manduSecondary/80"
                : "bg-manduCustom-secondary-blue text-white"
            }`}
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
    </Link>
  );
};

export default JobCard;
