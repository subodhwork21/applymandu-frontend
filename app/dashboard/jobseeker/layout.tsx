"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { initializeEcho } from "@/lib/echo-setup";
import { jobSeekerToken } from "@/lib/tokens";
import { Loader2Icon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {user} = useAuth();
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/dashboard/jobseeker/" },
    { name: "My Resume", href: "/dashboard/jobseeker/resume" },
    { name: "Applications", href: "/dashboard/jobseeker/applications" },
    { name: "Saved Jobs", href: "/dashboard/jobseeker/saved" },
    { name: "Job Alerts", href: "/dashboard/jobseeker/alerts" },
    { name: "Settings", href: "/dashboard/jobseeker/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/jobseeker/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const [echoInitialized, setEchoInitialized] = useState(false);
      
  useEffect(() => {
    try {
      initializeEcho();
      setEchoInitialized(true);
    } catch (error) {
      console.error("Failed to initialize Echo:", error);
    }
  }, []);


    if ( (!jobSeekerToken() && typeof window != 'undefined')) {
   redirect("/")
  }
  if(!user){
      <section className="w-screen h-screen flex justify-center items-center relative">
        <Loader2Icon className="animate-spin h-10 w-10 absolute" />
      </section>
  }



  return (
    <section  className="min-h-screen flex flex-col">
      <Header/>
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <nav className="flex justify-center space-x-6 overflow-x-auto py-4 mb-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm px-4 py-2 rounded-full whitespace-nowrap cursor-pointer ${
                  isActive(item.href)
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
      <Footer />
    </section>
  );
}
