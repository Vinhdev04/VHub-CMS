import { Descriptions, Modal, Space, Tag, Typography } from 'antd';

const { Paragraph, Text, Title } = Typography;

export default function BlogDetailModal({ open, post, onCancel }) {
  return (
    <Modal open={open} title={post?.title || 'Blog Detail'} footer={null} onCancel={onCancel} width={760}>
      <Space wrap size={[6, 6]} style={{ marginBottom: 12 }}>
        <Tag color={post?.status === 'Published' ? 'green' : 'orange'}>{post?.status}</Tag>
        {(post?.tags || []).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Space>

      <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Views">{post?.views || 0}</Descriptions.Item>
        <Descriptions.Item label="Likes">{post?.likes || 0}</Descriptions.Item>
        <Descriptions.Item label="Read time">{post?.readTime || '-'}</Descriptions.Item>
        <Descriptions.Item label="Published at">{post?.publishedAt || '-'}</Descriptions.Item>
      </Descriptions>

      <Title level={5}>Excerpt</Title>
      <Paragraph>{post?.excerpt || 'No excerpt'}</Paragraph>

      <Title level={5}>Content</Title>
      <Paragraph>
        <Text>{post?.content || post?.excerpt || 'No content'}</Text>
      </Paragraph>
    </Modal>
  );
}
