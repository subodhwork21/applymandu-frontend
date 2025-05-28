import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { employerToken } from '@/lib/tokens';
import Image from 'next/image';

interface StatusHistory {
  id: number;
  application_id: number;
  status: string;
  remarks: string | null;
  changed_at: string;
  created_at: string;
  updated_at: string;
}

interface Application {
  id: number;
  job_id: number;
  user_id: number;
  year_of_experience: number;
  expected_salary: number;
  notice_period: number;
  cover_letter: string;
  applied_at: string;
  formatted_applied_at: string;
  updated_at: string;
  status: number;
  job_title: string;
  company_name: string;
  applied_user: string;
  user_image: string;
  skills: string[];
  status_history: StatusHistory[];
}

interface ApplicationsResponse {
  data: Application[];
}

const fetcher = async (url: string) => {
  const token = employerToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  
  return response.json();
};

const RecentApplications = () => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<ApplicationsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}api/dashboard/recent-applications`,
    fetcher
  );
  
  // Helper function to get the current status label
  const getStatusLabel = (application: Application) => {
    if (application.status_history && application.status_history.length > 0) {
      const latestStatus = application.status_history[0].status;
      
      switch (latestStatus) {
        case 'interview_scheduled':
          return 'Interview Scheduled';
        case 'shortlisted':
          return 'Shortlisted';
        case 'rejected':
          return 'Rejected';
        case 'hired':
          return 'Hired';
        default:
          return 'Under Review';
      }
    }
    return 'Under Review';
  };
  
  // Helper function to get status color classes
  const getStatusColorClasses = (status: string) => {
    switch (status) {
      case 'Interview Scheduled':
        return 'bg-blue-50 text-blue-300';
      case 'Shortlisted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Hired':
        return 'bg-[#15FA244D]/30 text-[#3BB900]';
      default:
        return 'bg-[#F2FA154D]/30 text-[#B99400]';
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8">
          <p className="text-neutral-500">Loading recent applications...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8">
          <p className="text-red-500">Error loading applications. Please try again.</p>
        </div>
      </div>
    );
  }
  
  if (!data || data.data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8">
          <p className="text-neutral-500">No recent applications found.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {data.data.map((application) => {
        const statusLabel = getStatusLabel(application);
        const statusColorClasses = getStatusColorClasses(statusLabel);
        
        return (
          <div key={application.id} className="flex items-center md:flex-row flex-col md:gap-6 gap-4 justify-between md:p-4 px-2 pb-4 border border-neutral-200 rounded-md">
            <div className="flex items-center space-x-4">
              <Image
              width={79}
              height={79}
                src={application.user_image || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${application.user_id}`}
                alt={application.applied_user}
                className="w-[79px] h-[79px] rounded-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${application.user_id}`;
                }}
              />
              <div>
                <h3 className="text-lg text-manduPrimary">{application.applied_user}</h3>
                <p className="text-sm text-pureGray">
                  {application.job_title} • {application.year_of_experience} years experience
                </p>
                <span className={`inline-block px-2 py-1 ${statusColorClasses} rounded-full text-xs mt-2`}>
                  {statusLabel}
                </span>
              </div>
            </div>
            <Button
            className='bg-[#DC143C] px-3 py-4 rounded-[8px] text-white'
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/dashboard/employer/applications/${application.id}`)
              }
            >
              {statusLabel === 'Under Review' ? 'Start Review' : 'View Details'}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default RecentApplications;
