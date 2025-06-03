"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import {
  Search,
  Sliders,
  Plus,
  X,
  Clock,
  DollarSign,
  Heart,
  Minus,
  LucideBriefcase,
  Briefcase,
  HeartIcon,
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
// import { getFeaturedJobs, popularSearches } from "@/lib/constants";
import { useApplication } from "@/lib/application-context";
import useSWR from "swr";
import { Job, JobResponse } from "@/types/job-type";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DataNavigation from "@/components/ui/data-navigation";
import { useAuth } from "@/lib/auth-context";
import { JobSkeletonMax, JobSkeletonMini } from "@/components/ui/job-skeleton";
import { toast } from "@/hooks/use-toast";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import SaveJob from "@/components/saved-job";

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
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { openApplicationPanel } = useApplication();
  const searchParams = useSearchParams();
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(
    searchParams.getAll("employment_type[]") || []
  );

  const {data: popularSearches, isLoading: popularLoading, mutate: popularSearchesMutate} = useSWR<Record<string,any>>("api/job/search", defaultFetcher);




  const [skillsValue, setSkillsValue] = useState<string[]>([]);
  const [skillValue, setSkillValue] = useState<string>(
    searchParams.get("skills") || ""
  );
  //salary min and max

  // const featuredJobs = getFeaturedJobs();

  const router = useRouter();

  let urlSearchParams = new URLSearchParams(searchParams);

  const url = `api/job/latest?${urlSearchParams.toString()}`;


  const {
    data: featuredJobs,
    error: errorFeatured,
    isLoading: featuredLoading,
    mutate: featuredMutate,
  } = useSWR<JobResponse>(
    searchParams.toString() === "" ? "api/job/latest?label=featured" : null,
    defaultFetcher
  );

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
    { value: "Entry Level", label: "Entry Level (0-2 years)" },
    { value: "Mid Level", label: "Mid Level (2-5 years)" },
    { value: "Senior Level", label: "Senior Level (5+ years)" },
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      urlSearchParams.set("search", e.currentTarget.value);
      router.push(`/jobs?${urlSearchParams.toString()}`, {
        scroll: false,
      });
      jobMutate();
    }
  };

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let params = new URLSearchParams(searchParams.toString());

    const newActiveFilters: string[] = [];
    const newActiveKeys: string[] = [];

    const selectedJobTypes = formData.getAll("employment_type");
    if (selectedJobTypes.length > 0) {
      params.delete("employment_type[]");

      selectedJobTypes.forEach((type) => {
        params.append("employment_type[]", type.toString());
        newActiveFilters.push(type.toString());
        newActiveKeys.push("employment_type");
      });
    }
    setSelectedJobTypes([...newActiveFilters]);

    const experienceLevels = formData.getAll("experienceLevel");
    if (experienceLevels.length > 0) {
      params.delete("experience_level[]");
      experienceLevels.forEach((level) => {
        params.append("experience_level[]", level.toString());
        const levelLabel =
          level.toString() === "Entry Level"
            ? "Entry Level"
            : level.toString() === "Mid Level"
            ? "Mid Level"
            : "Senior Level";

        newActiveFilters.push(levelLabel);
        newActiveKeys.push("experience_level");
      });
    }

    const minSalary = formData.get("min-salary");
    const maxSalary = formData.get("max-salary");
    if (minSalary && minSalary.toString().trim() !== "") {
      params.set("salary_min", minSalary.toString());

      if (maxSalary && maxSalary.toString().trim() !== "") {
        params.set("salary_max", maxSalary.toString()); // Add this line
        newActiveFilters.push(`${minSalary}-${maxSalary}`);
        newActiveKeys.push("salary-range");
      } else {
        newActiveFilters.push(`Min ${minSalary}`);
        newActiveKeys.push("salary-min");
      }
    } else if (maxSalary && maxSalary.toString().trim() !== "") {
      params.set("salary_max", maxSalary.toString());
      newActiveFilters.push(`Max ${maxSalary}`);
      newActiveKeys.push("salary-max");
    }

    const location = formData.get("location");
    if (location && location.toString().trim() !== "") {
      params.set("location", location.toString());
      newActiveFilters.push(location.toString());
      newActiveKeys.push("location");
    }

    const isRemote = formData.get("remote");
    if (isRemote) {
      params.set("is_remote", "1");
      newActiveFilters.push("Remote");
      newActiveKeys.push("remote");
    } else {
      params.delete("is_remote");
    }

    const skillsInput = skillsValue;
    if (skillsInput && skillsInput.toString().trim() !== "") {
      params.delete("skills[]");

      // Add each skill
      const skills = skillsInput
        .toString()
        .split(",")
        .map((s) => s.trim());
      skills.forEach((skill) => {
        if (skill) {
          params.append("skills[]", skill);
          newActiveFilters.push(skill);
          newActiveKeys.push("skill");
        }
      });
    }
    setActiveFilters(newActiveFilters);
    setActiveKeys(newActiveKeys);

    router.push(`/jobs?${params.toString()}`, {
      scroll: false,
    });

    setIsFilterOpen(false);

    jobMutate();
  };

  const handlePageChange = (url: string) => {
    const urlObj = new URL(url);
    const queryParams = urlObj.search;

    // Update search params in the URL
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // Remove existing page parameter
    newSearchParams.delete("page");
    // Add new page parameter
    newSearchParams.append("page", urlObj.searchParams.get("page") || "1");

    router.push(`/jobs?${newSearchParams}`, {
      scroll: false,
    });

    // const apiUrl = `api/job/latest${queryParams}`;

    jobMutate();
  };

 const removeFilter = (filterkey: string, filterValue?: string) => {
  const urlSearchParams = new URLSearchParams(searchParams.toString());

  if (filterValue === undefined) {
    urlSearchParams.delete(filterkey);
    setSelectedJobTypes([]);
  } else {
    if (filterkey === "employment_type") {
      const values = urlSearchParams.getAll("employment_type[]");
      urlSearchParams.delete("employment_type[]");
      setSelectedJobTypes([]);
      values.forEach((value) => {
        if (value !== filterValue) {
          urlSearchParams.append("employment_type[]", value);
        }
      });
      setSelectedJobTypes(values.filter((value) => value !== filterValue));
    } else if (filterkey === "experience_level") {
      const values = urlSearchParams.getAll("experience_level[]");
      urlSearchParams.delete("experience_level[]");

      values.forEach((value) => {
        if (value !== filterValue) {
          urlSearchParams.append("experience_level[]", value);
        }
      });
    } else if (filterkey === "salary-range") {
      urlSearchParams.delete("salary_min");
      urlSearchParams.delete("salary_max");
    } else if (filterkey === "salary-min") {
      urlSearchParams.delete("salary_min");
    } else if (filterkey === "salary-max") {
      urlSearchParams.delete("salary_max");
    } else if (filterkey === "location") {
      urlSearchParams.delete("location");
    } else if (filterkey === "remote") {
      urlSearchParams.delete("is_remote");
    } else if (filterkey === "skill") {
      // Fix: Handle skill removal correctly
      const values = urlSearchParams.getAll("skills[]");
      urlSearchParams.delete("skills[]");

      // Add back all values except the one to remove
      values.forEach((value) => {
        if (value !== filterValue) {
          urlSearchParams.append("skills[]", value);
        }
      });
      
      // Also update the skillsValue state
      setSkillsValue(skillsValue.filter(skill => skill !== filterValue));
    } else {
      // For other parameters, just delete and re-add if needed
      urlSearchParams.delete(filterkey);
    }
  }

  // Update the URL using Next.js router
  router.push(`/jobs?${urlSearchParams.toString()}`, {
    scroll: false,
  });

  // Refresh the job data
  jobMutate();
};


  const setSortBy = (value: string) => {
    router.push(`/jobs?sort_by=${value}`, {
      scroll: false,
    });
    jobMutate();
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

    jobMutate();
    featuredMutate();
  };

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
                  <div className="flex-1 relative md:mb-0 mb-4 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
                    <input
                      onKeyDown={(e) => handleSearch(e)}
                      type="text"
                      defaultValue={searchParams.get("search") || ""}
                      placeholder="Search jobs, skills, or companies"
                      className="w-full pl-14 md:pl-16 pr-14 py-3 md:py-3 text-manduCustom-secondary-blue text-base md:text-lg bg-neutral-50 rounded-[50px] border-none focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
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
                    {activeFilters.map((filter, id) => (
                      <div
                        key={id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-base"
                      >
                        <span>{filter}</span>
                        <button
                          onClick={() => {
                            let activeFilterIndex = activeFilters.findIndex(
                              (f) => f === filter
                            );

                            let filterkey = activeKeys[activeFilterIndex];

                            // Update local state first
                            setActiveFilters(
                              activeFilters.filter((f) => f !== filter)
                            );
                            setActiveKeys(
                              activeKeys.filter((_, index) => {
                                return index != activeFilterIndex;
                              })
                            );

                            // Then update the URL parameters
                            removeFilter(filterkey, filter);
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
                          router.push("/jobs", {
                            scroll: false,
                          });
                          setActiveFilters([]);
                          setActiveKeys([]);
                          setSelectedJobTypes([]);
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
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="text-base font-normal text-white">
                      Popular Searches:
                    </span>
                    {popularSearches && popularSearches?.popular_searches?.map((item:{query: string}, id: number) => (
                      <span
                        key={id}
                        onClick={() => {
                          router.push("/jobs?search=" + item?.query, {
                            scroll: false,
                          });

                          jobMutate();
                        }}
                        className="px-4 py-2 md:py-3 md:px-6 bg-white/10 text-white border border-white/20 rounded-full text-sm cursor-pointer"
                      >
                        <Briefcase className="inline-block align-middle h-4 w-4 mr-2 text-white" />
                        {item?.query}
                      </span>
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
                      placeholder="30,000"
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
                      placeholder="150,000"
                      defaultValue={searchParams.get("salary_max") || ""}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Location</h4>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
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
                  onChange={(e) => setSkillValue(e.target.value)}
                  value={skillValue}
                  placeholder="Enter skills separated by commas (e.g. JavaScript, React, Node.js)"
                  defaultValue={searchParams.getAll("skills")?.join(", ") || ""}
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {skillsValue && skillsValue.map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <button onClick={()=>{
                        setSkillsValue(skillsValue.filter((s) => s !== skill));
                      }} type="button" className="hover:text-neutral-300">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                  onClick={()=> {
                    if(skillValue != ""){
                      setSkillsValue([...skillsValue!, skillValue])
                      setSkillValue("")
                    }
                  }}
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
                  router.push("/jobs", {
                    scroll: false,
                  });
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
          <section className="py-8 bg-neutral-100 2xl:px-0 lg:px-12 px-4">
            <div className="container mx-auto px-4">
              <h2 className=" mb-6 text-manduSecondary uppercase font-nasalization font-normal text-3xl">
                Featured Jobs
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredLoading || !featuredJobs?.data ? (
                  <JobSkeletonMax />
                ) : featuredJobs?.data?.length === 0 ? (
                  <div className="text-center text-lg w-full  lg:col-span-2 col-span-1 text-manduSecondary">
                    No featured jobs found
                  </div>
                ) : (
                  featuredJobs?.data?.map((job, index) => (
                    <Link href={`/jobs/${job?.slug}`} key={index}>
                      <div className="bg-white rounded-2xl shadow-lg md:p-6 p-4 border border-manduBorder/40 transition-all duration-200 h-full flex flex-col hover:shadow-l-[4px] hover:shadow-[inset_4px_0_0_0_rgb(0,28,74),inset_0_1px_0_0_rgb(0,28,74),inset_0_-1px_0_0_rgb(0,28,74),inset_-1px_0_0_0_rgb(0,28,74)]">
                        <div className="flex items-start flex-col gap-y-[10px] w-full">
                          <div className="flex items-start gap-x-1 w-full">
                            <div className="w-14 h-14 p-2 bg-white rounded-xl justify-center flex-shrink-0">
                              <div className="text-white text-xl">
                                <Image
                                  src={job?.image || "/logo.png"}
                                  alt="Company Logo"
                                  className="rounded-[6px]"
                                  width={36}
                                  height={36}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold mb-1.5 feat-text text-xl">
                                    {job?.title}
                                    <span className="bg-manduSecondary/10  text-sm  font-medium ml-6 rounded-3xl px-2 py-1  text-manduSecondary capitalize">
                                      {"New"}
                                    </span>
                                  </h3>
                                  <p className="capitalize text-manduCustom-secondary-blue font-medium text-base mb-2.5">
                                    {job?.employer_name}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {job.skills &&
                                      job.skills.map((skill, id) => (
                                        <span
                                          key={id}
                                          className="px-3 py-1 font-semibold bg-grayTag/70  rounded-[10px] text-[9px] capitalize text-manduBorder"
                                        >
                                          {skill?.name}
                                        </span>
                                      ))}
                                  </div>
                                </div>

                                <SaveJob job={job} handleSaveJob={handleSaveJob} />
                              </div>
                              <div className="flex items-center gap-4 text-sm text-neutral-600 mb-1.5">
                                <span className="flex items-center gap-2 capitalize">
                                  <MapPinIcon className="h-4 w-4 text-[#4A5568]" />
                                  {job?.location}
                                </span>
                                <span className="flex items-center gap-2 capitalize">
                                  <ClockIcon className="h-4 w-4 text-[#4A5568]" />
                                  {job?.employment_type}
                                </span>
                              </div>
                              <span className="flex items-center mb-4 text-manduSecondary text-base font-bold">
                                {job?.salary_range?.formatted}
                              </span>
                            </div>
                          </div>
                          <Button
                            className={`w-full bg-manduCustom-secondary-blue text-base font-semibold text-white hover:bg-neutral-800  ${
                              isAuthenticated && !isEmployer
                                ? job.is_applied
                                  ? "bg-manduSecondary hover:bg-manduSecondary/80 text-white font-semibold cursor-not-allowed"
                                  : "bg-manduSecondary hover:bg-manduSecondary/80"
                                : "bg-manduCustom-secondary-blue text-white"
                            }`}
                            onClick={(e) => handleApply(e, job)}
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
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          ""
        )}

        {/* All Jobs Section */}
        <section className="py-8 bg-white 2xl:px-0 lg:px-12 px-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl uppercase text-manduSecondary font-nasalization">
                All Jobs
              </h2>
              <div className="flex items-center gap-4 text-bluePrime">
                {/* <span className="text-sm text-bluePrime">Sort by:</span> */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {isLoading || !jobs?.data ? (
                <JobSkeletonMini count={9} />
              ) : jobs?.data?.length === 0 ? (
                <div className="lg:col-span-3 md:col-span-2 col-span-1 text-center text-lg font-bold">
                  No jobs found
                </div>
              ) : (
                jobs?.data?.map((job: Job, index) => (
                  <Link key={index} href={`/jobs/${job?.slug}`}>
                    <div className="bg-white shadow-2xl rounded-[15px] md:p-6 p-4 border-[2px] border-manduSecondary/40 hover:shadow-[inset_1px_0_0_0_rgb(220,20,60,1),inset_0_1px_0_0_rgb(220,20,60,1),inset_0_-1px_0_0_rgb(220,20,60,1),inset_-1px_0_0_0_rgb(220,20,60,1)]  transition-all duration-200 h-full flex flex-col">
                      <div className="flex items-start gap-1">
                        <div className="w-18 h-18 p-2">
                          <div className="text-sm">
                            <Image
                              src={job?.image ?? "/logo.png"}
                              alt="Company Logo"
                              className="rounded-[4px]"
                              width={52}
                              height={52}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2.5">
                            <div>
                              <h3 className="text-[20px] font-semibold text-manduCustom-secondary-blue">
                                {job.title}
                              </h3>
                              <p className="text-pureGray text-sm">
                                {job.employer_name}
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
                          {/* <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                            {job.description}
                          </p> */}

                          <div className="flex items-center gap-4 text-sm text-grayColor mb-2.5">
                            <span className="flex items-center gap-2 capitalize">
                              <MapPinIcon className="h-4 w-4 text-grayColor" />
                              {job?.location}
                            </span>
                            <span className="flex items-center gap-2 capitalize">
                              <ClockIcon className="h-4 w-4 text-grayColor" />
                              {job?.employment_type}
                            </span>
                            <span className="text-sm text-neutral-500 flex items-center gap-2 capitalize">
                              <CalendarDaysIcon className="h-4 w-4 text-grayColor" />
                              Posted {job.posted_date_formatted}
                            </span>
                          </div>
                          <span className="flex items-center mb-4 text-manduSecondary text-[17px] font-bold">
                            {job?.salary_range?.formatted}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2 mb-0">
                          {job?.skills?.slice(0, 3).map((skill, id) => (
                            <span
                              key={id}
                              className="px-5 py-2 bg-neutral-100 text-manduBorder font-semibold capitalize rounded-full text-sm"
                            >
                              {skill?.name}
                            </span>
                          ))}
                          {job?.skills?.length > 3 && (
                            <span className="px-5 py-2  bg-neutral-100 text-manduBorder font-semibold capitalize rounded-full text-sm">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between w-auto md:w-[200px]">
                          <Button
                            className={`w-full bg-manduCustom-secondary-blue text-base rounded-[8px] font-semibold text-white hover:bg-neutral-800  ${
                              isAuthenticated && !isEmployer
                                ? job.is_applied
                                  ? "bg-manduSecondary hover:bg-manduSecondary/80 text-white font-semibold cursor-not-allowed"
                                  : "bg-manduSecondary hover:bg-manduSecondary/80"
                                : "bg-manduCustom-secondary-blue text-white"
                            }`}
                            onClick={(e) => handleApply(e, job)}
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
