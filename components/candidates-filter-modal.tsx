"use client";

import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface CandidatesFilterModalProps {
  isOpen: boolean;
  mutate: () => void;
  onClose: () => void;
}

interface FilterState {
  experience_level: string[];
  skills: string[];
  location: string;
  availability: string[];
  min_salary: string;
  max_salary: string;
}

const CandidatesFilterModal = ({
  isOpen,
  mutate,
  onClose,
}: CandidatesFilterModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    experience_level: [],
    skills: [],
    location: "",
    availability: [],
    min_salary: "",
    max_salary: "",
  });
  
  const [currentSkill, setCurrentSkill] = useState("");


  // Handle experience level checkbox changes
  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    setFilters(prev => {
      if (checked) {
        return {
          ...prev,
          experience_level: [...prev.experience_level, level]
        };
      } else {
        return {
          ...prev,
          experience_level: prev.experience_level.filter(l => l !== level)
        };
      }
    });
  };

  // Handle availability checkbox changes
  const handleAvailabilityChange = (option: string, checked: boolean) => {
    setFilters(prev => {
      if (checked) {
        return {
          ...prev,
          availability: [...prev.availability, option]
        };
      } else {
        return {
          ...prev,
          availability: prev.availability.filter(o => o !== option)
        };
      }
    });
  };

  // Handle location change
  const handleLocationChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      location: value
    }));
  };

  // Handle salary range changes
  const handleSalaryChange = (field: 'min_salary' | 'max_salary', value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding a skill
  const handleAddSkill = () => {
    if (currentSkill.trim() && !filters.skills.includes(currentSkill.trim())) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill("");
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };


  useEffect(() => {
  if (isOpen) {
    const urlParams = new URLSearchParams(searchParams);
    
    // Get experience levels - handle both single value and array
    const experienceLevels = urlParams.getAll("experience_level[]") || urlParams.getAll("experience_level");
    
    // Get skills - handle both single value and array
    const skills = urlParams.getAll("skills[]") || urlParams.getAll("skills");
    
    // Get location
    const location = urlParams.get("location") || "";
    
    // Get availability options
    const availability = urlParams.getAll("availability[]") || urlParams.getAll("availability");
    
    // Get salary range
    const minSalary = urlParams.get("min_salary") || "";
    const maxSalary = urlParams.get("max_salary") || "";
    
    setFilters({
      experience_level: experienceLevels,
      skills: skills,
      location: location,
      availability: availability,
      min_salary: minSalary,
      max_salary: maxSalary,
    });
  }
}, [isOpen, searchParams]);


 const buildFilterUrl = () => {
  const params = new URLSearchParams(searchParams);
  
  params.delete("experience_level[]");
  params.delete("experience_level");
  params.delete("skills[]");
  params.delete("skills");
  params.delete("location");
  params.delete("availability[]");
  params.delete("min_salary");
  params.delete("max_salary");
  
  // Add experience levels as multiple parameters with the same name
  filters.experience_level.forEach(level => {
    params.append("experience_level[]", level);
  });
  
  // Add skills as multiple parameters with the same name
  filters.skills.forEach(skill => {
    params.append("skills[]", skill);
  });
  
  // Add location if not empty
  if (filters.location && filters.location !== "all") {
    params.set("location", filters.location);
  }
  
  filters.availability.forEach(option => {
    params.append("availability[]", option);
  });
  
  // Add salary range if not empty
  if (filters.min_salary) {
    params.set("min_salary", filters.min_salary);
  }
  
  if (filters.max_salary) {
    params.set("max_salary", filters.max_salary);
  }
  
  return params.toString();
};

  // Reset all filters
  const handleReset = () => {
    // Keep any search parameter that might exist
    const search = searchParams.get("search");
    let url = "/dashboard/employer/candidates";
    
    if (search) {
      url += `?search=${search}`;
    }
    
    router.push(url);
    setFilters({
      experience_level: [],
      skills: [],
      location: "",
      availability: [],
      min_salary: "",
      max_salary: "",
    });
    onClose();
  };

  // Apply filters
  const handleApply = () => {
    const filterUrl = buildFilterUrl();
    
    // Keep any search parameter
    const currentUrl = new URL(window.location.href);
    const search = currentUrl.searchParams.get("search");
    
    let url = `/dashboard/employer/candidates?${filterUrl}`;
    
    // Add search parameter if it exists
    if (search && !filterUrl.includes("search=")) {
      url = filterUrl ? `${url}&search=${search}` : `${url}search=${search}`;
    }
    
    router.push(url);
    mutate();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-manduSecondary font-semibold">Filter Candidates</h2>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <Label className="text-manduCustom-secondary-blue/80">Experience Level</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="entry" 
                  checked={filters.experience_level.includes("entry")}
                  onCheckedChange={(checked) => 
                    handleExperienceLevelChange("entry", checked as boolean)
                  }
                />
                <Label className="text-manduCustom-secondary-blue/80" htmlFor="entry">Entry Level (0-2 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mid" 
                  checked={filters.experience_level.includes("mid")}
                  onCheckedChange={(checked) => 
                    handleExperienceLevelChange("mid", checked as boolean)
                  }
                />
                <Label className="text-manduCustom-secondary-blue/80" htmlFor="mid">Mid Level (2-5 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="senior" 
                  checked={filters.experience_level.includes("senior")}
                  onCheckedChange={(checked) => 
                    handleExperienceLevelChange("senior", checked as boolean)
                  }
                />
                <Label className="text-manduCustom-secondary-blue/80" htmlFor="senior">Senior Level (5+ years)</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-manduCustom-secondary-blue/80">Skills</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add skills"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button variant="outline" onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-manduCustom-secondary-blue text-white rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-manduNeutral"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-manduCustom-secondary-blue/80">Location</Label>
            <Select 
              value={filters.location} 
              onValueChange={handleLocationChange}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent className="text-manduCustom-secondary-blue/80">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="kathmandu">Kathmandu</SelectItem>
                <SelectItem value="pokhara">Pokhara</SelectItem>
                <SelectItem value="lalitpur">Lalitpur</SelectItem>
                <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                <SelectItem value="biratnagar">Biratnagar</SelectItem>
                <SelectItem value="birgunj">Birgunj</SelectItem>
                <SelectItem value="dharan">Dharan</SelectItem>
                <SelectItem value="nepalgunj">Nepalgunj</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-manduCustom-secondary-blue/80">Availability</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="available-now" 
                  checked={filters.availability.includes("now")}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange("now", checked as boolean)
                  }
                />
                <Label className="text-manduCustom-secondary-blue/80" htmlFor="available-now">Available Now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="available-2weeks" 
                  checked={filters.availability.includes("two_weeks")}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange("two_weeks", checked as boolean)
                  }
                />
                <Label className="text-manduCustom-secondary-blue/80" htmlFor="available-2weeks">Available in 2 weeks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="available-1month" 
                  checked={filters.availability.includes("one_month")}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange("one_month", checked as boolean)
                  }
                />
                <Label className="text-manduCustom-secondary-blue/80" htmlFor="available-1month">Available in 1 month</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-manduCustom-secondary-blue/80">Salary Range (NPR)</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input 
                type="number" 
                placeholder="Min" 
                className="text-manduCustom-secondary-blue/80 border border-manduCustom-secondary-grey"
                value={filters.min_salary}
                onChange={(e) => handleSalaryChange('min_salary', e.target.value)}
              />
              <span className="text-manduCustom-secondary-blue/80">to</span>
              <Input 
                type="number" 
                placeholder="Max" 
                className="text-manduCustom-secondary-blue/80 border border-manduCustom-secondary-grey"
                value={filters.max_salary}
                onChange={(e) => handleSalaryChange('max_salary', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button
            className="bg-black text-white hover:bg-neutral-800"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidatesFilterModal;
