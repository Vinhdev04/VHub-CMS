import { useState, useMemo, useEffect } from 'react';
import {
  AppstoreOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, Avatar, Button, Col, Popconfirm, Row, Spin, Tag, Typography, message, Skeleton, Card, Input, Select, Empty, Badge, Space } from 'antd';
import PersonnelFormModal from '../components/personnel/PersonnelFormModal';
import { usePersonnel } from '../hooks/usePersonnel';

const { Title, Text } = Typography;
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
  const [seeding, setSeeding] = useState(false);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  async function handleSeed() {
      setSeeding(true);
      try {
          const admins = [
              { name: 'System Admin', email: 'admin@vhub.io', role: 'Administrator', status: 'Active', projects: 5, avatar: 'https://i.pravatar.cc/150?u=admin' },
              { name: 'Google Workspace', email: 'google-admin@vhub.io', role: 'Administrator', status: 'Active', projects: 2, avatar: 'https://i.pravatar.cc/150?u=google' },
              { name: 'GitHub Manager', email: 'github-admin@vhub.io', role: 'Administrator', status: 'Active', projects: 8, avatar: 'https://i.pravatar.cc/150?u=github' }
          ];
          for (const a of admins) {
              await createPersonnelItem(a);
          }
          message.success('Đã nạp 3 tài khoản Admin mẫu thành công!');
      } catch (e) {
          message.error('Lỗi khi nạp dữ liệu mẫu.');
      } finally {
          setSeeding(false);
      }
  }

  const filteredPersonnel = useMemo(() => {
    let result = [...personnel];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q));
    }
    if (filterRole !== 'All') {
      result = result.filter(p => p.role === filterRole);
    }
    return result;
  }, [personnel, search, filterRole]);

  const roles = useMemo(() => {
    const set = new Set();
    personnel.forEach(p => set.add(p.role));
    return ['All', ...Array.from(set)];
  }, [personnel]);

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
    { icon: <TeamOutlined />, color: 'orange', label: 'Team Members', value: personnel.length, sub: 'Total headcount' },
    { icon: <UserOutlined />, color: 'green', label: 'Active', value: activeCount, sub: 'Currently working' },
    { icon: <AppstoreOutlined />, color: 'blue', label: 'Avg Projects', value: avgProjects, sub: 'Per member' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <Title level={2} className="page-title">Resource Management</Title>
          <Text type="secondary">Manage your team members and their project assignments</Text>
        </div>
        <Space>
            <Button icon={<CloudDownloadOutlined />} onClick={handleSeed} loading={seeding} style={{ borderRadius: 8 }}>
                Load Samples
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingPerson(null); setModalOpen(true); }} className="header-add-btn" size="large">
                Add Member
            </Button>
            </motion.div>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item, i) => (
          <Col key={item.label} xs={24} sm={8}>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="stat-card">
                <div className={`stat-card-icon ${item.color}`}>{item.icon}</div>
                <div className="stat-card-body">
                  <div className="stat-card-label">{item.label}</div>
                  <div className="stat-card-value" style={{ fontWeight: 800 }}>{item.value}</div>
                  <div className="stat-card-sub">{item.sub}</div>
                </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Card variant="borderless" className="glass-panel" style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Input 
              prefix={<SearchOutlined />} 
              placeholder="Search members..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              allowClear
            />
          </Col>
          <Col xs={12} md={7}>
            <Select 
              value={filterRole} 
              onChange={setFilterRole} 
              style={{ width: '100%' }}
              options={roles.map(r => ({ value: r, label: r }))}
              suffixIcon={<FilterOutlined />}
            />
          </Col>
          <Col xs={12} md={7} style={{ textAlign: 'right' }}>
            <Badge count={filteredPersonnel.length} style={{ backgroundColor: '#ff7a1a' }} />
            <Text type="secondary" style={{ marginLeft: 8 }}>Found</Text>
          </Col>
        </Row>
      </Card>

      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16, borderRadius: 12 }} /> : null}

      {loading ? (
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map(i => (
            <Col key={i} xs={24} sm={12} xl={6}>
              <Card bordered={false} style={{ borderRadius: 16 }}>
                <Skeleton active avatar={{ size: 64, shape: 'circle' }} paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[16, 16]}>
          <AnimatePresence mode="popLayout">
            {filteredPersonnel.length === 0 ? (
               <Col span={24}>
                 <Empty description="No members found matching your criteria" />
               </Col>
            ) : filteredPersonnel.map((person, idx) => (
              <Col key={person.id} xs={24} sm={12} xl={6}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="personnel-card" style={{ borderRadius: 16, padding: '24px 20px' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                      <Avatar
                        size={80}
                        src={person.avatar}
                        style={{
                          background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                          fontSize: 28,
                          fontWeight: 700,
                          border: '3px solid #fff',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        }}
                      >
                        {person.name?.charAt(0)}
                      </Avatar>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 5,
                          right: 5,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: person.status === 'Active' ? '#22c55e' : '#9ca3af',
                          border: '3px solid #fff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>

                    <div className="personnel-card-name" style={{ fontSize: 16, letterSpacing: '-0.3px' }}>{person.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: person.roleColor || '#ff7a1a', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {person.role}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 24,
                        marginBottom: 20,
                        padding: '16px 0',
                        borderTop: '1px solid #f0f0f0',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
                          {person.projects || 0}
                        </div>
                        <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                          <AppstoreOutlined style={{ fontSize: 10 }} /> Projects
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
                          {person.joinedAt || 'N/A'}
                        </div>
                        <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                          <CalendarOutlined style={{ fontSize: 10 }} /> Joined
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      <Tag
                        className={person.status === 'Active' ? 'badge-live' : 'badge-archived'}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          margin: 0,
                          padding: '4px 0',
                          borderRadius: 8,
                          fontSize: 12
                        }}
                      >
                        {person.status}
                      </Tag>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingPerson(person);
                          setModalOpen(true);
                        }}
                        className="project-icon-btn"
                      />
                      <Popconfirm title="Xoa nhan su nay?" onConfirm={() => handleDelete(person.id)}>
                        <Button danger icon={<DeleteOutlined />} className="project-icon-btn" />
                      </Popconfirm>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
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
