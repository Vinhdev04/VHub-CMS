import { env, hasAdminConfig } from '../config/env.js';
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

    if (!hasAdminConfig) {
      return res.status(503).json({ ok: false, message: 'Tai khoan admin chua duoc cau hinh.' });
    }

    if (email !== env.adminEmail.toLowerCase() || password !== env.adminPassword) {
      return res.status(401).json({ ok: false, message: 'Sai thong tin dang nhap admin.' });
    }

    const profile = await getUserProfile(normalizeAdminUser(email));
    return res.json(successResponse(profile, 'Dang nhap admin thanh cong'));
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
