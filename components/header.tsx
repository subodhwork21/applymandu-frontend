"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "./ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  LogOut,
  Settings,
  User,
  Briefcase,
  BookMarked,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, openLoginModal, openRegisterModal } =
    useAuth();

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center cursor-pointer">
              <div className="text-3xl">
                <span className="text-black">Apply</span>
                <span className="text-neutral-800">mandu</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-sm hover:text-neutral-900 cursor-pointer transition-colors"
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className="text-sm hover:text-neutral-900 cursor-pointer transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/companies"
              className="text-sm hover:text-neutral-900 cursor-pointer transition-colors"
            >
              Companies
            </Link>
            <Link
              href="/resources"
              className="text-sm hover:text-neutral-900 cursor-pointer transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/about"
              className="text-sm hover:text-neutral-900 cursor-pointer transition-colors"
            >
              About Us
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-neutral-600" />
                      <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">Notifications</p>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 text-xs text-neutral-600 hover:text-neutral-900"
                        >
                          Mark all as read
                        </Button>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-auto">
                      <DropdownMenuItem className="flex items-start p-4 cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            New job match found
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Senior Developer position at TechCorp matches your
                            profile
                          </p>
                          <p className="text-xs text-neutral-400 mt-2">
                            2 hours ago
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-start p-4 cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <BookMarked className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Application viewed
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Your application for Product Designer at DesignCo
                            was viewed
                          </p>
                          <p className="text-xs text-neutral-400 mt-2">
                            1 day ago
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-start p-4 cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <CreditCard className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Subscription renewed
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Your premium subscription has been renewed
                            successfully
                          </p>
                          <p className="text-xs text-neutral-400 mt-2">
                            2 days ago
                          </p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <Link
                        href="/notifications"
                        className="text-sm text-center w-full text-neutral-600 hover:text-neutral-900"
                      >
                        View all notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 h-auto p-1"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                          alt={user?.name}
                        />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-neutral-800">
                        {user?.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-neutral-600">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link href="/dashboard/jobseeker/">
                        <DropdownMenuItem>
                          <span>Dasboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard/jobseeker/applications">
                        <DropdownMenuItem>
                          <span>My Applications</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard/jobseeker/saved">
                        <DropdownMenuItem>
                          <span>Saved Jobs</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard/jobseeker/settings">
                        <DropdownMenuItem>
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard/employer">
                        <DropdownMenuItem>
                          <span>Employer</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  className="hidden md:flex bg-black text-white hover:bg-neutral-800"
                  onClick={openLoginModal}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="hidden md:flex bg-white border-neutral-200 hover:bg-neutral-50"
                  onClick={openRegisterModal}
                >
                  Register
                </Button>
              </>
            )}
            <button
              className="md:hidden text-neutral-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white border-t border-neutral-200 mt-3">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm hover:text-neutral-900 cursor-pointer px-2 py-1"
              >
                Home
              </Link>
              <Link
                href="/jobs"
                className="text-sm hover:text-neutral-900 cursor-pointer px-2 py-1"
              >
                Browse Jobs
              </Link>
              <Link
                href="/companies"
                className="text-sm hover:text-neutral-900 cursor-pointer px-2 py-1"
              >
                Companies
              </Link>
              <Link
                href="/resources"
                className="text-sm hover:text-neutral-900 cursor-pointer px-2 py-1"
              >
                Resources
              </Link>
              <Link
                href="/about"
                className="text-sm hover:text-neutral-900 cursor-pointer px-2 py-1"
              >
                About Us
              </Link>
              {!isAuthenticated && (
                <div className="flex space-x-4 pt-2">
                  <Button
                    className="flex-1 bg-black text-white hover:bg-neutral-800"
                    onClick={openLoginModal}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white border-neutral-200 hover:bg-neutral-50"
                    onClick={openRegisterModal}
                  >
                    Register
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
