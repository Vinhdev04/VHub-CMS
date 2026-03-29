import { db, hasFirebaseConfig } from '../lib/firebase.js';

const COLLECTION = 'users';
const localUsers = new Map();

function normalizeUserProfile(input = {}) {
  return {
    id: input.id || '',
    email: input.email || '',
    name: input.name || input.fullName || '',
    role: input.role || 'Administrator',
    avatar: input.avatar || '',
    username: input.username || '',
    bio: input.bio || '',
    location: input.location || '',
    website: input.website || '',
    github: input.github || '',
    twitter: input.twitter || '',
    provider: input.provider || 'email',
    createdAt: input.created_at || input.createdAt || '',
    updatedAt: input.updated_at || input.updatedAt || '',
  };
}

export async function getUserProfile(authUser) {
  const fallback = normalizeUserProfile(authUser);
  const docId = authUser.id || authUser.email;

  if (!hasFirebaseConfig || !db) {
    const existing = localUsers.get(docId);
    return existing ? { ...fallback, ...existing } : fallback;
  }

  try {
    const doc = await db.collection(COLLECTION).doc(docId).get();
    if (!doc.exists) return fallback;
    return { ...fallback, ...normalizeUserProfile({ id: doc.id, ...doc.data() }) };
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local user profile for ${docId}: ${error.message}`);
    const existing = localUsers.get(docId);
    return existing ? { ...fallback, ...existing } : fallback;
  }
}

export async function upsertUserProfile(authUser, payload) {
  const docId = authUser.id || authUser.email;
  const existing = await getUserProfile(authUser);
  const timestamp = new Date().toISOString();
  const nextProfile = normalizeUserProfile({
    ...existing,
    ...payload,
    id: docId,
    email: payload.email || authUser.email || existing.email,
    provider: authUser.provider || existing.provider,
    created_at: existing.createdAt || timestamp,
    updated_at: timestamp,
  });

  if (!hasFirebaseConfig || !db) {
    localUsers.set(docId, nextProfile);
    return nextProfile;
  }

  try {
    await db.collection(COLLECTION).doc(docId).set({
      email: nextProfile.email,
      name: nextProfile.name,
      role: nextProfile.role,
      avatar: nextProfile.avatar,
      username: nextProfile.username,
      bio: nextProfile.bio,
      location: nextProfile.location,
      website: nextProfile.website,
      github: nextProfile.github,
      twitter: nextProfile.twitter,
      provider: nextProfile.provider,
      created_at: nextProfile.createdAt || timestamp,
      updated_at: timestamp,
    }, { merge: true });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local user profile write for ${docId}: ${error.message}`);
    localUsers.set(docId, nextProfile);
  }

  return nextProfile;
}
