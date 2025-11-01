import { NextResponse } from 'next/server';
import { INDIA_STATE_CITIES } from '@/data/indiaStateCities';

interface ImportRequest {
  state: string;
  limitPerCity?: number;
}

interface CityResult {
  city: string;
  inserted: number;
  updated: number;
  total: number;
  error?: string;
}

export async function POST(request: Request) {
  // Check if it's a POST request
  if (request.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { 
      status: 405,
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  // Check admin token
  const token = request.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_IMPORT_TOKEN) {
    const status = process.env.NODE_ENV === 'production' ? 410 : 401;
    return new NextResponse('Unauthorized', { 
      status,
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  try {
    const { state, limitPerCity = 5 } = (await request.json()) as ImportRequest;

    if (!state) {
      return new NextResponse('Missing state parameter', { 
        status: 400,
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    // Filter cities for the given state (case-insensitive)
    const stateCities = INDIA_STATE_CITIES
      .filter(entry => entry.state.toLowerCase() === state.toLowerCase())
      .slice(0, 8); // Take max 8 cities

    if (stateCities.length === 0) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'No cities found for the specified state',
          state,
          availableStates: [...new Set(INDIA_STATE_CITIES.map(c => c.state))].sort()
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        }
      );
    }

    const results: CityResult[] = [];
    let insertedTotal = 0;
    let updatedTotal = 0;

    // Process each city with a delay
    for (const { city } of stateCities) {
      try {
        // Add delay between requests (1-2 seconds)
        if (results.length > 0) {
          const delay = 1000 + Math.floor(Math.random() * 1000); // 1-2 seconds
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Make internal API call to import-city-ngos
        const response = await fetch(
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/import-city-ngos`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-token': process.env.ADMIN_IMPORT_TOKEN || ''
            },
            body: JSON.stringify({ state, city, limit: limitPerCity })
          }
        );

        if (!response.ok) {
          const error = await response.text().catch(() => 'Unknown error');
          throw new Error(`Failed to import ${city}: ${error}`);
        }

        const result = await response.json();
        results.push({
          city,
          inserted: result.inserted || 0,
          updated: result.updated || 0,
          total: result.total || 0
        });

        insertedTotal += result.inserted || 0;
        updatedTotal += result.updated || 0;

      } catch (error) {
        console.error(`Error processing ${city}:`, error);
        results.push({
          city,
          inserted: 0,
          updated: 0,
          total: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Prepare summary
    const summary = {
      state,
      processedCities: results.length,
      successfulCities: results.filter(r => !r.error).length,
      failedCities: results.filter(r => r.error).length,
      insertedTotal,
      updatedTotal,
      results
    };

    return new NextResponse(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });

  } catch (error) {
    console.error('Batch import error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      }
    );
  }
}

// Add cache control headers for other methods
const methodNotAllowed = () => new NextResponse('Method Not Allowed', { 
  status: 405,
  headers: { 'Cache-Control': 'no-store' }
});

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PATCH = methodNotAllowed;
