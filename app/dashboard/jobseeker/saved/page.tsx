"use client";

import React, { useState, useMemo } from "react";
import { MapPin, Clock, DollarSign, Heart, MoreVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApplication } from "@/lib/application-context";

const savedJobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "CloudTech Solutions",
    location: "Remote",
    type: "Full-time",
    salary: "$90K - $120K",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "Senior Product Designer",
    company: "InnovateTech Inc.",
    location: "Kathmandu",
    type: "Full-time",
    salary: "$85K - $110K",
    tags: ["Product Strategy", "Agile", "Leadership"],
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "Growth Nexus",
    location: "Pokhara",
    type: "Full-time",
    salary: "$60K - $85K",
    tags: ["Digital Marketing", "SEO", "Analytics"],
  },
];

const SavedJobsPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { openApplicationPanel } = useApplication();

  const filteredJobs = useMemo(() => {
    return savedJobs
      .filter((job) => {
        if (filter === "all") return true;
        return job.type.toLowerCase() === filter.toLowerCase();
      })
      .filter((job) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower)
        );
      });
  }, [filter, search]);

  const handleRemove = (id: number) => {
    console.log("Remove job:", id);
  };

  const handleApply = (e: React.MouseEvent, job: any) => {
    e.preventDefault();
    openApplicationPanel(job);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Saved Jobs</h1>
          <p className="text-neutral-600">
            Review and apply to your bookmarked positions
          </p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Saved Jobs</h2>
              <div className="flex space-x-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[200px]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-3 p-8 text-center text-neutral-600">
                No saved jobs found matching your criteria
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-neutral-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                      <div className="text-white text-xl">{job.company[0]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h3 className="text-lg font-medium truncate">
                            {job.title}
                          </h3>
                          <p className="text-neutral-600 truncate">
                            {job.company}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[200px]"
                          >
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemove(job.id)}
                              className="text-red-600"
                            >
                              Remove from Saved
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap gap-2 my-3">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-neutral-600">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          className="w-full bg-black text-white hover:bg-neutral-800"
                          onClick={(e) => handleApply(e, job)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">
                Showing {filteredJobs.length} of {savedJobs.length} saved jobs
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavedJobsPage;
