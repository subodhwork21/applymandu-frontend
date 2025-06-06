import React from 'react';
// import '.././calendar.css';
import "../../../calendar.css"

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="calendar-layout">
      {children}
    </div>
  );
}
