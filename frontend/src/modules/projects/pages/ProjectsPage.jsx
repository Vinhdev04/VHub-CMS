import { Alert, Button, Card, Col, Row, Space, Statistic, Typography, message, FloatButton, Skeleton, Input, Select, Badge, Empty } from 'antd';
import { PlusOutlined, ArrowDownOutlined, SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectFormModal from '../components/ProjectFormModal';
import ProjectDetailModal from '../components/ProjectDetailModal';
import GitHubImportModal from '../components/GitHubImportModal';
import ProjectsGrid from '../components/ProjectsGrid';
import { useProjects } from '../hooks/useProjects';
import { getProjectById } from '../../../api/projects.api';

const { Title } = Typography;

function ProjectsPage() {
  const { projects, loading, error, createProjectItem, updateProjectItem, deleteProjectItem } =
    useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTech, setFilterTech] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Derive unique technologies for filter
  const allTechs = useMemo(() => {
    const set = new Set();
    projects.forEach(p => p.technologies?.forEach(t => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Pagination / Filtered list
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    // Status
    if (filterStatus !== 'All') {
      result = result.filter(p => p.status === filterStatus);
    }

    // Tech
    if (filterTech !== 'All') {
      result = result.filter(p => p.technologies?.includes(filterTech));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [projects, search, filterStatus, filterTech, sortBy]);

  const [pageSize, setPageSize] = useState(6);
  const visibleProjects = filteredProjects.slice(0, pageSize);
  const hasMore = filteredProjects.length > pageSize;

  const liveProjects = projects.filter((item) => item.status === 'Live').length;
  const totalStars = projects.reduce((sum, item) => sum + Number(item.stars || 0), 0);

  useEffect(() => {
    function handleOpenAdd() {
      setEditingProject(null);
      setModalOpen(true);
    }
    const handleGithubBtn = () => setGithubModalOpen(true);

    window.addEventListener('cms:open-add-project', handleOpenAdd);
    window.addEventListener('cms:github-import', handleGithubBtn);
    
    return () => {
      window.removeEventListener('cms:open-add-project', handleOpenAdd);
      window.removeEventListener('cms:github-import', handleGithubBtn);
    };
  }, []);

  async function openDetailModal(projectId) {
    try {
      setDetailLoading(true);
      const detail = await getProjectById(projectId);
      setSelectedProject(detail);
      setDetailOpen(true);
    } catch (detailError) {
      message.error(detailError.message || 'Khong the tai chi tiet du an.');
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleSubmit(values) {
    try {
      setSubmitting(true);
      if (editingProject?.id) {
        await updateProjectItem(editingProject.id, values);
        message.success('Da cap nhat du an.');
      } else {
        await createProjectItem(values);
        message.success('Da tao du an moi.');
      }
      setModalOpen(false);
    } catch (submitError) {
      message.error(submitError.message || 'Khong the luu du an.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGitHubImport(selectedRepos) {
    try {
      setSubmitting(true);
      const promises = selectedRepos.map(repo => createProjectItem(repo));
      await Promise.all(promises);
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(projectId) {
    try {
      await deleteProjectItem(projectId);
      message.success('Da xoa du an.');
    } catch (deleteError) {
      message.error(deleteError.message || 'Khong the xoa du an.');
    }
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <Title level={2} className="page-title">Project Portfolio</Title>
          <Typography.Text type="secondary">Manage and showcase your best technical work</Typography.Text>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProject(null); setModalOpen(true); }} className="header-add-btn" size="large">
            New Project
          </Button>
        </motion.div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Total Projects', value: projects.length, color: 'orange' },
          { title: 'Live Apps', value: liveProjects, color: 'green' },
          { title: 'GitHub Stars', value: totalStars, color: 'yellow' }
        ].map((stat, i) => (
          <Col key={stat.title} xs={24} sm={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="stat-card" variant="borderless">
                <Statistic 
                  title={<span style={{ fontWeight: 600, color: '#6b7280' }}>{stat.title}</span>} 
                  value={stat.value} 
                  valueStyle={{ fontWeight: 800, color: '#111827' }}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Card variant="borderless" className="glass-panel" style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input 
              prefix={<SearchOutlined />} 
              placeholder="Search projects..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              allowClear
            />
          </Col>
          <Col xs={12} md={4}>
            <Select 
              value={filterStatus} 
              onChange={setFilterStatus} 
              style={{ width: '100%' }}
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Live', label: 'Live' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Archived', label: 'Archived' }
              ]}
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select 
              value={filterTech} 
              onChange={setFilterTech} 
              style={{ width: '100%' }}
              options={allTechs.map(t => ({ value: t, label: t }))}
            />
          </Col>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Typography.Text strong style={{ whiteSpace: 'nowrap' }}><SortAscendingOutlined /> Sort:</Typography.Text>
              <Select 
                value={sortBy} 
                onChange={setSortBy} 
                style={{ flex: 1 }}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'stars', label: 'Popular (Stars)' },
                  { value: 'name', label: 'Alphabetical' }
                ]}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {error ? (
        <Alert type="error" showIcon message={error} style={{ marginBottom: 24, borderRadius: 12 }} />
      ) : null}

      {visibleProjects.length === 0 && !loading ? (
        <Empty description="No projects found with current filters" style={{ padding: '60px 0' }} />
      ) : (
        <ProjectsGrid
            projects={visibleProjects}
            loading={loading || detailLoading || submitting}
            onEdit={(p) => { setEditingProject(p); setModalOpen(true); }}
            onDelete={handleDelete}
            onView={openDetailModal}
        />
      )}

      {hasMore && !loading && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Button 
            size="large" 
            icon={<ArrowDownOutlined />} 
            onClick={() => setPageSize(prev => prev + 3)}
            style={{ borderRadius: 99, padding: '0 32px', height: 46, fontWeight: 600 }}
          >
            Load More Projects ({filteredProjects.length - visibleProjects.length} left)
          </Button>
        </div>
      )}


      <FloatButton.BackTop visibilityHeight={400} />

      <ProjectFormModal
        open={modalOpen}
        loading={submitting}
        initialValues={editingProject}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <GitHubImportModal
        open={githubModalOpen}
        onCancel={() => setGithubModalOpen(false)}
        onImport={handleGitHubImport}
      />

      <ProjectDetailModal
        open={detailOpen}
        project={selectedProject}
        onCancel={() => setDetailOpen(false)}
      />
    </div>
  );
}

export default ProjectsPage;
