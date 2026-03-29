import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const ROLE_COLOR_OPTIONS = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#22c55e', label: 'Green' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' },
];

export default function PersonnelFormModal({
  open,
  loading,
  initialValues,
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      name: initialValues?.name || '',
      role: initialValues?.role || '',
      email: initialValues?.email || '',
      status: initialValues?.status || 'Active',
      projects: initialValues?.projects || 0,
      joinedAt: initialValues?.joinedAt || '',
      roleColor: initialValues?.roleColor || '#3b82f6',
      avatar: initialValues?.avatar || '',
    });
  }, [form, initialValues, open]);

  async function handleOk() {
    const values = await form.validateFields();
    onSubmit(values);
  }

  return (
    <Modal
      open={open}
      title={initialValues?.id ? 'Cap nhat nhan su' : 'Them nhan su moi'}
      okText={initialValues?.id ? 'Luu thay doi' : 'Tao moi'}
      cancelText="Huy"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      width={560}
    >
      <Form layout="vertical" form={form} style={{ marginTop: 8 }}>
        <Form.Item
          label="Ho ten"
          name="name"
          rules={[{ required: true, message: 'Vui long nhap ten nhan su' }]}
        >
          <Input placeholder="VD: Alex Rivera" />
        </Form.Item>
        <Form.Item
          label="Vai tro"
          name="role"
          rules={[{ required: true, message: 'Vui long nhap vai tro' }]}
        >
          <Input placeholder="VD: Backend Engineer" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui long nhap email' },
            { type: 'email', message: 'Email khong hop le' },
          ]}
        >
          <Input placeholder="alex@devcms.io" />
        </Form.Item>
        <Form.Item label="Trang thai" name="status" rules={[{ required: true }]}>
          <Select options={STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item label="So du an" name="projects">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Thoi gian tham gia" name="joinedAt">
          <Input placeholder="VD: Mar 26" />
        </Form.Item>
        <Form.Item label="Mau vai tro" name="roleColor">
          <Select options={ROLE_COLOR_OPTIONS} />
        </Form.Item>
        <Form.Item label="Avatar URL" name="avatar">
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
