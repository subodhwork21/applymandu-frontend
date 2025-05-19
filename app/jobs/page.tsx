"use client";

import React, { Suspense, useState } from "react";
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
  Minus,
  LucideBriefcase,
  Briefcase,
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
import { getFeaturedJobs, popularSearches } from "@/lib/constants";
import { useApplication } from "@/lib/application-context";
import useSWR from "swr";
import { JobResponse } from "@/types/job-type";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DataNavigation from "@/components/ui/data-navigation";
import { useAuth } from "@/lib/auth-context";
import { JobSkeletonMax, JobSkeletonMini } from "@/components/ui/job-skeleton";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <JobsPage />
      </Suspense>
    </>
  );
}

const JobsPage = () => {
  const { isAuthenticated, openLoginModal, isEmployer } = useAuth();

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { openApplicationPanel } = useApplication();
  const searchParams = useSearchParams();
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(
    searchParams.getAll("employment_type[]") || []
  );

  // const featuredJobs = getFeaturedJobs();

  

  const router = useRouter();

  let urlSearchParams = new URLSearchParams(searchParams);

  const url = `api/job/latest?${urlSearchParams.toString()}`;

  const {
    data: featuredJobs,
    error: errorFeatured,
    isLoading: featuredLoading,
    mutate: featuredMutate,
  } = useSWR<JobResponse>("api/job/latest?label=featured", defaultFetcher);

  const {
    data: jobs,
    error,
    isLoading,
    mutate: jobMutate,
  } = useSWR<JobResponse>(url, defaultFetcher);

  const handleApply = (e: React.MouseEvent, job: any) => {
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

  const jobTypes = [
    { id: "full-time", label: "Full-time", value: "Full-time" },
    { id: "part-time", label: "Part-time", value: "Part-time" },
    { id: "contract", label: "Contract", value: "Contract" },
    { id: "internship", label: "Internship", value: "Internship" },
    { id: "remote", label: "Remote", value: "Remote" },
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (2-5 years)" },
    { value: "senior", label: "Senior Level (5+ years)" },
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      urlSearchParams.set("search", e.currentTarget.value);
      // setActiveFilters([
      //   ...activeFilters?.filter((item) => item != searchParams.get("search")),
      //   e?.currentTarget?.value,
      // ]);
      router.push(`/jobs?${urlSearchParams.toString()}`);
      jobMutate();
    }
  };



  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Get form data
    const formData = new FormData(e.currentTarget);

    // Get current search params and update them
  let params = new URLSearchParams(searchParams.toString());


    // Track all active filters
    const newActiveFilters: string[] = [];

    // Job Type filters
    const selectedJobTypes = formData.getAll("employment_type");
    if (selectedJobTypes.length > 0) {
      params.delete("employment_type[]");

      selectedJobTypes.forEach((type) => {
        params.append("employment_type[]", type.toString());
        newActiveFilters.push(type.toString()); 
      });
    }

    const experienceLevels = formData.getAll("experienceLevel");
    if (experienceLevels.length > 0) {
      params.delete("experience_level[]");
      experienceLevels.forEach((level) => {
        params.append("experience_level[]", level.toString());
        const levelLabel = level.toString() === "entry" 
        ? "Entry Level" 
        : level.toString() === "mid" 
          ? "Mid Level" 
          : "Senior Level";
      
      newActiveFilters.push(levelLabel); 
      });
    }

    // Salary Range
    const minSalary = formData.get("min-salary");
    const maxSalary = formData.get("max-salary");
    if (minSalary && minSalary.toString().trim() !== "") {
      params.set("salary_min", minSalary.toString());
      
      if (maxSalary && maxSalary.toString().trim() !== "") {
        // If both min and max are set, add a combined filter
        newActiveFilters.push(`$${minSalary}-$${maxSalary}`);
      } else {
        // If only min is set
        newActiveFilters.push(`Min $${minSalary}`);
      }
    } else if (maxSalary && maxSalary.toString().trim() !== "") {
      // If only max is set
      params.set("salary_max", maxSalary.toString());
      newActiveFilters.push(`Max $${maxSalary}`);
    }

    // Location
    const location = formData.get("location");
    if (location && location.toString().trim() !== "") {
      params.set("location", location.toString());
      newActiveFilters.push(location.toString());
    }

    // Remote work
    const isRemote = formData.get("remote");
    if (isRemote) {
      params.set("is_remote", "1");
      newActiveFilters.push("Remote");
    } else {
      params.delete("is_remote");
    }

    // Skills - assuming skills are submitted as comma-separated values
    const skillsInput = formData.get("skills");
    if (skillsInput && skillsInput.toString().trim() !== "") {
      params.delete("skills");

      // Add each skill
      const skills = skillsInput
        .toString()
        .split(",")
        .map((s) => s.trim());
      skills.forEach((skill) => {
        if (skill) {
          params.append("skills", skill);
          newActiveFilters.push(skill); 
        }
      });
    }
    setActiveFilters(newActiveFilters);
    router.push(`/jobs?${params.toString()}`);

    setIsFilterOpen(false);

    jobMutate();
  };

  const handlePageChange = (url: string) => {
    const urlObj = new URL(url);
    const queryParams = urlObj.search;

    router.push(`/jobs${queryParams}`);

    const apiUrl = `api/job/latest${queryParams}`;

    jobMutate();

    // window.scrollTo({
    //   top: 200,
    //   behavior: 'smooth'
    // });
  };

  //sort by recent, and salary

  const setSortBy = (value: string) => {
    router.push(`/jobs?sort_by=${value}`);
    jobMutate();
  };


  const handleSaveJob = async (id: number, saved: boolean) =>{
    const {response, result} = await baseFetcher(saved ? "api/activity/unsave-job/"+id  : "api/activity/save-job/"+id, {
      method: "GET",
    })

    if(response?.ok){
      toast({
        title: "Success",
        description: result?.message,
        variant: "default", 
      });
    }
      else{
      toast({
        title: "Error",
        description: result?.message,
        variant: "destructive", 
      });
    }

    jobMutate();
    featuredMutate();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        {/* Search and Filter Section */}
        <section className="bg-white border-b border-neutral-200 py-20 bg-[url('/pattern.jpg')] bg-contain bg-center relative">
         <div className="absolute inset-0 bg-gradient-to-r from-[#000389] to-[#001C4A] opacity-90"></div>
           <div className="relative z-10 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-normal font-nasalization">
                Find Your Next Career Move
              </h2>
              <p className="text-manduTertiary text-sm md:text-xl">
                Discover thousands of job opportunities from top companies
              </p>
            </div>

            <div className="max-w-5xl mx-auto rounded-2xl shadow-lg p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-x-4 justify-start items-center rounded-[50px] shadow-sm md:bg-white p-x-[2px] p-y-[2px]">
                {/* <div className="relative mb-6 flex gap-4"> */}
                  <div className="flex-1 relative md:mb-0 mb-4">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
                    <input
                      onKeyDown={(e) => handleSearch(e)}
                      type="text"
                      defaultValue={searchParams.get("search") || ""}
                      placeholder="Search jobs, skills, or companies"
                      className="w-full pl-14 md:pl-16 pr-14 py-3 md:py-3 text-manduPrimary text-base md:text-lg bg-neutral-50 rounded-[50px] border-none focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
                    />
                  </div>
                  <Button
                    className="bg-manduSecondary mr-2 rounded-[50px] text-white px-8 md:px-6 py-2 md:py-2 text-base md:text-lg md:font-[600] hover:bg-neutral-800 transition-colors whitespace-nowrap"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <Sliders className="h-4 w-4 mr-4" />
                    <span>Filters</span>
                  </Button>
                {/* </div> */}
                </div>


                <div className="mt-4">

                <div className="flex flex-wrap gap-2 mb-6">
                  {activeFilters.map((filter) => (
                    <div
                      key={filter}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-base"
                    >
                      <span>{filter}</span>
                      <button
                        onClick={() => {
                          setActiveFilters(
                            
                            activeFilters.filter((f) => f !== filter)
                          );
                          // removeSpecificParam({ value: filter }, jobMutate, params, router);
                        
                        }}
                        className="hover:text-neutral-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {activeFilters.length != 0 && (
                    <button
                      onClick={() => {
                        router.push("/jobs");
                        setActiveFilters([]);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-full text-base hover:bg-red-200"
                    >
                      <Minus className="h-4 w-4" />
                      <span>Clear Filter</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-normal text-white">
                    Popular Searches:
                  </span>
                  {popularSearches.map((search) => (
                    <>
                    <span
                    onClick={()=> {
                      router.push("/jobs?search="+search)

                      jobMutate();
                    }
                    }
                      key={search}
                      className="px-4 py-2 md:py-3 md:px-6 bg-white/10 text-white border border-white/20 rounded-full text-sm cursor-pointer"
                    >
                       <Briefcase className="inline-block align-middle h-4 w-4 mr-2 text-white" />
                      {search}
                    </span>
                    </>
                  ))}
                </div>
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

            <form onSubmit={handleFilter} className="py-4" id="filter-form">
              {/* Job Type */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Job Type</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {jobTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center space-x-2 border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50"
                    >
                      <Checkbox
                        id={type.id}
                        name="employment_type"
                        value={type.value}
                        checked={selectedJobTypes.includes(type.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedJobTypes((prev) => [
                              ...prev,
                              type.value,
                            ]);
                          } else {
                            setSelectedJobTypes((prev) =>
                              prev.filter((t) => t !== type.value)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={type.id}>{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Experience Level</h4>
                <RadioGroup
                  defaultValue={searchParams.get("experience_level[]") ?? ""}
                  name="experienceLevel"
                >
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
                      name="min-salary"
                      placeholder="$30,000"
                      defaultValue={searchParams.get("salary_min") || ""}
                    />
                  </div>
                  <span className="text-neutral-500">to</span>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="max-salary">Maximum</Label>
                    <Input
                      id="max-salary"
                      type="number"
                      name="max-salary"
                      placeholder="$150,000"
                      defaultValue={searchParams.get("salary_max") || ""}
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
                    name="location"
                    placeholder="City, State, or Country"
                    className="pl-10"
                    defaultValue={searchParams.get("location") || ""}
                  />
                </div>
              </div>

              {/* Remote Work Option */}
              <div className="mb-8">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    name="remote"
                    defaultChecked={searchParams.get("is_remote") === "1"}
                  />
                  <Label htmlFor="remote">Remote Only</Label>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Skills</h4>
                <Input
                  name="skills"
                  placeholder="Enter skills separated by commas (e.g. JavaScript, React, Node.js)"
                  defaultValue={searchParams.getAll("skills")?.join(", ") || ""}
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {["JavaScript", "React", "Node.js"].map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <button type="button" className="hover:text-neutral-300">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm hover:bg-neutral-200"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </div>
            </form>

            <DialogFooter className="flex gap-4 sm:gap-0">
              <Button
                onClick={() => {
                  router.push("/jobs");
                  setIsFilterOpen(false);
                  setActiveFilters([]);
                }}
                variant="outline"
                className="flex-1"
              >
                Reset All
              </Button>
              <Button form="filter-form" type="submit" className="flex-1">
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Featured Jobs Section */}
        {searchParams.toString() === "" ? (
          <section className="py-8 bg-neutral-100">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl mb-6">Featured Jobs</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredLoading || !featuredJobs?.data ? (
                  <JobSkeletonMax />
                ) : featuredJobs?.data?.length === 0 ? (
                  <div className="text-center text-lg lg:col-span-2 col-span-1">
                    No featured jobs found
                  </div>
                ) : (
                  featuredJobs?.data?.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-white rounded-lg border-b-2 shadow-lg flex items-center justify-center">
                            <div className="text-white text-2xl">
                              <Image
                                src={job?.image}
                                alt="Company Logo"
                                width={48}
                                height={48}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl">{job.title}</h3>
                                <p className="text-neutral-600">
                                  {job.employer_name}
                                </p>
                              </div>
                              <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                                Featured
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 my-3">
                              {job.skills &&
                                job.skills.map((skill, id) => (
                                  <span
                                    key={id}
                                    className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
                                  >
                                    {skill?.name}
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
                                  {job.employment_type}
                                </span>
                                <span className="flex items-center gap-1">
                                  {/* <DollarSign className="h-4 w-4" /> */}
                                  {job.salary_range?.formatted}
                                </span>
                              </div>
                            {
                              job?.saved === true ?  <Button
                              onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                handleSaveJob(job?.id, job?.saved!);
                              }}
                                variant="ghost"
                                size="icon"
                                className="text-neutral-400 hover:text-neutral-600"
                              > 
                                <Heart   className={`text-blue-500 h-5 w-5`} />
                              </Button> :
                              job?.saved === false ? 
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
                              </Button> : null
                            }
                            </div>
                            <div className="mt-4">
                              <Button
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800"
                                onClick={(e) => handleApply(e, job)}
                              >
                                {isAuthenticated && !isEmployer
                                  ? job?.is_applied ? "Applied": "Apply Now":
                                  "Sign in to Apply"} 
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          ""
        )}

        {/* All Jobs Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">All Jobs</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-600">Sort by:</span>
                <Select
                  onValueChange={(value) => setSortBy(value)}
                  defaultValue={searchParams.get("sort_by") || "posted_date"}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="posted_date">Most Recent</SelectItem>
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
              {isLoading || !jobs?.data ? (
                <JobSkeletonMini count={9} />
              ) : jobs?.data?.length === 0 ? (
                <div className="lg:col-span-3 md:col-span-2 col-span-1 text-center text-lg font-bold">
                  No jobs found
                </div>
              ) : (
                jobs?.data?.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div className="bg-white rounded-lg p-6 border border-neutral-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 p-2 bg-white rounded-lg border-b-2 shadow-lg justify-center flex-shrink-0">
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
                              <h3 className="text-lg font-medium">
                                {job.title}
                              </h3>
                              <p className="text-neutral-600 text-sm">
                                {job.employer_name}
                              </p>
                            </div>
                            {
                              job?.saved === true ?  <Button
                              onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                handleSaveJob(job?.id, job?.saved!);
                              }}
                                variant="ghost"
                                size="icon"
                                className="text-neutral-400 hover:text-neutral-600"
                              > 
                                <Heart   className={`text-blue-500 h-5 w-5`} />
                              </Button> :
                              job?.saved === false ? 
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
                              </Button> : null
                            }
                           
                          </div>
                          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.slice(0, 3).map((skill, id) => (
                              <span
                                key={id}
                                className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                              >
                                {skill?.name}
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
                            {/* <DollarSign className="h-4 w-4" /> */}
                            {job.salary_range?.formatted}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">
                            Posted {job.posted_date_formatted}
                          </span>
                          <Button
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800"
                            onClick={(e) => handleApply(e, job)}
                          >
                             {isAuthenticated && !isEmployer
                                  ? job?.is_applied ? "Applied": "Apply Now":
                                  "Sign in to Apply"} 
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-8">
              <DataNavigation
                meta={jobs?.meta!}
                onPageChange={handlePageChange}
                className="justify-center"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
