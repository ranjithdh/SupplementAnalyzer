import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import JsonDisplay from './components/JsonDisplay';
import VisualDisplay from './components/VisualDisplay';
import { AnalysisState, ScrapedData } from './types';


const logSequence = [
  'Fetching URL content...',
  'Analyzing page structure...',
  'Identifying core entities...',
  'Extracting supplement facts...',
  'Performing grounding check...'
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark';
    }
    return 'dark';
  });

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
    logs: [],
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleAnalyze = async (url: string, imageUrl?: string) => {
    setAnalysisState({ status: 'analyzing', data: null, error: null, logs: ['Initializing AI agent...'] });

    const addLog = (log: string) => {
      setAnalysisState(prev => ({
        ...prev,
        logs: [...(prev.logs || []), log]
      }));
    };

    // Fake progress logs for UX
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logSequence.length) {
        addLog(logSequence[logIndex]);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, imageUrl }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to analyze URL';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result: ScrapedData = await response.json();
      clearInterval(interval);
      setAnalysisState({ status: 'complete', data: result, error: null, logs: [] });
    } catch (err: any) {
      clearInterval(interval);
      setAnalysisState({
        status: 'error',
        data: null,
        error: err.message || 'An unknown error occurred during analysis.',
        logs: []
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary font-sans selection:bg-brand-accent/30 transition-colors duration-300">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.15] dark:opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(var(--brand-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-brand-fg/50 border border-brand-tertiary text-brand-primary hover:border-brand-accent/50 transition-all shadow-lg active:scale-95 backdrop-blur-md"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707m12.728 0A9 9 0 115.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Header / Input Area */}
        <InputSection onAnalyze={handleAnalyze} status={analysisState.status} />

        {/* Error Message */}
        {analysisState.status === 'error' && (
          <div className="max-w-3xl mx-auto w-full mb-6 p-4 bg-brand-veryhigh/20 border border-brand-veryhigh/50 rounded-lg text-brand-primary flex items-center">
            <svg className="w-5 h-5 mr-3 text-brand-veryhigh" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {analysisState.error}
          </div>
        )}

        {/* Results Area */}
        {analysisState.data && analysisState.status === 'complete' && (
          <div className="flex flex-col gap-10 pb-12">
            {/* Top: Visual Analysis */}
            <div>
              <div className="flex items-center mb-4 px-2">
                <div className="h-2 w-2 rounded-full bg-brand-accent mr-2"></div>
                <h3 className="text-sm font-semibold text-brand-secondary uppercase tracking-wider">Analysis View</h3>
              </div>
              <div>
                <VisualDisplay data={analysisState.data} />
              </div>
            </div>

            {/* Bottom: JSON Output */}
            <div>
              <div className="flex items-center mb-4 px-2">
                <div className="h-2 w-2 rounded-full bg-brand-normal mr-2"></div>
                <h3 className="text-sm font-semibold text-brand-secondary uppercase tracking-wider">Structured Data</h3>
              </div>
              <div>
                <JsonDisplay data={analysisState.data} />
              </div>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {analysisState.status === 'analyzing' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-md bg-brand-fg/30 border border-brand-tertiary rounded-2xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-tertiary">
                <div
                  className="h-full bg-brand-accent transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(43,127,255,0.5)]"
                  style={{ width: `${Math.min(((analysisState.logs?.length || 0) / (logSequence.length + 1)) * 100, 95)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-brand-primary font-bold text-lg">Autonomous Analysis</h3>
                  <p className="text-brand-secondary text-xs">AI Agent is processing the request</p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>

              <div className="space-y-4">
                {analysisState.logs?.map((log, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm transition-all duration-500">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-normal/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-brand-normal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-brand-secondary">{log}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-brand-accent/30 border-t-brand-accent animate-spin"></div>
                  <span className="text-brand-primary font-medium">Processing current task...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Intro */}
        {analysisState.status === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center text-brand-secondary">
            <div className="w-20 h-20 bg-brand-fg/50 border border-brand-tertiary rounded-2xl mb-6 flex items-center justify-center shadow-xl group hover:border-brand-accent/50 transition-colors duration-500">
              <svg className="w-10 h-10 text-brand-secondary group-hover:text-brand-accent transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            </div>
            <h2 className="text-brand-primary font-semibold text-lg mb-2">Ready for analysis</h2>
            <p className="max-w-xs text-center text-sm opacity-60">Enter a product URL above to begin autonomous content extraction and structured data analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;