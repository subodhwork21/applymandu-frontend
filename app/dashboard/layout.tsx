'use client';
import { useEffect, useState } from "react";
import { initializeEcho } from '@/lib/echo-setup';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return <>{children}</>

}