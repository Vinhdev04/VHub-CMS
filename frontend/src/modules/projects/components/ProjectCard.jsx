import {
  DeleteOutlined,
  EditOutlined,
  GithubOutlined,
  LinkOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Tag, Typography } from "antd";

const { Paragraph, Title } = Typography;

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <Card
      className="project-card"
      cover={<img src={project.thumbnail} alt={project.name} className="project-thumb" />}
    >
      <div className="project-meta">
        <Tag color={project.status === "Live" ? "green" : "orange"}>{project.status}</Tag>
        <span className="project-stars">
          <StarFilled /> {project.stars}
        </span>
      </div>

      <Title level={4}>{project.name}</Title>
      <Paragraph className="project-description">{project.description}</Paragraph>

      <Space wrap size={[6, 6]} className="project-tags">
        {project.technologies.map((tech) => (
          <Tag key={`${project.id}-${tech}`}>{tech}</Tag>
        ))}
      </Space>

      <div className="project-actions">
        <Button type="primary" icon={<LinkOutlined />} href={project.liveDemoUrl}>
          Live Demo
        </Button>
        <Button icon={<GithubOutlined />} href={project.githubUrl} />
        <Button icon={<EditOutlined />} onClick={() => onEdit?.(project)} />
        <Popconfirm
          title="Xóa dự án này?"
          description="Thao tác này không thể hoàn tác."
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => onDelete?.(project.id)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
    </Card>
  );
}

export default ProjectCard;
