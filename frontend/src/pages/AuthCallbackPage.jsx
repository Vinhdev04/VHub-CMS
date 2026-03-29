import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { getMyProfile } from '../api/auth.api';
import { supabase, hasSupabase } from '../config/supabase';
import { ROUTES } from '../shared/constants/routes';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      if (!hasSupabase || !supabase) {
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      const session = data.session;

      if (error || !session) {
        message.error(error?.message || 'Khong the xac minh dang nhap OAuth.');
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      try {
        // Gửi token trực tiếp để tránh lỗi đồng bộ cache
        await getMyProfile(session.access_token);
      } catch (profileError) {
        await supabase.auth.signOut();
        message.error(profileError.message || 'Tai khoan nay khong co quyen admin.');
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      navigate(ROUTES.PROJECTS, { replace: true });
    }

    handleCallback();
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
        gap: 20,
      }}
    >
      <Spin size="large" />
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500 }}>
        Dang xu ly dang nhap...
      </div>
    </div>
  );
}
