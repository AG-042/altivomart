"use client";

import { useState, useEffect } from "react";

export function DebugInfo() {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [environment, setEnvironment] = useState<string>('');

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api');
    setEnvironment(process.env.NODE_ENV || 'development');
  }, []);

  // Only show in development or when explicitly enabled
  const showDebug = process.env.NODE_ENV === 'development' || 
                   process.env.NEXT_PUBLIC_SHOW_DEBUG === 'true';

  if (!showDebug) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div>
        <strong>Environment:</strong> {environment}
      </div>
      <div>
        <strong>API URL:</strong> {apiUrl}
      </div>
      <div>
        <strong>Host:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
      </div>
    </div>
  );
}
