"use client";

import { useState } from "react";

export default function ImportNgosDebug() {
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [data, setData] = useState('');
  const [token, setToken] = useState(process.env.NEXT_PUBLIC_ADMIN_IMPORT_TOKEN || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleJSON = `[
  {
    "name": "Women's Safety Network",
    "contact": "+91 98765 43210",
    "services": ["Legal Aid", "Counseling", "Shelter"],
    "languages": ["English", "Hindi", "Punjabi"],
    "region": "Delhi",
    "verified": true
  },
  {
    "name": "Hope Foundation",
    "contact": "1800-123-456",
    "services": ["Crisis Support", "Hotline"],
    "languages": ["English", "Tamil", "Telugu"],
    "region": "Chennai",
    "verified": true
  }
]`;

  const sampleCSV = `name,contact,services,languages,region,verified
Women's Safety Network,+91 98765 43210,Legal Aid;Counseling;Shelter,English;Hindi;Punjabi,Delhi,true
Hope Foundation,1800-123-456,Crisis Support;Hotline,English;Tamil;Telugu,Chennai,true
Support Circle,+91 99999 88888,Counseling;Legal Aid,English;Marathi,Mumbai,false`;

  const handleImport = async () => {
    if (!data.trim()) {
      setError('Please enter data to import');
      return;
    }

    if (!token.trim()) {
      setError('Admin token is required');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const contentType = format === 'json' ? 'application/json' : 'text/csv';
      const response = await fetch('/api/admin/import-ngos', {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          'x-admin-token': token,
        },
        body: data,
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || `HTTP ${response.status}`);
      } else {
        setResult(json);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setData(format === 'json' ? sampleJSON : sampleCSV);
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Dev-only tool</strong> - This page is for development use only. 
          It will not work in production without a valid admin token.
        </p>
      </div>

      <h1 className="text-2xl font-bold mb-6">Import NGOs (Debug)</h1>

      <div className="space-y-6">
        {/* Format Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Format
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="json"
                checked={format === 'json'}
                onChange={(e) => setFormat(e.target.value as 'json')}
                className="mr-2"
              />
              JSON
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="csv"
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value as 'csv')}
                className="mr-2"
              />
              CSV
            </label>
          </div>
        </div>

        {/* Token Input */}
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
            Admin Token
          </label>
          <input
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter ADMIN_IMPORT_TOKEN"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="mt-1 text-xs text-gray-500">
            Set in .env.local as ADMIN_IMPORT_TOKEN (and NEXT_PUBLIC_ADMIN_IMPORT_TOKEN for auto-fill)
          </p>
        </div>

        {/* Data Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="data" className="block text-sm font-medium text-gray-700">
              NGO Data ({format.toUpperCase()})
            </label>
            <button
              onClick={loadSample}
              className="text-sm text-blue-600 hover:underline"
            >
              Load Sample
            </button>
          </div>
          <textarea
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
            placeholder={format === 'json' ? 'Paste JSON array...' : 'Paste CSV data...'}
          />
          {format === 'csv' && (
            <p className="mt-1 text-xs text-gray-500">
              CSV columns: name, contact, services (semicolon-separated), languages (semicolon-separated), 
              region, lat, lng, verified
            </p>
          )}
        </div>

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-medium"
        >
          {loading ? 'Importing...' : 'Import NGOs'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Import Successful!</h3>
            <div className="text-sm text-green-800 space-y-1">
              <p>✓ Inserted: <strong>{result.inserted}</strong></p>
              <p>✓ Updated: <strong>{result.updated}</strong></p>
              <p>✓ Total: <strong>{result.total}</strong></p>
            </div>
            <p className="mt-3 text-xs text-green-700">
              Visit <a href="/resources" className="underline">/resources</a> to see the imported NGOs.
              You may need to clear the cache.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Set ADMIN_IMPORT_TOKEN in .env.local</li>
            <li>Choose JSON or CSV format</li>
            <li>Paste your data or load sample</li>
            <li>Enter admin token</li>
            <li>Click Import</li>
            <li>Check /resources to verify</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
