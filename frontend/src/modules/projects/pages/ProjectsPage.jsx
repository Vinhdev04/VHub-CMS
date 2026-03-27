import { Alert, Button, Card, Col, Row, Space, Statistic, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import ProjectFormModal from "../components/ProjectFormModal";
import ProjectsGrid from "../components/ProjectsGrid";
import { useProjects } from "../hooks/useProjects";

const { Title } = Typography;

function ProjectsPage() {
  const { projects, loading, error, createProjectItem, updateProjectItem, deleteProjectItem } =
    useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const liveProjects = projects.filter((item) => item.status === "Live").length;
  const totalStars = projects.reduce((sum, item) => sum + item.stars, 0);

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
        message.success("Đã cập nhật dự án.");
      } else {
        await createProjectItem(values);
        message.success("Đã tạo dự án mới.");
      }
      setModalOpen(false);
    } catch (submitError) {
      message.error(submitError.message || "Không thể lưu dự án.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(projectId) {
    try {
      await deleteProjectItem(projectId);
      message.success("Đã xóa dự án.");
    } catch (deleteError) {
      message.error(deleteError.message || "Không thể xóa dự án.");
    }
  }

  return (
    <div>
      <Space
        align="center"
        style={{ marginBottom: 12, display: "flex", justifyContent: "space-between" }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Projects Dashboard
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Thêm dự án mới
        </Button>
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Tổng dự án" value={projects.length} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Dự án Live" value={liveProjects} />
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

export default ProjectsPage;
