import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "./ui/icons";
import { MapPin, DollarSign, Users, Clock, Heart } from "lucide-react";
import {
  getPopularJobs,
  getClosingJobs,
  getTimeUntilClosing,
} from "@/lib/constants";
import { Button } from "./ui/button";

const PopularClosingJobs = () => {
  const popularJobs = getPopularJobs();
  const closingJobs = getClosingJobs();

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most Popular */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Most Popular</h2>
              <Link
                href="/jobs/popular"
                className="text-sm flex items-center hover:underline cursor-pointer"
              >
                View all <ArrowRightIcon />
              </Link>
            </div>

            <div className="space-y-4">
              {popularJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-neutral-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xl">
                          {job.company[0]}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{job.title}</h3>
                            <p className="text-neutral-600 text-sm mb-2">
                              {job.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center text-sm text-neutral-600">
                              <Users className="h-4 w-4 mr-1" />
                              {job.applications} applied
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-neutral-400 hover:text-neutral-600"
                            >
                              <Heart className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Closing Soon */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Closing Soon</h2>
              <Link
                href="/jobs/closing"
                className="text-sm flex items-center hover:underline cursor-pointer"
              >
                View all <ArrowRightIcon />
              </Link>
            </div>

            <div className="space-y-4">
              {closingJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-neutral-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xl">
                          {job.company[0]}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{job.title}</h3>
                            <p className="text-neutral-600 text-sm mb-2">
                              {job.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-red-600 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {getTimeUntilClosing(job.closingDate)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-neutral-400 hover:text-neutral-600"
                            >
                              <Heart className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularClosingJobs;
