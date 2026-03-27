import { Col, Row, Skeleton } from "antd";
import ProjectCard from "./ProjectCard";

function ProjectsGrid({ projects, loading, onEdit, onDelete }) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <Row gutter={[16, 16]}>
      {projects.map((project) => (
        <Col key={project.id} xs={24} md={12} xl={8}>
          <ProjectCard project={project} onEdit={onEdit} onDelete={onDelete} />
        </Col>
      ))}
    </Row>
  );
}

export default ProjectsGrid;
