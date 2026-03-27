import { Card, Col, Row, Statistic, Typography } from "antd";
import ProjectsGrid from "../components/ProjectsGrid";
import { useProjects } from "../hooks/useProjects";

const { Title } = Typography;

function ProjectsPage() {
  const { projects, loading } = useProjects();
  const liveProjects = projects.filter((item) => item.status === "Live").length;
  const totalStars = projects.reduce((sum, item) => sum + item.stars, 0);

  return (
    <div>
      <Title level={3}>Projects Dashboard</Title>

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

      <ProjectsGrid projects={projects} loading={loading} />
    </div>
  );
}

export default ProjectsPage;
