import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthSkeleton() {
  return (
    <div className="flex items-center space-x-4">
    {/* Notifications Skeleton */}
    <div className="relative">
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-300" />
    </div>

    {/* Profile Menu Skeleton */}
    <div className="flex items-center space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-28 rounded-sm" />
    </div>
  </div>
  );
}
