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
    <div className="w-full max-w-4xl mx-auto mb-10">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black text-brand-primary mb-3 tracking-tighter">
          Supplement <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-cyan-400">analyzer</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="relative group space-y-4">
        <div className={`absolute -inset-1 bg-gradient-to-r from-brand-accent via-cyan-500 to-brand-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50 ${isLoading ? 'animate-pulse opacity-60' : ''}`}></div>

        <div className="relative bg-brand-fg border border-brand-tertiary rounded-xl p-4 shadow-2xl space-y-4 transition-colors duration-300">
          {/* Main URL Input */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative flex items-center bg-brand-bg/50 rounded-lg border border-brand-tertiary focus-within:border-brand-accent/50 transition-colors group/input duration-300">
              <div className="pl-4 pr-2 text-brand-secondary group-focus-within/input:text-brand-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <input
                type="url"
                placeholder="Target URL (e.g. iHerb, Amazon, Brand Site)"
                className="flex-1 bg-transparent text-brand-primary placeholder-brand-secondary/40 focus:outline-none py-4 px-2 font-medium"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Optional Image URL Input */}
            <div className="flex-1 relative flex items-center bg-brand-bg/50 rounded-lg border border-brand-tertiary focus-within:border-brand-accent/50 transition-colors group/input duration-300">
              <div className="pl-4 pr-2 text-brand-secondary group-focus-within/input:text-brand-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="url"
                placeholder="Optional: Nutrition Label Image URL"
                className="flex-1 bg-transparent text-brand-primary placeholder-brand-secondary/40 focus:outline-none py-4 px-2 font-medium"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-2 border-t border-brand-tertiary/50">
             <button
                type="submit"
                disabled={isLoading}
                className={`w-full md:w-auto px-10 py-4 rounded-lg font-bold text-white transition-all shadow-xl active:scale-95 ${
                  isLoading
                    ? 'bg-brand-accent/50 cursor-not-allowed'
                    : 'bg-brand-accent hover:bg-brand-accent/90 shadow-brand-accent/20'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Run Analysis'
                )}
              </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputSection;