'use client';
import { useEffect, useState } from "react";
import { initializeEcho } from '@/lib/echo-setup';
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const router = useRouter();
  const {user, isEmployer} = useAuth();

if (!user ) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader2Icon className="animate-spin h-10 w-10" />
      </div>
    );
  }

  // useEffect(()=>{
  //   if(!user){
  //     router.push("/");
  //   }
  // }, [user])

  return <>{children}</>

}