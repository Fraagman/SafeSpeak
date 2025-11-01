import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/admin";
import { Timestamp } from "firebase-admin/firestore";
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

// City coordinates for fallback
const CITY_MAP: Record<string, { lat: number; lng: number }> = {
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
};

type NgoImportData = {
  name: string;
  contact?: string;
  services?: string | string[];
  languages?: string | string[];
  region?: string;
  lat?: number | string;
  lng?: number | string;
  verified?: boolean | string;
  [key: string]: any; // For any additional fields
};

function methodNotAllowed() {
  return new NextResponse("Method not allowed.", {
    status: 405,
    headers: { Allow: "POST" },
  });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;

function parseCSV(csvText: string): NgoImportData[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const ngos: NgoImportData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const ngo: NgoImportData = { name: '' };
    
    headers.forEach((header, index) => {
      const value = values[index];
      if (!value) return;
      
      switch (header) {
        case 'name':
          ngo.name = value;
          break;
        case 'contact':
          ngo.contact = value;
          break;
        case 'services':
          ngo.services = value.includes(';') ? value.split(';').map(s => s.trim()) : value;
          break;
        case 'languages':
          ngo.languages = value.includes(';') ? value.split(';').map(l => l.trim()) : value;
          break;
        case 'region':
          ngo.region = value;
          break;
        case 'lat':
        case 'latitude':
          ngo.lat = parseFloat(value);
          break;
        case 'lng':
        case 'longitude':
          ngo.lng = parseFloat(value);
          break;
        case 'verified':
          ngo.verified = value.toLowerCase() === 'true' || value === '1';
          break;
      }
    });
    
    if (ngo.name) ngos.push(ngo);
  }
  
  return ngos;
}

function normalizeNgo(ngo: NgoImportData) {
  console.log('Normalizing NGO:', ngo.name);
  
  // Basic validation
  if (!ngo.name || typeof ngo.name !== 'string' || ngo.name.trim() === '') {
    throw new Error(`Invalid NGO name: ${ngo.name}`);
  }

  const normalized: any = {
    name: ngo.name.trim(),
    verified: typeof ngo.verified === 'string' 
      ? (ngo.verified.toLowerCase() === 'true' || ngo.verified === '1')
      : Boolean(ngo.verified),
    updatedAt: Timestamp.now(),
    _importId: uuidv4(),
  };
  
  // Handle contact
  if (ngo.contact && typeof ngo.contact === 'string') {
    normalized.contact = ngo.contact.trim();
  }
  
  // Handle region
  if (ngo.region && typeof ngo.region === 'string') {
    normalized.region = ngo.region.trim();
  }
  
  // Normalize services
  if (ngo.services) {
    normalized.services = Array.isArray(ngo.services) 
      ? ngo.services.map(s => String(s).trim()).filter(Boolean)
      : String(ngo.services).split(/[,\n;]/).map((s: string) => s.trim()).filter(Boolean);
  } else {
    normalized.services = [];
  }
  
  // Normalize languages
  if (ngo.languages) {
    normalized.languages = Array.isArray(ngo.languages)
      ? ngo.languages.map(l => String(l).trim()).filter(Boolean)
      : String(ngo.languages).split(/[,\n;]/).map((l: string) => l.trim()).filter(Boolean);
  } else {
    normalized.languages = [];
  }
  
  // Handle coordinates
  const lat = typeof ngo.lat === 'string' ? parseFloat(ngo.lat) : ngo.lat;
  const lng = typeof ngo.lng === 'string' ? parseFloat(ngo.lng) : ngo.lng;
  
  if (typeof lat === 'number' && !isNaN(lat) && 
      typeof lng === 'number' && !isNaN(lng)) {
    normalized.lat = lat;
    normalized.lng = lng;
    normalized._hasCoords = true;
  } else if (normalized.region) {
    // Fallback to city coordinates
    const cityKey = normalized.region.toLowerCase().replace(/\s+/g, '');
    const cityCoords = CITY_MAP[cityKey];
    if (cityCoords) {
      normalized.lat = cityCoords.lat;
      normalized.lng = cityCoords.lng;
      normalized._hasCoords = true;
    } else {
      normalized._hasCoords = false;
    }
  } else {
    normalized._hasCoords = false;
  }
  
  console.log('Normalized NGO data:', JSON.stringify(normalized, null, 2));
  return normalized;
}

// Process NGOs in batches to avoid Firestore limits
const BATCH_SIZE = 25;

