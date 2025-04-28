"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

const ForgotPasswordModal = () => {
  const {
    isForgotPasswordModalOpen,
    closeForgotPasswordModal,
    openLoginModal,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // Implement password reset logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess(true);
      setTimeout(() => {
        closeForgotPasswordModal();
        openLoginModal();
      }, 3000);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    closeForgotPasswordModal();
    openLoginModal();
  };

  return (
    <Dialog
      open={isForgotPasswordModalOpen}
      onOpenChange={closeForgotPasswordModal}
    >
      <DialogContent className="sm:max-w-md p-0">
        <div className="flex justify-between items-center p-5 border-b border-neutral-200">
          <h2 className="text-xl font-semibold">Reset Password</h2>
        </div>

        <div className="p-5">
          {!success ? (
            <>
              <p className="text-neutral-600 text-sm mb-6">
                Enter your email address and we will send you a link to reset
                your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-black text-white hover:bg-neutral-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mb-4 text-green-600">
                <svg
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-600 mb-2">
                Reset Link Sent!
              </h3>
              <p className="text-neutral-600 text-sm">
                Check your email for instructions to reset your password.
              </p>
            </div>
          )}
        </div>

        <div className="bg-neutral-50 p-5 text-center border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Remember your password?{" "}
            <Button
              variant="link"
              className="text-black hover:text-neutral-800 h-auto p-0"
              onClick={switchToLogin}
            >
              Sign in
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
