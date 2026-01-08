import React from 'react';
import { ScrapedData } from '../types';

interface JsonDisplayProps {
  data: ScrapedData;
}

const JsonDisplay: React.FC<JsonDisplayProps> = ({ data }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-gray-400 font-mono text-sm uppercase tracking-wider">Raw Output</h3>
        <span className="text-xs text-green-500 font-mono">Status: 200 OK</span>
      </div>
      <div className="flex-1 bg-gray-950 rounded-lg border border-gray-800 p-4 overflow-auto font-mono text-sm shadow-inner relative">
        <div className="absolute top-0 right-0 p-2">
            <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition"
            >
                Copy
            </button>
        </div>
        <pre className="text-blue-100">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default JsonDisplay;