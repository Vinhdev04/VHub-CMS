import { supabase } from '../lib/supabase.js';
import { hasSupabaseConfig } from '../config/env.js';

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

    req.user = {
      id: user.id,
      email: user.email,
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
