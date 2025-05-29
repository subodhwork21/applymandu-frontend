'use client';
import { useAuth } from '@/lib/auth-context';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(()=>{
    if(user){
      router.push('/dashboard/jobseeker');
    }
  }, [user, router]);
}