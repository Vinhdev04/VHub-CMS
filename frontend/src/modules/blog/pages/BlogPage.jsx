import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, BookOutlined, SearchOutlined, FilterOutlined, SortAscendingOutlined, TikTokOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Popconfirm, Space, Table, Tag, Typography, message, Skeleton, Input, Select, Row, Col, Empty, Modal, Progress } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogFormModal from '../components/BlogFormModal';
import BlogDetailModal from '../components/BlogDetailModal';
import TikTokImportModal from '../components/TikTokImportModal';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { getBlogPostById } from '../../../api/blog.api';

const { Title, Text } = Typography;

function BlogPage() {
  const { posts, loading, error, createPost, updatePost, deletePost } = useBlogPosts();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // TikTok Import state
  const [tiktokModal, setTiktokModal] = useState(false);
  
  // Filter & Sort state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (search) {
      result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (filterStatus !== 'All') {
      result = result.filter(p => p.status === filterStatus);
    }
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      return 0;
    });
    return result;
  }, [posts, search, filterStatus, sortBy]);

  useEffect(() => {
    const handler = () => {
      setEditingPost(null);
      setModalOpen(true);
    };

    window.addEventListener('cms:open-add-post', handler);
    return () => window.removeEventListener('cms:open-add-post', handler);
  }, []);

  function openCreateModal() { setEditingPost(null); setModalOpen(true); }
  function openEditModal(post) { setEditingPost(post); setModalOpen(true); }

  async function openDetailModal(postId) {
    try {
      const post = await getBlogPostById(postId);
      setSelectedPost(post);
      setDetailOpen(true);
    } catch (detailError) {
      message.error(detailError.message || 'Khong the tai chi tiet bai viet.');
    }
  }

  async function handleImportTikTok(videoData) {
      await createPost({
          ...videoData,
          tags: [...(videoData.tags || []), 'TikTok'],
          status: 'Published'
      });
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
      title: 'Article Title',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      render: (_, record) => (
        <div style={{ padding: '4px 0' }}>
          <div className="blog-title-link" onClick={() => openDetailModal(record.id)} style={{ fontSize: 15, fontWeight: 700 }}>
            <Space>
                {record.tags?.includes('TikTok') && <TikTokOutlined style={{ color: '#ff0050' }} />}
                {record.title}
            </Space>
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
            Last updated: {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : 'Just now'}
          </div>
        </div>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <Space wrap size={[4, 4]}>
          {(tags || []).slice(0, 3).map((tag) => (
            <Tag key={tag} style={{ borderRadius: 6, margin: 0, fontSize: 11, background: '#f4f6fb', border: 'none' }}>{tag}</Tag>
          ))}
          {tags?.length > 3 && <Tag style={{ border: 'none', background: 'transparent' }}>+{tags.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Engagement',
      key: 'engagement',
      render: (_, record) => (
        <div style={{ fontSize: 13, color: '#4b5563' }}>
          <Text strong>{record.views || 0}</Text> views • <Text strong>{record.likes || 0}</Text> likes
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag className={status === 'Published' ? 'badge-published' : 'badge-draft'} style={{ borderRadius: 8, padding: '2px 10px' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} className="project-icon-btn" />
          <Popconfirm title="Xoa bai viet nay?" onConfirm={() => handleDelete(record.id)} okText="Xoa" cancelText="Huy">
            <Button danger icon={<DeleteOutlined />} className="project-icon-btn" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  async function handleSeed() {
      setSubmitting(true);
      try {
          const samplePosts = [
            { title: 'Mastering React 19', content: 'Explore the latest features of React 19...', status: 'Published', views: 1250, likes: 45, tags: ['React', 'Frontend'] },
            { title: 'Designing for Scalability', content: 'Architecture patterns for modern web apps...', status: 'Published', views: 890, likes: 32, tags: ['Architecture', 'Scaling'] },
            { title: 'Next.js 15 Optimization', content: 'Tips and tricks to boost your performance...', status: 'Published', views: 2100, likes: 88, tags: ['Next.js', 'Vercel'] },
            { title: 'Intro to Tailwind v4', content: 'What is new in the upcoming version...', status: 'Published', views: 600, likes: 20, tags: ['Tailwind', 'CSS'] },
            { title: 'The Rise of Agentic AI', content: 'How agents are changing software development...', status: 'Published', views: 3500, likes: 120, tags: ['AI', 'Future'] }
          ];
          for (const p of samplePosts) {
              await createPost({ ...p, thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&fit=crop' });
          }
          message.success('Nạp blog mẫu thành công!');
      } catch (e) {
          message.error('Lỗi khi nạp blog mẫu.');
      } finally {
          setSubmitting(false);
      }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} className="page-title">Content Management</Title>
          <Text type="secondary">Create and publish technical articles for your blog</Text>
        </div>
        <Space>
            <Button icon={<CloudDownloadOutlined />} onClick={handleSeed} loading={submitting} style={{ borderRadius: 8 }}>
                Load Samples
            </Button>
            <Button icon={<TikTokOutlined />} onClick={() => setTiktokModal(true)} style={{ borderRadius: 8 }}>
                TikTok Sync
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} className="header-add-btn" size="large">
                New Article
            </Button>
            </motion.div>
        </Space>
      </div>

      <TikTokImportModal
          open={tiktokModal}
          onCancel={() => setTiktokModal(false)}
          onImport={handleImportTikTok}
      />



      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16, borderRadius: 12 }} /> : null}

      <Card variant="borderless" className="glass-panel" style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Input 
              prefix={<SearchOutlined />} 
              placeholder="Search by title..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              allowClear
            />
          </Col>
          <Col xs={12} md={6}>
            <Select 
              value={filterStatus} 
              onChange={setFilterStatus} 
              style={{ width: '100%' }}
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Published', label: 'Published' },
                { value: 'Draft', label: 'Draft' }
              ]}
            />
          </Col>
          <Col xs={12} md={8}>
             <Select 
              value={sortBy} 
              onChange={setSortBy} 
              style={{ width: '100%' }}
              options={[
                { value: 'newest', label: 'Latest Updates' },
                { value: 'views', label: 'Most Viewed' },
                { value: 'likes', label: 'Most Liked' }
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Card className="glass-panel" variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : filteredPosts.length === 0 ? (
          <Empty description="No articles found" />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredPosts}
            pagination={{ pageSize: 8 }}
            className="custom-table"
          />
        )}
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
