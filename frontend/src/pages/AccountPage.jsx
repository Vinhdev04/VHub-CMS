import { useEffect, useState } from 'react';
import { Avatar, Button, Col, Form, Input, Row, Tabs, Tag, Typography, message } from 'antd';
import {
  UserOutlined, GithubOutlined, TwitterOutlined, SaveOutlined, CameraOutlined,
} from '@ant-design/icons';
import { getMyProfile, updateMyProfile } from '../api/auth.api';
import { useAuth } from '../shared/contexts/auth-context';

const { Title, Text } = Typography;

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();
        setProfile(data);
        form.setFieldsValue({
          fullName: data?.name || '',
          username: data?.username || '',
          email: data?.email || '',
          bio: data?.bio || '',
          location: data?.location || '',
          website: data?.website || '',
          github: data?.github || '',
          twitter: data?.twitter || '',
        });
      } catch (error) {
        form.setFieldsValue({
          fullName: user?.name || 'Alex Carter',
          username: '',
          email: user?.email || 'admin@devcms.io',
          bio: '',
          location: '',
          website: '',
          github: '',
          twitter: '',
        });
      }
    }

    loadProfile();
  }, [form, user]);

  async function handleSave() {
    try {
      setSaving(true);
      const values = await form.validateFields();
      const payload = {
        name: values.fullName,
        username: values.username,
        email: values.email,
        bio: values.bio,
        location: values.location,
        website: values.website,
        github: values.github,
        twitter: values.twitter,
        role: profile?.role || user?.role || 'Administrator',
        avatar: profile?.avatar || user?.avatar || '',
      };
      const updatedProfile = await updateMyProfile(payload);
      setProfile(updatedProfile);
      updateUser({
        ...(user || {}),
        email: updatedProfile.email,
        name: updatedProfile.name,
        role: updatedProfile.role,
        avatar: updatedProfile.avatar,
      });
      message.success('Da luu thong tin tai khoan.');
    } catch (error) {
      message.error(error.message || 'Khong the luu thong tin tai khoan.');
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    {
      key: 'profile',
      label: 'Profile',
      children: (
        <div>
          <div className="account-avatar-wrap">
            <div style={{ position: 'relative' }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ background: '#ff7a1a', fontSize: 32 }} src={profile?.avatar || user?.avatar} />
              <Button
                size="small"
                icon={<CameraOutlined />}
                style={{ position: 'absolute', bottom: -4, right: -4, borderRadius: '50%', width: 28, height: 28, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            </div>
            <div className="account-avatar-info">
              <h3>{profile?.name || user?.name || 'Alex Carter'}</h3>
              <p>{profile?.email || user?.email || 'admin@devcms.io'}</p>
              <Tag color="orange">{profile?.role || user?.role || 'Administrator'}</Tag>
            </div>
          </div>

          <Title level={5} style={{ marginBottom: 16 }}>Personal Information</Title>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Required' }]}>
                  <Input placeholder="Alex Carter" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Username" name="username">
                  <Input prefix="@" placeholder="alexcarter" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Email Address" name="email" rules={[{ required: true }, { type: 'email' }]}>
              <Input placeholder="admin@devcms.io" />
            </Form.Item>
            <Form.Item label="Bio" name="bio">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Location" name="location">
                  <Input placeholder="Ho Chi Minh City" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Website" name="website">
                  <Input placeholder="https://yoursite.dev" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} style={{ marginBottom: 16 }}>Social Links</Title>
            <Form.Item label="GitHub" name="github">
              <Input prefix={<GithubOutlined />} />
            </Form.Item>
            <Form.Item label="Twitter / X" name="twitter">
              <Input prefix={<TwitterOutlined />} />
            </Form.Item>
          </Form>

          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave} className="header-add-btn">
            Save Changes
          </Button>
        </div>
      ),
    },
    {
      key: 'security',
      label: 'Security',
      children: (
        <Form layout="vertical">
          <Title level={5} style={{ marginBottom: 16 }}>Change Password</Title>
          <Form.Item label="Current Password" name="currentPassword">
            <Input.Password />
          </Form.Item>
          <Form.Item label="New Password" name="newPassword">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirmPassword">
            <Input.Password />
          </Form.Item>
          <Button type="primary" className="header-add-btn" disabled>Update Password</Button>
        </Form>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      children: (
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>Notification Preferences</Title>
          <Text type="secondary">Notification settings coming soon.</Text>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="account-card">
        <Tabs items={tabs} className="account-tabs" />
      </div>
    </div>
  );
}
