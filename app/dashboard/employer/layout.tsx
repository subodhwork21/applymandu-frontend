"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { initializeEcho } from "@/lib/echo-setup";

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard/employer" },
    { name: "Job Listings", href: "/dashboard/employer/jobs" },
    { name: "Applications", href: "/dashboard/employer/applications" },
    { name: "Candidates", href: "/dashboard/employer/candidates" },
    { name: "Analytics", href: "/dashboard/employer/analytics" },
    { name: "Settings", href: "/dashboard/employer/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/employer") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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
    </div>
  );
}
