"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  editJob?: {
    title: string;
    type: string;
    location: string;
    salary: string;
    applicants: number;
    expires: string;
    status: string;
  };
}

const PostJobModal = ({ isOpen, onClose, editJob }: PostJobModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    employmentType: "",
    locationType: "",
    experienceLevel: "",
    salaryFrom: "",
    salaryTo: "",
    description: "",
    skills: "",
    deadline: undefined as Date | undefined,
  });

  useEffect(() => {
    if (editJob) {
      // Parse salary range from string (e.g., "$80k-$100k" -> { from: "80", to: "100" })
      const salaryMatch = editJob.salary.match(/\$(\d+)k-\$(\d+)k/);
      const [, salaryFrom, salaryTo] = salaryMatch || ["", "", ""];

      setFormData({
        title: editJob.title,
        department: "",
        employmentType: editJob.type.toLowerCase(),
        locationType: editJob.location.toLowerCase(),
        experienceLevel: "",
        salaryFrom,
        salaryTo,
        description: "",
        skills: "",
        deadline: editJob.expires ? new Date(editJob.expires) : undefined,
      });
    }
  }, [editJob]);

  const handleSubmit = () => {
    if (editJob) {
      console.log("Update job:", formData);
    } else {
      console.log("Post new job:", formData);
    }
    onClose();
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Employment Type</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, employmentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Location Type</Label>
                <Select
                  value={formData.locationType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, locationType: value })
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
                  value={formData.experienceLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, experienceLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Salary Range (From)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 60"
                  value={formData.salaryFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryFrom: e.target.value })
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
                  value={formData.salaryTo}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryTo: e.target.value })
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

            <div>
              <Label>Required Skills</Label>
              <Input
                placeholder="Add skills (comma separated)"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
              />
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-black text-white hover:bg-neutral-800"
            onClick={handleSubmit}
          >
            {editJob ? "Update Job" : "Post Job"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostJobModal;
