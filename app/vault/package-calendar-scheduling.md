---
title: "Package @kotonosora/calendar Scheduling"
description: "Calendar component system and scheduling functionality for event management"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["calendar", "scheduling", "events", "date-management"]
---

# @kotonosora/calendar Scheduling

## Overview

`@kotonosora/calendar` provides a comprehensive calendar and scheduling component system for building event management interfaces.

## Package Information

- **Name**: `@kotonosora/calendar`
- **Version**: 0.0.1
- **Type**: React component library
- **Location**: `packages/calendar/`
- **Dependencies**:
  - `@kotonosora/ui` (workspace) - UI components
  - `@kotonosora/i18n-react` (workspace) - Translations
  - `@kotonosora/google-analytics` (workspace) - Analytics
  - `react`, `react-dom` (19.2.4)
  - `lucide-react` (0.563.0) - Icons
  - `date-fns` (4.1.0) - Date utilities
  - `react-virtuoso` (4.18.1) - Virtual scrolling

## Component Structure

```
packages/calendar/
├── src/
│   ├── components/
│   │   ├── Calendar.tsx            # Main calendar component
│   │   ├── DatePicker.tsx          # Single date picker
│   │   ├── DateRangePicker.tsx     # Date range selection
│   │   ├── TimePicker.tsx          # Time selection
│   │   ├── EventList.tsx           # List of events
│   │   ├── EventCard.tsx           # Individual event
│   │   └── Scheduler.tsx           # Full scheduler view
│   ├── hooks/
│   │   ├── useCalendar.ts          # Calendar state
│   │   ├── useEvents.ts            # Event management
│   │   └── useSchedule.ts          # Scheduling logic
│   ├── types/
│   │   ├── event.types.ts          # Event definitions
│   │   └── calendar.types.ts       # Calendar types
│   ├── utils/
│   │   ├── dateUtils.ts            # Date calculations
│   │   └── eventUtils.ts           # Event processing
│   └── index.ts                    # Main exports
└── package.json
```

## Core Components

### Calendar Component

Display a calendar month view with event indicators:

```typescript
import { Calendar } from '@kotonosora/calendar'
import { useState } from 'react'

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <Calendar
      value={selectedDate}
      onChange={setSelectedDate}
      events={events}
      onDateClick={(date) => showDateDetails(date)}
      showWeekNumbers={true}
      firstDayOfWeek="monday"
    />
  )
}
```

**Features:**

- Month view display
- Day/week/year switching
- Event indicators on dates
- Internationalization support
- Keyboard navigation
- Mobile responsive

### DatePicker

Single date selection component:

```typescript
import { DatePicker } from '@kotonosora/calendar'

export function SelectDate() {
  const [date, setDate] = useState<Date | null>(null)

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Select a date"
      format="MM/dd/yyyy"
      minDate={new Date(2026, 0, 1)}
      maxDate={new Date(2026, 11, 31)}
      disabled={false}
    />
  )
}
```

### DateRangePicker

Select date range (start and end dates):

```typescript
import { DateRangePicker } from '@kotonosora/calendar'
import { useState } from 'react'

export function SelectDateRange() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  return (
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      presets={[
        { label: 'Today', getValue: () => ({ start: today, end: today }) },
        { label: 'This Week', getValue: () => ({ start: weekStart, end: weekEnd }) },
        { label: 'This Month', getValue: () => ({ start: monthStart, end: monthEnd }) },
      ]}
    />
  )
}
```

### TimePicker

Select time of day:

```typescript
import { TimePicker } from '@kotonosora/calendar'

export function SelectTime() {
  const [time, setTime] = useState<string>('09:00')

  return (
    <TimePicker
      value={time}
      onChange={setTime}
      format="24h"           // or '12h'
      step={15}              // 15 minute intervals
      minTime="08:00"
      maxTime="18:00"
    />
  )
}
```

### EventList

Display events in a virtualized list:

```typescript
import { EventList } from '@kotonosora/calendar'

export function UpcomingEvents({ events }) {
  return (
    <EventList
      events={events}
      sortBy="date"           // 'date', 'priority', 'duration'
      groupBy="date"          // Group events by date
      onEventClick={(event) => navigateToEvent(event)}
      onEventDeleted={(eventId) => removeEvent(eventId)}
      showTimeIndicators={true}
    />
  )
}
```

