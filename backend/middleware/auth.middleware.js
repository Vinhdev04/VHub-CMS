import { env, hasSupabaseConfig, isAdminEmail } from '../config/env.js';
import { supabase } from '../lib/supabase.js';

function extractSupabaseEmail(user) {
  const candidates = [
    user?.email,
    user?.user_metadata?.email,
    user?.user_metadata?.preferred_email,
    ...(Array.isArray(user?.identities)
      ? user.identities.map((identity) => identity?.identity_data?.email)
      : []),
  ];

  const matched = candidates.find((value) => typeof value === 'string' && value.trim());
  return String(matched || '').trim().toLowerCase();
}

export async function authMiddleware(req, res, next) {
  if (!hasSupabaseConfig || !supabase) {
    req.user = {
      id: req.headers['x-dev-user-id'] || 'dev-user',
      email: req.headers['x-dev-user-email'] || 'dev@localhost',
      name: req.headers['x-dev-user-name'] || 'Developer',
      avatar: req.headers['x-dev-user-avatar'] || '',
      provider: req.headers['x-dev-user-provider'] || 'email',
      role: req.headers['x-dev-user-role'] || 'Administrator',
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ ok: false, message: 'Invalid or expired token' });
    }

    const normalizedEmail = extractSupabaseEmail(user);
    if (!isAdminEmail(normalizedEmail)) {
      console.warn(`[AUTH] Truy cập bị từ chối cho email: ${normalizedEmail}. Vui lòng thêm email này vào ADMIN_EMAILS trong file .env.`);
      return res.status(403).json({ ok: false, message: 'Tai khoan nay khong co quyen admin.' });
    }

    req.user = {
      id: user.id,
      email: normalizedEmail,
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      avatar: user.user_metadata?.avatar_url || '',
      provider: user.app_metadata?.provider || 'email',
      role: 'Administrator',
    };

    return next();
  } catch (err) {
    console.error('[AUTH] Token verification failed:', err.message);
    return res.status(401).json({ ok: false, message: 'Authentication failed' });
  }
}
