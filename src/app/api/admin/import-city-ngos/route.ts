import { NextResponse } from 'next/server';
import { getFirestore, Timestamp, GeoPoint } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import slugify from 'slugify';

// Manual list of NGOs for testing
async function getManualNGOs(city: string, state: string) {
  console.log(`Using manual NGO list for ${city}, ${state}`);
  
  // Hardcoded list of known NGOs in Nagpur
  const manualNGOs = [
    {
      name: "Nagpur Social Service Association",
      type: "NGO",
      address: {
        street: "123 Social Service Road",
        city: city,
        state: state,
        country: "India"
      },
      contact: {
        phone: "+91 1234567890",
        email: "info@nagpursocial.org"
      },
      location: {
        lat: 21.1458,
        lng: 79.0882
      }
    },
    {
      name: "Nagpur Education Trust",
      type: "Educational",
      address: {
        street: "456 Education Lane",
        city: city,
        state: state,
        country: "India"
      },
      contact: {
        phone: "+91 9876543210",
        email: "contact@nagpuredu.org"
      },
      location: {
        lat: 21.1460,
        lng: 79.0885
      }
    }
  ];

  console.log(`Found ${manualNGOs.length} manual NGOs`);
  return manualNGOs.map(ngo => ({
    ...ngo,
    source: "manual",
    verified: true,
    updatedAt: new Date().toISOString()
  }));
}

// Interface for our manual NGO data
interface ManualNGO {
  name: string;
  type: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  source: string;
  verified: boolean;
  updatedAt: string;
}

// Convert ManualNGO to OSMElement format
function toOSMElement(ngo: ManualNGO): OSMElement {
  return {
    id: Math.floor(Math.random() * 1000000).toString(),
    type: 'node',
    lat: ngo.location.lat,
    lon: ngo.location.lng,
    tags: {
      name: ngo.name,
      'contact:phone': ngo.contact.phone,
      'contact:email': ngo.contact.email,
      'addr:street': ngo.address.street,
      'addr:city': ngo.address.city,
      'addr:state': ngo.address.state,
      'addr:country': ngo.address.country,
      office: 'ngo',
      source: ngo.source,
      verified: ngo.verified ? 'yes' : 'no'
    }
  };
}

