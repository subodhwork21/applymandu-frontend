"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { initializeEcho } from "@/lib/echo-setup";
import { Loader2Icon } from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "../context/auth-context";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAdminAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard/admin/" },
    { name: "Jobs", href: "/dashboard/admin/jobs" },
    { name: "Users", href: "/dashboard/admin/users" },
    { name: "Employers", href: "/dashboard/admin/employers" },
    { name: "Applications", href: "/dashboard/admin/applications" },
    { name: "Reports", href: "/dashboard/admin/reports" },
    { name: "Settings", href: "/dashboard/admin/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/admin/") {
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

  // Check if user is authenticated and redirect if not
  if (!isLoading && !isAuthenticated) {
    redirect("/dashboard/admin/login");
  }
  
  if(isLoading || !user){
    return (
      <section className="w-screen h-screen flex justify-center items-center relative">
        <Loader2Icon className="animate-spin h-10 w-10 absolute" />
      </section>
    );
  }

  return (
        <AdminAuthProvider>

    <section className="min-h-screen flex flex-col">
      <Header/>
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
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
      <Footer />
    </section>
    </AdminAuthProvider>
  );
}
