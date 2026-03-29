import { Col, Row, Skeleton } from 'antd';
import ProjectCard from './ProjectCard';

export default function ProjectsGrid({ projects, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <Row gutter={[20, 20]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Col key={i} xs={24} md={12} xl={8}>
            <Skeleton active paragraph={{ rows: 5 }} style={{ padding: 20, background: '#fff', borderRadius: 12 }} />
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row gutter={[20, 20]}>
      {projects.map((project) => (
        <Col key={project.id} xs={24} md={12} xl={8}>
          <ProjectCard project={project} onEdit={onEdit} onDelete={onDelete} />
        </Col>
      ))}
    </Row>
  );
}
