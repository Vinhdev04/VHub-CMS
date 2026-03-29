import { env, hasFirebaseConfig } from "../config/env.js";

let db = null;

if (hasFirebaseConfig) {
  try {
    const { default: admin } = await import("firebase-admin");

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.firebaseProjectId,
          clientEmail: env.firebaseClientEmail,
          privateKey: env.firebasePrivateKey,
        }),
      });
    }

    db = admin.firestore();
    console.log("Firebase Firestore connected");
  } catch (error) {
    console.warn(`Firebase unavailable, using in-memory mock data: ${error.message}`);
  }
} else {
  console.warn("Firebase config missing, using in-memory mock data");
}

export { db };
export { hasFirebaseConfig };
