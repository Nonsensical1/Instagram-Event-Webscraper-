
import React from 'react';
import { InstagramPage } from '../types';
import EventDetails from './EventDetails';
import { InstagramIcon, LinkIcon, CheckCircleIcon, XCircleIcon, InfoIcon } from './Icons';

const StatusIndicator: React.FC<{ status: InstagramPage['status'] }> = ({ status }) => {
    switch (status) {
        case 'analyzing':
            return <div className="text-sm text-blue-400 flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...</div>;
        case 'done':
            return <div className="text-sm text-green-400 flex items-center gap-1"><CheckCircleIcon /> Analysis Complete</div>;
        case 'error':
            return <div className="text-sm text-red-400 flex items-center gap-1"><XCircleIcon /> Analysis Failed</div>;
        default:
            return <div className="text-sm text-gray-400">Pending...</div>;
    }
}

const ResultsCard: React.FC<{ page: InstagramPage }> = ({ page }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <InstagramIcon />
              <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-gray-100 hover:text-indigo-400 transition-colors">
                @{page.handle}
              </a>
            </div>
            <p className="text-gray-400 text-sm">{page.description}</p>
          </div>
          <div className="flex-shrink-0 bg-gray-900 rounded-full px-3 py-1 text-sm font-medium text-indigo-400 border border-indigo-500/30">
            Official Confidence: {page.confidence}%
          </div>
        </div>
      </div>
      <div className="bg-gray-800/50 px-5 py-4 border-t border-gray-700">
        <div className="flex justify-between items-center">
            <StatusIndicator status={page.status} />
            <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <LinkIcon /> View on Instagram
            </a>
        </div>
      </div>
      {page.status === 'done' && (
        <div className="p-5 border-t border-gray-700/50 bg-black/10">
          {page.event ? (
            <EventDetails event={page.event} />
          ) : (
            <div className="text-center text-gray-400 py-4 flex items-center justify-center gap-2">
              <InfoIcon />
              <span>No upcoming event information found in recent posts.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsCard;
