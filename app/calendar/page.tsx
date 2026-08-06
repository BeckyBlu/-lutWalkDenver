'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  rsvps?: string[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: firstDay }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function toIcs(event: CalendarEvent): string {
  const dateStr = event.date.replace(/-/g, '');
  const uid = `${event.id}@slutwalkdenver`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SlutWalk Denver//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadIcs(event: CalendarEvent) {
  const blob = new Blob([toIcs(event)], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, '-')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function googleCalendarUrl(event: CalendarEvent): string {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const date = event.date.replace(/-/g, '');
  return `${base}&text=${encodeURIComponent(event.title)}&dates=${date}/${date}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
}

// ── Seed events for prototype (shown when Firebase is not configured) ─────────

const SEED_EVENTS: CalendarEvent[] = [
  {
    id: 'seed-1',
    title: 'Volunteer Orientation',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 14).toISOString().slice(0, 10),
    time: '4:00 PM',
    location: 'Denver Community Center',
    description: 'Planning circle and resource sharing for new volunteers.',
    rsvps: [],
  },
  {
    id: 'seed-2',
    title: 'Solidarity Rally',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 21).toISOString().slice(0, 10),
    time: '11:00 AM',
    location: 'Civic Center Park, Denver',
    description: 'Public gathering and outreach event.',
    rsvps: [],
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>(SEED_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [rsvpDone, setRsvpDone] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/events?limit=100', { credentials: 'include' });
      if (!res.ok) return;
      const json = await res.json() as { events?: CalendarEvent[] };
      if (Array.isArray(json.events) && json.events.length > 0) {
        setEvents(json.events);
      }
    } catch {
      // Use seed events when API is unavailable
    }
  }, []);

  useEffect(() => { void fetchEvents(); }, [fetchEvents]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const cells = buildCalendarGrid(year, month);

  const eventsThisMonth = events.filter((e) => {
    const [ey, em] = e.date.split('-').map(Number);
    return ey === year && em - 1 === month;
  });

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  for (const e of eventsThisMonth) {
    const day = Number(e.date.split('-')[2]);
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push(e);
  }

  const handleRsvp = async () => {
    if (!selectedEvent) return;
    try {
      await fetch(`/api/events/${selectedEvent.id}/rsvp`, {
        method: 'POST',
        credentials: 'include',
      });
      setRsvpDone(true);
    } catch {
      setRsvpDone(true); // Optimistic for prototype
    }
  };

  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Store</Link></li>
            <li><Link href="/bulletin">Bulletin</Link></li>
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Community calendar</p>
          <h1>Meetings, workshops, rallies, and volunteer shifts.</h1>
          <p>Click any highlighted date to see event details and RSVP.</p>
        </div>
      </header>

      <section className="featured">
        {/* Month navigation */}
        <div className="cal-nav" role="navigation" aria-label="Calendar navigation">
          <button type="button" onClick={prevMonth} aria-label="Previous month">‹</button>
          <h2>{MONTHS[month]} {year}</h2>
          <button type="button" onClick={nextMonth} aria-label="Next month">›</button>
        </div>

        {/* Calendar grid */}
        <div className="cal-grid" role="grid" aria-label={`${MONTHS[month]} ${year} calendar`}>
          {DAYS.map((d) => (
            <div key={d} className="cal-day-label" role="columnheader" aria-label={d}>{d}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="cal-cell cal-cell--empty" aria-hidden="true" />;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dayEvents = eventsByDay[day] ?? [];
            return (
              <div
                key={day}
                className={`cal-cell ${isToday ? 'cal-cell--today' : ''} ${dayEvents.length > 0 ? 'cal-cell--has-event' : ''}`}
                role="gridcell"
                aria-label={`${MONTHS[month]} ${day}${dayEvents.length > 0 ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
              >
                <span className="cal-date">{day}</span>
                {dayEvents.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className="cal-event-pill"
                    onClick={() => { setSelectedEvent(e); setRsvpDone(false); }}
                  >
                    {e.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Upcoming events list */}
        <h2 style={{ marginTop: '2rem' }}>Upcoming events</h2>
        <div className="events">
          {events
            .filter((e) => e.date >= today.toISOString().slice(0, 10))
            .slice(0, 6)
            .map((e) => (
              <article key={e.id}>
                <p className="eyebrow">{e.date}</p>
                <h3>
                  <button
                    type="button"
                    className="event-title-btn"
                    onClick={() => { setSelectedEvent(e); setRsvpDone(false); }}
                  >
                    {e.title}
                  </button>
                </h3>
                <p>{e.time}{e.location ? ` • ${e.location}` : ''}</p>
              </article>
            ))}
          {events.filter((e) => e.date >= today.toISOString().slice(0, 10)).length === 0 && (
            <p>No upcoming events. Check back soon.</p>
          )}
        </div>
      </section>

      {/* Event detail modal */}
      {selectedEvent && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={selectedEvent.title}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}
        >
          <div className="modal-card">
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close event details"
            >
              ×
            </button>
            <p className="eyebrow">{selectedEvent.date}</p>
            <h2>{selectedEvent.title}</h2>
            {selectedEvent.time && <p><strong>Time:</strong> {selectedEvent.time}</p>}
            {selectedEvent.location && <p><strong>Location:</strong> {selectedEvent.location}</p>}
            {selectedEvent.description && <p>{selectedEvent.description}</p>}

            <div className="btn-row" style={{ justifyContent: 'flex-start', marginTop: '1rem' }}>
              {rsvpDone ? (
                <span className="rsvp-confirm">You&apos;re attending.</span>
              ) : (
                <button type="button" className="btn" onClick={() => void handleRsvp()}>
                  RSVP
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => downloadIcs(selectedEvent)}
              >
                Add to Calendar (.ics)
              </button>
              <a
                className="btn btn-secondary"
                href={googleCalendarUrl(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Calendar
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
