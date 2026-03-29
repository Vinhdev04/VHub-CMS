const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function getStoredUser() {
  try {
    const raw = sessionStorage.getItem('cms_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getAuthToken() {
  try {
    const raw = sessionStorage.getItem('sb-auth-token');
    if (raw) return JSON.parse(raw)?.access_token || null;
  } catch {}

  const storageKeys = [...Object.keys(sessionStorage), ...Object.keys(localStorage)];
  for (const key of storageKeys) {
    if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
      try {
        const source = key in sessionStorage ? sessionStorage : localStorage;
        const data = JSON.parse(source.getItem(key));
        if (data?.access_token) return data.access_token;
      } catch {}
    }
  }

  return null;
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  const storedUser = getStoredUser();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (storedUser) {
    headers['X-Dev-User-Id'] = storedUser.id || storedUser.email || 'dev-user';
    headers['X-Dev-User-Email'] = storedUser.email || 'dev@localhost';
    headers['X-Dev-User-Name'] = storedUser.name || 'Developer';
    headers['X-Dev-User-Avatar'] = storedUser.avatar || '';
    headers['X-Dev-User-Provider'] = storedUser.provider || 'email';
    headers['X-Dev-User-Role'] = storedUser.role || 'Administrator';
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

export async function adminLogin(data) {
  return request('/auth/admin-login', { method: 'POST', body: JSON.stringify(data) });
}

export async function getMyProfile() {
  return request('/auth/me');
}

export async function updateMyProfile(data) {
  return request('/auth/me', { method: 'PUT', body: JSON.stringify(data) });
}