### Scheduler

Full scheduling/calendar interface:

```typescript
import { Scheduler } from '@kotonosora/calendar'

export function EventScheduler() {
  return (
    <Scheduler
      view="week"             // 'day', 'week', 'month'
      events={events}
      onEventCreate={(slot) => createEvent(slot)}
      onEventUpdate={(event) => updateEvent(event)}
      onEventDelete={(eventId) => deleteEvent(eventId)}
      startHour={6}
      endHour={22}
      slotDuration={30}       // 30 minute slots
      allowDragDrop={true}
    />
  )
}
```

## Custom Hooks

### useCalendar

Manage calendar state:

```typescript
import { useCalendar } from '@kotonosora/calendar'

export function CalendarManager() {
  const {
    currentDate,
    selectedDate,
    goToDate,
    nextMonth,
    prevMonth,
    today
  } = useCalendar()

  return (
    <div>
      <button onClick={prevMonth}>← Previous</button>
      <span>{currentDate.toLocaleDateString()}</span>
      <button onClick={nextMonth}>Next →</button>
    </div>
  )
}
```

### useEvents

Manage events:

```typescript
import { useEvents } from '@kotonosora/calendar'
import type { Event } from '@kotonosora/calendar'

export function EventManager() {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    searchEvents,
    clearConflicts
  } = useEvents()

  const handleCreateEvent = (event: Event) => {
    addEvent(event)
  }

  const dateEvents = getEventsForDate(new Date())
  const searchResults = searchEvents('meeting')

  return (
    <div>
      {dateEvents.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  )
}
```

### useSchedule

Advanced scheduling logic:

```typescript
import { useSchedule } from '@kotonosora/calendar'

export function ScheduleManager() {
  const {
    findAvailableSlots,
    suggestMeetingTime,
    checkConflict,
    getWorkingHours,
    calculateDuration
  } = useSchedule()

  // Find available time slots
  const slots = findAvailableSlots({
    date: new Date(),
    duration: 60,
    workingHoursOnly: true,
    excludeBreaks: true
  })

  // Check for conflicts
  const hasConflict = checkConflict(startTime, endTime, attendees)

  return (
    <div>
      {slots.map(slot => (
        <button key={slot.id}>
          {slot.start} - {slot.end}
        </button>
      ))}
    </div>
  )
}
```

## Event Data Structure

### Event Type Definition

```typescript
interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'

  type: "meeting" | "task" | "reminder" | "block";
  category?: string;
  priority: "low" | "medium" | "high";

  location?: string;
  attendees?: Attendee[];

  isAllDay: boolean;
  isRecurring: boolean;
  recurrence?: RecurrenceRule;

  reminders: Reminder[];

  status: "scheduled" | "confirmed" | "cancelled" | "completed";

  color?: string;
  tags: string[];

  createdAt: Date;
  updatedAt: Date;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "declined";
}

interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  endDate?: Date;
  count?: number;
}
```

## Usage Examples

### Create Event

```typescript
import { useEvents } from '@kotonosora/calendar'

export function AddEventForm() {
  const { addEvent } = useEvents()
  const [formData, setFormData] = useState({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00'
  })

  const handleSubmit = () => {
    addEvent({
      id: generateUUID(),
      title: formData.title,
      startDate: formData.date,
      endDate: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      isAllDay: false,
      isRecurring: false,
      priority: 'medium',
      status: 'scheduled',
      tags: [],
      reminders: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### Schedule Meeting

```typescript
import { Calendar, DateRangePicker, TimePicker } from '@kotonosora/calendar'
import { useSchedule } from '@kotonosora/calendar'

export function ScheduleMeeting() {
  const { findAvailableSlots, suggestMeetingTime } = useSchedule()
  const [attendees, setAttendees] = useState<string[]>([])
  const [duration, setDuration] = useState(60)

  const availableSlots = findAvailableSlots({
    duration,
    attendees,
    workingHoursOnly: true
  })

  return (
    <div>
      <h2>Schedule Meeting</h2>
      <EventList events={availableSlots} />
    </div>
  )
}
```

### Recurring Events

```typescript
import { useEvents } from '@kotonosora/calendar'

