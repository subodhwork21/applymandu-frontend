"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { baseFetcher } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  currentStatus: string;
  candidateName: string;
  onStatusUpdate: () => void;
}

const statusOptions = [
  { value: "applied", label: "Applied", color: "bg-blue-100 text-blue-800" },
  { value: "under_review", label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-green-100 text-green-800" },
  { value: "interview_scheduled", label: "Interview Scheduled", color: "bg-purple-100 text-purple-800" },
  { value: "interviewed", label: "Interviewed", color: "bg-indigo-100 text-indigo-800" },
  { value: "selected", label: "Selected", color: "bg-emerald-100 text-emerald-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "withdrawn", label: "Withdrawn", color: "bg-gray-100 text-gray-800" },
];

const StatusUpdateModal = ({
  isOpen,
  onClose,
  applicationId,
  currentStatus,
  candidateName,
  onStatusUpdate,
}: StatusUpdateModalProps) => {
  const [formData, setFormData] = useState({
    status: currentStatus,
    remarks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.status) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { response, result, errors } = await baseFetcher(
        `api/employer/update-application-status/${applicationId}`,
        {
          method: "POST",
          body: JSON.stringify({
            status: formData.status,
            remarks: formData.remarks.trim() || null,
          }),
        }
      );


      if (response?.ok) {
        toast({
          title: "Success",
          description: "Application status updated successfully",
        });
        onStatusUpdate();
        onClose();
        // Reset form
        setFormData({
          status: currentStatus,
          remarks: "",
        });
      } else {
        toast({
          title: "Error",
          description: errors || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        status: currentStatus,
        remarks: "",
      });
      onClose();
    }
  };

  const selectedStatusOption = statusOptions.find(
    (option) => option.value === formData.status
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="border-b border-neutral-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Update Application Status</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-neutral-600">
              Updating status for <span className="font-medium">{candidateName}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status">
                    {selectedStatusOption && (
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${selectedStatusOption.color}`}
                        >
                          {selectedStatusOption.label}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                placeholder="Add any notes or comments about this status change..."
                className="h-24 resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-neutral-500 mt-1">
                This will be visible in the application timeline
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 p-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.status}
            className="bg-manduSecondary text-white hover:bg-neutral-800"
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
