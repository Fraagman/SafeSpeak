"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { blurFaces } from '@/lib/imageBlur';

export default function BlurTestPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [blurredImage, setBlurredImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [stats, setStats] = useState<{ timeMs?: number; facesDetected?: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logMessage = (message: string) => {
    setLog(prev => [`[${new Date().toISOString()}] ${message}`, ...prev].slice(0, 20));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setOriginalImage(null);
    setBlurredImage(null);
    setStats({});
    logMessage(`Selected file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Create preview URL for original image
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
  };

  const handleBlurFaces = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !originalImage) {
      logMessage('Error: No file selected');
      return;
    }

    setIsProcessing(true);
    logMessage('Starting face blur process...');
    const startTime = performance.now();

    try {
      const blob = await blurFaces(file);
      const url = URL.createObjectURL(blob);
      
      const endTime = performance.now();
      const processTime = Math.round(endTime - startTime);
      
      setBlurredImage(url);
      setStats(prev => ({
        ...prev,
        timeMs: processTime,
      }));
      
      logMessage(`Success! Processed in ${processTime}ms`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logMessage(`Error: ${errorMessage}`);
      console.error('Face blur error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Face Blur Tester</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select an image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              disabled={isProcessing}
            />
          </div>

          <button
            onClick={handleBlurFaces}
            disabled={!originalImage || isProcessing}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              !originalImage || isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Run Blur'}
          </button>

          {stats.timeMs !== undefined && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
              <p>Processed in: {stats.timeMs}ms</p>
              {stats.facesDetected !== undefined && (
                <p>Faces detected: {stats.facesDetected}</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Original</h2>
            <div className="bg-gray-100 rounded-md flex items-center justify-center" style={{ minHeight: '300px' }}>
              {originalImage ? (
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="max-w-full max-h-[500px] object-contain"
                />
              ) : (
                <p className="text-gray-500">No image selected</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Blurred</h2>
            <div className="bg-gray-100 rounded-md flex items-center justify-center" style={{ minHeight: '300px' }}>
              {blurredImage ? (
                <img 
                  src={blurredImage} 
                  alt="Blurred" 
                  className="max-w-full max-h-[500px] object-contain"
                />
              ) : (
                <p className="text-gray-500">Result will appear here</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">Logs</h2>
            <button
              onClick={() => setLog([])}
              className="text-sm text-gray-300 hover:text-white"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-black text-green-400 font-mono text-sm p-3 rounded-md h-64 overflow-y-auto">
            {log.length > 0 ? (
              log.map((message, index) => (
                <div key={index} className="mb-1 border-b border-gray-700 pb-1">
                  {message}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No logs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
