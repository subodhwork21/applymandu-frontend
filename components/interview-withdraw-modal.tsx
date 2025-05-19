"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { employerToken, jobSeekerToken } from "@/lib/tokens";
import { baseFetcher, FetchError } from "@/lib/fetcher";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const InterviewWithdrawModal = ({
    application_id,
    isOpen,
    onClose,
    mutate,
}: {
    application_id: string;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleWithdraw = async () => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
           
            
            const {response, result} = await baseFetcher(`api/application-interview/withdraw-interview`, {
                method: 'POST',

                body: JSON.stringify({ id: application_id })
            });


            if (!response?.ok) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result?.message || "Failed to withdraw from interview",
                })
                return;
                
            }

            setSuccess(true);
            
            // // Close the modal after a short delay on success
            // setTimeout(() => {
            //     onClose();
            //     // Optionally refresh the page or update the parent component
            //     window.location.reload();
            // }, 2000);
            mutate();
        } catch (err) {
            console.error('Error withdrawing from interview:', err);
            setError(
                err instanceof FetchError
                    ? err.message
                    : 'An unexpected error occurred. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Withdraw from Interview</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to withdraw from this interview? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 p-4 rounded-md flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="text-sm text-red-700">{error}</div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 p-4 rounded-md flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div className="text-sm text-green-700">
                            Successfully withdrawn from the interview.
                        </div>
                    </div>
                )}

                <DialogFooter className="flex sm:justify-between gap-4 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting || success}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleWithdraw}
                        disabled={isSubmitting || success}
                    >
                        {isSubmitting ? "Withdrawing..." : "Withdraw from Interview"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InterviewWithdrawModal;
