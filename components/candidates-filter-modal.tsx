"use client";

import React, { useState } from "react";
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

interface CandidatesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CandidatesFilterModal = ({
  isOpen,
  onClose,
}: CandidatesFilterModalProps) => {
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript"]);
  const [currentSkill, setCurrentSkill] = useState("");

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleReset = () => {
    setSkills([]);
    onClose();
  };

  const handleApply = () => {
    // Apply filters logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Filter Candidates</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label>Experience Level</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="entry" />
                <Label htmlFor="entry">Entry Level (0-2 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mid" />
                <Label htmlFor="mid">Mid Level (2-5 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="senior" />
                <Label htmlFor="senior">Senior Level (5+ years)</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Skills</Label>
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
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-neutral-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="kathmandu">Kathmandu</SelectItem>
                <SelectItem value="pokhara">Pokhara</SelectItem>
                <SelectItem value="lalitpur">Lalitpur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Availability</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="available-now" />
                <Label htmlFor="available-now">Available Now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="available-2weeks" />
                <Label htmlFor="available-2weeks">Available in 2 weeks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="available-1month" />
                <Label htmlFor="available-1month">Available in 1 month</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Salary Range</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input type="number" placeholder="Min" />
              <span className="text-neutral-400">to</span>
              <Input type="number" placeholder="Max" />
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
