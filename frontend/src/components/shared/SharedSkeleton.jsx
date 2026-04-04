import { Row, Col } from 'antd';
import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <div className="project-card" style={{ border: '1px solid #f0f0f0' }}>
    <div className="skeleton-shimmer" style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px 12px 0 0' }} />
    <div className="project-card-body">
      <div className="skeleton-shimmer" style={{ width: '40%', height: 12, marginBottom: 8 }} />
      <div className="skeleton-shimmer" style={{ width: '80%', height: 20, marginBottom: 12 }} />
      <div className="skeleton-shimmer" style={{ width: '100%', height: 14, marginBottom: 4 }} />
      <div className="skeleton-shimmer" style={{ width: '70%', height: 14 }} />
    </div>
    <div className="project-card-footer">
      <div className="skeleton-shimmer" style={{ height: 34, flex: 1, borderRadius: 8 }} />
      <div className="skeleton-shimmer" style={{ width: 34, height: 34, borderRadius: 8 }} />
      <div className="skeleton-shimmer" style={{ width: 34, height: 34, borderRadius: 8 }} />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <Row gutter={[20, 20]}>
    {Array.from({ length: count }).map((_, i) => (
      <Col key={i} xs={24} md={12} xl={8}>
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: i * 0.1 }}
        >
          <CardSkeleton />
        </motion.div>
      </Col>
    ))}
  </Row>
);
