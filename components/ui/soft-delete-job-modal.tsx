import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader } from "lucide-react";
import { toast } from "sonner";
import { baseFetcher } from "@/lib/fetcher";

interface SoftDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number | null;
}

const SoftDeleteModal = ({ isOpen, onClose, jobId }: SoftDeleteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseJob = async () => {
    if (!jobId) return;
    
    setIsLoading(true);
    try {
      const {response, result, errors} = await baseFetcher(`api/job/soft-delete/${jobId}`,
        {
          method: "POST",
        }
      );
      
      if (response?.ok) {
        toast.success("Job closed successfully");
        onClose();
        // You might want to refresh the job listings after closing a job
        // This could be done by passing a callback function from the parent component
      } else {
        toast.error(errors || "Failed to close job");
      }
    } catch (error) {
      console.error("Error closing job:", error);
      toast.error("An error occurred while closing the job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Close Job Posting
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to close this job posting? This will remove it from the active job listings and candidates will no longer be able to apply.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="sm:mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleCloseJob}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Closing...
              </>
            ) : (
              "Close Job"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SoftDeleteModal;
