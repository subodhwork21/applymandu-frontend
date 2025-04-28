"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    position: string;
    avatar: string;
  };
}

const InterviewScheduleModal = ({
  isOpen,
  onClose,
  candidate,
}: InterviewScheduleModalProps) => {
  const [formData, setFormData] = useState({
    interviewType: "",
    date: undefined as Date | undefined,
    time: "",
    mode: "in-person",
    interviewer: "",
    notes: "",
  });

  // Generate time slots from 9 AM to 6 PM
  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? "00" : "30";
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return {
      value: `${hour.toString().padStart(2, "0")}:${minute}`,
      label: `${displayHour}:${minute} ${ampm}`,
    };
  });

  const handleSubmit = () => {
    console.log("Schedule interview:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0">
        <div className="border-b border-neutral-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Schedule Interview</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${candidate.avatar}`}
              alt={candidate.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg">{candidate.name}</h3>
              <p className="text-sm text-neutral-600">
                {candidate.position} Position
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Interview Type</Label>
              <Select
                value={formData.interviewType}
                onValueChange={(value) =>
                  setFormData({ ...formData, interviewType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Interview</SelectItem>
                  <SelectItem value="hr">HR Interview</SelectItem>
                  <SelectItem value="culture">Culture Fit</SelectItem>
                  <SelectItem value="final">Final Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      {formData.date ? (
                        format(formData.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Time</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) =>
                    setFormData({ ...formData, time: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Interview Mode</Label>
              <RadioGroup
                value={formData.mode}
                onValueChange={(value) =>
                  setFormData({ ...formData, mode: value })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person">In-person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video Call</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone">Phone Call</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Interviewer</Label>
              <Select
                value={formData.interviewer}
                onValueChange={(value) =>
                  setFormData({ ...formData, interviewer: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">
                    Sarah Johnson (Tech Lead)
                  </SelectItem>
                  <SelectItem value="mike">
                    Mike Peters (Senior Developer)
                  </SelectItem>
                  <SelectItem value="anna">Anna Smith (HR Manager)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any additional notes or instructions..."
                className="h-24"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 p-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-black text-white hover:bg-neutral-800"
            onClick={handleSubmit}
          >
            Schedule Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewScheduleModal;
