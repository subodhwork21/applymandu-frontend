"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Eye, EyeOff, User, Building, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { baseFetcher } from "@/lib/fetcher";
import { getValidationErrors } from "@/lib/validation-error";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const RegisterModal = () => {
  const { toast } = useToast();
  const {
    isRegisterModalOpen,
    closeRegisterModal,
    openLoginModal,
    isEmployer,
    isAuthenticated,
  } = useAuth();
  const [seekFor, setSeekFor] = useState<"employer" | "jobseeker" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Account type, Step 2: Form details

  useEffect(() => {
    if (isAuthenticated && isEmployer) {
      setSeekFor("jobseeker");
    } else if (isAuthenticated && !isEmployer) {
      setSeekFor("employer");
    } else {
      setSeekFor(null);
    }
  }, [isAuthenticated, isEmployer]);

  // Reset step when modal is closed
  useEffect(() => {
    if (!isRegisterModalOpen) {
      setStep(1);
    }
  }, [isRegisterModalOpen]);

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

    if (!seekFor) {
      setError("Please select an account type");
      return;
    }

    setIsLoading(true);
    try {
      const { firstName, lastName, email, password, company_name, phone } = formData;
      const { response, result, errors } = await baseFetcher(
        seekFor === "employer" ? "api/employer/register" : "api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:
            seekFor === "jobseeker"
              ? JSON.stringify({
                  first_name: firstName,
                  last_name: lastName,
                  email,
                  password,
                  password_confirmation: formData.password,
                  seekFor,
                })
              : JSON.stringify({
                  company_name: company_name,
                  email,
                  password,
                  phone,
                  password_confirmation: formData.password,
                  seekFor,
                }),
        }
      );

      if (!response?.ok) {
        if (result.errors && typeof result.errors === "object") {
          getValidationErrors(result.errors);
          setError(errors || "Validation failed");
        } else {
          setError(errors);
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

  const goToNextStep = () => {
    if (!seekFor) {
      setError("Please select an account type");
      return;
    }
    setError("");
    setStep(2);
  };

  const goToPreviousStep = () => {
    setStep(1);
    setError("");
  };

  return (
    <Dialog open={isRegisterModalOpen} onOpenChange={closeRegisterModal}>
      <DialogContent className="sm:max-w-md pt-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          {step === 2 && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              onClick={goToPreviousStep}
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Button>
          )}
          <h1 className="text-2xl font-semibold text-bluePrime">
            {step === 1 ? "Create Account" : seekFor === "jobseeker" ? "Job Seeker Account" : "Employer Account"}
          </h1>
          {/* <Button
            variant="ghost"
            size="icon"
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            onClick={closeRegisterModal}
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button> */}
        </div>

        {step === 1 ? (
          <div className="p-6">
            {/* User Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6 gap-3">
              {!isAuthenticated ? (
                <>
                  <Button
                    type="button"
                    onClick={() => setSeekFor("jobseeker")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      seekFor === "jobseeker"
                        ? "bg-manduPrimary text-white shadow-sm hover:bg-manduPrimary/90"
                        : "bg-white  text-manduPrimary hover:bg-white"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Job Seeker
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setSeekFor("employer")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      seekFor === "employer"
                        ? "bg-manduPrimary text-white shadow-sm hover:bg-manduPrimary/90"
                        : "bg-white text-manduPrimary hover:bg-white"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    Employer
                  </Button>
                </>
              ) : seekFor === "employer" ? (
                <Button
                  variant="default"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-pink-500 text-white"
                  disabled
                >
                  <Building className="w-4 h-4" />
                  Employer Account
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 text-white"
                  disabled
                >
                  <User className="w-4 h-4" />
                  Job Seeker Account
                </Button>
              )}
            </div>

            {/* Google Sign Up Button */}
            <Button
              variant="outline"
              className="w-full bg-googleButton border border-gray-200 rounded-[12px] py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors mb-6 h-auto"
              onClick={() => {
                // Implement Google registration
                console.log("Google registration clicked");
              }}
            >
              <Image src="/google.png" alt="Google" width={24} height={24} />
              <span className="text-googleButtonText font-normal text-base">Sign in with Google</span>
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-[#313131] text-sm">Or Sign up with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Continue Button */}
            <Button
              type="button"
              className="w-full bg-manduSecondary text-white py-3 px-4 rounded-lg font-medium hover:manduSecondary/80 transition-colors h-auto"
              onClick={goToNextStep}
              disabled={!seekFor}
            >
              Continue
            </Button>

            {/* Sign In Link */}
            {!isAuthenticated && (
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800 font-medium p-0 h-auto"
                  onClick={switchToLogin}
                >
                  Login
                </Button>
              </p>
            )}
          </div>
        ) : (
          <div className="p-6">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              {/* Name Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {seekFor === "jobseeker" ? (
                  <>
                    <div>
                      <Label htmlFor="firstName" className="block text-sm font-normal text-labels mb-1">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="block text-sm font-normal text-labels mb-1">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-1 sm:col-span-2">
                      <Label htmlFor="company_name" className="block text-sm font-normal text-labels mb-1">
                        Company Name
                      </Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="XYZ Company"
                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <Label htmlFor="phone" className="block text-sm font-normal text-labels mb-1">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        type="tel"
                        placeholder="Phone number"
                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="block text-sm font-normal text-labels mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@gmail.com"
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="block text-sm font-normal text-labels mb-1">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a password"
                    className="w-full px-3 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-labels"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-normal text-labels mb-1">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    className="w-full px-3 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-2 mt-6">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="terms" className="text-sm text-manduBorder">
                  I agree to all the{" "}
                  <Button variant="link" className="text-manduSecondary hover:text-manduSecondary/90 font-medium p-0 h-auto">
                    Terms
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="text-manduSecondary hover:text-manduSecondary/90  font-medium p-0 h-auto">
                    Privacy Policies
                  </Button>
                </Label>
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full bg-manduSecondary text-white py-3 px-4 rounded-lg font-medium hover:bg-manduSecondary/90 transition-colors mt-6 h-auto"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? "Creating Account..." : "Create account"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
