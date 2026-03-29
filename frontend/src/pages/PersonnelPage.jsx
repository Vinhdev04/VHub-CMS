import { useEffect, useState } from 'react';
import { Alert, Avatar, Button, Col, Popconfirm, Row, Spin, Tag, message } from 'antd';
import {
  AppstoreOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import PersonnelFormModal from '../components/personnel/PersonnelFormModal';
import { usePersonnel } from '../hooks/usePersonnel';

const AVATAR_COLORS = ['#ff7a1a', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function PersonnelPage() {
  const {
    personnel,
    loading,
    error,
    createPersonnelItem,
    updatePersonnelItem,
    deletePersonnelItem,
  } = usePersonnel();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  useEffect(() => {
    const handler = () => {
      setEditingPerson(null);
      setModalOpen(true);
    };

    window.addEventListener('cms:open-add-member', handler);
    return () => window.removeEventListener('cms:open-add-member', handler);
  }, []);

  const activeCount = personnel.filter((person) => person.status === 'Active').length;
  const avgProjects = personnel.length
    ? Math.round(personnel.reduce((sum, person) => sum + Number(person.projects || 0), 0) / personnel.length)
    : 0;

  async function handleDelete(id) {
    try {
      await deletePersonnelItem(id);
      message.success('Da xoa nhan su.');
    } catch (err) {
      message.error(err.message || 'Khong the xoa nhan su.');
    }
  }

  async function handleSubmit(values) {
    try {
      setSubmitting(true);

      if (editingPerson?.id) {
        await updatePersonnelItem(editingPerson.id, values);
        message.success('Da cap nhat nhan su.');
      } else {
        await createPersonnelItem(values);
        message.success('Da them nhan su moi.');
      }

      setModalOpen(false);
    } catch (err) {
      message.error(err.message || 'Khong the luu nhan su.');
    } finally {
      setSubmitting(false);
    }
  }

  const stats = [
    { icon: <TeamOutlined />, colorClass: 'orange', label: 'Team Members', value: personnel.length, sub: 'Total headcount' },
    { icon: <UserOutlined />, colorClass: 'green', label: 'Active', value: activeCount, sub: 'Currently working' },
    { icon: <AppstoreOutlined />, colorClass: 'orange', label: 'Avg Projects', value: avgProjects, sub: 'Per member' },
  ];

  return (
    <div className="animate-fade-in-up">
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item) => (
          <Col key={item.label} xs={24} sm={8}>
            <div className="stat-card">
              <div className={`stat-card-icon ${item.colorClass}`}>{item.icon}</div>
              <div className="stat-card-body">
                <div className="stat-card-label">{item.label}</div>
                <div className="stat-card-value">{item.value}</div>
                <div className="stat-card-sub">{item.sub}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} /> : null}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {personnel.map((person, idx) => (
            <Col key={person.id} xs={24} sm={12} xl={6}>
              <div className="personnel-card">
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
                  <Avatar
                    size={80}
                    src={person.avatar}
                    style={{
                      background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                      fontSize: 28,
                      fontWeight: 700,
                      border: '3px solid #fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    {person.name?.charAt(0)}
                  </Avatar>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: person.status === 'Active' ? '#22c55e' : '#9ca3af',
                      border: '2.5px solid #fff',
                    }}
                  />
                </div>

                <div className="personnel-card-name">{person.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: person.roleColor, marginBottom: 14 }}>
                  {person.role}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 28,
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
                      {person.projects}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', marginTop: 2 }}>
                      <AppstoreOutlined style={{ fontSize: 10 }} /> Projects
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
                      {person.joinedAt}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', marginTop: 2 }}>
                      <CalendarOutlined style={{ fontSize: 10 }} /> Joined
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <Tag
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: 12,
                      padding: '5px 0',
                      borderRadius: 8,
                      margin: 0,
                      background: person.status === 'Active' ? 'rgba(34,197,94,0.08)' : 'rgba(107,114,128,0.08)',
                      color: person.status === 'Active' ? '#16a34a' : '#6b7280',
                      border: `1px solid ${person.status === 'Active' ? 'rgba(34,197,94,0.2)' : 'rgba(107,114,128,0.2)'}`,
                    }}
                  >
                    {person.status}
                  </Tag>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingPerson(person);
                      setModalOpen(true);
                    }}
                    style={{ borderRadius: 6, width: 30, height: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  />
                  <Popconfirm title="Xoa nhan su nay?" okText="Xoa" cancelText="Huy" onConfirm={() => handleDelete(person.id)}>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      style={{ borderRadius: 6, width: 30, height: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                  </Popconfirm>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <PersonnelFormModal
        open={modalOpen}
        loading={submitting}
        initialValues={editingPerson}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
