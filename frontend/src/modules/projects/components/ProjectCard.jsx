import {
  DeleteOutlined,
  EditOutlined,
  GithubOutlined,
  LinkOutlined,
  StarFilled,
  EyeOutlined
} from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Tag, Typography, Tooltip } from "antd";
import { motion } from "framer-motion";

const { Paragraph, Title } = Typography;

function ProjectCard({ project, onEdit, onDelete, onView }) {
  return (
    <Card
      hoverable
      className="project-card glass-panel"
      style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 16, overflow: 'hidden' }}
      cover={
        <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
            <img 
                src={project.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop'} 
                alt={project.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                className="hover-zoom"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop'; }}
            />
            <div className="card-status-overlay">
                <Tag color={project.status === "Live" ? "#22c55e" : "#ff7a1a"} style={{ borderRadius: 6, border: 'none', fontWeight: 600 }}>
                    {project.status}
                </Tag>
            </div>
        </div>
      }
      styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px' } }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 700, flex: 1, marginRight: 8 }} ellipsis={{ rows: 1 }}>
                {project.name}
            </Title>
            <Space size={4} style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600 }}>
                <StarFilled /> {project.stars || 0}
            </Space>
        </div>

        <Paragraph 
            style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, height: 40 }} 
            ellipsis={{ rows: 2 }}
        >
            {project.description || 'No description provided.'}
        </Paragraph>

        <Space wrap size={[4, 8]} style={{ marginBottom: 20, minHeight: 24 }}>
            {(project.technologies || []).slice(0, 3).map((tech) => (
            <Tag key={`${project.id}-${tech}`} style={{ borderRadius: 4, background: '#f3f4f6', border: 'none', fontSize: 11 }}>{tech}</Tag>
            ))}
            {project.technologies?.length > 3 && <Typography.Text type="secondary" style={{ fontSize: 10 }}>+{project.technologies.length - 3}</Typography.Text>}
        </Space>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <Tooltip title="View Detail">
            <Button icon={<EyeOutlined />} onClick={() => onView?.(project.id)} className="project-detail-btn" />
        </Tooltip>
        
        {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
            <Button type="primary" icon={<LinkOutlined />} href={project.liveDemoUrl} target="_blank" style={{ flex: 1, borderRadius: 8, fontWeight: 600 }}>
                Demo
            </Button>
        )}
        
        <Space size={4}>
            {project.githubUrl && (
                <Tooltip title="GitHub Repo">
                    <Button icon={<GithubOutlined />} href={project.githubUrl} target="_blank" className="project-icon-btn" />
                </Tooltip>
            )}
            <Tooltip title="Edit">
                <Button icon={<EditOutlined />} onClick={() => onEdit?.(project)} className="project-icon-btn" />
            </Tooltip>
            <Popconfirm title="Delete?" onConfirm={() => onDelete?.(project.id)} okText="Xóa" cancelText="Hủy">
                <Button danger icon={<DeleteOutlined />} className="project-icon-btn" />
            </Popconfirm>
        </Space>
      </div>
    </Card>
  );
}

export default ProjectCard;

