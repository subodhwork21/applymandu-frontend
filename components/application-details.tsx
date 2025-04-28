"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ApplicationDetails = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Application Details</h1>
          <p className="text-neutral-600">Track the progress of your job application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center gap-4 mb-8">
                  <Link href="/dashboard/applications">
                    <Button variant="ghost" className="text-neutral-600 p-2 h-auto">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <h2 className="text-xl font-semibold">Back to Applications</h2>
                </div>
                
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white text-2xl">T</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Senior Frontend Developer</h3>
                      <p className="text-neutral-600 mb-2">TechCorp Nepal</p>
                      <div className="flex space-x-4 text-sm text-neutral-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Applied on Apr 18, 2025
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Kathmandu
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Shortlisted
                  </span>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-medium mb-6">Application Status Timeline</h4>
                    <div className="relative">
                      <div className="absolute left-[17px] top-0 h-full w-[2px] bg-neutral-200"></div>
                      <div className="space-y-8">
                        <div className="relative flex gap-6">
                          <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                            <CheckCircle2 className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <p className="text-neutral-900 font-medium">Application Submitted</p>
                            <p className="text-neutral-500 text-sm">Apr 18, 2025 - 10:30 AM</p>
                            <p className="text-neutral-600 text-sm mt-1">Your application was successfully submitted</p>
                          </div>
                        </div>
                        <div className="relative flex gap-6">
                          <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                            <CheckCircle2 className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <p className="text-neutral-900 font-medium">Application Reviewed</p>
                            <p className="text-neutral-500 text-sm">Apr 19, 2025 - 2:15 PM</p>
                            <p className="text-neutral-600 text-sm mt-1">Your application has been reviewed by the hiring team</p>
                          </div>
                        </div>
                        <div className="relative flex gap-6">
                          <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center z-10">
                            <CheckCircle2 className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <p className="text-neutral-900 font-medium">Shortlisted</p>
                            <p className="text-neutral-500 text-sm">Apr 20, 2025 - 11:45 AM</p>
                            <p className="text-neutral-600 text-sm mt-1">Congratulations! You've been shortlisted for the next round</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Attached Documents</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-neutral-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Resume.pdf</p>
                            <p className="text-xs text-neutral-500">238 KB • PDF</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-neutral-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Cover_Letter.pdf</p>
                            <p className="text-xs text-neutral-500">156 KB • PDF</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-neutral-200">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-6">Other Applications</h3>
                <div className="space-y-6 flex flex-col">
                  <Link href="/dashboard/applications/2">
                    <div className="group p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                          <div className="text-white text-xl">D</div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium group-hover:text-neutral-900">UI/UX Designer</h4>
                          <p className="text-sm text-neutral-600">Design Studio Nepal</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-xs text-neutral-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Applied 3 days ago
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link href="/dashboard/applications/3">
                    <div className="group p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                          <div className="text-white text-xl">W</div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium group-hover:text-neutral-900">Full Stack Developer</h4>
                          <p className="text-sm text-neutral-600">WebSolutions Ltd</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-xs text-neutral-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Applied 5 days ago
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Rejected
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link href="/dashboard/applications/4">
                    <div className="group p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                          <div className="text-white text-xl">I</div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium group-hover:text-neutral-900">Product Designer</h4>
                          <p className="text-sm text-neutral-600">Innovation Hub</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-xs text-neutral-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Applied 1 week ago
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationDetails;