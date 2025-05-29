"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import debounce from "lodash/debounce";

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
    experience_level: string;
    location: string;
    salary: string;
    department: string;
    employment_type: string;
    description?: string;
    location_type?: string;
    is_remote?: boolean;
    requirements?: string[];
    responsibilities?: string[];
    benefits?: string[];
    skills?: string[];
    salary_min?: string;
    salary_max?: string;
    application_deadline?: string;
    status?: boolean;
    slug?: string;
  };
  mutate?: () => void;
}

const PostJobModal = ({ isOpen, onClose, editJob, mutate }: PostJobModalProps) => {
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
    application_deadline: undefined as Date | undefined,
    slug: "", // Added slug field
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
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"available" | "unavailable" | "checking" | null>(null);
  

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
        department: editJob?.department || "",
        employment_type: editJob.employment_type || "",
        location_type: editJob.is_remote ? "remote" : "on-site",
        experience_level: editJob?.experience_level,
        salary_min: editJob?.salary_min || "",
        salary_max: editJob?.salary_max || "",
        description: editJob.description || "",
        location: editJob.location || "",
        application_deadline: editJob.application_deadline ? new Date(editJob.application_deadline) : undefined,
        slug: editJob.slug || "", // Set slug from editJob
      });

      // Set multi-option fields
      setSkills(editJob.skills || []);
      setRequirements(editJob.requirements || []);
      setResponsibilities(editJob.responsibilities || []);
      setBenefits(editJob.benefits || []);
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
        application_deadline: undefined,
        slug: "", // Reset slug for new job
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


  // Create a debounced version of handleCheckSlug
  const debouncedCheckSlug = useCallback(
    debounce(async (slug: string, jobId: string) => {
      if (!slug.trim()) {
        setSlugStatus(null);
        return;
      }
      
      setIsCheckingSlug(true);
      setSlugStatus("checking");
      
      const {response, result, errors} = await baseFetcher(`api/employer/available-slug/${jobId}`, {
        method: "POST",
        body: JSON.stringify({slug}),
      });
  
      if (response?.ok) {
        setSlugStatus("available");
        toast({
          title: "Success",
          description: result?.message
        });
      } else {
        setSlugStatus("unavailable");
        toast({
          title: "Error",
          description: errors,
          variant: "destructive",
        });
      }
      
      setIsCheckingSlug(false);
    }, 2000), 
    [editJob]
  );
  

  const handleSubmit = async () => {
   
    
    try {
      // Format the data for API
      const apiData = {
        title: formData.title,
        department: formData.department,
        employment_type: formData.employment_type,
        location_type: formData.location_type,
        experience_level: formData.experience_level,
        salary_min: parseInt(formData.salary_min) || 0,
        salary_max: parseInt(formData.salary_max) || 0,
        description: formData.description,
        skills: skills,
        requirements: requirements,
        responsibilities: responsibilities,
        benefits: benefits,
        location: formData.location,
        application_deadline: formData.application_deadline ? format(formData.application_deadline, 'yyyy-MM-dd') : null,
        slug: editJob ? formData.slug : undefined, // Only include slug when editing
      };

      if (editJob) {
        setIsSubmitting(true);
        if(!formData.slug.trim()) {
          toast({
            title: "Error",
            description: "Please enter a slug",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
    
        if(slugStatus === "unavailable") {
          toast({
            title: "Error",
            description: "Slug is not available",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        const { response, result, errors } = await baseFetcher(`api/job/update/${editJob?.id}`, {
          method: "POST",
          body: JSON.stringify(apiData),
        });
        
        if (response?.ok) {
          toast({
            title: "Success",
            description: "Job updated successfully",
          });
          mutate?.();
      onClose();

        } else {
          toast({
            title: "Error",
            description: errors || "Failed to update job",
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

            {/* Slug field - only visible when editing */}
            {editJob && (
  <div>
    <Label>URL Slug</Label>
    <div className="relative">
      <Input
        placeholder="job-url-slug"
        value={formData.slug}
        onChange={(e) => {
          const newSlug = e.target.value;
          setFormData({ ...formData, slug: newSlug });
          
          // Trigger the debounced check
          if (newSlug.trim()) {
            debouncedCheckSlug(newSlug, editJob.id);
          } else {
            setSlugStatus(null);
          }
        }}
        className={cn(
          "font-mono text-sm pr-10",
          slugStatus === "available" && "border-green-500",
          slugStatus === "unavailable" && "border-red-500",
          slugStatus === "checking" && "border-yellow-500"
        )}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {slugStatus === "checking" && (
          <span className="h-4 w-4 block rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
        )}
        {slugStatus === "available" && (
          <span className="text-green-500">✓</span>
        )}
        {slugStatus === "unavailable" && (
          <span className="text-red-500">✗</span>
        )}
      </div>
    </div>
    <p className="text-xs text-neutral-500 mt-1">
      {slugStatus === "available" && "This slug is available."}
      {slugStatus === "unavailable" && "This slug is already taken."}
      {slugStatus === "checking" && "Checking slug availability..."}
      {!slugStatus && "This is the URL path for this job. Edit with caution as it affects existing links."}
    </p>
  </div>)}

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
                    <SelectItem value="it">IT</SelectItem>
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
                      !formData.application_deadline && "text-muted-foreground"
                    )}
                  >
                    {formData.application_deadline ? (
                      format(formData.application_deadline, "PPP")
                    ) : (
                      <span>Pick a deadline date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.application_deadline}
                    onSelect={(date) =>
                      setFormData({ ...formData, application_deadline: date })
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
            {isSubmitting ? "Submitting..." : (editJob ? "Update Job": "Post Job")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostJobModal;
