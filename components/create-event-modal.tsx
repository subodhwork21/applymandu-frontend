"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Link as LinkIcon } from 'lucide-react';
import { Input } from './ui/input';

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'interview' | 'meeting' | 'deadline' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  description?: string;
  location?: string;
  attendees?: string[];
  job_id?: number;
  application_id?: number;
  candidate_name?: string;
  candidate_email?: string;
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Partial<CalendarEvent>) => void;
  initialData?: CalendarEvent | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'interview' as CalendarEvent['type'],
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    description: '',
    location: '',
    candidate_name: '',
    candidate_email: '',
    meeting_link: '',
    notes: '',
    job_id: '',
  });

  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      const startDate = new Date(initialData.start);
      const endDate = new Date(initialData.end);
      
      setFormData({
        title: initialData.title || '',
        type: initialData.type || 'interview',
        start_date: startDate.toISOString().split('T')[0],
        start_time: startDate.toTimeString().slice(0, 5),
        end_date: endDate.toISOString().split('T')[0],
        end_time: endDate.toTimeString().slice(0, 5),
        description: initialData.description || '',
        location: initialData.location || '',
        candidate_name: initialData.candidate_name || '',
        candidate_email: initialData.candidate_email || '',
        meeting_link: initialData.meeting_link || '',
        notes: initialData.notes || '',
        job_id: initialData.job_id?.toString() || '',
      });
    }
  }, [initialData]);

  // Fetch jobs for dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/employer/jobs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("EMPLOYER_TOKEN")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setJobs(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  // Fetch applications when job is selected
  useEffect(() => {
    const fetchApplications = async () => {
      if (!formData.job_id) {
        setApplications([]);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/employer/jobs/${formData.job_id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("EMPLOYER_TOKEN")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setApplications(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [formData.job_id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleApplicationSelect = (applicationId: string) => {
    const application = applications.find(app => app.id.toString() === applicationId);
    if (application) {
      setFormData(prev => ({
        ...prev,
        candidate_name: `${application.applied_user}`,
        candidate_email: application.user_email || '',
        title: prev.title || `Interview with ${application.applied_user}`,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    // Validate that end time is after start time
    if (formData.start_date && formData.start_time && formData.end_date && formData.end_time) {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    if (formData.type === 'interview' && !formData.candidate_name.trim()) {
      newErrors.candidate_name = 'Candidate name is required for interviews';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

      const eventData = {
        title: formData.title,
        type: formData.type,
        start: startDateTime,
        end: endDateTime,
        description: formData.description,
        location: formData.location,
        candidate_name: formData.candidate_name,
        candidate_email: formData.candidate_email,
        meeting_link: formData.meeting_link,
        notes: formData.notes,
        job_id: formData.job_id ? parseInt(formData.job_id) : undefined,
        status: 'scheduled' as const,
      };

      await onSubmit(eventData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: 'interview',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      description: '',
      location: '',
      candidate_name: '',
      candidate_email: '',
      meeting_link: '',
      notes: '',
      job_id: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Event Title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter event title"
                  error={errors.title}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Event Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'interview' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Related Job</Label>
                  <Select value={formData.job_id} onValueChange={(value) => handleInputChange('job_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id.toString()}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date & Time
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    error={errors.start_date}
                  />
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    error={errors.start_time}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  End Date & Time
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    error={errors.end_date}
                  />
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    error={errors.end_time}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interview-specific fields */}
          {formData.type === 'interview' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Interview Details
              </h4>
              
              {formData.job_id && applications.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Candidate</Label>
                  <Select onValueChange={handleApplicationSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose from applicants" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id.toString()}>
                          {app.applied_user} - {app.user_email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Candidate Name"
                  required
                  value={formData.candidate_name}
                  onChange={(e) => handleInputChange('candidate_name', e.target.value)}
                  placeholder="Enter candidate name"
                  error={errors.candidate_name}
                />
                <Input
                  label="Candidate Email"
                  type="email"
                  value={formData.candidate_email}
                  onChange={(e) => handleInputChange('candidate_email', e.target.value)}
                  placeholder="Enter candidate email"
                  error={errors.candidate_email}
                />
              </div>
            </div>
          )}

          {/* Location and Meeting Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter location or 'Online'"
              icon={<MapPin className="w-4 h-4" />}
            />
            <Input
              label="Meeting Link"
              value={formData.meeting_link}
              onChange={(e) => handleInputChange('meeting_link', e.target.value)}
              placeholder="Enter meeting link (Zoom, Teams, etc.)"
              icon={<LinkIcon className="w-4 h-4" />}
            />
          </div>

          {/* Description and Notes */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes"
                rows={2}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
