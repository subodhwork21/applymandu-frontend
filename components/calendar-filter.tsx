"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Filter } from 'lucide-react';
import { Input } from './ui/input';

interface FilterOptions {
  type: string[];
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface CalendarFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose: () => void;
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose
}) => {
  const eventTypes = [
    { value: 'interview', label: 'Interview', color: 'text-green-600' },
    { value: 'meeting', label: 'Meeting', color: 'text-blue-600' },
    { value: 'deadline', label: 'Deadline', color: 'text-red-600' },
    { value: 'other', label: 'Other', color: 'text-purple-600' },
  ];

  const eventStatuses = [
    { value: 'scheduled', label: 'Scheduled', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
    { value: 'rescheduled', label: 'Rescheduled', color: 'text-yellow-600' },
  ];

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.type, type]
      : filters.type.filter(t => t !== type);
    
    onFiltersChange({
      ...filters,
      type: newTypes
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    
    onFiltersChange({
      ...filters,
      status: newStatuses
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value ? new Date(value) : null
      }
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      type: [],
      status: [],
      dateRange: { start: null, end: null }
    });
  };

  const hasActiveFilters = 
    filters.type.length > 0 || 
    filters.status.length > 0 || 
    filters.dateRange.start || 
    filters.dateRange.end;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="font-medium">Filters</h3>
          {hasActiveFilters && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Event Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Event Types</Label>
          <div className="space-y-2">
            {eventTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.type.includes(type.value)}
                  onCheckedChange={(checked) => 
                    handleTypeChange(type.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`type-${type.value}`}
                  className={`text-sm cursor-pointer ${type.color}`}
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Event Status */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Status</Label>
          <div className="space-y-2">
            {eventStatuses.map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status.value}`}
                  checked={filters.status.includes(status.value)}
                  onCheckedChange={(checked) => 
                    handleStatusChange(status.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`status-${status.value}`}
                  className={`text-sm cursor-pointer ${status.color}`}
                >
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Date Range</Label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="Start date"
              value={filters.dateRange.start ? 
                filters.dateRange.start.toISOString().split('T')[0] : ''
              }
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
            <Input
              type="date"
              placeholder="End date"
              value={filters.dateRange.end ? 
                filters.dateRange.end.toISOString().split('T')[0] : ''
              }
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.type.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {type}
                <button
                  onClick={() => handleTypeChange(type, false)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.status.map((status) => (
              <span
                key={status}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {status}
                <button
                  onClick={() => handleStatusChange(status, false)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Date Range
                <button
                  onClick={() => handleDateRangeChange('start', '')}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarFilters;
