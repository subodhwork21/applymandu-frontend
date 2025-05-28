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
  Briefcase,
  ShoppingBag,
  Utensils,
  Truck,
  Film,
  Phone,
  Lightbulb,
  Building,
  Landmark,
  Scale,
  Heart,
  Plane,
  ShoppingCart,
  Coffee,
  Shield,
  BarChart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";
import { defaultFetcher } from "@/lib/fetcher";
import DataNavigation from "@/components/ui/data-navigation";

interface Company {
  id: number;
  first_name: string | null;
  last_name: string | null;
  company_name: string;
  email: string;
  phone: string;
  image_path: string;
  profile: {
    id: number;
    address: string;
    size: string;
    user_id: number;
    industry: string;
    logo: string;
  };
}

interface ApiResponse {
  data: Company[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

  const getIndustryName = (industryKey: string) => {
    const industries: Record<string, string> = {
      technology: "Technology",
      healthcare: "Healthcare",
      finance: "Finance",
      education: "Education",
      it: "Information Technology",
      engineering: "Engineering",
      design: "Design",
      marketing: "Marketing",
      sales: "Sales",
      hr: "Human Resources",
      operations: "Operations",
      product: "Product",
      customer_support: "Customer Support",
      manufacturing: "Manufacturing",
      retail: "Retail",
      hospitality: "Hospitality & Tourism",
      construction: "Construction",
      agriculture: "Agriculture",
      transportation: "Transportation & Logistics",
      media: "Media & Entertainment",
      telecom: "Telecommunications",
      energy: "Energy & Utilities",
      real_estate: "Real Estate",
      consulting: "Consulting & Professional Services",
      legal: "Legal Services",
      nonprofit: "Non-Profit & NGO",
      government: "Government & Public Sector",
      pharma: "Pharmaceuticals & Biotechnology",
      automotive: "Automotive",
      aerospace: "Aerospace & Defense",
      ecommerce: "E-commerce",
      food: "Food & Beverage",
      insurance: "Insurance",
    };
    
    return industries[industryKey] || industryKey.charAt(0).toUpperCase() + industryKey.slice(1).replace('_', ' ');
  };

  interface IndustryResponse {
  success: boolean;
  message: string;
  data: Record<string, number>;
}

const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("api/all-companies");

  const { data: companiesResponse, error, isLoading, mutate } = useSWR<ApiResponse>(
    currentPage,
    defaultFetcher
  );

  const {data: industriesResponse, isLoading:industryLoading,  error: industryError, mutate: mutateIndustries} = useSWR<IndustryResponse>(
    "api/all-industries",
    defaultFetcher
  );

  const handlePageChange = (url: string) => {
    // Extract the API endpoint from the full URL
    const apiPath = url.split("/api/")[1];
    setCurrentPage(`api/${apiPath}`);
  };

   const getIndustryIcon = (industryKey: string) => {
    const industryIcons: Record<string, any> = {
      technology: { icon: Laptop2, color: "bg-blue-50", iconColor: "text-blue-600", borderColor: "border-blue-100", hoverColor: "hover:bg-blue-50" },
      healthcare: { icon: Stethoscope, color: "bg-red-50", iconColor: "text-red-600", borderColor: "border-red-100", hoverColor: "hover:bg-red-50" },
      finance: { icon: LineChart, color: "bg-green-50", iconColor: "text-green-600", borderColor: "border-green-100", hoverColor: "hover:bg-green-50" },
      education: { icon: GraduationCap, color: "bg-purple-50", iconColor: "text-purple-600", borderColor: "border-purple-100", hoverColor: "hover:bg-purple-50" },
      manufacturing: { icon: Building2, color: "bg-gray-50", iconColor: "text-gray-600", borderColor: "border-gray-100", hoverColor: "hover:bg-gray-50" },
      retail: { icon: ShoppingBag, color: "bg-pink-50", iconColor: "text-pink-600", borderColor: "border-pink-100", hoverColor: "hover:bg-pink-50" },
      hospitality: { icon: Utensils, color: "bg-yellow-50", iconColor: "text-yellow-600", borderColor: "border-yellow-100", hoverColor: "hover:bg-yellow-50" },
      construction: { icon: Building, color: "bg-orange-50", iconColor: "text-orange-600", borderColor: "border-orange-100", hoverColor: "hover:bg-orange-50" },
      agriculture: { icon: Lightbulb, color: "bg-lime-50", iconColor: "text-lime-600", borderColor: "border-lime-100", hoverColor: "hover:bg-lime-50" },
      transportation: { icon: Truck, color: "bg-indigo-50", iconColor: "text-indigo-600", borderColor: "border-indigo-100", hoverColor: "hover:bg-indigo-50" },
      media: { icon: Film, color: "bg-rose-50", iconColor: "text-rose-600", borderColor: "border-rose-100", hoverColor: "hover:bg-rose-50" },
      telecom: { icon: Phone, color: "bg-sky-50", iconColor: "text-sky-600", borderColor: "border-sky-100", hoverColor: "hover:bg-sky-50" },
      energy: { icon: Lightbulb, color: "bg-amber-50", iconColor: "text-amber-600", borderColor: "border-amber-100", hoverColor: "hover:bg-amber-50" },
      real_estate: { icon: Building, color: "bg-emerald-50", iconColor: "text-emerald-600", borderColor: "border-emerald-100", hoverColor: "hover:bg-emerald-50" },
      consulting: { icon: Briefcase, color: "bg-violet-50", iconColor: "text-violet-600", borderColor: "border-violet-100", hoverColor: "hover:bg-violet-50" },
      legal: { icon: Scale, color: "bg-slate-50", iconColor: "text-slate-600", borderColor: "border-slate-100", hoverColor: "hover:bg-slate-50" },
      nonprofit: { icon: Heart, color: "bg-red-50", iconColor: "text-red-600", borderColor: "border-red-100", hoverColor: "hover:bg-red-50" },
      government: { icon: Landmark, color: "bg-blue-50", iconColor: "text-blue-600", borderColor: "border-blue-100", hoverColor: "hover:bg-blue-50" },
      pharma: { icon: Stethoscope, color: "bg-teal-50", iconColor: "text-teal-600", borderColor: "border-teal-100", hoverColor: "hover:bg-teal-50" },
      automotive: { icon: Truck, color: "bg-zinc-50", iconColor: "text-zinc-600", borderColor: "border-zinc-100", hoverColor: "hover:bg-zinc-50" },
      aerospace: { icon: Plane, color: "bg-cyan-50", iconColor: "text-cyan-600", borderColor: "border-cyan-100", hoverColor: "hover:bg-cyan-50" },
      ecommerce: { icon: ShoppingCart, color: "bg-fuchsia-50", iconColor: "text-fuchsia-600", borderColor: "border-fuchsia-100" , hoverColor: "hover:bg-fuchsia-50" },
      food: { icon: Coffee, color: "bg-amber-50", iconColor: "text-amber-600", borderColor: "border-amber-100" , hoverColor: "hover:bg-amber-50" },
      insurance: { icon: Shield, color: "bg-blue-50", iconColor: "text-blue-600", borderColor: "border-blue-100" , hoverColor: "hover:bg-blue-50" },
      marketing: { icon: BarChart, color: "bg-purple-50", iconColor: "text-purple-600", borderColor: "border-purple-100", hoverColor: "hover:bg-purple-50" },
    };
    return industryIcons[industryKey] || { 
      icon: Building2, 
      color: "bg-gray-50", 
      iconColor: "text-gray-600", 
      borderColor: "border-gray-100" 
    };
  };

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

  // Function to get industry display name
  const getIndustryName = (industryKey: string) => {
    const industries: Record<string, string> = {
      technology: "Technology",
      healthcare: "Healthcare",
      finance: "Finance",
      education: "Education",
      it: "Information Technology",
      engineering: "Engineering",
      design: "Design",
      marketing: "Marketing",
      sales: "Sales",
      hr: "Human Resources",
      operations: "Operations",
      product: "Product",
      customer_support: "Customer Support",
    };
    
    return industries[industryKey] || industryKey;
  };

  // Function to get company size display text
  const getCompanySize = (size: string) => {
    const sizes: Record<string, string> = {
      "1-50": "1-50 employees",
      "51-200": "51-200 employees",
      "201-500": "201-500 employees",
      "501-1000": "501-1000 employees",
      "1000+": "1000+ employees",
    };
    
    return sizes[size] || `${size} employees`;
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
        <section className="py-12 bg-white 2xl:px-0 lg:px-12 px-4">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-normal mb-8 font-nasalization text-manduSecondary uppercase">Featured Companies</h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-[20px] border border-neutral-200 p-6 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-neutral-200 rounded-xl flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                        <div className="h-4 bg-neutral-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-neutral-200 rounded mb-3 w-1/2"></div>
                        <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                          <div className="h-8 bg-neutral-200 rounded ml-auto w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading companies. Please try again later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companiesResponse?.data.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white rounded-[20px] border border-neutral-200 p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-neutral-800 text-sm">
                            <Image
                              src={company.image_path || "/logo.png"}
                              alt="Company Logo"
                              width={52}
                              className="rounded-[6.8px]"
                              height={52}
                            />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg mb-1 text-bluePrime font-semibold">
                            {company.company_name}
                          </h3>
                          <p className="text-patternSecondary text-base font-medium mb-2">
                            {getIndustryName(company.profile?.industry || "")} • {getCompanySize(company.profile?.size || "")}
                          </p>
                          <div className="flex items-center text-sm text-patternSecondary mb-3">
                            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{company.profile?.address || "Location not specified"}</span>
                          </div>
                          <div className="mb-4">{renderStars(4.0)}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs shadow-sm rounded-[50px] bg-neutral-100 px-3 py-1.5 text-neutral-700">
                              5 Open positions
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
                
                {/* Pagination */}
                {companiesResponse?.meta && (
                  <div className="mt-8">
                    <DataNavigation meta={companiesResponse.meta} onPageChange={handlePageChange} />
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Browse by Industry */}
        <section className="py-12 bg-neutral-50 2xl:px-0 lg:px-12 px-4">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl text-manduSecondary font-nasalization font-normal mb-8">Browse by Industry</h2>

            {industryLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 animate-pulse">
                    <div className="w-12 h-12 bg-neutral-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {industriesResponse?.data && Object.entries(industriesResponse.data)
                  // Filter out industries with 0 companies if you want
                  // .filter(([_, count]) => count > 0)
                  // Or show all industries but limit to top 8 or so
                  .map(([industry, count]) => {
                    const { icon: IndustryIcon, hoverColor, color, iconColor, borderColor } = getIndustryIcon(industry);
                    return (
                      <div
                        key={industry}
                        className={`bg-white p-6 rounded-xl border ${borderColor} ${hoverColor} transition-all duration-600 cursor-pointer group`}
                      >
                        <div  
                          className={`w-10 h-10 ${color} rounded-full flex items-center justify-center mb-4 group-hover:scale-[1.3] duration-700 transition-transform`}
                        >
                          <IndustryIcon
                            className={`h-6 w-6 rounded-full ${iconColor}`}
                          />
                        </div>
                        <h3 className="text-lg font-medium mb-2 group-hover:text-black transition-colors capitalize">
                          {getIndustryName(industry)}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600">
                            {count} {count === 1 ? 'company' : 'companies'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </section>

        {/* Company Reviews */}
        <section className="py-12 bg-white 2xl:px-0 lg:px-12 px-4">
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
