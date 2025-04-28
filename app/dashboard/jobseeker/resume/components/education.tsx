"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Education {
  id: number;
  degree: string;
  subject: string;
  institution: string;
  university: string;
  gradingType: string;
  joinedYear: Date | null;
  passedYear: Date | null;
  currentlyStudying: boolean;
}

interface EducationProps {
  educations: Education[];
  addEducation: () => void;
  removeEducation: (id: number) => void;
  updateEducation: (id: number, field: string, value: any) => void;
}

const Education: React.FC<EducationProps> = ({
  educations,
  addEducation,
  removeEducation,
  updateEducation,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Education</h3>
        <Button onClick={addEducation} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div className="space-y-8">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="relative border border-neutral-200 rounded-lg p-6"
          >
            {educations.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeEducation(edu.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">Degree</Label>
                <Select
                  value={edu.degree.toLowerCase()}
                  onValueChange={(value) =>
                    updateEducation(edu.id, "degree", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor's degree">
                      Bachelors Degree
                    </SelectItem>
                    <SelectItem value="master's degree">
                      Masters Degree
                    </SelectItem>
                    <SelectItem value="phd">Ph.D.</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="highschool">High School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Subject/Major
                </Label>
                <Input
                  value={edu.subject}
                  onChange={(e) =>
                    updateEducation(edu.id, "subject", e.target.value)
                  }
                  placeholder="Enter subject or major"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Institution
                </Label>
                <Input
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, "institution", e.target.value)
                  }
                  placeholder="Enter institution name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  University/Board
                </Label>
                <Input
                  value={edu.university}
                  onChange={(e) =>
                    updateEducation(edu.id, "university", e.target.value)
                  }
                  placeholder="Enter university or board name"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium pb-2 block">
                Grading Type
              </Label>
              <Select
                value={edu.gradingType}
                onValueChange={(value) =>
                  updateEducation(edu.id, "gradingType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grading type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpa">GPA</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="division">Division</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Joined Year
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !edu.joinedYear && "text-neutral-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {edu.joinedYear
                        ? format(edu.joinedYear, "PPP")
                        : "Select joined year"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={edu.joinedYear || undefined}
                      onSelect={(date) =>
                        updateEducation(edu.id, "joinedYear", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Passed Year
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !edu.passedYear && "text-neutral-500"
                      )}
                      disabled={edu.currentlyStudying}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {edu.passedYear
                        ? format(edu.passedYear, "PPP")
                        : "Select passed year"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={edu.passedYear || undefined}
                      onSelect={(date) =>
                        updateEducation(edu.id, "passedYear", date)
                      }
                      initialFocus
                      disabled={(date) =>
                        edu.joinedYear ? date < edu.joinedYear : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`currentlyStudying-${edu.id}`}
                  checked={edu.currentlyStudying}
                  onCheckedChange={(checked: boolean) => {
                    updateEducation(edu.id, "currentlyStudying", checked);
                    if (checked) {
                      updateEducation(edu.id, "passedYear", null);
                    }
                  }}
                />
                <Label
                  htmlFor={`currentlyStudying-${edu.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I am currently studying here
                </Label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
