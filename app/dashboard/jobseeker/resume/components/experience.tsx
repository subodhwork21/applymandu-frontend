"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {  Experience as Exp } from "@/types/jobseeker-resume";

// interface Experience {
//   id: number;
//   position: string;
//   company: string;
//   industry: string;
//   jobLevel: string;
//   responsibilities: string;
//   startDate: Date | null;
//   endDate: Date | null;
//   currentlyWorking: boolean;
// }

interface ExperienceProps {
  experiences: Exp[];
  addExperience: () => void;
  removeExperience: (id: number) => void;
  updateExperience: (id: number, field: string, value: any) => void;
}

const Experience: React.FC<ExperienceProps> = ({
  experiences,
  addExperience,
  removeExperience,
  updateExperience,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Work Experience</h3>
        <Button onClick={addExperience} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-8">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="relative border border-neutral-200 rounded-lg p-6"
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
                <Label className="text-sm font-medium pb-2 block">
                  Position Title
                </Label>
                <Input
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(exp.id, "position", e.target.value)
                  }
                  placeholder="Enter position title"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Company Name
                </Label>
                <Input
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Industry
                </Label>
                <Select
                  value={exp.industry.toLowerCase()}
                  onValueChange={(value) =>
                    updateExperience(exp.id, "industry", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Job Level
                </Label>
                <Select
                  value={exp.jobLevel.toLowerCase()}
                  onValueChange={(value) =>
                    updateExperience(exp.id, "jobLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium pb-2 block">
                Roles and Responsibilities
              </Label>
              <Textarea
                value={exp.responsibilities}
                onChange={(e) =>
                  updateExperience(exp.id, "responsibilities", e.target.value)
                }
                placeholder="Describe your roles and responsibilities"
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !exp.startDate && "text-neutral-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {exp.startDate
                        ? format(exp.startDate, "PPP")
                        : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={exp.startDate || undefined}
                      onSelect={(date) =>
                        updateExperience(exp.id, "startDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !exp.endDate && "text-neutral-500"
                      )}
                      disabled={exp.currentlyWorking}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {exp.endDate
                        ? format(exp.endDate, "PPP")
                        : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={exp.endDate || undefined}
                      onSelect={(date) =>
                        updateExperience(exp.id, "endDate", date)
                      }
                      initialFocus
                      disabled={(date) =>
                        exp.startDate ? date < exp.startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`currentlyWorking-${exp.id}`}
                  checked={exp.currentlyWorking}
                  onCheckedChange={(checked: boolean) => {
                    updateExperience(exp.id, "currentlyWorking", checked);
                    if (checked) {
                      updateExperience(exp.id, "endDate", null);
                    }
                  }}
                />
                <Label
                  htmlFor={`currentlyWorking-${exp.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I currently work here
                </Label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
