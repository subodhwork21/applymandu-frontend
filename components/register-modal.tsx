"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { baseFetcher } from "@/lib/fetcher";
import { getValidationErrors } from "@/lib/validation-error";
import { useToast } from "@/hooks/use-toast";

const RegisterModal = () => {
  const { toast } = useToast();
  const {
    isRegisterModalOpen,
    closeRegisterModal,
    openLoginModal,
    isEmployer,
    isAuthenticated,
  } = useAuth();
  const [accountType, setAccountType] = useState<"employer" | "jobseeker" | null>(null);

  useEffect(() => {
    // Set initial account type based on authentication status
    if (isAuthenticated) {
      setAccountType(isEmployer ? "employer" : "jobseeker");
    } else {
      setAccountType(null);
    }
  }, [isAuthenticated, isEmployer]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
    agreeToTerms: false,
    company_name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (!accountType) {
      setError("Please select an account type");
      return;
    }

    setIsLoading(true);
    try {
      const { firstName, lastName, email, password, company_name, phone } = formData;
      const { response, result } = await baseFetcher(
        accountType === "employer" ? "api/employer/register" : "api/register", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: accountType === "jobseeker" ? JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            password_confirmation: formData.password,
            accountType,
          }) : JSON.stringify({
            company_name: company_name,
            email,
            password,
            phone,
            password_confirmation: formData.password,
            accountType,
          })
        }
      );

      if (!response?.ok) {
        if (result.errors && typeof result.errors === 'object') {
          getValidationErrors(result.errors);
          setError(result.message || "Validation failed");
        } else {
          setError(result.message);
        }
      } else {
        toast({
          title: "Success!",
          description: result?.message,
          variant: "default",
        });
        closeRegisterModal();
      }
    } catch (err: any) {
      setError(getValidationErrors(err.data?.errors as Record<string, string[]>));
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    closeRegisterModal();
    openLoginModal();
  };

  return (
    <Dialog open={isRegisterModalOpen} onOpenChange={closeRegisterModal}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="flex justify-between items-center p-5 border-b border-neutral-200">
          <h2 className="text-xl font-semibold">Create Account</h2>
        </div>

        <div className="p-5">
          <div className="flex gap-4 mb-6">
            {!isAuthenticated ? (
              <>
                <Button
                  variant={accountType === "jobseeker" ? "default" : "outline"}
                  className={`flex-1 h-11 ${
                    accountType === "jobseeker" ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setAccountType("jobseeker")}
                >
                  <User className="h-5 w-5 mr-2" />
                  Job Seeker
                </Button>
                <Button
                  variant={accountType === "employer" ? "default" : "outline"}
                  className={`flex-1 h-11 ${
                    accountType === "employer" ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setAccountType("employer")}
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  Employer
                </Button>
              </>
            ) : isEmployer ? (
              <Button
                variant="default"
                className="flex-1 h-11 bg-black text-white"
                disabled
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Employer Account
              </Button>
            ) : (
              <Button
                variant="default"
                className="flex-1 h-11 bg-black text-white"
                disabled
              >
                <User className="h-5 w-5 mr-2" />
                Job Seeker Account
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full h-11 mb-6"
            onClick={() => {
              // Implement Google registration
              console.log("Google registration clicked");
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {accountType === "jobseeker" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Doe"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({ ...formData, company_name: e.target.value })
                      }
                      placeholder="XYZ Company"
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      type="tel"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Create a password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-black text-white hover:bg-neutral-800"
              disabled={isLoading || !accountType}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
        {isAuthenticated ? (
          <></>
        ) : (
          <div className="bg-neutral-50 p-5 text-center border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="text-black hover:text-neutral-800 h-auto p-0"
                onClick={switchToLogin}
              >
                Sign in
              </Button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
