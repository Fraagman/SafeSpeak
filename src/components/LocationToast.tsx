"use client";

import { useEffect, useState } from "react";

type LocationToastProps = {
  message: string;
  onClear?: () => void;
  onDismiss?: () => void;
  duration?: number;
};

export default function LocationToast({ 
  message, 
  onClear, 
  onDismiss,
  duration = 5000 
}: LocationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-sm animate-fadeUp"
      role="status"
      aria-live="polite"
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
        <div className="flex gap-2">
          {onClear && (
            <button
              onClick={() => {
                onClear();
                setIsVisible(false);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              aria-label="Clear location"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
