import React from 'react';
import Calendar from '../../components/ClientCalendar/ClientCalendar'
import './ClientCalendarCard.scss'

export default function ClientActivityCard() {
  return (
    <div className="calendarWrapClientActivity">
      <div className="calendarClientActivity" >
        <Calendar />
      </div>
    </div>
  )
}