export function CreateRecurringEvent() {
  const { addEvent } = useEvents()

  const handleCreate = () => {
    addEvent({
      id: generateUUID(),
      title: 'Team Standup',
      startDate: new Date(),
      endDate: new Date(),
      startTime: '09:30',
      endTime: '10:00',
      isAllDay: false,
      isRecurring: true,
      recurrence: {
        frequency: 'daily',
        interval: 1,
        endDate: new Date(2026, 11, 31)
      },
      priority: 'high',
      status: 'scheduled',
      tags: ['work'],
      reminders: [{ type: 'notification', minutes: 10 }],
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  return <button onClick={handleCreate}>Create Daily Standup</button>
}
```

## Integration Examples

### With React Router

```typescript
// Route: ($lang).calendar._index.tsx
import { Calendar } from '@kotonosora/calendar'
import { useEvents } from '@kotonosora/calendar'

export const loader = async ({ context }: Route.LoaderArgs) => {
  const events = await fetchUserEvents(context.userId)
  return { events }
}

export default function CalendarPage({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData

  return (
    <Calendar
      events={events}
      onEventClick={(event) => {
        // Navigate to event details
      }}
    />
  )
}
```

### With i18n

```typescript
import { useTranslation } from '@kotonosora/i18n-react'
import { Calendar } from '@kotonosora/calendar'

export function LocalizedCalendar() {
  const { locale, t } = useTranslation()

  return (
    <Calendar
      locale={locale}
      labels={{
        today: t('calendar.today'),
        tomorrow: t('calendar.tomorrow'),
        month: t('calendar.month'),
        week: t('calendar.week')
      }}
    />
  )
}
```

### With Analytics

```typescript
import { useGoogleAnalytics } from '@kotonosora/google-analytics'
import { useEvents } from '@kotonosora/calendar'

export function TrackableCalendar() {
  const { trackEvent } = useGoogleAnalytics()
  const { addEvent } = useEvents()

  const handleEventCreate = (event) => {
    addEvent(event)
    trackEvent('event_created', {
      event_title: event.title,
      duration: calculateDuration(event),
      type: event.type
    })
  }

  return <div>Calendar UI with event creation</div>
}
```

## Scheduling Algorithms

### Finding Available Slots

```typescript
function findAvailableSlots(params: FindSlotsParams): TimeSlot[] {
  // 1. Get all events for attendees
  // 2. Merge time ranges
  // 3. Find gaps
  // 4. Apply working hours filter
  // 5. Filter by minimum duration
  // 6. Return sorted by ranking (earliest, most convenient)
}
```

### Conflict Detection

```typescript
function checkConflict(
  startTime: Date,
  endTime: Date,
  attendees: User[],
): boolean {
  // Check if any attendee has event in time range
  // Account for overrides and break time
  // Return true if conflict exists
}
```

## Styling

Calendar components are themed with Tailwind CSS:

```css
.calendar {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.calendar-event {
  background: #dbeafe;
  color: #1e40af;
  border-left: 4px solid #1e40af;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 0.25rem;
}

.calendar-event-hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}
```

## Performance Optimization

- **Virtual scrolling** for large event lists
- **Event indexing** for quick lookups
- **Lazy loading** of calendar data
- **Caching** of recurring event expansions
- **Debounced** drag-and-drop operations

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar } from '@kotonosora/calendar'

describe('Calendar', () => {
  it('displays events on calendar', () => {
    const events = [
      { id: '1', title: 'Meeting', startDate: new Date(), ... }
    ]
    render(<Calendar events={events} />)
    expect(screen.getByText('Meeting')).toBeInTheDocument()
  })
})
```

## Best Practices

1. **Use memoization** for expensive date calculations
2. **Handle timezone** differences carefully
3. **Validate recurring rules** to prevent infinite loops
4. **Cache expanded recurrences** to avoid recomputation
5. **Optimize re-renders** with React.memo on calendar cells
6. **Test edge cases** (leap years, DST transitions)
7. **Consider mobile UX** for touch-friendly date picking
8. **Provide keyboard shortcuts** for power users

---

The calendar package provides flexible, performant scheduling and event management capabilities for the NARA ecosystem.
