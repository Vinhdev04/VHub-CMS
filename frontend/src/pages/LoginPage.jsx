import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Space, message } from 'antd';
import {
  LockOutlined,
  MailOutlined,
  GithubOutlined,
  GoogleOutlined,
  AppstoreOutlined,
  BookOutlined,
  BarChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { hasSupabase } from '../config/supabase';
import { useAuth } from '../shared/contexts/auth-context';
import { ROUTES } from '../shared/constants/routes';

const FEATURES = [
  { icon: <AppstoreOutlined />, title: 'Project Manager', desc: 'Manage all your dev projects in one place' },
  { icon: <BookOutlined />, title: 'Blog and Content', desc: 'Write, publish, and track your tech blog' },
  { icon: <BarChartOutlined />, title: 'Analytics', desc: 'Deep insights with interactive charts' },
  { icon: <TeamOutlined />, title: 'Team Control', desc: 'Manage your personnel and their roles' },
];

export default function LoginPage() {
  const { loginWithEmail, signInWithProvider } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');

  async function handleSubmit(values) {
    setLoading(true);
    try {
      const result = await loginWithEmail(values.email, values.password);
      if (result.success) {
        message.success('Dang nhap thanh cong.');
        navigate(ROUTES.PROJECTS);
      } else {
        message.error(result.error || 'Dang nhap that bai.');
      }
    } catch (error) {
      message.error(error.message || 'Dang nhap that bai. Vui long thu lai.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider) {
    setSocialLoading(provider);
    try {
      const result = await signInWithProvider(provider);
      if (result.success) {
        if (result.demo) {
          message.success(`Dang nhap bang ${provider} thanh cong.`);
          navigate(ROUTES.PROJECTS);
        }
      } else {
        message.error(result.error || `Dang nhap bang ${provider} that bai.`);
      }
    } catch (error) {
      message.error(error.message || `Dang nhap bang ${provider} that bai.`);
    } finally {
      setSocialLoading('');
    }
  }

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div
              className="brand-logo"
              style={{
                width: 44,
                height: 44,
                fontSize: 22,
                borderRadius: 12,
                background: 'linear-gradient(135deg,#ff7a1a,#ff9d50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              V
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>DevCMS</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Admin Panel</div>
            </div>
          </div>

          <div className="login-online-badge">
            <span className="login-online-dot" />
            System Online
          </div>

          <h1 className="login-headline">
            Your developer
            <br />
            workspace, <em>reimagined.</em>
          </h1>
          <p className="login-desc">
            One unified platform to manage your portfolio projects, publish content, and track performance.
          </p>

          <div className="login-feature-grid">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="login-feature-item">
                <div className="login-feature-icon" style={{ color: '#ff7a1a' }}>
                  {feature.icon}
                </div>
                <div className="login-feature-title">{feature.title}</div>
                <div className="login-feature-desc">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <h2>Welcome back</h2>
          <p>Sign in to access your admin dashboard</p>

          <div className="login-demo-note">
            <span style={{ color: '#ff7a1a' }}>i</span>
            {hasSupabase
              ? 'Chi email admin trong backend moi duoc dang nhap bang email, Google hoac GitHub.'
              : 'Che do local: admin login dung tai khoan backend, Google/GitHub dung profile demo.'}
          </div>

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label="EMAIL ADDRESS"
              name="email"
              rules={[
                { required: true, type: 'email', message: 'Email khong hop le' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="admin@devcms.io"
                className="login-input"
                size="large"
              />
            </Form.Item>
            <Form.Item
              label="PASSWORD"
              name="password"
              rules={[
                { required: true, message: 'Vui long nhap mat khau' },
                { min: 8, message: 'Mat khau phai co it nhat 8 ky tu' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                className="login-input"
                size="large"
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>Remember me</Checkbox>
              </Form.Item>
              <span style={{ color: '#ff7a1a', fontSize: 13, cursor: 'pointer' }}>Admin access only</span>
            </div>

            <Button htmlType="submit" loading={loading} className="login-submit-btn" size="large">
              Sign in to Dashboard
            </Button>
          </Form>

          <div className="login-divider"><span>or continue with</span></div>

          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button
              icon={<GithubOutlined />}
              className="login-social-btn"
              style={{ width: 155 }}
              loading={socialLoading === 'github'}
              onClick={() => handleOAuth('github')}
            >
              GitHub
            </Button>
            <Button
              icon={<GoogleOutlined />}
              className="login-social-btn"
              style={{ width: 155 }}
              loading={socialLoading === 'google'}
              onClick={() => handleOAuth('google')}
            >
              Google
            </Button>
          </Space>

          <div className="login-footer">
            Copyright 2026 DevCMS
            <br />
            Protected system. Unauthorized access is prohibited.
          </div>
        </div>
      </div>
    </div>
  );
}
