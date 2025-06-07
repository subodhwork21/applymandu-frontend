'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, DollarSign, Calendar, GraduationCap, Briefcase, Clock } from 'lucide-react';
import { ResumeSearchFilters } from '@/types/resume-search';
import { baseFetcher } from '@/lib/fetcher';

interface ResumeFiltersProps {
  filters: ResumeSearchFilters;
  onFiltersChange: (filters: ResumeSearchFilters) => void;
  onApply: () => void;
  onClose: () => void;
}

const ResumeFilters: React.FC<ResumeFiltersProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onClose
}) => {
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [skillSearch, setSkillSearch] = useState('');

  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Executive Level',
    'Internship'
  ];

  const availabilityStatuses = [
    { value: 'available', label: 'Available' },
    { value: 'not_available', label: 'Not Available' },
    { value: 'open_to_offers', label: 'Open to Offers' }
  ];

  const educationLevels = [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Professional Certification'
  ];

  const lastActiveOptions = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'all', label: 'All Time' }
  ];

  // Fetch available skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { response, result } = await baseFetcher('api/skills', {
          method: 'GET',
        });

        if (response?.ok && result?.success) {
          setAvailableSkills(result.data.map((skill: any) => skill.name));
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { response, result } = await baseFetcher('api/employer/jobs', {
          method: 'GET',
        });

        if (response?.ok && result?.success) {
          setAvailableJobs(result.data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    const newLevels = checked
      ? [...filters.experience_level, level]
      : filters.experience_level.filter(l => l !== level);
    
    onFiltersChange({
      ...filters,
      experience_level: newLevels
    });
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    const newSkills = checked
      ? [...filters.skills, skill]
      : filters.skills.filter(s => s !== skill);
    
    onFiltersChange({
      ...filters,
      skills: newSkills
    });
  };

  const handleAvailabilityChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.availability_status, status]
      : filters.availability_status.filter(s => s !== status);
    
    onFiltersChange({
      ...filters,
      availability_status: newStatuses
    });
  };

  const handleEducationChange = (level: string, checked: boolean) => {
    const newLevels = checked
      ? [...filters.education_level, level]
      : filters.education_level.filter(l => l !== level);
    
    onFiltersChange({
      ...filters,
      education_level: newLevels
    });
  };

  const handleSalaryRangeChange = (field: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      salary_range: {
        ...filters.salary_range,
        [field]: value ? parseInt(value) : null
      }
    });
  };

  const handleExperienceYearsChange = (field: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      experience_years: {
        ...filters.experience_years,
        [field]: value ? parseInt(value) : null
      }
    });
  };

  const removeSkill = (skillToRemove: string) => {
    onFiltersChange({
      ...filters,
      skills: filters.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !filters.skills.includes(skill)
  );

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Advanced Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Location Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              placeholder="Enter city or region"
              value={filters.location}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            />
          </div>

          {/* Job Matching */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="w-4 h-4" />
              Match Against Job
            </Label>
            <Select
              value={filters.job_id}
              onValueChange={(value) => onFiltersChange({ ...filters, job_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Jobs</SelectItem>
                {availableJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id.toString()}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Last Active */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Last Active
            </Label>
            <Select
              value={filters.last_active}
              onValueChange={(value) => onFiltersChange({ ...filters, last_active: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lastActiveOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4" />
            Expected Salary Range
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min salary"
              value={filters.salary_range.min || ''}
              onChange={(e) => handleSalaryRangeChange('min', e.target.value)}
              className="flex-1"
            />
            <span className="text-gray-500">to</span>
            <Input
              type="number"
              placeholder="Max salary"
              value={filters.salary_range.max || ''}
              onChange={(e) => handleSalaryRangeChange('max', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Experience Years */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Years of Experience
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min years"
              value={filters.experience_years.min || ''}
              onChange={(e) => handleExperienceYearsChange('min', e.target.value)}
              className="flex-1"
            />
            <span className="text-gray-500">to</span>
            <Input
              type="number"
              placeholder="Max years"
              value={filters.experience_years.max || ''}
              onChange={(e) => handleExperienceYearsChange('max', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Experience Level</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {experienceLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`exp-${level}`}
                  checked={filters.experience_level.includes(level)}
                  onCheckedChange={(checked) => handleExperienceLevelChange(level, checked as boolean)}
                />
                <Label htmlFor={`exp-${level}`} className="text-sm">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Availability Status</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availabilityStatuses.map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`avail-${status.value}`}
                  checked={filters.availability_status.includes(status.value)}
                  onCheckedChange={(checked) => handleAvailabilityChange(status.value, checked as boolean)}
                />
                <Label htmlFor={`avail-${status.value}`} className="text-sm">
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Education Level */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <GraduationCap className="w-4 h-4" />
            Education Level
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {educationLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`edu-${level}`}
                  checked={filters.education_level.includes(level)}
                  onCheckedChange={(checked) => handleEducationChange(level, checked as boolean)}
                />
                <Label htmlFor={`edu-${level}`} className="text-sm">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Skills</Label>
          
          {/* Selected Skills */}
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-600"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Skill Search */}
          <Input
            placeholder="Search and select skills..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
          />

          {/* Available Skills */}
          {skillSearch && filteredSkills.length > 0 && (
            <div className="max-h-32 overflow-y-auto border rounded-md p-2 bg-white">
              {filteredSkills.slice(0, 10).map((skill) => (
                <div
                  key={skill}
                  className="flex items-center space-x-2 py-1 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    handleSkillChange(skill, true);
                    setSkillSearch('');
                  }}
                >
                  <span className="text-sm">{skill}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <Button onClick={onApply} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeFilters;
