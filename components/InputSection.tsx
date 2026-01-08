import React, { useState } from 'react';
import { AnalysisState } from '../types';

interface InputSectionProps {
  onAnalyze: (url: string, imageUrl?: string) => void;
  status: AnalysisState['status'];
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, status }) => {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url, imageUrl.trim() || undefined);
    }
  };

  const isLoading = status === 'analyzing';

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          AutoScrape <span className="text-blue-500">Agent</span>
        </h1>
        <p className="text-gray-400">
          Autonomous content analysis and structured data extraction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group space-y-4">
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${isLoading ? 'animate-pulse opacity-70' : ''}`}></div>

        {/* Main URL Input */}
        <div className="relative flex items-center bg-gray-900 rounded-lg p-2 border border-gray-800">
          <div className="pl-4 pr-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <input
            type="url"
            placeholder="Enter target URL (e.g., https://example.com/product)"
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none py-3 px-2 font-mono"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {/* Optional Image URL Input */}
        <div className="relative flex items-center bg-gray-900 rounded-lg p-2 border border-gray-800">
          <div className="pl-4 pr-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="url"
            placeholder="Optional: Nutritional label image URL (if product has image-based info)"
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none py-3 px-2 font-mono text-sm"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <div className="relative flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-md font-semibold text-white transition-all ${
              isLoading
                ? 'bg-blue-800 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputSection;