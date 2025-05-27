"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormInput  from "@/components/fields/input-field";
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
  user_id: number;
  degree: string;
  subject_major: string;
  institution: string;
  university_board: string;
  grading_type: string;
  joined_year: string | Date;
  passed_year: string | Date | null;
  currently_studying: boolean;
  created_at: string;
  updated_at: string;
}

interface EducationProps {
  educations: Education[];
  addEducation: () => void;
  removeEducation: (id: number) => void;
  updateEducation: (id: number, field: string, value: any) => void;
  errors?: Record<string, string>;
}

const Education: React.FC<EducationProps> = ({
  educations,
  addEducation,
  removeEducation,
  updateEducation,
  errors = {},
}) => {
  const getError = (id: number, field: string): string => {
    return errors[`educations.${id}.${field}`] || '';
  };

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
                <Label className="text-sm font-medium pb-2 block">Degree <span className="text-red-500">*</span></Label>
                <Select
                  value={edu.degree}
                  onValueChange={(value) =>
                    updateEducation(edu.id, "degree", value)
                  }
                >
                  <SelectTrigger className={getError(edu.id, "degree") ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelors Degree">
                      Bachelors Degree
                    </SelectItem>
                    <SelectItem value="Masters Degree">
                      Masters Degree
                    </SelectItem>
                    <SelectItem value="PHD">Ph.D.</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                  </SelectContent>
                </Select>
                {getError(edu.id, "degree") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getError(edu.id, "degree")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {/* <Label className="text-sm font-medium pb-2 block">
                  Subject/Major
                </Label> */}
                <FormInput
                  label="Subject/Major"
                  required={true}
                  value={edu.subject_major}
                  onChange={(e) =>
                    updateEducation(edu.id, "subject_major", e.target.value)
                  }
                  placeholder="Enter subject or major"
                  error={getError(edu.id, "subject_major")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                {/* <Label className="text-sm font-medium pb-2 block">
                  Institution
                </Label> */}
                <FormInput
                  label="Institution"
                  required={true}
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, "institution", e.target.value)
                  }
                  placeholder="Enter institution name"
                  error={getError(edu.id, "institution")}
                />
              </div>
              <div className="space-y-2">
                {/* <Label className="text-sm font-medium pb-2 block">
                  University/Board
                </Label> */}
                <FormInput
                  label="University/Board"
                  required={true}
                  value={edu.university_board}
                  onChange={(e) =>
                    updateEducation(edu.id, "university_board", e.target.value)
                  }
                  placeholder="Enter university or board name"
                  error={getError(edu.id, "university_board")}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium pb-2 block">
                Grading Type 
              </Label>
              <Select
                value={edu.grading_type}
                onValueChange={(value) =>
                  updateEducation(edu.id, "grading_type", value)
                }
              >
                <SelectTrigger className={getError(edu.id, "grading_type") ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select grading type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpa">GPA</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="division">Division</SelectItem>
                </SelectContent>
              </Select>
              {getError(edu.id, "grading_type") && (
                <p className="text-sm text-red-500 mt-1">
                  {getError(edu.id, "grading_type")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium pb-2 block">
                  Joined Year <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !edu.joined_year && "text-neutral-500",
                        getError(edu.id, "joined_year") && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {edu.joined_year
                        ? format(
                            typeof edu.joined_year === 'string'
                              ? new Date(edu.joined_year)
                              : edu.joined_year,
                            "PPP"
                          )
                        : "Select joined year"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        edu.joined_year
                          ? typeof edu.joined_year === 'string'
                            ? new Date(edu.joined_year)
                            : edu.joined_year
                          : undefined
                      }
                      onSelect={(date) =>
                        updateEducation(edu.id, "joined_year", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {getError(edu.id, "joined_year") && (
                  <p className="text-sm text-red-500 mt-1">
                    {getError(edu.id, "joined_year")}
                  </p>
                )}
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
                        !edu.passed_year && "text-neutral-500",
                        getError(edu.id, "passed_year") && "border-red-500"
                      )}
                      disabled={edu.currently_studying}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {edu.passed_year
                        ? format(
                            typeof edu.passed_year === 'string'
                              ? new Date(edu.passed_year)
                              : edu.passed_year,
                            "PPP"
                          )
                        : "Select passed year"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        edu.passed_year
                          ? typeof edu.passed_year === 'string'
                            ? new Date(edu.passed_year)
                            : edu.passed_year
                          : undefined
                      }
                      onSelect={(date) =>
                        updateEducation(edu.id, "passed_year", date)
                      }
                      initialFocus
                      disabled={(date) =>
                        edu.joined_year
                          ? date < (
                              typeof edu.joined_year === 'string'
                                ? new Date(edu.joined_year)
                                : edu.joined_year
                            )
                          : false
                      }
                    />
                  </PopoverContent>
                </Popover>
                {getError(edu.id, "passed_year") && !edu.currently_studying && (
                  <p className="text-sm text-red-500 mt-1">
                    {getError(edu.id, "passed_year")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`currentlyStudying-${edu.id}`}
                  checked={edu.currently_studying}
                  onCheckedChange={(checked: boolean) => {
                    updateEducation(edu.id, "currently_studying", checked);
                    if (checked) {
                      updateEducation(edu.id, "passed_year", null);
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
              {getError(edu.id, "currently_studying") && (
                <p className="text-sm text-red-500 mt-1">
                  {getError(edu.id, "currently_studying")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
