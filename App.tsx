import React, { useState } from 'react';
import InputSection from './components/InputSection';
import JsonDisplay from './components/JsonDisplay';
import VisualDisplay from './components/VisualDisplay';
import { AnalysisState, ScrapedData } from './types';
import { analyzeUrl } from './services/geminiService';

const App: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const handleAnalyze = async (url: string, imageUrl?: string) => {
    setAnalysisState({ status: 'analyzing', data: null, error: null });

    try {
      const result: ScrapedData = await analyzeUrl(url, imageUrl);
      setAnalysisState({ status: 'complete', data: result, error: null });
    } catch (err: any) {
      setAnalysisState({
        status: 'error',
        data: null,
        error: err.message || 'An unknown error occurred during analysis.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-blue-500/30">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header / Input Area */}
        <InputSection onAnalyze={handleAnalyze} status={analysisState.status} />

        {/* Error Message */}
        {analysisState.status === 'error' && (
          <div className="max-w-3xl mx-auto w-full mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {analysisState.error}
          </div>
        )}

        {/* Results Area */}
        {analysisState.data && (
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            {/* Left: Visual Analysis */}
            <div className="flex flex-col min-h-0">
              <div className="flex items-center mb-2 px-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Analysis View</h3>
              </div>
              <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800 p-4 overflow-hidden">
                <VisualDisplay data={analysisState.data} />
              </div>
            </div>

            {/* Right: JSON Output */}
            <div className="flex flex-col min-h-0">
               <div className="flex items-center mb-2 px-2">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Structured Data</h3>
              </div>
               <div className="flex-1 overflow-hidden">
                 <JsonDisplay data={analysisState.data} />
               </div>
            </div>
          </div>
        )}

        {/* Empty State / Intro */}
        {analysisState.status === 'idle' && (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
              <div className="w-16 h-16 border-2 border-gray-700 border-dashed rounded-lg mb-4 flex items-center justify-center">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              </div>
              <p>Waiting for input...</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;