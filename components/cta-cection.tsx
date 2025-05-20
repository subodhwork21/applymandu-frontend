'use client'
import React from "react";
import Link from "next/link";
import { UserPlusIcon, BriefcaseIcon } from "./ui/icons";
import { useAuth } from "@/lib/auth-context";

const CTASection = () => {
   const {
      user,
      isAuthenticated,
      isEmployer,
      logout,
      isLoading,
      openLoginModal,
      openRegisterModal,
    } = useAuth();
  return (
    !isAuthenticated && (
    <section className="py-16  2xl:px-0 px-12 bg-patternPrimary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-normal mb-4 text-white font-nasalization">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="mb-8 text-base text-white">
            Join thousands of professionals who&apos;ve found their dream jobs
            through Applymandu
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <p
            onClick={()=> openRegisterModal(false)}
              className="px-6 py-3 bg-white text-patternText hover:text-patternText/60 rounded-md transition-colors inline-flex items-center justify-center"
            >
              <UserPlusIcon />
              <span className="ml-4">Create an Account</span>
            </p>
            <Link
              href="/jobs"
              className="px-6 py-3 bg-patternPrimary border-[1px] border-[patternText/60!important] text-white rounded-md transition-colors inline-flex items-center justify-center"
            >
              <BriefcaseIcon />
              <span className="ml-4">Browse All Jobs</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  ));
};

export default CTASection;
