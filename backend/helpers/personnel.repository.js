import { db, hasFirebaseConfig } from '../lib/firebase.js';

const COLLECTION = 'personnel';

const mockPersonnel = [
  {
    id: 'u1', name: 'Alex Rivera', role: 'Lead Frontend Developer', email: 'alex@devcms.io',
    status: 'Active', projects: 8, joinedAt: 'Jun 23', roleColor: '#3b82f6',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'u2', name: 'Priya Nair', role: 'Backend Engineer', email: 'priya@devcms.io',
    status: 'Active', projects: 5, joinedAt: 'Sep 23', roleColor: '#22c55e',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5b3e8cb?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'u3', name: 'Jordan Kim', role: 'UI/UX Designer', email: 'jordan@devcms.io',
    status: 'Active', projects: 6, joinedAt: 'Jan 24', roleColor: '#8b5cf6',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'u4', name: 'Marcus Webb', role: 'DevOps Engineer', email: 'marcus@devcms.io',
    status: 'Inactive', projects: 12, joinedAt: 'Nov 22', roleColor: '#f59e0b',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
  },
];

let localPersonnel = [...mockPersonnel];

function normalize(person) {
  return {
    id: person.id,
    name: person.name || '',
    role: person.role || '',
    email: person.email || '',
    status: person.status || 'Active',
    projects: Number(person.projects || 0),
    joinedAt: person.joined_at || person.joinedAt || '',
    roleColor: person.role_color || person.roleColor || '#3b82f6',
    avatar: person.avatar || '',
  };
}

export async function findAllPersonnel() {
  if (!hasFirebaseConfig || !db) return localPersonnel;

  try {
    const snapshot = await db.collection(COLLECTION).get();
    return snapshot.docs.map((doc) => normalize({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local personnel list: ${error.message}`);
    return localPersonnel;
  }
}

export async function createPersonnel(payload) {
  const data = normalize(payload);

  if (!hasFirebaseConfig || !db) {
    const newPerson = { ...data, id: `u_${Date.now()}` };
    localPersonnel = [newPerson, ...localPersonnel];
    return newPerson;
  }

  try {
    const docRef = await db.collection(COLLECTION).add({
      name: data.name,
      role: data.role,
      email: data.email,
      status: data.status,
      projects: data.projects,
      joined_at: data.joinedAt,
      role_color: data.roleColor,
      avatar: data.avatar,
      created_at: new Date().toISOString(),
    });

    return normalize({ id: docRef.id, ...data });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local personnel create: ${error.message}`);
    const newPerson = { ...data, id: `u_${Date.now()}` };
    localPersonnel = [newPerson, ...localPersonnel];
    return newPerson;
  }
}

export async function updatePersonnel(personId, payload) {
  const data = normalize(payload);

  if (!hasFirebaseConfig || !db) {
    const idx = localPersonnel.findIndex((p) => String(p.id) === String(personId));
    if (idx < 0) throw new Error('Không tìm thấy nhân sự cần cập nhật.');
    localPersonnel[idx] = { ...localPersonnel[idx], ...data, id: localPersonnel[idx].id };
    return localPersonnel[idx];
  }

  try {
    const docRef = db.collection(COLLECTION).doc(personId);
    await docRef.update({
      name: data.name,
      role: data.role,
      email: data.email,
      status: data.status,
      projects: data.projects,
      joined_at: data.joinedAt,
      role_color: data.roleColor,
      avatar: data.avatar,
      updated_at: new Date().toISOString(),
    });

    const updated = await docRef.get();
    return normalize({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local personnel update ${personId}: ${error.message}`);
    const idx = localPersonnel.findIndex((p) => String(p.id) === String(personId));
    if (idx < 0) throw error;
    localPersonnel[idx] = { ...localPersonnel[idx], ...data, id: localPersonnel[idx].id };
    return localPersonnel[idx];
  }
}

export async function deletePersonnel(personId) {
  if (!hasFirebaseConfig || !db) {
    const prev = localPersonnel.length;
    localPersonnel = localPersonnel.filter((p) => String(p.id) !== String(personId));
    if (localPersonnel.length === prev) throw new Error('Không tìm thấy nhân sự cần xóa.');
    return { id: personId };
  }

  try {
    await db.collection(COLLECTION).doc(personId).delete();
    return { id: personId };
  } catch (error) {
    console.warn(`[FIREBASE] Fallback to local personnel delete ${personId}: ${error.message}`);
    const prev = localPersonnel.length;
    localPersonnel = localPersonnel.filter((p) => String(p.id) !== String(personId));
    if (localPersonnel.length === prev) throw error;
    return { id: personId };
  }
}
