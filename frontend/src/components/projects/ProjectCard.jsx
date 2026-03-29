import {
  DeleteOutlined,
  EditOutlined,
  GithubOutlined,
  LinkOutlined,
  StarFilled,
  CalendarOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Tag, Typography } from 'antd';

const { Paragraph, Title } = Typography;

function getStatusClass(status) {
  if (status === 'Live') return 'badge-live';
  if (status === 'In Progress') return 'badge-progress';
  return 'badge-archived';
}

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="project-card">
      {/* Thumbnail */}
      <div className="project-card-thumb-wrap">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="project-card-thumb"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=60'; }}
        />
        <div className="project-card-overlay" />
        <Tag className={`project-card-status ${getStatusClass(project.status)}`}>
          {project.status}
        </Tag>
        <span className="project-card-stars">
          <StarFilled /> {project.stars}
        </span>
      </div>

      {/* Body */}
      <div className="project-card-body">
        {project.category && (
          <span className="project-card-category">{project.category}</span>
        )}
        <Title level={5} className="project-card-title">{project.name}</Title>
        <Paragraph className="project-card-desc">{project.description}</Paragraph>

        <div className="project-card-tags">
          {(project.technologies || []).map((tech) => (
            <Tag key={tech} className="project-card-tag">{tech}</Tag>
          ))}
        </div>
      </div>

      {/* Meta */}
      {project.publishedAt && (
        <div className="project-card-meta">
          <span><CalendarOutlined /> {project.publishedAt}</span>
          <span><CodeOutlined /> {(project.technologies || []).length} technologies</span>
        </div>
      )}

      {/* Actions */}
      <div className="project-card-footer">
        <Button
          type="primary"
          icon={<LinkOutlined />}
          className="project-live-btn"
          href={project.liveDemoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Live Demo
        </Button>
        <Button
          icon={<GithubOutlined />}
          className="project-icon-btn"
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        />
        <Button
          icon={<EditOutlined />}
          className="project-icon-btn"
          onClick={() => onEdit?.(project)}
        />
        <Popconfirm
          title="Xóa dự án này?"
          description="Thao tác này không thể hoàn tác."
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => onDelete?.(project.id)}
        >
          <Button danger icon={<DeleteOutlined />} className="project-icon-btn" />
        </Popconfirm>
      </div>
    </div>
  );
}
