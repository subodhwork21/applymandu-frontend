"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  X,
  ChevronRight
} from 'lucide-react';

const QuickStartGuide: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: Calendar,
      title: 'Schedule Interviews',
      description: 'Click on any date or time slot to create a new interview',
      color: 'text-green-600'
    },
    {
      icon: Users,
      title: 'Manage Candidates',
      description: 'Link interviews to job applications and candidate profiles',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Set Reminders',
      description: 'Get notified before important interviews and meetings',
      color: 'text-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Track Progress',
      description: 'Mark interviews as completed, cancelled, or rescheduled',
      color: 'text-orange-600'
    }
  ];

  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900">
            Welcome to Your Calendar
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-blue-800 mb-4">
          Get started with scheduling and managing your interviews and events.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className={`p-2 rounded-lg bg-gray-50 ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">
              Need help? Check out our documentation or contact support.
            </p>
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-300">
              Learn More
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;
