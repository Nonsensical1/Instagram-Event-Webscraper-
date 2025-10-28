import { EventInfo } from '../types';

// Converts an ISO 8601 string to an iCalendar format (YYYYMMDDTHHMMSSZ)
function toICSDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function createAndDownloadIcsFile(event: EventInfo) {
    // A simple UID generator
    const uid = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
    const now = toICSDate(new Date().toISOString());
    const dtstart = toICSDate(event.dtstart);

    // Assume event is 1 hour long if no end date is provided.
    const endDate = new Date(event.dtstart);
    endDate.setHours(endDate.getHours() + 1);
    const dtend = toICSDate(endDate.toISOString());

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AI-Event-Scraper//NONSGML v1.0//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${event.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

export function createAndDownloadMultiEventIcsFile(events: EventInfo[], topic: string) {
    const calendarEvents = events.map(event => {
        const uid = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
        const now = toICSDate(new Date().toISOString());
        const dtstart = toICSDate(event.dtstart);

        // Assume event is 1 hour long if no end date is provided.
        const endDate = new Date(event.dtstart);
        endDate.setHours(endDate.getHours() + 1);
        const dtend = toICSDate(endDate.toISOString());

        return [
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${now}`,
            `DTSTART:${dtstart}`,
            `DTEND:${dtend}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
            `LOCATION:${event.location}`,
            'END:VEVENT'
        ].join('\r\n');
    }).join('\r\n');

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AI-Event-Scraper//NONSGML v1.0//EN',
        calendarEvents,
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    // Sanitize topic for filename
    const filename = topic.trim() ? topic.replace(/[^a-zA-Z0-9]/g, '_') : 'instagram_events';
    link.download = `${filename}_events.ics`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}
