import { useEffect, useState } from "react";
import { initializeEcho } from '@/lib/echo-setup';
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { employerToken, jobSeekerToken } from "@/lib/tokens";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <>{children}</>

}