import { CalendarEvent } from '@/types/calendar';
import { format, isToday, isTomorrow, isThisWeek, addDays } from 'date-fns';

export const formatEventTime = (start: Date, end: Date): string => {
  const startTime = format(start, 'HH:mm');
  const endTime = format(end, 'HH:mm');
  return `${startTime} - ${endTime}`;
};

export const formatEventDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE');
  } else {
    return format(date, 'MMM dd, yyyy');
  }
};

export const getEventStatusColor = (status: CalendarEvent['status']): string => {
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

export const getEventTypeColor = (type: CalendarEvent['type']): string => {
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

export const generateCalendarInvite = (event: CalendarEvent): string => {
  const startDate = format(event.start, "yyyyMMdd'T'HHmmss");
  const endDate = format(event.end, "yyyyMMdd'T'HHmmss");
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Your Company//Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@yourcompany.com`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description || ''}`,
    `LOCATION:${event.location || ''}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icsContent;
};

export const getUpcomingEvents = (events: CalendarEvent[], days: number = 7): CalendarEvent[] => {
  const now = new Date();
  const futureDate = addDays(now, days);
  
  return events
    .filter(event => 
      event.start >= now && 
      event.start <= futureDate && 
      event.status === 'scheduled'
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime());
};

export const validateEventData = (data: Partial<CalendarEvent>): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.start) {
    errors.push('Start date is required');
  }
  
  if (!data.end) {
    errors.push('End date is required');
  }
  
  if (data.start && data.end && data.start >= data.end) {
    errors.push('End date must be after start date');
  }
  
  if (!data.type) {
    errors.push('Event type is required');
  }
  
  return errors;
};