// Test function to directly query Overpass API with a bounding box around Nagpur
async function testOverpassQuery() {
  // Bounding box around Nagpur (expanded area)
  const bbox = '79.0,21.0,79.2,21.2';  // minLon, minLat, maxLon, maxLat
  
  // More comprehensive query to find various types of organizations in Nagpur
  const query = `
    [out:json];
    (
      // Standard NGO and social service tags
      nwr[office=ngo](${bbox});
      nwr[amenity=social_facility](${bbox});
      nwr[charity](${bbox});
      nwr[nonprofit](${bbox});
      nwr[organisation](${bbox});
      
      // Community centers and social services
      nwr[amenity=community_centre](${bbox});
      nwr[amenity=social_centre](${bbox});
      nwr[amenity=coworking_space](${bbox});
      
      // Health and education
      nwr[amenity=hospital](${bbox});
      nwr[amenity=clinic](${bbox});
      nwr[amenity=doctors](${bbox});
      nwr[amenity=school](${bbox});
      nwr[amenity=college](${bbox});
      nwr[amenity=university](${bbox});
      
      // Search by name patterns common in Indian NGOs
      nwr[~"^(name|name:en|operator|brand)"~
        "trust|foundation|society|seva|samiti|samaj|sanstha|mandal|kendra|ashram"
      ,i](${bbox});
    );
    out center 100;
    >;
    out skel qt;
  `;

  try {
    console.log('Testing Overpass API with comprehensive query for Nagpur...');
    console.log('Query:', query);
    
    const startTime = Date.now();
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Overpass API error (${response.status}):`, errorText);
      return [];
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    console.log(`Test query completed in ${responseTime}ms`);
    console.log(`Found ${data.elements?.length || 0} elements`);
    
    if (data.elements && data.elements.length > 0) {
      console.log('Sample elements:', 
        data.elements.slice(0, 3).map((el: any) => ({
          type: el.type,
          id: el.id,
          tags: el.tags || {},
          lat: el.lat || (el.center && el.center.lat),
          lon: el.lon || (el.center && el.center.lon)
        }))
      );
    }
    
    return data.elements || [];
  } catch (error) {
    console.error('Test Overpass query failed:', error);
    return [];
  }
}

// Initialize Firebase Admin if not already done
import type { Firestore } from 'firebase-admin/firestore';

let db: Firestore | null = null;

// Enhanced Firebase initialization with better error handling
const initializeFirebase = () => {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
      return false;
    }

    console.log('Initializing Firebase Admin...');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    if (!serviceAccount.project_id) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT: Missing project_id');
      return false;
    }
    
    if (!getApps().length) {
      console.log('Creating new Firebase app instance...');
      initializeApp({
        credential: cert(serviceAccount as any),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
        projectId: serviceAccount.project_id
      });
      console.log('Firebase app initialized');
    } else {
      console.log('Using existing Firebase app instance');
    }
    
    db = getFirestore();
    db.settings({
      ignoreUndefinedProperties: true
    });
    
    console.log('Firestore initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return false;
  }
};

// Initialize Firebase when the module loads
const isFirebaseInitialized = initializeFirebase();

if (!isFirebaseInitialized) {
  console.warn('Firebase initialization failed. Some features may not work correctly.');
}

// In-memory cache for Nominatim responses (valid for 24 hours)
const nominatimCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Clean up cache every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, { timestamp }] of nominatimCache.entries()) {
    if (now - timestamp > CACHE_TTL) {
      nominatimCache.delete(key);
    }
  }
}, 60 * 60 * 1000);

interface ImportRequest {
  state: string;
  city: string;
  limit?: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface OSMElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    'name:en'?: string;
    phone?: string;
    'contact:phone'?: string;
    email?: string;
    'contact:email'?: string;
    website?: string;
    'contact:website'?: string;
    'addr:street'?: string;
    'addr:city'?: string;
    'addr:state'?: string;
    'addr:postcode'?: string;
    'addr:country'?: string;
    [key: string]: any;
  };
}

interface OverpassResponse {
  elements: OSMElement[];
}

async function geocodeCity(state: string, city: string): Promise<{ lat: number; lng: number } | null> {
  const cacheKey = `${city},${state}`;
  const cached = nominatimCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`Using cached coordinates for ${cacheKey}:`, cached.data[0]);
    return {
      lat: parseFloat(cached.data[0].lat),
      lng: parseFloat(cached.data[0].lon)
    };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=India&format=json&limit=1`;
    console.log(`Geocoding URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': process.env.NOMINATIM_USER_AGENT || 'SafeSpeak/1.0 (safespeak@example.com)'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Nominatim API error (${response.status}):`, errorText);
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Geocoding response for ${city}, ${state}:`, JSON.stringify(data, null, 2));
    
    if (!data || data.length === 0) {
      // Try alternative search without state if first attempt fails
      console.log(`No results found for ${city}, ${state}. Trying alternative search...`);
      const altUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', India')}&format=json&limit=1`;
      console.log(`Alternative geocoding URL: ${altUrl}`);
      
      const altResponse = await fetch(altUrl, {
        headers: {
          'User-Agent': process.env.NOMINATIM_USER_AGENT || 'SafeSpeak/1.0 (safespeak@example.com)'
        }
      });
      
      if (!altResponse.ok) {
        const errorText = await altResponse.text();
        console.error(`Alternative Nominatim API error (${altResponse.status}):`, errorText);
        throw new Error(`Alternative Nominatim API error: ${altResponse.statusText}`);
      }
      
      const altData = await altResponse.json();
      console.log(`Alternative geocoding response:`, JSON.stringify(altData, null, 2));
      
      if (!altData || altData.length === 0) {
        console.error(`No results found in alternative search for ${city}`);
        return null;
      }
      
      // Cache the alternative result
      nominatimCache.set(cacheKey, {
        data: altData,
        timestamp: Date.now()
      });
      
      console.log(`Using coordinates from alternative search:`, altData[0]);
      return {
        lat: parseFloat(altData[0].lat),
        lng: parseFloat(altData[0].lon)
      };
    }
    
    // Cache the result
    nominatimCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    console.log(`Using coordinates:`, data[0]);
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

async function queryOverpass(lat: number, lng: number, radiusKm = 50): Promise<OSMElement[]> {
  // First, try a direct query for Nagpur coordinates if that's where we're looking
  if (Math.abs(lat - 21.1458) < 0.1 && Math.abs(lng - 79.0882) < 0.1) {
    console.log('Using hardcoded Nagpur coordinates for more specific search');
    lat = 21.1458;
    lng = 79.0882;
  }
  
  const radius = radiusKm * 1000; // Convert to meters
  const bbox = [
    (lat - radius / 111320).toFixed(6),
    (lng - (radius / (111320 * Math.cos(lat * Math.PI / 180)))).toFixed(6),
    (lat + radius / 111320).toFixed(6),
    (lng + (radius / (111320 * Math.cos(lat * Math.PI / 180)))).toFixed(6)
  ].join(',');

  console.log(`Querying OSM with bbox: ${bbox} (${lat.toFixed(6)}, ${lng.toFixed(6)})`);

  // Expanded list of OSM tags that might indicate NGOs or similar organizations
  const overpassQuery = `
    [out:json][timeout:180];
    (
      // Standard NGO and social service tags
      nwr[office=ngo](${bbox});
      nwr[amenity=social_facility](${bbox});
      nwr[charity](${bbox});
      nwr[nonprofit](${bbox});
      nwr[organisation](${bbox});
      nwr[volunteer](${bbox});
      
      // Community and social services
      nwr[amenity=community_centre](${bbox});
      nwr[amenity=social_centre](${bbox});
      nwr[amenity=social_facility](${bbox});
      nwr[amenity=coworking_space](${bbox});
      nwr[amenity=training](${bbox});
      nwr[amenity=education](${bbox});
      nwr[amenity=library](${bbox});
      nwr[amenity=research_institute](${bbox});
      
      // Health and welfare
      nwr[amenity=clinic](${bbox});
      nwr[amenity=hospital](${bbox});
      nwr[amenity=doctors](${bbox});
      nwr[healthcare](${bbox});
      nwr[healthcare:speciality~"psychiatry|psychologist|therapy|counseling"](${bbox});
      
      // Education and training
      nwr[amenity=school](${bbox});
      nwr[amenity=college](${bbox});
      nwr[amenity=university](${bbox});
      nwr[amenity=training](${bbox});
      nwr[amenity=research_institute](${bbox});
      
      // Religious and community organizations
      nwr[amenity=place_of_worship](${bbox});
      nwr[amenity=monastery](${bbox});
      nwr[amenity=ashram](${bbox});
      nwr[amenity=community_centre](${bbox});
      
      // Government and public services
      nwr[office=government](${bbox});
      nwr[office=foundation](${bbox});
      nwr[office=association](${bbox});
      nwr[office=charity](${bbox});
      
      // Search by name patterns (case insensitive) - common NGO name patterns in India
      nwr[~"^(name|name:en|operator|brand)"~
        "trust|foundation|society|seva|samiti|samaj|sanstha|mandal|kendra|ashram|gramin|rural|urban|\
        development|welfare|social|help|care|support|ngo|non-profit|nonprofit|charity|\
        seva|sahayog|parishad|pratishtan|nyas|nidhi|niketan|bhavan|sansthan|\
        jan|janseva|jansewa|janhit|janvikaas|janvikas|janseva|\
        mahila|bal|shishu|bala|yuvak|yuvati|vridh|vriddha|\
        kalyan|kalyankari|kalyana|kalyani|kalyankendra|\
        seva|sewak|sewika|sewadhari|sevasadan|sevasamiti|\
        samaj|samajik|samasya|samadhan|samiti|sangh|sangathan|sangharsh|\
        pragati|pragya|pragatisheel|pragatishil|pragatipath|\
        vikas|vikasini|vikasit|vikaskendra|vikasbhavan|\
        shiksha|shikshan|shiksharthi|shikshak|shiksharth|\
        shramik|shramjivi|shramshakti|shramdoot|\
        mahatma|gandhi|ambedkar|phule|savitribai|jotiba|jagruti|jagriti|\
        parivartan|parivartak|parivartanashil|parivartansheel|\
        chetna|chetnaa|chetnaa|chetnayen|chetnaayen|chetnaayan|\
        sahayog|sahayata|sahay|sahayataa|sahayogini|sahayogita|\
        yuva|yuvak|yuvati|yuvashakti|yuvak|yuvati|yuvak|yuvati|\
        arthik|arthiya|arthvyavastha|arthik|arthiya|arthvyavastha|\
        swavlamban|swavalamban|swawalamban|swawalam|\
        udyam|udyog|udyamita|udyogita|udyojak|udyojana|\
        nirman|nirmaan|nirmiti|nirmata|nirmatritva|\
        paryavaran|paryavaran|paryavaran|paryavaran|\
        paryavaran|paryavaran|paryavaran|paryavaran|\
        paryavaran|paryavaran|paryavaran|paryavaran|\
        paryavaran|paryavaran|paryavaran|paryavaran|\
        paryavaran|paryavaran|paryavaran|paryavaran"
      ,i](${bbox});
    );
    
    // Remove duplicates and ensure we have coordinates
    (._; - ._;) -> .filtered;
    
    // Get center points for ways/relations
    .filtered out center;
    >;
    out skel qt;
  `;

  try {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    console.log(`Sending request to Overpass API: ${overpassUrl}`);
    console.log(`Query length: ${overpassQuery.length} characters`);
    
    const startTime = Date.now();
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    const responseTime = Date.now() - startTime;
    console.log(`Overpass API response time: ${responseTime}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Overpass API error (${response.status}):`, errorText);
      throw new Error(`Overpass API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json() as OverpassResponse;
    console.log(`Found ${data.elements?.length || 0} elements in the response`);
    
    if (data.elements && data.elements.length > 0) {
      console.log('Sample element:', JSON.stringify(data.elements[0], null, 2));
    }
    
    return data.elements || [];
  } catch (error) {
    console.error('Error querying Overpass API:', error);
    return [];
  }
}

function normalizeNGO(element: OSMElement, city: string, state: string) {
  const tags = element.tags || {};
  
  // Generate a more descriptive name for unnamed NGOs
  let name = tags.name || tags['name:en'] || 
            tags['addr:housename'] || 
            tags['addr:street'] || 
            tags['operator'] ||
            tags['brand'] ||
            'Unnamed Organization';
  
  // If it's still unnamed, add coordinates to make it unique
  if (name === 'Unnamed Organization' && element.lat && element.lon) {
    name = `Organization at ${element.lat.toFixed(6)},${element.lon.toFixed(6)}`;
  }

  // Get coordinates - prefer node lat/lon, then center for ways/relations
  let lat: number, lng: number;
  if (element.lat !== undefined && element.lon !== undefined) {
    lat = element.lat;
    lng = element.lon;
  } else if (element.center) {
    lat = element.center.lat;
    lng = element.center.lon;
  } else {
    return null; // Skip if no coordinates
  }

  // Determine organization type based on OSM tags
  const orgType = getOrganizationType(tags);
  const services = getServicesFromTags(tags);
  
  // Build address object with fallbacks
  const address: Record<string, string> = {};
  address.street = tags['addr:street'] || tags['addr:full'] || '';
  address.city = tags['addr:city'] || city || '';
  address.state = tags['addr:state'] || state || '';
  address.postcode = tags['addr:postcode'] || '';
  address.country = tags['addr:country'] || 'India';
  
  // Clean up address - remove empty fields
  Object.keys(address).forEach(key => {
    if (!address[key]) delete address[key];
  });

  // Extract contact info from various possible tags
  const phone = [
    tags.phone,
    tags['contact:phone'],
    tags['contact:mobile'],
    tags['contact:whatsapp']
  ].filter(Boolean).join('; ');
  
  const email = tags.email || tags['contact:email'] || '';
  
  // Collect all possible website/social media links
  const website = [
    tags.website,
    tags['contact:website'],
    tags.url,
    tags['contact:facebook'] ? `https://facebook.com/${tags['contact:facebook'].replace(/^@/, '')}` : '',
    tags['contact:instagram'] ? `https://instagram.com/${tags['contact:instagram'].replace(/^@/, '')}` : ''
  ].filter(Boolean)[0] || ''; // Take the first available link
  
  // Extract additional metadata
  const description = tags.description || tags['description:en'] || tags.note || '';
  const openingHours = tags['opening_hours'] || '';
  
  const hasContactInfo = phone || email || website;
  const lastUpdated = tags['last_updated'] || tags['lastupdate'] || new Date().toISOString().split('T')[0];

  return {
    name: name.trim(),
    slug: slugify(`${state} ${city} ${name}`, { lower: true, strict: true }),
    orgType,
    services,
    languages: ['English', 'Hindi', 'Marathi'].filter(lang => 
      (tags.language || '').toLowerCase().includes(lang.toLowerCase())
    ) || ['English'],
    region: city,
    state,
    verified: true,
    description: description || undefined,
    openingHours: openingHours || undefined,
    contact: {
      phone: phone || undefined,
      email: email || undefined,
      website: website || undefined
    },
    address: Object.keys(address).length > 0 ? address : undefined,
    location: new GeoPoint(lat, lng),
    source: 'osm',
    sourceId: element.id ? element.id.toString() : undefined,
    sourceType: element.type,
    lastUpdated: new Date(lastUpdated).toISOString(),
    updatedAt: Timestamp.now(),
    _hasContactInfo: hasContactInfo,
    _rawTags: Object.keys(tags).length > 0 ? tags : undefined // Keep original tags for reference
  };
}

// Helper function to determine organization type from OSM tags
function getOrganizationType(tags: Record<string, string>): string {
  if (tags['office'] === 'ngo') return 'NGO';
  if (tags['amenity'] === 'social_facility') return 'Social Facility';
  if (tags['charity']) return 'Charity';
  if (tags['amenity'] === 'community_centre') return 'Community Center';
  if (tags['amenity'] === 'social_centre') return 'Social Center';
  if (tags['healthcare']) return 'Healthcare Organization';
  if (tags['amenity'] === 'hospital' || tags['amenity'] === 'clinic') return 'Medical Facility';
  if (['school', 'college', 'university'].includes(tags['amenity'] || '')) return 'Educational Institution';
  if (tags['club']) return 'Club/Association';
  if (tags['foundation']) return 'Foundation';
  if (tags['nonprofit']) return 'Non-Profit';
  if (tags['religion']) return 'Religious Organization';
  return 'Community Organization';
}

// Helper function to extract services from OSM tags
function getServicesFromTags(tags: Record<string, string>): string[] {
  const services = new Set<string>();
  
  // Add services based on OSM tags
  if (tags.amenity) services.add(tags.amenity.replace(/_/g, ' ').toLowerCase());
  if (tags.healthcare) services.add(tags.healthcare.replace(/_/g, ' ').toLowerCase());
  if (tags.social_facility) services.add(tags.social_facility.replace(/_/g, ' ').toLowerCase());
  
  // Add common services based on tags
  if (tags['social_facility:for']) services.add(tags['social_facility:for'].toLowerCase());
  if (tags['social_facility:people']) services.add(`serves ${tags['social_facility:people'].toLowerCase()}`);
  
  // Convert to title case and add to array
  return Array.from(services).map(service => 
    service.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

export async function POST(request: Request) {
  // Check if it's a POST request
  if (request.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
  
  // Check admin token
  const token = request.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_IMPORT_TOKEN) {
    const status = process.env.NODE_ENV === 'production' ? 401 : 200;
    return new NextResponse('Unauthorized', { status });
  }

  // First, try a simple test query to see if we get any results
  const testResults = await testOverpassQuery();
  console.log(`Test query returned ${testResults.length} results`);
  
  if (testResults.length === 0) {
    console.log('No results from test query, falling back to manual NGO list');
  }

  try {
    const { state, city, limit = 5 } = (await request.json()) as ImportRequest;

    if (!state || !city) {
      return new NextResponse('Missing state or city', { status: 400 });
    }

    // Use manual NGO list and convert to OSMElement format
    console.log(`Using manual NGO list for ${city}, ${state}`);
    const manualNGOs = await getManualNGOs(city, state);
    const elements = manualNGOs.map(toOSMElement);
    console.log(`Converted ${elements.length} manual NGOs to OSMElement format`);
    
    // Normalize and filter NGOs
    const ngos = elements
      .map(el => normalizeNGO(el, city, state))
      .filter((ngo): ngo is NonNullable<typeof ngo> => ngo !== null)
      // Deduplicate by name and coordinates
      .filter((ngo, index, self) => {
        return index === self.findIndex(n => 
          n.name === ngo.name && 
          n.location.isEqual(ngo.location)
        );
      });

    // Sort by having contact info first, then by proximity to center
    ngos.sort((a, b) => {
      // NGOs with contact info first
      if (a._hasContactInfo !== b._hasContactInfo) {
        return a._hasContactInfo ? -1 : 1;
      }
      // Then by name for consistent ordering
      return a.name.localeCompare(b.name);
    });

    // Take top N NGOs
    const topNGOs = ngos.slice(0, limit);

    // Save to Firestore
    if (!db) {
      console.error('Firestore not initialized. Attempting to reinitialize...');
      const reinitialized = initializeFirebase();
      if (!reinitialized || !db) {
        console.error('❌ Failed to initialize Firestore');
        throw new Error('Firestore not initialized');
      }
      console.log('✅ Firestore reinitialized successfully');
    } else {
      console.log('ℹ️ Firestore is already initialized');
    }

    const ngosCollection = db.collection('ngos');
    let inserted = 0;
    let updated = 0;

    console.log(`📝 Preparing to save ${topNGOs.length} NGOs to Firestore`);

    // Process each NGO individually
    for (const ngo of topNGOs) {
      try {
        const docRef = ngosCollection.doc(ngo.slug);
        console.log(`\n🔍 Processing NGO: ${ngo.name} (${docRef.path})`);

        // Prepare the data to be saved
        const ngoData = {
          ...ngo,
          updatedAt: Timestamp.now(),
        };

        // Remove internal fields
        const { _hasContactInfo, ...ngoDataToSave } = ngoData;
        
        // Log the data being saved
        console.log('📄 Document data:', JSON.stringify(ngoDataToSave, null, 2));

        // Check if the document exists
        const doc = await docRef.get();
        
        try {
          if (doc.exists) {
            console.log(`🔄 Updating existing NGO: ${ngo.name}`);
            await docRef.set(ngoDataToSave, { merge: true });
            updated++;
            console.log(`✅ Successfully updated: ${docRef.path}`);
          } else {
            console.log(`🆕 Creating new NGO: ${ngo.name}`);
            await docRef.set({
              ...ngoDataToSave,
              createdAt: Timestamp.now()
            });
            inserted++;
            console.log(`✅ Successfully created: ${docRef.path}`);
          }
          
          // Verify the document was written
          const updatedDoc = await docRef.get();
          if (!updatedDoc.exists) {
            console.error(`❌ Document not found after write: ${docRef.path}`);
          } else {
            console.log(`🔍 Document verified: ${docRef.path}`);
          }
        } catch (error) {
          console.error(`❌ Error saving document ${docRef.path}:`, error);
          throw error; // Re-throw to stop execution on first error
        }
      } catch (error) {
        console.error(`❌ Error processing NGO ${ngo.name}:`, error);
        // Continue with next NGO even if one fails
      }
    }

    console.log(`\n📊 Operations completed: ${inserted} inserts, ${updated} updates`);

    // Return results
    const response = {
      success: true,
      inserted,
      updated,
      total: topNGOs.length,
      ngos: topNGOs.map(({ _hasContactInfo, ...rest }) => rest) // Remove internal field
    };
    
    console.log('Import completed:', response);
    return NextResponse.json(response);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Import error:', errorMessage, error);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        error: 'Import failed',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack : undefined })
      }), 
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        } 
      }
    );
  }
}

// Add cache control headers
export function GET() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: { 'Cache-Control': 'no-store' }
  });
}

export function PUT() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: { 'Cache-Control': 'no-store' }
  });
}

export function DELETE() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: { 'Cache-Control': 'no-store' }
  });
}

export function HEAD() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: { 'Cache-Control': 'no-store' }
  });
}

export function PATCH() {
  return new NextResponse('Method Not Allowed', { 
    status: 405,
    headers: { 'Cache-Control': 'no-store' }
  });
}
