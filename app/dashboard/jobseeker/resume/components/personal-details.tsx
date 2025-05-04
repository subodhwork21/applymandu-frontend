"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput  from "@/components/fields/input-field"; // Import FormInput
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface JobSeekerProfile {
  id: number | null;
  user_id: number | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  district: string;
  municipality: string;
  city_tole: string;
  date_of_birth: string | Date;
  mobile: string;
  industry: string;
  preferred_job_type: string;
  gender: string;
  has_driving_license: boolean;
  has_vehicle: boolean;
  career_objectives: string;
  looking_for: string;
  salary_expectations: string;
  created_at: string;
  updated_at: string;
}

interface PersonalDetailsProps {
  personalDetails: JobSeekerProfile;
  updatePersonalDetails: (field: string, value: any) => void;
  errors?: Record<string, string>; // Add errors prop
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  personalDetails,
  updatePersonalDetails,
  errors = {}, // Default to empty object
}) => {
  // Helper function to get error for a specific field
  const getError = (field: string): string => {
    return errors[field] || '';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-neutral-200">
      <h3 className="text-lg font-medium mb-6">Personal Information</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">First Name</Label>
            <FormInput
              value={personalDetails.first_name}
              onChange={(e) =>
                updatePersonalDetails("first_name", e.target.value)
              }
              placeholder="Enter first name"
              error={getError("first_name")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">
              Middle Name
            </Label>
            <FormInput
              value={personalDetails.middle_name}
              onChange={(e) =>
                updatePersonalDetails("middle_name", e.target.value)
              }
              placeholder="Enter middle name"
              error={getError("middle_name")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">Last Name</Label>
            <FormInput
              value={personalDetails.last_name}
              onChange={(e) =>
                updatePersonalDetails("last_name", e.target.value)
              }
              placeholder="Enter last name"
              error={getError("last_name")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">District</Label>
            <FormInput
              value={personalDetails.district}
              onChange={(e) =>
                updatePersonalDetails("district", e.target.value)
              }
              placeholder="Enter district"
              error={getError("district")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">
              Municipality
            </Label>
            <FormInput
              value={personalDetails.municipality}
              onChange={(e) =>
                updatePersonalDetails("municipality", e.target.value)
              }
              placeholder="Enter municipality"
              error={getError("municipality")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">City/Tole</Label>
            <FormInput
              value={personalDetails.city_tole}
              onChange={(e) =>
                updatePersonalDetails("city_tole", e.target.value)
              }
              placeholder="Enter city/tole"
              error={getError("city_tole")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">
              Date of Birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !personalDetails.date_of_birth && "text-neutral-500",
                    getError("date_of_birth") && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {personalDetails.date_of_birth
                    ? format(
                        typeof personalDetails.date_of_birth === 'string' 
                          ? new Date(personalDetails.date_of_birth) 
                          : personalDetails.date_of_birth, 
                        "PPP"
                      )
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    personalDetails.date_of_birth 
                      ? typeof personalDetails.date_of_birth === 'string'
                        ? new Date(personalDetails.date_of_birth)
                        : personalDetails.date_of_birth
                      : undefined
                  }
                  onSelect={(date) =>
                    updatePersonalDetails("date_of_birth", date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {getError("date_of_birth") && (
              <p className="text-sm text-red-500 mt-1">
                {getError("date_of_birth")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">Mobile</Label>
            <FormInput
              value={personalDetails.mobile}
              onChange={(e) => updatePersonalDetails("mobile", e.target.value)}
              placeholder="Enter mobile number"
              error={getError("mobile")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">Industry</Label>
            <Select
              value={personalDetails.industry?.toLowerCase()}
              onValueChange={(value) =>
                updatePersonalDetails("industry", value)
              }
            > 
              <SelectTrigger className={getError("industry") ? "border-red-500" : ""}>
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
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="customer service">Customer Service</SelectItem>
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
            {getError("industry") && (
              <p className="text-sm text-red-500 mt-1">
                {getError("industry")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">
              Preferred Job Type
            </Label>
            <Select
              value={personalDetails.preferred_job_type?.toLowerCase()}
              onValueChange={(value) =>
                updatePersonalDetails("preferred_job_type", value)
              }
            >
              <SelectTrigger className={getError("preferred_job_type") ? "border-red-500" : ""}>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            {getError("preferred_job_type") && (
              <p className="text-sm text-red-500 mt-1">
                {getError("preferred_job_type")}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium pb-2 block">Gender</Label>
          <RadioGroup
            value={personalDetails.gender}
            onValueChange={(value) => updatePersonalDetails("gender", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
          {getError("gender") && (
            <p className="text-sm text-red-500 mt-1">
              {getError("gender")}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Transportation</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="license"
              checked={personalDetails.has_driving_license}
              onCheckedChange={(checked) =>
                updatePersonalDetails("has_driving_license", checked)
              }
            />
            <Label htmlFor="license">I have a driving license</Label>
          </div>
          {getError("has_driving_license") && (
            <p className="text-sm text-red-500 mt-1">
              {getError("has_driving_license")}
            </p>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vehicle"
              checked={personalDetails.has_vehicle}
              onCheckedChange={(checked) =>
                updatePersonalDetails("has_vehicle", checked)
              }
            />
            <Label htmlFor="vehicle">I have a vehicle</Label>
          </div>
          {getError("has_vehicle") && (
            <p className="text-sm text-red-500 mt-1">
              {getError("has_vehicle")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium pb-2 block">
            Career Objectives
          </Label>
          <Textarea
            value={personalDetails.career_objectives}
            onChange={(e) =>
              updatePersonalDetails("career_objectives", e.target.value)
            }
            placeholder="Enter your career objectives"
            className={cn(
              "h-32",
              getError("career_objectives") ? "border-red-500" : ""
            )}
          />
          {getError("career_objectives") && (
            <p className="text-sm text-red-500 mt-1">
              {getError("career_objectives")}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium pb-2 block">
            Looking For
          </Label>
          <FormInput
            value={personalDetails.looking_for}
            onChange={(e) =>
              updatePersonalDetails("looking_for", e.target.value)
            }
            placeholder="What are you looking for?"
            error={getError("looking_for")}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium pb-2 block">
            Salary Expectations
          </Label>
          <FormInput
            value={personalDetails.salary_expectations}
            onChange={(e) =>
              updatePersonalDetails("salary_expectations", e.target.value)
            }
            placeholder="Enter your salary expectations"
            error={getError("salary_expectations")}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
