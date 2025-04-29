"use client"
import { Job } from '@/types/job-type';
import React, { createContext, useContext, useState } from 'react';
// import { Job } from './constants';

interface ApplicationContextType {
  isApplyOpen: boolean;
  selectedJob: Job | null;
  openApplicationPanel: (job: Job) => void;
  closeApplicationPanel: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const openApplicationPanel = (job: Job) => {
    setSelectedJob(job);
    setIsApplyOpen(true);
  };

  const closeApplicationPanel = () => {
    setIsApplyOpen(false);
    setSelectedJob(null);
  };

  return (
    <ApplicationContext.Provider 
      value={{ 
        isApplyOpen, 
        selectedJob, 
        openApplicationPanel, 
        closeApplicationPanel 
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}