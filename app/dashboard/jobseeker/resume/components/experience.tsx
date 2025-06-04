"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import  FormInput  from "@/components/fields/input-field"; // Import FormInput
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Updated interface to match the API structure from edit/page.tsx
interface Experience {
  id: number;
  user_id: number;
  position_title: string;
  company_name: string;
  industry: string;
  job_level: string;
  roles_and_responsibilities: string;
  start_date: string | Date;
  end_date: string | Date | null;
  currently_work_here: boolean;
  created_at: string;
  updated_at: string;
}

interface ExperienceProps {
  experiences: Experience[];
  addExperience: () => void;
  removeExperience: (id: number) => void;
  updateExperience: (id: number, field: string, value: any) => void;
  errors?: Record<string, string>; // Add errors prop
}

const Experience: React.FC<ExperienceProps> = ({
  experiences,
  addExperience,
  removeExperience,
  updateExperience,
  errors = {}, // Default to empty object
}) => {
  // Helper function to get error for a specific field
  const getError = (id: number, field: string): string => {
    return errors[`experiences.${id}.${field}`] || '';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-borderLine">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-manduSecondary">Work Experience</h3>
        <Button className="bg-manduSecondary text-white" onClick={addExperience} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-8">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="relative border border-borderLine rounded-lg p-6"
          >
            {experiences.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeExperience(exp.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {/* <Label className="text-sm font-medium pb-2 block">
                  Position Title
                </Label> */}
                <FormInput
                  label="Position Title"
                  required={true}
                  value={exp.position_title}
                  onChange={(e) =>
                    updateExperience(exp.id, "position_title", e.target.value)
                  }
                  placeholder="Enter position title"
                  error={getError(exp.id, "position_title")}
                />
              </div>
              <div className="space-y-2">
                {/* <Label className="text-sm font-medium pb-2 block">
                  Company Name
                </Label> */}
                <FormInput
                  label="Company Name"
                  required={true}
                  value={exp.company_name}
                  onChange={(e) =>
                    updateExperience(exp.id, "company_name", e.target.value)
                  }
                  placeholder="Enter company name"
                  error={getError(exp.id, "company_name")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm text-statsValue font-medium pb-2 block">
                  Industry <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={exp.industry.toLowerCase()}
                  onValueChange={(value) =>
                    updateExperience(exp.id, "industry", value)
                  }
                >
                  <SelectTrigger className={getError(exp.id, "industry") ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="customer service">
                      Customer Service
                    </SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                    <SelectItem value="real estate">Real Estate</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="mining">Mining</SelectItem>
                    <SelectItem value="defense">Defense</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {getError(exp.id, "industry") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getError(exp.id, "industry")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-statsValue font-medium pb-2 block">
                  Job Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={exp.job_level.toLowerCase()}
                  onValueChange={(value) =>
                    updateExperience(exp.id, "job_level", value)
                  }
                >
                  <SelectTrigger className={getError(exp.id, "job_level") ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select job level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Manager</SelectItem>
                  </SelectContent>
                </Select>
                {getError(exp.id, "job_level") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getError(exp.id, "job_level")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium pb-2 block text-statsValue">
                Roles and Responsibilities 
              </Label>
              <Textarea
                value={exp.roles_and_responsibilities}
                onChange={(e) =>
                  updateExperience(
                    exp.id,
                    "roles_and_responsibilities",
                    e.target.value
                  )
                }
                placeholder="Describe your roles and responsibilities"
                className={cn(
                  "h-32",
                  getError(exp.id, "roles_and_responsibilities") ? "border-red-500" : ""
                )}
              />
              {getError(exp.id, "roles_and_responsibilities") && (
                <p className="text-sm text-red-500 mt-1">
                  {getError(exp.id, "roles_and_responsibilities")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block text-statsValue">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !exp.start_date && "text-neutral-500",
                        getError(exp.id, "start_date") && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {exp.start_date
                        ? format(new Date(exp.start_date), "PPP")
                        : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        exp.start_date ? new Date(exp.start_date) : undefined
                      }
                      onSelect={(date) =>
                        updateExperience(exp.id, "start_date", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {getError(exp.id, "start_date") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getError(exp.id, "start_date")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block text-statsValue">
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !exp.end_date && "text-neutral-500",
                        getError(exp.id, "end_date") && !exp.currently_work_here && "border-red-500"
                      )}
                      disabled={exp.currently_work_here}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {exp.end_date
                        ? format(new Date(exp.end_date), "PPP")
                        : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        exp.end_date ? new Date(exp.end_date) : undefined
                      }
                      onSelect={(date) =>
                        updateExperience(exp.id, "end_date", date)
                      }
                      initialFocus
                      disabled={(date) =>
                        exp.start_date ? date < new Date(exp.start_date) : false
                      }
                    />
                  </PopoverContent>
                </Popover>
                {getError(exp.id, "end_date") && !exp.currently_work_here && (
                  <p className="text-sm text-red-500 mt-1">
                    {getError(exp.id, "end_date")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`currentlyWorking-${exp.id}`}
                  defaultChecked={exp.currently_work_here}
                  onCheckedChange={(checked: boolean) => {
                    updateExperience(exp.id, "currently_work_here", checked);
                    if (checked) {
                      updateExperience(exp.id, "end_date", null);
                    }
                  }}
                />
                <Label
                  htmlFor={`currentlyWorking-${exp.id}`}
                  className="text-sm text-manduBorder font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I currently work here
                </Label>
              </div>
              {getError(exp.id, "currently_work_here") && (
                <p className="text-sm text-red-500 mt-1">
                  {getError(exp.id, "currently_work_here")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
