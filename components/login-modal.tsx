"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";
import TwoFactorModal from "./TwoFactorModal";
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
              <span className="text-2xl">👋</span>
            </h2>
          </div>

          <div className="p-6 pt-4">
            {/* Google Sign In Button */}
            <Button
              variant="outline"
              className="w-full h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 rounded-lg"
              onClick={() => {
                console.log("Google login clicked");
              }}
            >
              <div className="w-5 h-5 mr-3 bg-[#F3F9FA] rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
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
                {isLoading ? "Signing in..." : "Create account"}
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