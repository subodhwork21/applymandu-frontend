import React from "react";
import Link from "next/link";
import { SocialIcons, LocationIcon, EnvelopeIcon, PhoneIcon } from "./ui/icons";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Applymandu</h3>
            <p className="text-neutral-400 mb-4">
              Your gateway to career opportunities in Nepal and beyond.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <SocialIcons.Facebook />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <SocialIcons.Twitter />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <SocialIcons.LinkedIn />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <SocialIcons.Instagram />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/jobs"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/resume"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Create Resume
                </Link>
              </li>
              <li>
                <Link
                  href="/alerts"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Job Alerts
                </Link>
              </li>
              <li>
                <Link
                  href="/advice"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/post-job"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/resumes"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Browse Resumes
                </Link>
              </li>
              <li>
                <Link
                  href="/recruitment"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Recruitment Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mt-1 mr-2 text-neutral-400">
                  <LocationIcon />
                </div>
                <span className="text-neutral-400">Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center">
                <div className="mr-2 text-neutral-400">
                  <EnvelopeIcon />
                </div>
                <a
                  href="mailto:info@applymandu.com"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  info@applymandu.com
                </a>
              </li>
              <li className="flex items-center">
                <div className="mr-2 text-neutral-400">
                  <PhoneIcon />
                </div>
                <a
                  href="tel:+9771234567"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  +977 1234567
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            © 2025 Applymandu. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/terms"
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
