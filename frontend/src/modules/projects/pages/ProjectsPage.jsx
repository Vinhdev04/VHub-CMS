import { Alert, Button, Card, Col, Row, Space, Statistic, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import ProjectFormModal from '../components/ProjectFormModal';
import ProjectDetailModal from '../components/ProjectDetailModal';
import ProjectsGrid from '../components/ProjectsGrid';
import { useProjects } from '../hooks/useProjects';
import { getProjectById } from '../../../api/projects.api';

const { Title } = Typography;

function ProjectsPage() {
  const { projects, loading, error, createProjectItem, updateProjectItem, deleteProjectItem } =
    useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const liveProjects = projects.filter((item) => item.status === 'Live').length;
  const totalStars = projects.reduce((sum, item) => sum + Number(item.stars || 0), 0);

  useEffect(() => {
    function handleOpenAdd() {
      setEditingProject(null);
      setModalOpen(true);
    }

    window.addEventListener('cms:open-add-project', handleOpenAdd);
    return () => window.removeEventListener('cms:open-add-project', handleOpenAdd);
  }, []);

  function openCreateModal() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEditModal(project) {
    setEditingProject(project);
    setModalOpen(true);
  }

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

  async function handleDelete(projectId) {
    try {
      await deleteProjectItem(projectId);
      message.success('Da xoa du an.');
    } catch (deleteError) {
      message.error(deleteError.message || 'Khong the xoa du an.');
    }
  }

  return (
    <div>
      <Space
        align="center"
        style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Projects Dashboard
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Them du an moi
        </Button>
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Tong du an" value={projects.length} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Du an Live" value={liveProjects} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Stars" value={totalStars} />
          </Card>
        </Col>
      </Row>

      {error ? (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <ProjectsGrid
        projects={projects}
        loading={loading || detailLoading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onView={openDetailModal}
      />

      <ProjectFormModal
        open={modalOpen}
        loading={submitting}
        initialValues={editingProject}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
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
