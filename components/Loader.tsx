
import React from 'react';
import { AILoaderIcon } from './Icons';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg border border-gray-700">
      <AILoaderIcon />
      <p className="mt-4 text-lg text-gray-300 animate-pulse">{message}</p>
    </div>
  );
};

export default Loader;
