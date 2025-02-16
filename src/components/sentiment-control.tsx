import React from 'react';

interface SentimentControlProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function SentimentControl({ onAnalyze, isAnalyzing }: SentimentControlProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="bg-white px-4 py-2 rounded-md shadow-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Area Sentiment'}
      </button>
    </div>
  );
}
