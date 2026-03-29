import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'Published', label: 'Published' },
  { value: 'Draft',     label: 'Draft' },
];

export default function BlogFormModal({ open, loading, initialValues, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      title:    initialValues?.title    || '',
      excerpt:  initialValues?.excerpt  || '',
      tags:     initialValues?.tags     || [],
      status:   initialValues?.status   || 'Draft',
      readTime: initialValues?.readTime || '',
      views:    initialValues?.views    || 0,
      likes:    initialValues?.likes    || 0,
    });
  }, [open, initialValues, form]);

  async function handleOk() {
    const values = await form.validateFields();
    onSubmit(values);
  }

  return (
    <Modal
      open={open}
      title={initialValues?.id ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}
      okText={initialValues?.id ? 'Lưu thay đổi' : 'Tạo mới'}
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      width={560}
    >
      <Form layout="vertical" form={form} style={{ marginTop: 8 }}>
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="VD: Building Scalable APIs with Node.js" />
        </Form.Item>
        <Form.Item label="Tóm tắt" name="excerpt">
          <Input.TextArea rows={3} placeholder="Mô tả ngắn về bài viết..." />
        </Form.Item>
        <Form.Item label="Tags" name="tags">
          <Select mode="tags" placeholder="React, Node.js, TypeScript..." />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
          <Select options={STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item label="Thời gian đọc" name="readTime">
          <Input placeholder="VD: 8 min read" />
        </Form.Item>
        <Form.Item label="Lượt xem" name="views">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Lượt thích" name="likes">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
