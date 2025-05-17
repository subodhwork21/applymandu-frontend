"use client";

import React from "react";
import Link from "next/link";
import {
  Building,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  BookmarkCheck,
  Calendar,
  ChevronRight,
  Eye,
  Clock,
  User,
  Heart,
  DollarSign,
  Linkedin,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const JobSeekerDashboardSkeleton = () => {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-8 w-48 bg-neutral-200 rounded-md mb-1 animate-pulse"></div>
            <div className="h-5 w-64 bg-neutral-200 rounded-md animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-6 w-24 bg-neutral-200 rounded-md animate-pulse"></div>
                      <div className="h-8 w-8 bg-neutral-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="h-4 w-32 bg-neutral-200 rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="h-7 w-48 bg-neutral-200 rounded-md mb-4 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                    >
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-neutral-200 rounded-md animate-pulse"></div>
                        <div className="h-4 w-24 bg-neutral-200 rounded-md animate-pulse"></div>
                        <div className="h-3 w-20 bg-neutral-200 rounded-md animate-pulse"></div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-200" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity and Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-7 w-36 bg-neutral-200 rounded-md animate-pulse"></div>
                    <div className="h-8 w-16 bg-neutral-200 rounded-md animate-pulse"></div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-neutral-200 rounded-full flex-shrink-0 animate-pulse"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 w-full bg-neutral-200 rounded-md animate-pulse"></div>
                          <div className="h-3 w-16 bg-neutral-200 rounded-md animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Stats */}
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="h-7 w-36 bg-neutral-200 rounded-md mb-6 animate-pulse"></div>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="h-4 w-24 bg-neutral-200 rounded-md animate-pulse"></div>
                          <div className="h-4 w-8 bg-neutral-200 rounded-md animate-pulse"></div>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div
                            className="bg-neutral-300 h-2 rounded-full animate-pulse"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Jobs */}
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="h-7 w-48 bg-neutral-200 rounded-md mb-4 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg border border-neutral-200"
                    >
                      <div className="flex items-start gap-4 p-4">
                        <div className="w-12 h-12 bg-neutral-300 rounded-lg animate-pulse"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="h-6 w-32 bg-neutral-200 rounded-md animate-pulse"></div>
                              <div className="h-4 w-24 bg-neutral-200 rounded-md animate-pulse"></div>
                            </div>
                            <div className="h-8 w-8 bg-neutral-200 rounded-full animate-pulse"></div>
                          </div>
                          <div className="flex flex-wrap gap-2 my-3">
                            {[1, 2, 3].map((j) => (
                              <div
                                key={j}
                                className="h-7 w-16 bg-neutral-200 rounded-md animate-pulse"
                              ></div>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="h-4 w-20 bg-neutral-200 rounded-md animate-pulse"></div>
                            <div className="h-4 w-20 bg-neutral-200 rounded-md animate-pulse"></div>
                            <div className="h-4 w-20 bg-neutral-200 rounded-md animate-pulse"></div>
                          </div>
                          <div className="h-10 w-full bg-neutral-200 rounded-md animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* User Profile */}
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-neutral-300 animate-pulse"></div>
                  <div className="h-6 w-40 bg-neutral-200 rounded-md mx-auto mb-1 animate-pulse"></div>
                  <div className="h-4 w-32 bg-neutral-200 rounded-md mx-auto mt-1 animate-pulse"></div>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="w-5 h-5 bg-neutral-200 rounded-md animate-pulse"></div>
                    <div className="w-5 h-5 bg-neutral-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="h-7 w-40 bg-neutral-200 rounded-md mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-32 bg-neutral-200 rounded-md animate-pulse"></div>
                    <div className="h-4 w-8 bg-neutral-200 rounded-md animate-pulse"></div>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-neutral-300 animate-pulse"
                      style={{ width: "60%" }}
                    />
                  </div>
                  <div className="h-4 w-full bg-neutral-200 rounded-md animate-pulse"></div>
                  <div className="h-10 w-full bg-neutral-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JobSeekerDashboardSkeleton;