import React, { useState, useCallback } from 'react';
import { SearchState, InstagramPage, EventInfo } from './types';
import { findInstagramPages, analyzePageForEvents } from './services/geminiService';
import { createAndDownloadMultiEventIcsFile } from './utils/icsHelper';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import ResultsCard from './components/ResultsCard';
import { GithubIcon, DownloadIcon } from './components/Icons';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [pages, setPages] = useState<InstagramPage[]>([]);
  const [searchState, setSearchState] = useState<SearchState>(SearchState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or university.');
      return;
    }

    setSearchState(SearchState.SEARCHING_PAGES);
    setError(null);
    setPages([]);

    try {
      const foundPages = await findInstagramPages(topic);
      if (foundPages.length === 0) {
        setSearchState(SearchState.DONE);
        setError("Could not find any relevant Instagram pages. Try a different topic.");
        return;
      }

      const initialPages: InstagramPage[] = foundPages.map(p => ({ ...p, status: 'pending' }));
      setPages(initialPages);
      setSearchState(SearchState.ANALYZING_POSTS);

      const analysisPromises = initialPages.map(async (page, index) => {
        setPages(prev => prev.map((p, i) => i === index ? { ...p, status: 'analyzing' } : p));
        try {
          const event = await analyzePageForEvents(page.handle);
          setPages(prev => prev.map((p, i) => i === index ? { ...p, status: 'done', event } : p));
        } catch (e) {
          console.error(`Error analyzing page ${page.handle}:`, e);
          setPages(prev => prev.map((p, i) => i === index ? { ...p, status: 'error', event: null } : p));
        }
      });

      await Promise.all(analysisPromises);
      setSearchState(SearchState.DONE);

    } catch (err) {
      console.error(err);
      setError('An error occurred while searching. Please check your API key and try again.');
      setSearchState(SearchState.ERROR);
    }
  }, [topic]);

  const foundEvents: EventInfo[] = pages.flatMap(p => p.event ? [p.event] : []);

  const handleDownloadAll = () => {
    if (foundEvents.length > 0) {
      createAndDownloadMultiEventIcsFile(foundEvents, topic);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 mb-2">
            AI Instagram Event Scraper
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover official club Instagram pages and automatically extract event details into downloadable calendar files.
          </p>
        </header>

        <main>
          <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
            <SearchBar
              topic={topic}
              setTopic={setTopic}
              onSearch={handleSearch}
              isLoading={searchState !== SearchState.IDLE && searchState !== SearchState.DONE && searchState !== SearchState.ERROR}
            />
          </div>

          {error && <div className="bg-red-900/50 text-red-300 p-4 rounded-lg text-center mb-8 border border-red-700">{error}</div>}

          {searchState === SearchState.DONE && foundEvents.length > 0 && (
            <div className="mb-6 text-right">
                <button
                    onClick={handleDownloadAll}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200"
                >
                    <DownloadIcon />
                    <span>Download All Events (.ics)</span>
                </button>
            </div>
          )}

          {searchState !== SearchState.IDLE && (
            <div className="space-y-6">
              {searchState === SearchState.SEARCHING_PAGES && <Loader message="AI is searching for relevant Instagram pages..." />}
              {searchState === SearchState.ANALYZING_POSTS && <Loader message="Found pages! Now analyzing posts for events..." />}
              
              {pages.map((page, index) => (
                <ResultsCard key={`${page.handle}-${index}`} page={page} />
              ))}
            </div>
          )}

          {searchState === SearchState.IDLE && (
             <div className="text-center text-gray-500 py-10">
                <p>Enter a university or topic to get started.</p>
                <p>For example: "MIT", "UC Berkeley AI Club", "New York Photography Groups"</p>
             </div>
          )}
        </main>
        
        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by React, Tailwind CSS, and Gemini API</p>
            <a href="https://github.com/google/genai-prompt-gallery" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-indigo-400 transition-colors">
                <GithubIcon />
                <span>View on GitHub</span>
            </a>
        </footer>
      </div>
    </div>
  );
};

export default App;