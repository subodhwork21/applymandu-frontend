"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";
import TwoFactorModal from "./TwoFactorModal";
import Image from "next/image";
import { X, Eye, EyeOff } from "lucide-react";

const LoginModal = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    login,
    openRegisterModal,
    openForgotPasswordModal,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToRegister = () => {
    closeLoginModal();
    openRegisterModal();
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    closeLoginModal();
    openForgotPasswordModal();
  };

  return (
    <>
      <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
        <DialogContent className="sm:max-w-md p-0 rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-2xl font-bold text-bluePrime flex items-center gap-2">
              Sign In to Applymandu 
            </h2>
          </div>

          <div className="p-6 pt-4">
            {/* Google Sign In Button */}
            <Button
              variant="outline"
              className="w-full h-12 bg-googleButton border-gray-200 hover:bg-googleButton/80 rounded-lg"
              onClick={() => {
                console.log("Google login clicked");
              }}
            >
              <div className="w-5 h-5 mr-3 bg-googleButton rounded-full flex items-center justify-center shadow-sm">
                <Image
                width={16}
                height={16}
                  src="/Google.png"
                  alt="Google Icon"
                  className="w-4 h-4"
                />
              </div>
              <span className="text-[#313957] font-medium">Sign in with Google</span>
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm">Or Sign up with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@gmail.com"
                  className="h-12 px-4 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 px-4 pr-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm text-patternText font-normal">
                    Remember Me
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="text-sm h-auto p-0 text-patternText hover:text-patternText"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-manduSecondary text-white hover:bg-manduSecondary/80 rounded-lg font-medium mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center pb-6 px-6">
            <p className="text-sm text-gray-600">
              Don't you have an account?{' '}
              <Button
                variant="link"
                className="text-patternText hover:patternText/80 font-medium h-auto p-0"
                onClick={switchToRegister}
              >
                Create One
              </Button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <TwoFactorModal />
    </>
  );
};

export default LoginModal;