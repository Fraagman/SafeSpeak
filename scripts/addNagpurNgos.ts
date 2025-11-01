import { getAdminDb } from "../src/lib/admin";

// Nagpur coordinates
const NAGPUR_COORDS = {
  lat: 21.1458,
  lng: 79.0882
};

const NAGPUR_NGOS = [
  // Education NGOs
  {
    name: "Akhil Bhartiya Marwari Mahila Sammelan (Civil Lines)",
    services: ["Education", "Women Empowerment"],
    languages: ["Hindi", "Marathi", "English"],
    verified: true,
    contact: "Contact via local chapter",
    region: "Nagpur",
    lat: 21.1558,
    lng: 79.0982
  },
  {
    name: "Lasa Charitable Foundation",
    services: ["Child Education", "Rural Development"],
    languages: ["Hindi", "Marathi", "English"],
    verified: true,
    contact: "Visit lasacharitablefoundation.org",
    website: "https://lasacharitablefoundation.org",
    region: "Nagpur",
    lat: 21.1358,
    lng: 79.0882
  },
  
  // Health NGOs
  {
    name: "Love and Care India Trust",
    services: ["Mobile Health Services", "Elderly Care", "Women's Vocational Training"],
    languages: ["Hindi", "Marathi"],
    verified: true,
    contact: "Check local directories",
    region: "Nagpur",
    lat: 21.1658,
    lng: 79.0782
  },
  
  // Women and Child NGOs
  {
    name: "Nageshwara Charitable Trust",
    services: ["Women Empowerment", "Rural Development"],
    languages: ["Hindi", "Marathi"],
    verified: true,
    contact: "+91 712 2558410",
    website: "https://nageshwara.org",
    region: "Nagpur",
    lat: 21.1458,
    lng: 79.1082
  },
  
  // Tribal and Rural Development
  {
    name: "Bhartiya Adim Jati Sevak Sangh (Vidarbha)",
    services: ["Tribal Education", "Vocational Training", "Healthcare"],
    languages: ["Hindi", "Marathi", "Tribal Dialects"],
    verified: true,
    contact: "Contact via organization search",
    region: "Nagpur",
    lat: 21.1258,
    lng: 79.0982
  },
  
  // Multi-theme Social Service
  {
    name: "India Peace Centre (Nagpur)",
    services: ["Peace Education", "Interfaith Dialogue", "Civic Engagement"],
    languages: ["Hindi", "English", "Marathi"],
    verified: true,
    contact: "Check local directories",
    region: "Nagpur",
    lat: 21.1558,
    lng: 79.0782
  },
  
  // Environment and Livelihoods
  {
    name: "Sahyadri Gramin Vikas va Bahuuddeshiya Yuvak Kalyan Sanstha",
    services: ["Rural Development", "Environmental Awareness", "Livelihood Programs"],
    languages: ["Hindi", "Marathi"],
    verified: true,
    contact: "Contact via organization",
    region: "Nagpur",
    lat: 21.1158,
    lng: 79.0882
  },
  
  // Additional Education NGOs
  {
    name: "Aadhar Bahuuddeshiya Sanstha Nagpur",
    services: ["Education", "Social Work"],
    languages: ["Hindi", "Marathi"],
    verified: true,
    contact: "Azad Hind Nagar, Jaitala Road",
    region: "Nagpur",
    lat: 21.1358,
    lng: 79.1082
  },
  
  // Additional Health NGOs
  {
    name: "Mobile Medical Camps (Various Groups)",
    services: ["Healthcare", "Medical Camps", "Rural Health"],
    languages: ["Hindi", "Marathi"],
    verified: true,
    contact: "Check local directories",
    region: "Nagpur",
    lat: 21.1558,
    lng: 79.0582
  }
];

async function addNagpurNgos() {
  try {
    const db = getAdminDb();
    
    // Check for existing NGOs to avoid duplicates
    const existingNgos = await db.collection('ngos').where('region', '==', 'Nagpur').get();
    const existingNames = new Set(existingNgos.docs.map(doc => doc.data().name));
    
    // Filter out NGOs that already exist
    const newNgos = NAGPUR_NGOS.filter(ngo => !existingNames.has(ngo.name));
    
    if (newNgos.length === 0) {
      console.log('All Nagpur NGOs already exist in the database.');
      return;
    }
    
    console.log(`Found ${newNgos.length} new NGOs to add.`);
    
    // Add each new NGO to the batch
    const batch = db.batch();
    newNgos.forEach(ngo => {
      const ngoRef = db.collection('ngos').doc();
      batch.set(ngoRef, {
        ...ngo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    // Commit the batch
    await batch.commit();
    console.log(`Successfully added ${newNgos.length} NGOs to the database.`);
    
    // Show the names of added NGOs
    console.log('Added NGOs:');
    newNgos.forEach(ngo => console.log(`- ${ngo.name}`));
    
  } catch (error) {
    console.error('Error adding NGOs:', error);
    throw error;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  addNagpurNgos().catch(console.error);
}

export { addNagpurNgos };
