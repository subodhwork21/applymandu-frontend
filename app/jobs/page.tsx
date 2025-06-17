"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page(){
  return <Suspense fallback={<div>Loading...</div>}>
    <JobsRedirect/>
  </Suspense>
}

 function JobsRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If there are search params, convert them to the new URL structure
    if (searchParams.toString()) {
      const segments: string[] = [];
      
      // Convert query params to URL segments
      const search = searchParams.get('search');
      if (search) {
        segments.push('search', encodeURIComponent(search));
      }
      
      const location = searchParams.get('location');
      if (location) {
        segments.push('location', encodeURIComponent(location));
      }
      
      const experienceLevel = searchParams.getAll('experience_level[]');
      if (experienceLevel.length > 0) {
        segments.push('experience', encodeURIComponent(experienceLevel[0]));
      }
      
      const employmentType = searchParams.getAll('employment_type[]');
      if (employmentType.length > 0) {
        segments.push('type', encodeURIComponent(employmentType.join(',')));
      }
      
      const salaryMin = searchParams.get('salary_min');
      if (salaryMin) {
        segments.push('salary-min', encodeURIComponent(salaryMin));
      }
      
      const salaryMax = searchParams.get('salary_max');
      if (salaryMax) {
        segments.push('salary-max', encodeURIComponent(salaryMax));
      }
      
      const skills = searchParams.getAll('skills[]');
      if (skills.length > 0) {
        segments.push('skills', encodeURIComponent(skills.join(',')));
      }
      
      const isRemote = searchParams.get('is_remote');
      if (isRemote === '1') {
        segments.push('remote', 'true');
      }
      
      const page = searchParams.get('page');
      if (page && page !== '1') {
        segments.push('page', page);
      }
      
      const sortBy = searchParams.get('sort_by');
      if (sortBy && sortBy !== 'posted_date') {
        segments.push('sort', sortBy);
      }
      
      // Redirect to new URL structure
      const newUrl = segments.length > 0 ? `/jobs/${segments.join('/')}` : '/jobs/all';
      router.replace(newUrl);
    } else {
      // No search params, redirect to the catch-all route showing all jobs
      router.replace('/jobs/browse/all');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manduSecondary mx-auto mb-4"></div>
        <p className="text-manduSecondary">Redirecting to jobs...</p>
      </div>
    </div>
  );
}
