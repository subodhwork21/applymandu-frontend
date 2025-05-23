"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Users,
  Building2,
  Laptop2,
  LineChart,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/solid";

const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-[3px]">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-6 w-6 ${
              index < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : index < rating
                ? "text-yellow-400 fill-yellow-400 opacity-50"
                : "text-neutral-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-[#444444] font-semibold">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-white bg-[url('/pattern.jpg')] bg-contain bg-center relative border-b border-neutral-200 py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#000389] to-[#001C4A] opacity-90"></div>
           <div className="relative z-10 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-5xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-normal font-nasalization leading-[60px]">
                Discover Great Places to Work
              </h1>
              <p className="text-manduTertiary text-base font-normal">
                Explore companies hiring now and find your ideal workplace
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search companies by name, industry or location"
                  className="w-full pl-12 pr-4 py-6 text-lg rounded-[44px] placeholder:font-normal placeholder:text-sm text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Featured Companies */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-normal mb-8 font-nasalization text-manduSecondary uppercase">Featured Companies</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "TechCorp Solutions",
                  industry: "Technology",
                  employees: "500+",
                  location: "Kathmandu, Nepal",
                  rating: 4.5,
                  openings: 12,
                },
                {
                  name: "InnoTech Solutions",
                  industry: "Software",
                  employees: "200+",
                  location: "Lalitpur, Nepal",
                  rating: 4.2,
                  openings: 8,
                },
                {
                  name: "DataVision",
                  industry: "Analytics",
                  employees: "100+",
                  location: "Pokhara, Nepal",
                  rating: 4.0,
                  openings: 5,
                },
              ].map((company, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[20px] border border-neutral-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-neutral-800 text-2xl font-semibold">
                         <Image
                          src={ "/logo.png"}
                          alt="Company Logo"
                          width={52}
                          className="rounded-[6.8px]"
                          height={52}
                        />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg mb-1 text-bluePrime font-semibold">
                        {company.name}
                      </h3>
                      <p className="text-patternSecondary text-base font-medium mb-2">
                        {company.industry} • {company.employees} employees
                      </p>
                      <div className="flex items-center text-sm text-patternSecondary mb-3">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{company.location}</span>
                      </div>
                      <div className="mb-4">{renderStars(company.rating)}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs shadow-sm rounded-[50px] bg-neutral-100 px-3 py-1.5 text-neutral-700">
                          {company.openings} Open positions
                        </span>
                        <Button variant="outline" size="sm" className="ml-auto font-semibold bg-manduPrimary text-base text-white rounded-[8px]">
                          View Company
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Industry */}
        <section className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl text-manduSecondary font-nasalization font-normal mb-8">Browse by Industry</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Laptop2,
                  name: "Technology",
                  companies: 450,
                  color: "bg-blue-50",
                  iconColor: "text-blue-600",
                  borderColor: "border-blue-100",
                },
                {
                  icon: LineChart,
                  name: "Finance",
                  companies: 280,
                  color: "bg-green-50",
                  iconColor: "text-green-600",
                  borderColor: "border-green-100",
                },
                {
                  icon: Stethoscope,
                  name: "Healthcare",
                  companies: 150,
                  color: "bg-red-50",
                  iconColor: "text-red-600",
                  borderColor: "border-red-100",
                },
                {
                  icon: GraduationCap,
                  name: "Education",
                  companies: 200,
                  color: "bg-purple-50",
                  iconColor: "text-purple-600",
                  borderColor: "border-purple-100",
                },
              ].map((industry, index) => (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-xl border ${industry.borderColor} hover:shadow-lg transition-all duration-200 cursor-pointer group`}
                >
                  <div
                    className={`w-12 h-12 ${industry.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <industry.icon
                      className={`h-6 w-6 ${industry.iconColor}`}
                    />
                  </div>
                  <h3 className="text-lg font-medium mb-2 group-hover:text-black transition-colors">
                    {industry.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">
                      {industry.companies}+ companies
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Reviews */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">
              Latest Company Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  avatar: "123",
                  role: "Software Engineer",
                  rating: 4,
                  review:
                    "Great work culture and opportunities for growth. Management is supportive and transparent.",
                  company: "TechCorp Solutions",
                  days: 2,
                },
                {
                  avatar: "456",
                  role: "Marketing Specialist",
                  rating: 5,
                  review:
                    "Excellent benefits package and work-life balance. The company truly values its employees.",
                  company: "InnoTech Solutions",
                  days: 5,
                },
                {
                  avatar: "789",
                  role: "Data Analyst",
                  rating: 4,
                  review:
                    "Good learning experience with challenging projects. Professional development is encouraged.",
                  company: "DataVision",
                  days: 7,
                },
              ].map((review, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${review.avatar}`}
                      alt="Reviewer"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium">Anonymous Employee</p>
                      <p className="text-xs text-neutral-500">{review.role}</p>
                    </div>
                  </div>
                  <div className="mb-3">{renderStars(review.rating)}</div>
                  <p className="text-sm text-neutral-600 mb-3">
                    &quot;{review.review}&quot;
                  </p>
                  <p className="text-xs text-neutral-500">
                    {review.company} • Posted {review.days} days ago
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompaniesPage;
