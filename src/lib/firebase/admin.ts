import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK if not already initialized
let app: App;
let db: Firestore;

try {
  // Parse the service account from environment variable
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
  }

  // Fix newlines in private key if it's escaped
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  if (!getApps().length) {
    app = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      storageBucket: `${serviceAccount.project_id}.appspot.com`
    });
    
    db = getFirestore(app);
    console.log('Firebase Admin initialized successfully');
  } else {
    app = getApps()[0];
    db = getFirestore(app);
  }
} catch (error) {
  console.error('Firebase admin initialization error:', error);
  // Don't throw here to allow the app to start without Firebase in development
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }
}

export { db };

// Re-export Firestore types for convenience
export * from 'firebase-admin/firestore';
