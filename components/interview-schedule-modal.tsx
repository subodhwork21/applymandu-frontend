"use client";

import React, { useState } from "react";
import { Loader, X } from "lucide-react";
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
import { DropdownWithAddOption } from "./ui/dropdown-with-add-option";
import { baseFetcher, defaultFetcher } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";
import useSWR from "swr";
import Image from "next/image";

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    position: string;
    avatar: string;

  };
  application_id: string;
  mutate: () => void;
}

const InterviewScheduleModal = ({
  isOpen,
  onClose,
  candidate,
  application_id,
  mutate
}: InterviewScheduleModalProps) => {
  const [formData, setFormData] = useState({
    interviewType: "",
    date: undefined as Date | undefined,
    time: "",
    mode: "in-person",
    interviewer: "",
    notes: "",
    formattedDate: "",
  });


  const {
    data: interviewType,
    isLoading,
    mutate: mutateInterviewType,
  } = useSWR<{ data: { name: string }[] }>(
    "api/application-interview/interview-types",
    defaultFetcher
  );
  const {
    data: interviewer,
    isLoading: interviewerLoading,
    mutate: mutateInterviewer,
  } = useSWR<{ data: { name: string }[] }>(
    "api/application-interview/interviewers",
    defaultFetcher
  );

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

  const handleSubmit = async () => {
    let formDataFinal = { interview_type_id: formData?.interviewType, interviewer_id: formData?.interviewer, mode: formData?.mode, status: "scheduled", application_id: application_id, date: formData?.formattedDate, time: formData?.time };
    const { response, result, errors } = await baseFetcher("api/application-interview/schedule-interview", {
      method: "POST",
      body: JSON.stringify(formDataFinal),
    })

    if (response?.ok) {
      toast({
        title: "Interview scheduled successfully",
        description: result?.message
      })
      onClose();
      mutate();

    }
    else {
      toast({
        title: "Error",
        description: errors || "Something went wrong",
      })
    }
  };

  if(isLoading || interviewerLoading) return (<>
    <Loader />
  </>);

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
            <Image
              width={48}
              height={48}
              src={`${candidate.avatar}`}
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

              <DropdownWithAddOption
                options={
                  interviewType?.data
                    ? interviewType?.data.map((item: any) => ({
                      value: item.name,
                      label: item.name,
                      id: item.id
                    }))
                    : []
                }
                value={formData.interviewType}
                onChange={(value) =>
                  setFormData({ ...formData, interviewType: value })
                }
                placeholder="Select interview type"
                className="w-full"
                addOptionText="Add interview type"
                addNewPlaceholder="Enter interview type"
                onAddNewOption={async (newType) => {
                  try {
                    const { response, result } = await baseFetcher(
                      "api/application-interview/add-interview-type",
                      {
                        method: "POST",
                        body: JSON.stringify({ name: newType }),
                      }
                    );

                    if (response?.ok) {
                      toast({
                        title: "Success",
                        description: "Interview type added successfully",
                      });
                      mutateInterviewType();
                      return true;
                    } else {
                      toast({
                        title: "Error",
                        description: "Failed to add interview type",
                        variant: "destructive",
                      });
                      return false;
                    }
                  } catch (error) {
                    console.error("Error adding interview type:", error);
                    toast({
                      title: "Error",
                      description: "An unexpected error occurred",
                      variant: "destructive",
                    });
                    return false;
                  }
                }}
              />
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
                      onSelect={(date) => {
                        // Format the date for Laravel (YYYY-MM-DD format)
                         const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;

                        // Store both the Date object (for the UI) and the formatted string (for API)
                        setFormData({
                          ...formData,
                          date: date,
                          formattedDate: formattedDate! as string 
                        });
                      }}
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
                  <RadioGroupItem value="video-call" id="video" />
                  <Label htmlFor="video">Video Call</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone-call" id="phone" />
                  <Label htmlFor="phone">Phone Call</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Interviewer</Label>


              <DropdownWithAddOption
                value={formData.interviewer}
                placeholder="Select interviewer"
                options={
                  interviewer?.data
                    ? interviewer?.data.map((item: any) => ({
                      value: item.name,
                      label: item.name,
                      id: item.id,
                    }))
                    : []
                }
                onChange={(option) =>{
                  setFormData({ ...formData, interviewer: option })
                }
                }
                onAddNewOption={async (option) => {
                  try {
                    const { response, result } = await baseFetcher(
                      "api/application-interview/add-interviewers",
                      {
                        method: "POST",
                        body: JSON.stringify({
                          name: option,
                          department: "Interview",
                        }),
                      }
                    );

                    if (response?.ok) {
                      toast({
                        title: "Success",
                        description: "Interviewer added successfully",
                      });
                      mutateInterviewer();
                      return true;
                    } else {
                      toast({
                        title: "Error",
                        description: "Failed to add interviewer",
                        variant: "destructive",
                      });
                      return false;
                    }
                  } catch (error) {
                    console.error("Error adding interviewer:", error);
                    toast({
                      title: "Error",
                      description: "An unexpected error occurred",
                      variant: "destructive",
                    });
                    return false;
                  }
                }}
              />
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
          <Button className="bg-white border border-manduSecondary" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-manduSecondary text-white hover:bg-neutral-800"
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
