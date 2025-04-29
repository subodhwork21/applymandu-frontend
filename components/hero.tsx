'use client'
import React from "react";
import { SearchIcon } from "./ui/icons";
import { useRouter, useSearchParams } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key == "Enter"){

      router.push("/jobs?search="+e?.currentTarget?.value);
    }
  }
  return (
    <section className="bg-white border-b border-neutral-200 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-bold">
            Your Dream Job Awaits
          </h1>
          <p className="text-neutral-600 text-lg md:text-xl">
            Whether you&apos;re seeking new opportunities or hiring talent, we
            connect the right people with the right positions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1 relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400">
                <SearchIcon />
              </div>
              <input
              onKeyDown={(e)=> handleSearch(e)}
                type="text"
                placeholder="Search jobs, keywords, or companies"
                className="w-full pl-14 md:pl-16 pr-6 py-4 md:py-6 text-base md:text-lg bg-neutral-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
              />
            </div>
            <button className="bg-black text-white px-8 md:px-12 py-4 md:py-6 text-base md:text-lg rounded-xl hover:bg-neutral-800 transition-colors whitespace-nowrap">
              Search Jobs
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="text-sm bg-neutral-100 px-4 py-2 rounded-full hover:bg-neutral-200 cursor-pointer transition-colors">
              Remote
            </span>
            <span className="text-sm bg-neutral-100 px-4 py-2 rounded-full hover:bg-neutral-200 cursor-pointer transition-colors">
              Full-time
            </span>
            <span className="text-sm bg-neutral-100 px-4 py-2 rounded-full hover:bg-neutral-200 cursor-pointer transition-colors">
              Part-time
            </span>
            <span className="text-sm bg-neutral-100 px-4 py-2 rounded-full hover:bg-neutral-200 cursor-pointer transition-colors">
              Entry Level
            </span>
            <span className="text-sm bg-neutral-100 px-4 py-2 rounded-full hover:bg-neutral-200 cursor-pointer transition-colors">
              Experienced
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
