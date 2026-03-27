import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";

const statusOptions = [
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Draft" },
];

function BlogFormModal({ open, loading, initialValues, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      title: initialValues?.title || "",
      excerpt: initialValues?.excerpt || "",
      tags: initialValues?.tags || [],
      views: initialValues?.views || 0,
      likes: initialValues?.likes || 0,
      status: initialValues?.status || "Draft",
      readTime: initialValues?.readTime || "",
    });
  }, [open, initialValues, form]);

  async function handleOk() {
    const values = await form.validateFields();
    onSubmit(values);
  }

  return (
    <Modal
      open={open}
      title={initialValues?.id ? "Cập nhật bài viết" : "Thêm bài viết mới"}
      okText={initialValues?.id ? "Lưu thay đổi" : "Tạo bài viết"}
      cancelText="Hủy"
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả ngắn" name="excerpt">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Tags" name="tags">
          <Select mode="tags" />
        </Form.Item>
        <Form.Item label="Lượt xem" name="views">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Lượt thích" name="likes">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Select options={statusOptions} />
        </Form.Item>
        <Form.Item label="Thời gian đọc" name="readTime">
          <Input placeholder="Ví dụ: 8 phút" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default BlogFormModal;
