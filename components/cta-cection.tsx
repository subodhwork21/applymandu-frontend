import React from "react";
import Link from "next/link";
import { UserPlusIcon, BriefcaseIcon } from "./ui/icons";

const CTASection = () => {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-neutral-600 mb-8">
            Join thousands of professionals who&apos;ve found their dream jobs
            through Applymandu
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors inline-flex items-center justify-center"
            >
              <UserPlusIcon />
              <span className="ml-2">Create an Account</span>
            </Link>
            <Link
              href="/jobs"
              className="px-6 py-3 bg-white border border-neutral-300 text-neutral-800 rounded-md hover:bg-neutral-100 transition-colors inline-flex items-center justify-center"
            >
              <BriefcaseIcon />
              <span className="ml-2">Browse All Jobs</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
