import { env, hasAdminConfig, isAdminEmail } from '../config/env.js';
import { successResponse } from '../helpers/apiResponse.js';
import { getUserProfile, upsertUserProfile } from '../helpers/user.repository.js';

function normalizeAdminUser(email) {
  return {
    id: `admin:${email.toLowerCase()}`,
    email: email.toLowerCase(),
    name: 'Administrator',
    role: 'Administrator',
    avatar: '',
    provider: 'email',
  };
}

export async function adminLoginController(req, res, next) {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email va mat khau la bat buoc.' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ ok: false, message: 'Email khong hop le.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ ok: false, message: 'Mat khau phai co it nhat 8 ky tu.' });
    }

    // 1. Kiểm tra cấu hình trong .env (Root Admin)
    const isRootAdmin = isAdminEmail(email) && password === env.adminPassword;
    
    // 2. Kiểm tra trong Database (Personnel collection)
    let dbUser = null;
    try {
        const { db } = await import('../lib/firebase.js');
        const personnelSnap = await db.collection('personnel')
            .where('email', '==', email)
            .get();
        
        if (!personnelSnap.empty) {
            const foundUser = personnelSnap.docs[0].data();
            
            // Logic kiểm tra mật khẩu linh hoạt:
            // - Nếu là Viewer (Demo): Cho phép dùng 'demo123456'
            // - Nếu là Admin khác: Cho phép dùng mật khẩu lưu trong Firestore (nếu có) hoặc mật khẩu hệ thống
            if (foundUser.role === 'Viewer' && password === 'demo123456') {
                dbUser = foundUser;
            } else if (password === env.adminPassword || (foundUser.password && password === foundUser.password)) {
                dbUser = foundUser;
            }
        }
    } catch (err) {
        console.error('[AUTH] Lỗi truy vấn database login:', err.message);
    }

    if (!isRootAdmin && !dbUser) {
      console.warn(`[AUTH] Dang nhap THAT BAI cho: ${email}`);
      return res.status(401).json({ ok: false, message: 'Sai thong tin dang nhap hoac mat khau.' });
    }

    const userData = dbUser ? {
        id: dbUser.id || `admin:${email}`,
        email: email,
        name: dbUser.name || 'User',
        role: dbUser.role || 'Administrator',
        avatar: dbUser.avatar || '',
        provider: 'email'
    } : normalizeAdminUser(email);

    const profile = await getUserProfile(userData);
    return res.json(successResponse(profile, 'Dang nhap thanh cong'));
  } catch (error) {
    return next(error);
  }
}

export async function getMeController(req, res, next) {
  try {
    const profile = await getUserProfile(req.user);
    return res.json(successResponse(profile, 'User profile retrieved'));
  } catch (error) {
    return next(error);
  }
}

export async function updateMeController(req, res, next) {
  try {
    const profile = await upsertUserProfile(req.user, req.body);
    return res.json(successResponse(profile, 'User profile updated'));
  } catch (error) {
    return next(error);
  }
}
