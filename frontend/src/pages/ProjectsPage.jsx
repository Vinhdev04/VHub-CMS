import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Select, Space, Tag, Typography, message } from 'antd';
import {
  PlusOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  StarOutlined,
  ClockCircleOutlined,
  AppstoreFilled,
  UnorderedListOutlined,
} from '@ant-design/icons';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import { useProjects } from '../hooks/useProjects';

const { Title, Text } = Typography;

const STATUS_FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'Live',        label: 'Live' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Archived',    label: 'Archived' },
];

export default function ProjectsPage() {
  const { projects, loading, error, createProjectItem, updateProjectItem, deleteProjectItem } = useProjects();

  const [modalOpen,      setModalOpen]      = useState(false);
  const [submitting,     setSubmitting]      = useState(false);
  const [editingProject, setEditingProject]  = useState(null);
  const [statusFilter,   setStatusFilter]   = useState('all');
  const [sortOrder,      setSortOrder]       = useState('newest');

  // Listen for header "Add Project" button event
  useEffect(() => {
    function handleOpenAdd() { openCreateModal(); }
    window.addEventListener('cms:open-add-project', handleOpenAdd);
    return () => window.removeEventListener('cms:open-add-project', handleOpenAdd);
  }, []);

  // Derived stats
  const liveCount    = projects.filter((p) => p.status === 'Live').length;
  const totalStars   = projects.reduce((sum, p) => sum + (p.stars || 0), 0);
  const inProgCount  = projects.filter((p) => p.status === 'In Progress').length;

  // Filtered + sorted list
  const displayed = projects
    .filter((p) => statusFilter === 'all' || p.status === statusFilter)
    .sort((a, b) => {
      if (sortOrder === 'stars')  return b.stars - a.stars;
      if (sortOrder === 'oldest') return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id); // newest first (by id string)
    });

  function openCreateModal() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEditModal(project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    try {
      setSubmitting(true);
      if (editingProject?.id) {
        await updateProjectItem(editingProject.id, values);
        message.success('Đã cập nhật dự án.');
      } else {
        await createProjectItem(values);
        message.success('Đã tạo dự án mới.');
      }
      setModalOpen(false);
    } catch (err) {
      message.error(err.message || 'Không thể lưu dự án.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProjectItem(id);
      message.success('Đã xóa dự án.');
    } catch (err) {
      message.error(err.message || 'Không thể xóa dự án.');
    }
  }

  const STATS = [
    { icon: <AppstoreOutlined />, colorClass: 'orange', label: 'Total Projects', value: projects.length, sub: '+2 this month' },
    { icon: <GlobalOutlined />,   colorClass: 'green',  label: 'Live Projects',  value: liveCount,       sub: 'Active & deployed' },
    { icon: <StarOutlined />,     colorClass: 'yellow', label: 'Total Stars',    value: totalStars.toLocaleString(), sub: '+47 this week' },
    { icon: <ClockCircleOutlined />, colorClass: 'blue', label: 'In Progress',  value: inProgCount,     sub: 'Currently building' },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {STATS.map((s) => (
          <Col key={s.label} xs={24} sm={12} xl={6}>
            <div className="stat-card">
              <div className={`stat-card-icon ${s.colorClass}`}>{s.icon}</div>
              <div className="stat-card-body">
                <div className="stat-card-label">{s.label}</div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-sub">{s.sub}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.key}
              className={`filter-tab-btn${statusFilter === f.key ? ' active-filter' : ''}`}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
              {f.key !== 'all' && (
                <Tag style={{ marginLeft: 6, fontSize: 11 }}>
                  {projects.filter((p) => p.status === f.key).length}
                </Tag>
              )}
              {f.key === 'all' && (
                <Tag style={{ marginLeft: 6, fontSize: 11 }}>{projects.length}</Tag>
              )}
            </Button>
          ))}
        </div>
        <Space>
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            className="filter-sort-select"
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'stars',  label: 'Most Stars' },
            ]}
          />
          <Button icon={<PlusOutlined />} type="primary" onClick={openCreateModal} className="header-add-btn">
            Thêm mới
          </Button>
        </Space>
      </div>

      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
        Showing {displayed.length} of {projects.length} projects
      </Text>

      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

      <ProjectsGrid
        projects={displayed}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <ProjectFormModal
        open={modalOpen}
        loading={submitting}
        initialValues={editingProject}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
