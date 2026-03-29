import { Button, Descriptions, Image, Modal, Space, Tag, Typography, Divider, List, Timeline, Avatar, Card, Statistic, Row, Col, Empty } from 'antd';
import { GithubOutlined, LinkOutlined, HistoryOutlined, CodeOutlined, DeploymentUnitOutlined } from '@ant-design/icons';

const { Paragraph, Title, Text } = Typography;

export default function ProjectDetailModal({ open, project, onCancel }) {
  if (!project) return null;

  return (
    <Modal
      open={open}
      title={<Title level={4} style={{ margin: 0 }}><CodeOutlined /> {project.name}</Title>}
      footer={null}
      onCancel={onCancel}
      width={900}
      className="glass-modal"
    >
      <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: 8 }}>
        <Row gutter={24}>
          <Col span={16}>
            {project?.thumbnail && (
              <Image
                src={project.thumbnail}
                alt={project.name}
                width="100%"
                style={{ borderRadius: 16, objectFit: 'cover', height: 320, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            )}
            
            <div style={{ marginTop: 24 }}>
              <Title level={5}>Description</Title>
              <Paragraph style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.6 }}>
                {project.description || 'No detailed description provided for this project.'}
              </Paragraph>
            </div>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                   <Card size="small" variant="borderless" style={{ background: '#f9fafb', borderRadius: 12 }}>
                      <Statistic title="Status" value={project.status} prefix={<DeploymentUnitOutlined />} valueStyle={{ color: '#10b981', fontSize: 18 }} />
                   </Card>
                </Col>
                <Col span={12}>
                   <Card size="small" variant="borderless" style={{ background: '#f9fafb', borderRadius: 12 }}>
                      <Statistic title="Stars" value={project.stars || 0} prefix={<GithubOutlined />} valueStyle={{ fontSize: 18 }} />
                   </Card>
                </Col>
            </Row>

            <Divider orientation="left">Recent Commits</Divider>
            {project.commits && project.commits.length > 0 ? (
              <Timeline
                mode="left"
                items={project.commits.map(c => ({
                  color: '#ff7a1a',
                  children: (
                    <div style={{ marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 13, display: 'block' }}>{c.message}</Text>
                      <Space style={{ fontSize: 11, color: '#6b7280' }}>
                        <span>by <b>{c.author}</b></span>
                        <span>•</span>
                        <span>{new Date(c.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <a href={c.url} target="_blank" rel="noreferrer" style={{ color: '#ff7a1a' }}>{c.sha}</a>
                      </Space>
                    </div>
                  )
                }))}
              />
            ) : (
                <Empty description="No commit information available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>
          
          <Col span={8}>
            <Title level={5}>Information</Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Category">
                <Tag color="cyan">{project.category || 'Portfolio'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(project.createdAt || Date.now()).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <Title level={5}>Stack</Title>
            <Space wrap size={[4, 8]}>
              {(project?.technologies || []).map((tech) => (
                <Tag key={tech} style={{ borderRadius: 6, background: '#eef2ff', color: '#4f46e5', border: 'none', padding: '2px 10px' }}>
                  {tech}
                </Tag>
              ))}
            </Space>

            <Divider />
            <Title level={5}>Links</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {project?.liveDemoUrl && project.liveDemoUrl !== '#' && (
                  <Button type="primary" block icon={<LinkOutlined />} href={project.liveDemoUrl} target="_blank" style={{ borderRadius: 8, height: 40 }}>
                    Live Preview
                  </Button>
                )}
                {project?.githubUrl && (
                  <Button block icon={<GithubOutlined />} href={project.githubUrl} target="_blank" style={{ borderRadius: 8, height: 40 }}>
                    View Repository
                  </Button>
                )}
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}

