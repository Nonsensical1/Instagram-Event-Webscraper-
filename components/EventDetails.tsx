
import React from 'react';
import { EventInfo } from '../types';
import { createAndDownloadIcsFile } from '../utils/icsHelper';
import { CalendarIcon, LocationIcon, InfoIcon, DownloadIcon } from './Icons';

interface EventDetailsProps {
  event: EventInfo;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-indigo-400">{event.title}</h3>
      <div className="space-y-3 text-gray-300">
        <div className="flex items-start gap-3">
          <CalendarIcon />
          <span>{formatDate(event.dtstart)}</span>
        </div>
        <div className="flex items-start gap-3">
          <LocationIcon />
          <span>{event.location}</span>
        </div>
        <div className="flex items-start gap-3">
          <InfoIcon />
          <p className="flex-1">{event.description}</p>
        </div>
      </div>
      <div className="pt-4">
        <button
          onClick={() => createAndDownloadIcsFile(event)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200"
        >
          <DownloadIcon />
          Add to Calendar (.ics)
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
