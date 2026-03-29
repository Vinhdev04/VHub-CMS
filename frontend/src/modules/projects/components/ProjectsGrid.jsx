import { Col, Row, Skeleton, Card } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";

function ProjectsGrid({ projects, loading, onEdit, onDelete, onView }) {
  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Col key={i} xs={24} md={12} xl={8}>
            <Card
              cover={<Skeleton.Image active style={{ width: '100%', height: 180 }} />}
              actions={[
                <Skeleton.Button active size="small" shape="round" />,
                <Skeleton.Button active size="small" shape="round" />,
              ]}
            >
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <Col key={project.id} xs={24} md={12} xl={8}>
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProjectCard project={project} onEdit={onEdit} onDelete={onDelete} onView={onView} />
            </motion.div>
          </Col>
        ))}
      </AnimatePresence>
    </Row>
  );
}

export default ProjectsGrid;
