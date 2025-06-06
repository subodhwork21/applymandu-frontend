"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Link as LinkIcon, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

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

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
  onUpdate: (eventData: Partial<CalendarEvent>) => void;
  onDelete: (eventId: number) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
  onUpdate,
  onDelete
}) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-green-100 text-green-800';
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      case 'other':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (newStatus: CalendarEvent['status']) => {
    setLoading(true);
    try {
      await onUpdate({ status: newStatus });
      toast({
        title: "Success",
        description: `Event status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(event.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyMeetingLink = () => {
    if (event.meeting_link) {
      navigator.clipboard.writeText(event.meeting_link);
      toast({
        title: "Copied",
        description: "Meeting link copied to clipboard",
      });
    }
  };

  const sendCalendarInvite = async () => {
    if (!event.candidate_email) {
      toast({
        title: "Error",
        description: "No candidate email available",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employer/calendar/events/${event.id}/invite`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("EMPLOYER_TOKEN")}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Calendar invite sent successfully",
        });
      } else {
        throw new Error('Failed to send invite');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send calendar invite",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{event.title}</span>
            <div className="flex gap-2">
              <Badge className={getTypeColor(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
              <Badge className={getStatusColor(event.status)}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">Start</p>
                <p className="text-sm text-gray-600">
                  {format(event.start, 'PPP')} at {format(event.start, 'p')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">End</p>
                <p className="text-sm text-gray-600">
                  {format(event.end, 'PPP')} at {format(event.end, 'p')}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            </div>
          )}

          {/* Candidate Information */}
          {event.type === 'interview' && (event.candidate_name || event.candidate_email) && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-3">Candidate Information</h4>
              <div className="space-y-2">
                {event.candidate_name && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{event.candidate_name}</span>
                  </div>
                )}
                {event.candidate_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{event.candidate_email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meeting Link */}
          {event.meeting_link && (
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-medium">Meeting Link</p>
                <div className="flex items-center gap-2">
                  <a
                    href={event.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                  >
                    {event.meeting_link}
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyMeetingLink}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div>
              <p className="font-medium mb-2">Description</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div>
              <p className="font-medium mb-2">Notes</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {event.notes}
              </p>
            </div>
          )}

          {/* Status Actions */}
          {event.status === 'scheduled' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={loading}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('rescheduled')}
                  disabled={loading}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reschedule
                </Button>
                {event.candidate_email && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={sendCalendarInvite}
                    disabled={loading}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Send Invite
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 mb-3">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement edit functionality
                  toast({
                    title: "Edit Event",
                    description: "Edit functionality coming soon",
                  });
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
