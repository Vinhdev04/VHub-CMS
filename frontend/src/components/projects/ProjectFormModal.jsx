import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'Live',        label: 'Live' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Archived',    label: 'Archived' },
];

export default function ProjectFormModal({ open, loading, initialValues, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      name:         initialValues?.name         || '',
      description:  initialValues?.description  || '',
      status:       initialValues?.status       || 'In Progress',
      stars:        initialValues?.stars        || 0,
      thumbnail:    initialValues?.thumbnail    || '',
      liveDemoUrl:  initialValues?.liveDemoUrl  || '',
      githubUrl:    initialValues?.githubUrl    || '',
      technologies: initialValues?.technologies || [],
      category:     initialValues?.category     || '',
    });
  }, [open, initialValues, form]);

  async function handleOk() {
    const values = await form.validateFields();
    onSubmit(values);
  }

  return (
    <Modal
      open={open}
      title={initialValues?.id ? 'Cập nhật dự án' : 'Thêm dự án mới'}
      okText={initialValues?.id ? 'Lưu thay đổi' : 'Tạo mới'}
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      width={560}
    >
      <Form layout="vertical" form={form} style={{ marginTop: 8 }}>
        <Form.Item label="Tên dự án" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}>
          <Input placeholder="VD: JobFinderHub" />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Mô tả ngắn về dự án..." />
        </Form.Item>
        <Form.Item label="Danh mục" name="category">
          <Input placeholder="VD: Full-Stack, SaaS, Portfolio" />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
          <Select options={STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item label="GitHub Stars" name="stars">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Thumbnail URL" name="thumbnail">
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item label="Live Demo URL" name="liveDemoUrl">
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item label="GitHub Repo URL" name="githubUrl">
          <Input placeholder="https://github.com/..." />
        </Form.Item>
        <Form.Item label="Công nghệ sử dụng" name="technologies">
          <Select mode="tags" placeholder="Nhập React, Node.js, ... rồi nhấn Enter" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
