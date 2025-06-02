"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Loader2Icon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {isAdminAuthenticated, adminUser} = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin/" },
    { name: "Jobs", href: "/admin/jobs" },
    { name: "Users", href: "/admin/users" },
    { name: "Employers", href: "/admin/employers" },
    {name: "JobSeekers", href: "/admin/jobseekers"},
    { name: "Applications", href: "/admin/applications" },
    {
      name: "Blogs", href: "/admin/blogs",
    },
    { name: "Reports", href: "/admin/reports" },
    { name: "Settings", href: "/admin/settings" },

  ];

  const isActive = (path: string) => {
    return pathname === path;
  };


  // useEffect(()=>{
  //   if (!isAdminAuthenticated) {
  //     router.push("admin-login");
  //   }
  // }, [pathname, adminUser, isAdminAuthenticated, router])

  
  // if(!isAdminAuthenticated){
  //   return (
  //     <section className="w-screen h-screen flex justify-center items-center relative">
  //       <Loader2Icon className="animate-spin h-10 w-10 absolute" />
  //     </section>
  //   );
  // }

  

  return (
    <Suspense fallback={<div>Loading...</div>}>

    <section className="min-h-screen flex flex-col">
      {/* <Header/> */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-2">
          <nav className="flex justify-center space-x-6 overflow-x-auto py-4 mb-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm px-4 py-2 rounded-[8px] whitespace-nowrap cursor-pointer ${
                  isActive(item.href)
                    ? "bg-manduPrimary text-white"
                    : "text-manduPrimary hover:bg-manduPrimary hover:text-white duration-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
      {/* <Footer /> */}
    </section>
    </Suspense>
  );
}
