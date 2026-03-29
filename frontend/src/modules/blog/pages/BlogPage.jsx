import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import BlogFormModal from '../components/BlogFormModal';
import BlogDetailModal from '../components/BlogDetailModal';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { getBlogPostById } from '../../../api/blog.api';

const { Title } = Typography;

function BlogPage() {
  const { posts, loading, error, createPost, updatePost, deletePost } = useBlogPosts();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const handler = () => {
      setEditingPost(null);
      setModalOpen(true);
    };

    window.addEventListener('cms:open-add-post', handler);
    return () => window.removeEventListener('cms:open-add-post', handler);
  }, []);

  function openCreateModal() {
    setEditingPost(null);
    setModalOpen(true);
  }

  function openEditModal(post) {
    setEditingPost(post);
    setModalOpen(true);
  }

  async function openDetailModal(postId) {
    try {
      const post = await getBlogPostById(postId);
      setSelectedPost(post);
      setDetailOpen(true);
    } catch (detailError) {
      message.error(detailError.message || 'Khong the tai chi tiet bai viet.');
    }
  }

  async function handleSubmit(values) {
    try {
      setSubmitting(true);
      if (editingPost?.id) {
        await updatePost(editingPost.id, values);
        message.success('Da cap nhat bai viet.');
      } else {
        await createPost({
          ...values,
          publishedAt: values.status === 'Published' ? new Date().toISOString() : '',
        });
        message.success('Da tao bai viet moi.');
      }
      setModalOpen(false);
    } catch (submitError) {
      message.error(submitError.message || 'Khong the luu bai viet.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(postId) {
    try {
      await deletePost(postId);
      message.success('Da xoa bai viet.');
    } catch (deleteError) {
      message.error(deleteError.message || 'Khong the xoa bai viet.');
    }
  }

  const columns = [
    {
      title: 'Tieu de',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Button type="link" style={{ paddingInline: 0 }} onClick={() => openDetailModal(record.id)}>
          {record.title}
        </Button>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <Space wrap size={[6, 6]}>
          {(tags || []).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: 'Likes',
      dataIndex: 'likes',
      key: 'likes',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Published' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetailModal(record.id)} />
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Xoa bai viet nay?"
            okText="Xoa"
            cancelText="Huy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space
        align="center"
        style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Blog Dashboard
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Them bai viet moi
        </Button>
      </Space>

      {error ? (
        <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
      ) : null}

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={posts}
          pagination={{ pageSize: 6 }}
        />
      </Card>

      <BlogFormModal
        open={modalOpen}
        loading={submitting}
        initialValues={editingPost}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <BlogDetailModal
        open={detailOpen}
        post={selectedPost}
        onCancel={() => setDetailOpen(false)}
      />
    </div>
  );
}

export default BlogPage;
