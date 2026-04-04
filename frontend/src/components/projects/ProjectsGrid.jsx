import { Col, Row } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { SkeletonGrid } from '../shared/SharedSkeleton';

export default function ProjectsGrid({ projects, loading, onEdit, onDelete, hasMore, loadMore }) {
  if (loading && projects.length === 0) {
    return <SkeletonGrid count={6} />;
  }

  return (
    <div className="projects-grid-container">
      <Row gutter={[20, 20]}>
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => (
            <Col key={project.id} xs={24} md={12} xl={8}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProjectCard project={project} onEdit={onEdit} onDelete={onDelete} />
              </motion.div>
            </Col>
          ))}
        </AnimatePresence>
      </Row>
      
      {hasMore && (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
           <button 
             className="header-add-btn" 
             style={{ padding: '0 32px' }}
             onClick={loadMore}
             disabled={loading}
           >
             {loading ? 'Đang tải...' : 'Xem thêm dự án'}
           </button>
        </div>
      )}
    </div>
  );
}
