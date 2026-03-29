import { useEffect, useState } from 'react';
import {
  Alert, Button, Col, Popconfirm, Row, Space, Table, Tag, Typography, message,
} from 'antd';
import {
  PlusOutlined, BookOutlined, EyeOutlined, HeartOutlined, CheckCircleOutlined,
  EditOutlined, DeleteOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import BlogFormModal from '../components/blog/BlogFormModal';
import { useBlogPosts } from '../hooks/useBlogPosts';

const { Text } = Typography;
const BAR_COLORS = ['#ff7a1a', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function BlogPage() {
  const { posts, loading, error, createPost, updatePost, deletePost } = useBlogPosts();
  const [modalOpen,   setModalOpen]  = useState(false);
  const [submitting,  setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Listen for header "+ New Post" button
  useEffect(() => {
    const handler = () => { setEditingPost(null); setModalOpen(true); };
    window.addEventListener('cms:open-add-post', handler);
    return () => window.removeEventListener('cms:open-add-post', handler);
  }, []);

  const publishedCount = posts.filter((p) => p.status === 'Published').length;
  const totalViews     = posts.reduce((s, p) => s + (p.views || 0), 0);
  const totalLikes     = posts.reduce((s, p) => s + (p.likes || 0), 0);

  const chartData = posts
    .filter((p) => p.status === 'Published' && p.views > 0)
    .map((p) => ({
      name:  p.title.length > 18 ? p.title.slice(0, 18) + '...' : p.title,
      views: p.views,
    }));

  function openCreateModal() { setEditingPost(null); setModalOpen(true); }
  function openEditModal(post) { setEditingPost(post); setModalOpen(true); }

  async function handleSubmit(values) {
    try {
      setSubmitting(true);
      if (editingPost?.id) {
        await updatePost(editingPost.id, values);
        message.success('Đã cập nhật bài viết.');
      } else {
        await createPost(values);
        message.success('Đã tạo bài viết mới.');
      }
      setModalOpen(false);
    } catch (err) {
      message.error(err.message || 'Không thể lưu bài viết.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deletePost(id);
      message.success('Đã xóa bài viết.');
    } catch (err) {
      message.error(err.message || 'Không thể xóa bài viết.');
    }
  }

  const STATS = [
    { icon: <BookOutlined />,        colorClass: 'orange', label: 'Total Posts', value: posts.length,                sub: 'All time' },
    { icon: <CheckCircleOutlined />, colorClass: 'green',  label: 'Published',   value: publishedCount,              sub: 'Live on site' },
    { icon: <EyeOutlined />,         colorClass: 'blue',   label: 'Total Views', value: totalViews.toLocaleString(), sub: 'Cumulative' },
    { icon: <HeartOutlined />,       colorClass: 'purple', label: 'Total Likes', value: totalLikes.toLocaleString(), sub: 'Reactions' },
  ];

  const columns = [
    {
      title: 'TITLE',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <div className="blog-title-link">{title}</div>
          {record.readTime && (
            <div className="blog-read-time"><ClockCircleOutlined /> {record.readTime}</div>
          )}
        </div>
      ),
    },
    {
      title: 'TAGS',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <Space wrap size={[4, 4]}>
          {(tags || []).slice(0, 2).map((t) => <Tag key={t}>{t}</Tag>)}
          {(tags || []).length > 2 && <Tag>+{(tags || []).length - 2}</Tag>}
        </Space>
      ),
    },
    {
      title: 'VIEWS',
      dataIndex: 'views',
      key: 'views',
      render: (v) => v ? <><EyeOutlined style={{ marginRight: 4 }} />{v.toLocaleString()}</> : <Text type="secondary">—</Text>,
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'LIKES',
      dataIndex: 'likes',
      key: 'likes',
      render: (l) => l ? <><HeartOutlined style={{ marginRight: 4 }} />{l.toLocaleString()}</> : <Text type="secondary">—</Text>,
    },
    {
      title: 'DATE',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (d) => d ? <Text style={{ color: '#6b7280', fontSize: 12 }}>{d}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag className={s === 'Published' ? 'badge-published' : 'badge-draft'}>{s}</Tag>,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)} style={{ borderRadius: 6 }} />
          <Popconfirm title="Xóa bài viết này?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {STATS.map((s) => (
          <Col key={s.label} xs={24} sm={12} xl={6}>
            <div className="stat-card">
              <div className={`stat-card-icon ${s.colorClass}`}>{s.icon}</div>
              <div className="stat-card-body">
                <div className="stat-card-label">{s.label}</div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-sub">{s.sub}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Views by Published Post Chart */}
      {chartData.length > 0 && (
        <div className="chart-card" style={{ marginBottom: 20 }}>
          <div className="chart-card-title">Views by Published Post</div>
          <div className="chart-card-sub">Total views comparison across published articles</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 20, left: -10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => [val.toLocaleString(), 'Views']} />
              <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table Header */}
      <div className="filter-bar" style={{ marginBottom: 12 }}>
        <div>
          <Text strong style={{ fontSize: 14 }}>All Posts</Text>
          <Text type="secondary" style={{ fontSize: 13, marginLeft: 8 }}>
            {posts.length} posts — click row to view details
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="header-add-btn" onClick={openCreateModal}>
          + New Post
        </Button>
      </div>

      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e9f2', overflow: 'hidden' }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={posts}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          size="middle"
        />
      </div>

      <BlogFormModal
        open={modalOpen}
        loading={submitting}
        initialValues={editingPost}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
