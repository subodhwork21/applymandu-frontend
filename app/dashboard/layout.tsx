'use client';
import { useEffect, useState } from "react";
import { initializeEcho } from '@/lib/echo-setup';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [echoInitialized, setEchoInitialized] = useState(false);
  
  useEffect(() => {
    try {
      initializeEcho();
      setEchoInitialized(true);
    } catch (error) {
      console.error("Failed to initialize Echo:", error);
    }
  }, []);
  return <>{children}</>

}