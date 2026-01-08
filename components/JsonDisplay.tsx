import React, { useState } from 'react';
import { ScrapedData } from '../types';

interface JsonDisplayProps {
  data: ScrapedData;
}

const JsonDisplay: React.FC<JsonDisplayProps> = ({ data }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus('idle');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsUploading(false);
    setUploadStatus('success');
    
    // Reset success status after 3 seconds
    setTimeout(() => setUploadStatus('idle'), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-normal animate-pulse"></div>
           <h3 className="text-brand-secondary font-black text-[10px] uppercase tracking-widest">System Raw Output</h3>
        </div>
        <div className="flex items-center gap-4">
          {uploadStatus === 'success' && (
            <div className="text-[10px] text-brand-normal font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
              Sync Complete
            </div>
          )}
          <div className="px-2 py-0.5 rounded bg-brand-normal/10 border border-brand-normal/20">
             <span className="text-[10px] text-brand-normal font-mono font-bold tracking-tighter">HTTP 200 OK</span>
          </div>
        </div>
      </div>
      <div className="bg-brand-bg/80 backdrop-blur-sm rounded-xl border border-brand-tertiary p-5 font-mono text-sm shadow-inner relative transition-colors duration-300">
        <div className="absolute top-4 right-4 flex gap-2 z-10 transition-opacity">
            <button 
                onClick={handleUpload}
                disabled={isUploading}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 shadow-lg active:scale-95 ${
                  isUploading 
                  ? 'bg-brand-accent/50 text-white cursor-not-allowed' 
                  : 'bg-brand-accent hover:bg-brand-accent/90 text-white shadow-brand-accent/20'
                }`}
            >
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload JSON
                  </>
                )}
            </button>
            <button 
                onClick={handleCopy}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all shadow-lg active:scale-95 ${
                    copied 
                    ? 'bg-brand-normal text-brand-bg' 
                    : 'bg-brand-tertiary hover:bg-brand-tertiary/80 text-brand-primary'
                }`}
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
        <div className="">
           <pre className="text-brand-secondary selection:bg-brand-accent selection:text-white leading-relaxed overflow-x-auto custom-scrollbar">
             <code>{JSON.stringify(data, null, 2)}</code>
           </pre>
        </div>
      </div>
    </div>
  );
};

export default JsonDisplay;