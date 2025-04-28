"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PersonalDetailsProps {
  personalDetails: {
    firstName: string;
    middleName: string;
    lastName: string;
    district: string;
    municipality: string;
    cityTole: string;
    dateOfBirth: Date | null;
    mobile: string;
    hasLicense: boolean;
    hasVehicle: boolean;
    industry: string;
    preferredJobType: string;
    gender: string;
    lookingFor: string;
    salaryExpectations: string;
    careerObjectives: string;
  };
  updatePersonalDetails: (field: string, value: any) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  personalDetails,
  updatePersonalDetails,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-neutral-200">
      <h3 className="text-lg font-medium mb-6">Personal Information</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">First Name</Label>
            <Input
              value={personalDetails.firstName}
              onChange={(e) =>
                updatePersonalDetails("firstName", e.target.value)
              }
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">
              Middle Name
            </Label>
            <Input
              value={personalDetails.middleName}
              onChange={(e) =>
                updatePersonalDetails("middleName", e.target.value)
              }
              placeholder="Enter middle name"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">Last Name</Label>
            <Input
              value={personalDetails.lastName}
              onChange={(e) =>
                updatePersonalDetails("lastName", e.target.value)
              }
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">District</Label>
            <Input
              value={personalDetails.district}
              onChange={(e) =>
                updatePersonalDetails("district", e.target.value)
              }
              placeholder="Enter district"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">
              Municipality
            </Label>
            <Input
              value={personalDetails.municipality}
              onChange={(e) =>
                updatePersonalDetails("municipality", e.target.value)
              }
              placeholder="Enter municipality"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">City/Tole</Label>
            <Input
              value={personalDetails.cityTole}
              onChange={(e) =>
                updatePersonalDetails("cityTole", e.target.value)
              }
              placeholder="Enter city/tole"
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
                    !personalDetails.dateOfBirth && "text-neutral-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {personalDetails.dateOfBirth
                    ? format(personalDetails.dateOfBirth, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={personalDetails.dateOfBirth || undefined}
                  onSelect={(date) =>
                    updatePersonalDetails("dateOfBirth", date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">Mobile</Label>
            <Input
              value={personalDetails.mobile}
              onChange={(e) => updatePersonalDetails("mobile", e.target.value)}
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium pb-2 block">Industry</Label>
            <Select
              value={personalDetails.industry.toLowerCase()}
              onValueChange={(value) =>
                updatePersonalDetails("industry", value)
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
              Preferred Job Type
            </Label>
            <Select
              value={personalDetails.preferredJobType.toLowerCase()}
              onValueChange={(value) =>
                updatePersonalDetails("preferredJobType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
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
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Transportation</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="license"
              checked={personalDetails.hasLicense}
              onCheckedChange={(checked) =>
                updatePersonalDetails("hasLicense", checked)
              }
            />
            <Label htmlFor="license">I have a driving license</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vehicle"
              checked={personalDetails.hasVehicle}
              onCheckedChange={(checked) =>
                updatePersonalDetails("hasVehicle", checked)
              }
            />
            <Label htmlFor="vehicle">I have a vehicle</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium pb-2 block">
            Career Objectives
          </Label>
          <Textarea
            value={personalDetails.careerObjectives}
            onChange={(e) =>
              updatePersonalDetails("careerObjectives", e.target.value)
            }
            placeholder="Enter your career objectives"
            className="h-32"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
