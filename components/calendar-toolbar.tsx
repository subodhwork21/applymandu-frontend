"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar, List, Grid, Clock } from 'lucide-react';
import { View, Views } from 'react-big-calendar';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';

interface CalendarToolbarProps {
  view: View;
  date: Date;
  onView: (view: View) => void;
  onNavigate: (date: Date) => void;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  view,
  date,
  onView,
  onNavigate
}) => {
  const navigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    let newDate = new Date(date);

    switch (action) {
      case 'PREV':
        if (view === Views.MONTH) {
          newDate = subMonths(date, 1);
        } else if (view === Views.WEEK) {
          newDate = subWeeks(date, 1);
        } else if (view === Views.DAY) {
          newDate = subDays(date, 1);
        }
        break;
      case 'NEXT':
        if (view === Views.MONTH) {
          newDate = addMonths(date, 1);
        } else if (view === Views.WEEK) {
          newDate = addWeeks(date, 1);
        } else if (view === Views.DAY) {
          newDate = addDays(date, 1);
        }
        break;
      case 'TODAY':
        newDate = new Date();
        break;
    }

    onNavigate(newDate);
  };

  const getDateLabel = () => {
    switch (view) {
      case Views.MONTH:
        return format(date, 'MMMM yyyy');
      case Views.WEEK:
        return format(date, 'MMM dd, yyyy');
      case Views.DAY:
        return format(date, 'EEEE, MMM dd, yyyy');
      case Views.AGENDA:
        return 'Agenda';
      default:
        return format(date, 'MMM yyyy');
    }
  };

  const viewOptions = [
    { value: Views.MONTH, label: 'Month', icon: Grid },
    { value: Views.WEEK, label: 'Week', icon: Calendar },
    { value: Views.DAY, label: 'Day', icon: Clock },
    { value: Views.AGENDA, label: 'Agenda', icon: List },
  ];

  return (
    <div className="flex items-center justify-between mb-4 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('TODAY')}
        >
          Today
        </Button>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('PREV')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('NEXT')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 ml-2">
          {getDateLabel()}
        </h2>
      </div>

      {/* View Selector */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex border border-gray-200 rounded-lg p-1">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={view === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => onView(option.value as View)}
                className="flex items-center gap-1"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{option.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Mobile View Selector */}
        <div className="md:hidden">
          <Select value={view} onValueChange={(value) => onView(value as View)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {viewOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
