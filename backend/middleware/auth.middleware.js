import { env, hasSupabaseConfig, isAdminEmail, hasFirebaseConfig } from '../config/env.js';
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
    console.log(`[AUTH] Checking access for: ${normalizedEmail}`);

    if (!normalizedEmail) return res.status(401).json({ ok: false, message: 'Authorization error: No email found' });

    let isAdmin = isAdminEmail(normalizedEmail);
    let isViewer = false;

    // Hardcode quyền để bạn cứu vãn đăng nhập ngay lập tức
    if (['pcv.fed@gmail.com', 'vaniizit@gmail.com', 'admin@devcms.io'].includes(normalizedEmail)) {
        isAdmin = true;
        console.log(`[AUTH] Emergency access granted for: ${normalizedEmail}`);
    }

    // Bổ sung kiểm tra từ Database nếu không có trong .env
    if (hasFirebaseConfig) {
        try {
            const { db } = await import('../lib/firebase.js');
            const personnelSnap = await db.collection('personnel')
                .where('email', '==', normalizedEmail)
                .get();
            
            if (!personnelSnap.empty) {
                const userData = personnelSnap.docs[0].data();
                if (userData.role === 'Administrator') {
                    isAdmin = true;
                } else if (userData.role === 'Viewer') {
                    isViewer = true;
                }
            }
        } catch (dbErr) {
            console.error('[AUTH] Lỗi kiểm tra database role:', dbErr.message);
        }
    }

    // Nếu là Viewer, chỉ cho phép các method đọc (GET)
    if (isViewer && req.method !== 'GET') {
        return res.status(403).json({ ok: false, message: 'Tai khoan Demo chi co quyen xem, khong the thay doi du lieu.' });
    }

    if (!isAdmin && !isViewer) {
      console.warn(`[AUTH] Truy cập bị từ chối cho email: ${normalizedEmail}.`);
      return res.status(403).json({ ok: false, message: 'Tai khoan nay khong co quyen truy cap Dashboard.' });
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
