// API base URL from environment
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function getAuthToken() {
  try {
    const raw = sessionStorage.getItem('sb-auth-token');
    if (raw) return JSON.parse(raw)?.access_token || null;
  } catch { /* ignore */ }

  // Fallback: try Supabase's internal storage key
  const keys = Object.keys(sessionStorage);
  for (const key of keys) {
    if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
      try {
        const data = JSON.parse(sessionStorage.getItem(key));
        if (data?.access_token) return data.access_token;
      } catch { /* ignore */ }
    }
  }

  // Try localStorage too (Supabase default)
  const lsKeys = Object.keys(localStorage);
  for (const key of lsKeys) {
    if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data?.access_token) return data.access_token;
      } catch { /* ignore */ }
    }
  }

  return null;
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // Attach auth token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload?.data;
}

/* ── Projects API ─────────────────────────────────────────── */
export async function getProjects() {
  return request('/projects');
}

export async function getProjectById(id) {
  return request(`/projects/${id}`);
}

export async function createProject(data) {
  return request('/projects', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProject(id, data) {
  return request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteProject(id) {
  return request(`/projects/${id}`, { method: 'DELETE' });
}
