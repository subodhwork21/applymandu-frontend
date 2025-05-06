"use client";

import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { baseFetcher } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  editJob?: {
    id: string;
    title: string;
    type: string;
    location: string;
    salary: string;
    applicants: number;
    expires: string;
    status: string;
    description?: string;
    is_remote?: boolean;
    requirements?: string[];
    responsibilities?: string[];
    benefits?: string[];
    skills?: string[];
  };
}

const PostJobModal = ({ isOpen, onClose, editJob }: PostJobModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state with arrays for multi-option fields
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    employment_type: "",
    location_type: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    description: "",
    location: "",
    deadline: undefined as Date | undefined,
  });

  // Separate state for multi-option fields
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  
  // Current input values for new items
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [currentResponsibility, setCurrentResponsibility] = useState("");
  const [currentBenefit, setCurrentBenefit] = useState("");

  // Parse JSON string arrays
  const parseJsonArray = (jsonStr: string | undefined): string[] => {
    if (!jsonStr) return [];
    
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    if (editJob) {
      // Parse salary range from string (e.g., "$80k-$100k" -> { from: "80", to: "100" })
      const salaryMatch = editJob.salary?.match(/\$(\d+)k-\$(\d+)k/);
      const [, salaryFrom, salaryTo] = salaryMatch || ["", "", ""];

      // Set basic form data
      setFormData({
        title: editJob.title || "",
        department: "",
        employment_type: editJob.type || "",
        location_type: editJob.is_remote ? "remote" : "on-site",
        experience_level: "",
        salary_min: salaryFrom || "",
        salary_max: salaryTo || "",
        description: editJob.description || "",
        location: editJob.location || "",
        deadline: editJob.expires ? new Date(editJob.expires) : undefined,
      });

      // Set multi-option fields
      setSkills(editJob.skills || []);
      setRequirements(parseJsonArray(editJob.requirements as unknown as string));
      setResponsibilities(parseJsonArray(editJob.responsibilities as unknown as string));
      setBenefits(parseJsonArray(editJob.benefits as unknown as string));
    } else {
      // Reset form for new job
      setFormData({
        title: "",
        department: "",
        employment_type: "",
        location_type: "",
        experience_level: "",
        salary_min: "",
        salary_max: "",
        description: "",
        location: "",
        deadline: undefined,
      });
      
      // Reset multi-option fields
      setSkills([]);
      setRequirements([]);
      setResponsibilities([]);
      setBenefits([]);
    }
    
    // Reset current input values
    setCurrentSkill("");
    setCurrentRequirement("");
    setCurrentResponsibility("");
    setCurrentBenefit("");
  }, [editJob, isOpen]);

  // Handlers for adding items to multi-option fields
  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const addRequirement = () => {
    if (currentRequirement.trim() && !requirements.includes(currentRequirement.trim())) {
      setRequirements([...requirements, currentRequirement.trim()]);
      setCurrentRequirement("");
    }
  };

  const addResponsibility = () => {
    if (currentResponsibility.trim() && !responsibilities.includes(currentResponsibility.trim())) {
      setResponsibilities([...responsibilities, currentResponsibility.trim()]);
      setCurrentResponsibility("");
    }
  };

  const addBenefit = () => {
    if (currentBenefit.trim() && !benefits.includes(currentBenefit.trim())) {
      setBenefits([...benefits, currentBenefit.trim()]);
      setCurrentBenefit("");
    }
  };

  // Handlers for removing items from multi-option fields
  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Format the data for API
      const apiData = {
        title: formData.title,
        department: formData.department,
        employment_type: formData.employment_type,
        location_type: formData.location_type,
        experience_level: formData.experience_level,
        salary_min: parseInt(formData.salary_min) * 1000 || 0,
        salary_max: parseInt(formData.salary_max) * 1000 || 0,
        description: formData.description,
        skills: skills,
        requirements: requirements,
        responsibilities: responsibilities,
        benefits: benefits,
        location: formData.location,
        application_deadline: formData.deadline ? format(formData.deadline, 'yyyy-MM-dd') : null,
      };

      if (editJob) {
        const { response, result } = await baseFetcher(`api/job/update/${editJob?.id}`, {
          method: "POST",
          body: JSON.stringify(apiData),
        });
        
        if (response?.ok) {
          toast({
            title: "Success",
            description: "Job updated successfully",
          });
      onClose();

        } else {
          toast({
            title: "Error",
            description: result?.message || "Failed to update job",
            variant: "destructive",
          });
        }
      } else {
        const { response, result, errors } = await baseFetcher("api/job", {
          method: "POST",
          body: JSON.stringify(apiData),
        });
        
        if (response?.ok) {
          toast({
            title: "Success",
            description: "Job posted successfully",
          });
      onClose();

        } else {
          toast({
            title: "Error",
            description: errors || "Failed to post job",
            variant: "destructive",
          });
        }
      }
      
    } catch (error) {
      console.error("Error submitting job:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl">{editJob ? "Edit Job" : "Post New Job"}</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <Input
                placeholder="e.g. Senior Frontend Developer"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="customer_support">Customer Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Employment Type</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, employment_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>

                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Location Type</Label>
                <Select
                  value={formData.location_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, location_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Experience Level</Label>
                <Select
                  value={formData.experience_level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, experience_level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                    {/* <SelectItem value="executive">Executive</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Salary Range (From)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 60"
                  value={formData.salary_min}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_min: e.target.value })
                  }
                />
                <span className="text-sm text-neutral-500 mt-1">
                  K per year
                </span>
              </div>
              <div>
                <Label>Salary Range (To)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 80"
                  value={formData.salary_max}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_max: e.target.value })
                  }
                />
                <span className="text-sm text-neutral-500 mt-1">
                  K per year
                </span>
              </div>
            </div>

            <div>
              <Label>Job Description</Label>
              <Textarea
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Skills - Multi-option input */}
            <div>
              <Label>Required Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a skill"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addSkill}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="hover:text-neutral-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements - Multi-option input */}
            <div>
              <Label>Requirements</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a requirement"
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRequirement();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addRequirement}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {requirements.map((requirement, index) => (
                  <div
                    key={index}
                    className="bg-neutral-50 border border-neutral-200 p-2 rounded-md flex justify-between items-center"
                  >
                    <span>{requirement}</span>
                    <button
                      onClick={() => removeRequirement(index)}
                      className="hover:text-neutral-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsibilities - Multi-option input */}
            <div>
              <Label>Responsibilities</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a responsibility"
                  value={currentResponsibility}
                  onChange={(e) => setCurrentResponsibility(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addResponsibility();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addResponsibility}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {responsibilities.map((responsibility, index) => (
                  <div
                    key={index}
                    className="bg-neutral-50 border border-neutral-200 p-2 rounded-md flex justify-between items-center"
                  >
                    <span>{responsibility}</span>
                    <button
                      onClick={() => removeResponsibility(index)}
                      className="hover:text-neutral-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits - Multi-option input */}
            <div>
              <Label>Benefits</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a benefit"
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addBenefit}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-neutral-50 border border-neutral-200 p-2 rounded-md flex justify-between items-center"
                  >
                    <span>{benefit}</span>
                    <button
                      onClick={() => removeBenefit(index)}
                      className="hover:text-neutral-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    {formData.deadline ? (
                      format(formData.deadline, "PPP")
                    ) : (
                      <span>Pick a deadline date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) =>
                      setFormData({ ...formData, deadline: date })
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-black text-white hover:bg-neutral-800"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : (editJob ? "Update Job" : "Post Job")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostJobModal;
