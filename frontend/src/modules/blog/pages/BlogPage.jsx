import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Popconfirm, Space, Table, Tag, Typography, message } from "antd";
import { useState } from "react";
import BlogFormModal from "../components/BlogFormModal";
import { useBlogPosts } from "../hooks/useBlogPosts";

const { Title } = Typography;

function BlogPage() {
  const { posts, loading, error, createPost, updatePost, deletePost } = useBlogPosts();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  function openCreateModal() {
    setEditingPost(null);
    setModalOpen(true);
  }

  function openEditModal(post) {
    setEditingPost(post);
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    try {
      setSubmitting(true);
      if (editingPost?.id) {
        await updatePost(editingPost.id, values);
        message.success("Đã cập nhật bài viết.");
      } else {
        await createPost(values);
        message.success("Đã tạo bài viết mới.");
      }
      setModalOpen(false);
    } catch (submitError) {
      message.error(submitError.message || "Không thể lưu bài viết.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(postId) {
    try {
      await deletePost(postId);
      message.success("Đã xóa bài viết.");
    } catch (deleteError) {
      message.error(deleteError.message || "Không thể xóa bài viết.");
    }
  }

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <Space wrap size={[6, 6]}>
          {(tags || []).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
    },
    {
      title: "Likes",
      dataIndex: "likes",
      key: "likes",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Published" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Xóa bài viết này?"
            okText="Xóa"
            cancelText="Hủy"
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
        style={{ marginBottom: 12, display: "flex", justifyContent: "space-between" }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Blog Dashboard
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Thêm bài viết mới
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
    </div>
  );
}

export default BlogPage;
