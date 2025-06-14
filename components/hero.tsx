'use client'
import React from "react";
import { SearchIcon } from "./ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Clock, Globe, RocketIcon, TrendingUp } from "lucide-react";

const Hero = () => {
  const router = useRouter();
  const [inputSearch, setInputSearch] = React.useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key == "Enter"){

      router.push("/jobs?search="+e?.currentTarget?.value);
    }
  }
  return (
    <section className="bg-white border-b border-neutral-200 py-20 bg-[url('/pattern.jpg')] bg-contain bg-center relative">
       <div className="absolute inset-0 bg-gradient-to-r from-[#000389] to-[#001C4A] opacity-90"></div>
       <div className="relative z-10 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mx-auto mb-16 w-full">
          <h1 className="text-4xl md:text-5xl lg:text-h2 mb-6 font-normal font-nasalization">
            Your Dream Job Awaits
          </h1>
          <p className="text-manduTertiary text-lg md:text-xl leading-7 w-full">
            Whether you&apos;re seeking new opportunities or hiring talent, we
            connect the right people with the right positions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto rounded-2xl shadow-lg p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 rounded-[50px] md:bg-white px-[2px] py-[2px]">
            <div className="flex-1 relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#757575]">
                <SearchIcon/>
              </div>
              <input
              value={inputSearch}
              onChange={(e)=> setInputSearch(e?.target?.value)}
              onKeyDown={(e)=> handleSearch(e)}
                type="text"
                placeholder="Search jobs, keywords, or companies"
                className="w-full placeholder:text-[#757575] pl-14 md:pl-16 pr-6 py-3 md:py-3 text-manduCustom-secondary-blue text-base md:text-lg bg-neutral-50 rounded-[50px] border-none focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
              />
            </div>
            <button onClick={(e)=> router.push("/jobs?search="+inputSearch)} className="bg-manduSecondary rounded-[50px] text-white px-8 md:px-6 py-2 md:py-2 text-base md:text-lg md:font-[600] hover:bg-neutral-800 transition-colors whitespace-nowrap">
              Search Jobs
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-3">
            <button onClick={(e)=> router.push("/jobs?employment_type[]="+"remote")} className="flex items-center gap-2 md:px-6 md:py-3 px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all">
        <Globe size={20} />
        <span className="text-body2">Remote</span>
      </button>
      
      <button onClick={(e)=> router.push("/jobs?employment_type[]="+"Full-time")} className="flex items-center gap-2 md:px-6 md:py-3 px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all">
        <Briefcase size={20} />
        <span className="text-body2">Full-time</span>
      </button>
      
      <button onClick={(e)=> router.push("/jobs?employment_type[]="+"Part-time")} className="flex items-center gap-2 md:px-6 md:py-3 px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all">
        <Clock size={20} />
        <span className="text-body2">Part-time</span>
      </button>
      
      <button onClick={(e)=> router.push("/jobs?experience_level[]="+"Entry Level")} className="flex items-center gap-2 md:px-6 md:py-3 px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all">
        <TrendingUp size={20} />
        <span className="text-body2">Entry Level</span>
      </button>

        <button onClick={(e)=> router.push("/jobs?experience_level[]="+"Senior Level")} className="flex items-center gap-2 md:px-6 md:py-3 px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all">
        <RocketIcon size={20} />
        <span className="text-body2">Experienced</span>
      </button>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Hero;