async function processBatch(
  batch: FirebaseFirestore.WriteBatch,
  operations: { ref: FirebaseFirestore.DocumentReference, data: any, type: 'set' | 'update' }[],
  stats: { inserted: number; updated: number; errors: number }
) {
  try {
    // Execute the batch
    await batch.commit();
    
    // Update stats based on operation type
    operations.forEach(op => {
      if (op.type === 'set') stats.inserted++;
      else stats.updated++;
    });
    
    console.log(`✅ Processed batch of ${operations.length} operations`);
  } catch (error) {
    console.error('❌ Batch operation failed:', error);
    stats.errors += operations.length;
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('Starting NGO import process');
  
  // Production protection
  const adminToken = request.headers.get('x-admin-token');
  const validToken = process.env.ADMIN_IMPORT_TOKEN;
  
  if (process.env.NODE_ENV !== "development" && adminToken !== validToken) {
    console.warn('Unauthorized access attempt in production');
    return NextResponse.json({ error: "gone" }, { status: 410 });
  }
  
  if (!adminToken || adminToken !== validToken) {
    console.warn('Invalid or missing admin token');
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  
  try {
    // Parse request body
    const contentType = request.headers.get('content-type') || '';
    let ngos: NgoImportData[] = [];
    
    console.log(`Processing request with content type: ${contentType}`);
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      ngos = Array.isArray(body) ? body : [body];
      console.log(`Parsed ${ngos.length} NGOs from JSON`);
    } else if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
      const csvText = await request.text();
      ngos = parseCSV(csvText);
      console.log(`Parsed ${ngos.length} NGOs from CSV`);
    } else {
      const errorMsg = `Unsupported content type: ${contentType}. Use application/json or text/csv`;
      console.error(errorMsg);
      return NextResponse.json({ 
        success: false,
        error: errorMsg 
      }, { status: 400 });
    }
    
    if (ngos.length === 0) {
      const errorMsg = "No valid NGO data provided";
      console.error(errorMsg);
      return NextResponse.json({ 
        success: false,
        error: errorMsg 
      }, { status: 400 });
    }
    
    // Initialize Firestore
    console.log('Initializing Firestore...');
    const db = getAdminDb();
    const batch = db.batch();
    
    const stats = {
      total: ngos.length,
      processed: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      invalid: 0,
    };
    
    const batchOperations: {
      ref: FirebaseFirestore.DocumentReference;
      data: any;
      type: 'set' | 'update';
    }[] = [];
    
    console.log(`Processing ${ngos.length} NGOs...`);
    
    // Process NGOs in batches
    for (const [index, ngo] of ngos.entries()) {
      try {
        stats.processed++;
        
        if (!ngo || !ngo.name || typeof ngo.name !== 'string' || ngo.name.trim() === '') {
          console.warn(`Skipping NGO at index ${index}: Missing or invalid name`);
          stats.skipped++;
          continue;
        }
        
        const normalized = normalizeNgo(ngo);
        const docId = slugify(ngo.name, { lower: true, strict: true }) + '-' + uuidv4().substring(0, 8);
        const docRef = db.collection('ngos').doc(docId);
        
        // Check if document exists
        const doc = await docRef.get();
        const operationType = doc.exists ? 'update' : 'set';
        
        // Add to batch operations
        batchOperations.push({
          ref: docRef,
          data: {
            ...normalized,
            ...(operationType === 'set' ? { createdAt: Timestamp.now() } : {})
          },
          type: operationType
        });
        
        // Process batch if we've reached batch size
        if (batchOperations.length >= BATCH_SIZE) {
          await processBatch(batch, batchOperations, stats);
          batchOperations.length = 0; // Clear the array
        }
        
        // Log progress
        if (stats.processed % 10 === 0 || stats.processed === ngos.length) {
          console.log(`Processed ${stats.processed}/${ngos.length} NGOs...`);
        }
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`Error processing NGO at index ${index} (${ngo?.name || 'unknown'}):`, errorMsg);
        stats.errors++;
      }
    }
    
    // Process any remaining operations in the last batch
    if (batchOperations.length > 0) {
      await processBatch(batch, batchOperations, stats);
    }
    
    // Prepare response
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    const response = {
      success: stats.errors === 0,
      duration: `${duration}s`,
      stats: {
        total: stats.total,
        processed: stats.processed,
        inserted: stats.inserted,
        updated: stats.updated,
        skipped: stats.skipped,
        errors: stats.errors,
        invalid: stats.invalid,
      },
      timestamp: Timestamp.now().toDate().toISOString(),
    };
    
    console.log('Import completed:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response, { status: stats.errors === 0 ? 200 : 207 });
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Critical import error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: "Import failed",
      message: errorMsg,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
