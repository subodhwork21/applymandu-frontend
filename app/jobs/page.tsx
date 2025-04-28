"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Sliders,
  Plus,
  X,
  MapPin,
  Clock,
  DollarSign,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { jobs, getFeaturedJobs, popularSearches } from "@/lib/constants";
import { useApplication } from "@/lib/application-context";

const JobsPage = () => {
  const [activeFilters] = useState(["Remote", "Full-time", "Senior Level"]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { openApplicationPanel } = useApplication();

  const featuredJobs = getFeaturedJobs();

  const handleApply = (e: React.MouseEvent, job: any) => {
    e.preventDefault();
    openApplicationPanel(job);
  };

  const jobTypes = [
    { id: "full-time", label: "Full-time" },
    { id: "part-time", label: "Part-time" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" },
    { id: "remote", label: "Remote" },
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (2-5 years)" },
    { value: "senior", label: "Senior Level (5+ years)" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        {/* Search and Filter Section */}
        <section className="bg-white border-b border-neutral-200 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Find Your Next Career Move
              </h2>
              <p className="text-neutral-600 text-lg">
                Discover thousands of job opportunities from top companies
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8">
                <div className="relative mb-6 flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search jobs, skills, or companies"
                      className="w-full pl-14 pr-6 py-5 bg-neutral-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-200 text-xl h-[60px]"
                    />
                  </div>
                  <Button
                    className="px-6 bg-black text-white rounded-xl hover:bg-neutral-800 flex items-center gap-2 h-[60px]"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <Sliders className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {activeFilters.map((filter) => (
                    <div
                      key={filter}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-base"
                    >
                      <span>{filter}</span>
                      <button className="hover:text-neutral-300">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full text-base hover:bg-neutral-200">
                    <Plus className="h-4 w-4" />
                    <span>Add Filter</span>
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base text-neutral-600">
                    Popular Searches:
                  </span>
                  {popularSearches.map((search) => (
                    <span
                      key={search}
                      className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full text-base hover:bg-neutral-200 cursor-pointer"
                    >
                      {search}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Modal */}
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Filter Jobs</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              {/* Job Type */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Job Type</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {jobTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center space-x-2 border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50"
                    >
                      <Checkbox id={type.id} />
                      <Label htmlFor={type.id}>{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Experience Level</h4>
                <RadioGroup defaultValue="entry">
                  {experienceLevels.map((level) => (
                    <div
                      key={level.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={level.value} id={level.value} />
                      <Label htmlFor={level.value}>{level.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Salary Range */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Salary Range</h4>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="min-salary">Minimum</Label>
                    <Input
                      id="min-salary"
                      type="number"
                      placeholder="$30,000"
                    />
                  </div>
                  <span className="text-neutral-500">to</span>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="max-salary">Maximum</Label>
                    <Input
                      id="max-salary"
                      type="number"
                      placeholder="$150,000"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Location</h4>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="City, State, or Country"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {["JavaScript", "React", "Node.js"].map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <button className="hover:text-neutral-300">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm hover:bg-neutral-200">
                    <Plus className="h-3 w-3" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-4 sm:gap-0">
              <Button variant="outline" className="flex-1">
                Reset All
              </Button>
              <Button className="flex-1">Apply Filters</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Featured Jobs Section */}
        <section className="py-8 bg-neutral-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl mb-6">Featured Jobs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <div className="text-white text-2xl">
                          {job.company[0]}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl">{job.title}</h3>
                            <p className="text-neutral-600">{job.company}</p>
                          </div>
                          <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                            Featured
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 my-3">
                          {job.tags &&
                            job.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-neutral-400 hover:text-neutral-600"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="mt-4">
                          <Button
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800"
                            onClick={(e) => handleApply(e, job)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Jobs Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">All Jobs</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-600">Sort by:</span>
                <Select defaultValue="recent">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="salary-high">
                      Salary: High to Low
                    </SelectItem>
                    <SelectItem value="salary-low">
                      Salary: Low to High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="bg-white rounded-lg p-6 border border-neutral-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-white text-xl">
                          {job.company[0]}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-medium">{job.title}</h3>
                            <p className="text-neutral-600 text-sm">
                              {job.company}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-neutral-400 hover:text-neutral-600"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                          {job.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex items-center gap-1 text-sm text-neutral-600">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-neutral-600">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">
                          Posted {job.postedTime}
                        </span>
                        <Button
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800"
                          onClick={(e) => handleApply(e, job)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobsPage;
