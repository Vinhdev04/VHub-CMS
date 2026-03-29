import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
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

      if (error || !data.session) {
        message.error(error?.message || 'Khong the xac minh dang nhap OAuth.');
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
