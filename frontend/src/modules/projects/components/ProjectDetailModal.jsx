import { Button, Descriptions, Image, Modal, Space, Tag, Typography } from 'antd';
import { GithubOutlined, LinkOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function ProjectDetailModal({ open, project, onCancel }) {
  return (
    <Modal open={open} title={project?.name || 'Project Detail'} footer={null} onCancel={onCancel} width={760}>
      {project?.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.name}
          width="100%"
          style={{ borderRadius: 12, objectFit: 'cover', maxHeight: 260 }}
        />
      ) : null}

      <Descriptions bordered column={1} size="small" style={{ marginTop: 16 }}>
        <Descriptions.Item label="Status">
          <Tag color={project?.status === 'Live' ? 'green' : 'orange'}>{project?.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Category">{project?.category || 'General'}</Descriptions.Item>
        <Descriptions.Item label="Stars">{project?.stars || 0}</Descriptions.Item>
        <Descriptions.Item label="Technologies">
          <Space wrap>
            {(project?.technologies || []).map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          <Paragraph style={{ marginBottom: 0 }}>{project?.description || 'No description'}</Paragraph>
        </Descriptions.Item>
      </Descriptions>

      <Space style={{ marginTop: 16 }}>
        {project?.liveDemoUrl ? (
          <Button type="primary" icon={<LinkOutlined />} href={project.liveDemoUrl} target="_blank">
            Live Demo
          </Button>
        ) : null}
        {project?.githubUrl ? (
          <Button icon={<GithubOutlined />} href={project.githubUrl} target="_blank">
            GitHub
          </Button>
        ) : null}
      </Space>
    </Modal>
  );
}
