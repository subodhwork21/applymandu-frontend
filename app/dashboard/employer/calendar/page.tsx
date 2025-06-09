"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, Filter, Download, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CalendarFilters from '@/components/calendar-filter';
import QuickStartGuide from '@/components/quick-start-guide';
import CalendarToolbar from '@/components/calendar-toolbar';
import CreateEventModal from '@/components/create-event-modal';
import EventDetailsModal from '@/components/event-details-modal';
import { baseFetcher } from '@/lib/fetcher';

const localizer = momentLocalizer(moment);

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

interface FilterOptions {
  type: string[];
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    status: [],
    dateRange: { start: null, end: null }
  });

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const {response, errors, result} = await baseFetcher(
        `api/employer/calendar/events`,
        {
          method: "GET",    
        }
      );

      console.log(result);

      if (response?.ok) {
        const data = result;
        if (data.success) {
          const formattedEvents = data.data.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }));
          setEvents(formattedEvents);
        }
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters to events
  useEffect(() => {
    let filtered = [...events];

    // Filter by type
    if (filters.type.length > 0) {
      filtered = filtered.filter(event => filters.type.includes(event.type));
    }

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(event => filters.status.includes(event.status));
    }

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start);
        const start = filters.dateRange.start;
        const end = filters.dateRange.end;
        
        if (start && end) {
          return eventDate >= start && eventDate <= end;
        } else if (start) {
          return eventDate >= start;
        } else if (end) {
          return eventDate <= end;
        }
        return true;
      });
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle event creation
  const handleCreateEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      const {response, result, errors} = await baseFetcher(
        `api/employer/calendar/events`,
        {
          method: 'POST',
          body: JSON.stringify(eventData),
        }
      );


      if (response?.ok) {
        const data = result;
        if (data?.success) {
          toast({
            title: "Success",
            description: "Event created successfully",
          });
          setShowCreateModal(false);
          setSelectedSlot(null);
          fetchEvents(); // Refresh events
        }
      } else {
        toast({
          title: "Error",
          description: errors,
        })
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  // Handle event update
  const handleUpdateEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!selectedEvent) return;

    try {
      const {response, result, errors} = await baseFetcher(
        `api/employer/calendar/events/${selectedEvent.id}`,
        {
          method: 'POST',
          body: JSON.stringify(eventData),
        }
      );

      if (response?.ok) {
        const data = result;
        if (data?.success) {
          toast({
            title: "Success",
            description: "Event updated successfully",
          });
          fetchEvents(); // Refresh events
        }
      } else {
        toast({
          title: "Error",
          description: errors || "Failed to update event",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId: number) => {
    try {
      const {response, result, errors} = await baseFetcher(
        `api/employer/calendar/events/${eventId}`,
        {
          method: 'DELETE',
        }
      );

      if (response?.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        setShowDetailsModal(false);
        setSelectedEvent(null);
        fetchEvents(); // Refresh events
      } else {
        toast({
          title: "Error",
          description: errors || "Failed to delete event",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  // Handle slot selection (for creating new events)
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setShowCreateModal(true);
  };

  // Handle event selection (for viewing details)
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  // Custom event style function
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3b82f6'; // Default blue
    
    switch (event.type) {
      case 'interview':
        backgroundColor = '#10b981'; // Green
        break;
      case 'meeting':
        backgroundColor = '#3b82f6'; // Blue
        break;
      case 'deadline':
        backgroundColor = '#ef4444'; // Red
        break;
      case 'other':
        backgroundColor = '#8b5cf6'; // Purple
        break;
    }

    // Adjust opacity for cancelled events
    if (event.status === 'cancelled') {
      backgroundColor = '#6b7280'; // Gray
    }

    return {
      style: {
        backgroundColor,
        borderColor: backgroundColor,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
      },
      className: `event-${event.type} status-${event.status}`
    };
  };

  // Export calendar data
  const handleExport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employer/calendar/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("EMPLOYER_TOKEN")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendar-events.ics';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Success",
          description: "Calendar exported successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export calendar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto 2xl:px-0 lg:px-12 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap sm:gap-0 gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-manduSecondary">Calendar</h1>
          <p className="text-manduCustom-secondary-blue sm:block hidden">Manage your interviews and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      {/* Quick Start Guide */}
      <QuickStartGuide />

      {/* Filters */}
      {showFilters && (
        <CalendarFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Calendar Toolbar */}
      <CalendarToolbar
        view={view}
        date={date}
        onView={setView}
        onNavigate={setDate}
      />

      {/* Calendar */}
      <div className={`bg-white rounded-lg border border-borderLine ${loading ? 'calendar-loading' : ''}`}>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          popup
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: () => null, // We use custom toolbar
          }}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            agendaTimeFormat: 'HH:mm',
            agendaTimeRangeFormat: ({ start, end }) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
          }}
          messages={{
            allDay: 'All Day',
            previous: 'Previous',
            next: 'Next',
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            agenda: 'Agenda',
            date: 'Date',
            time: 'Time',
            event: 'Event',
            noEventsInRange: 'No events in this range',
            showMore: (total) => `+${total} more`,
          }}
        />
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {events.filter(e => e.type === 'interview').length}
          </div>
          <div className="text-sm text-gray-600">Total Interviews</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {events.filter(e => e.status === 'scheduled').length}
          </div>
          <div className="text-sm text-gray-600">Scheduled Events</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {events.filter(e => e.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
                   <div className="text-2xl font-bold text-red-600">
            {events.filter(e => e.status === 'cancelled').length}
          </div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedSlot(null);
        }}
        onSubmit={handleCreateEvent}
        initialData={selectedSlot ? {
          start: selectedSlot.start,
          end: selectedSlot.end,
        } : undefined}
      />

      {selectedEvent && (
        <EventDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default CalendarPage;

