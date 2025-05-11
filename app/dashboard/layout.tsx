'use client';
import { useEffect, useState } from "react";
import { initializeEcho } from '@/lib/echo-setup';
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const router = useRouter();
  const {user, isEmployer} = useAuth();
  if(!user) {
    router.push("/");
    return <></>
  }
  return <>{children}</>

}