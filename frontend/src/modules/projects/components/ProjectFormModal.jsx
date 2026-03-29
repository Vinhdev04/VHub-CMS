import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";

const statusOptions = [
  { value: "Live", label: "Live" },
  { value: "In Progress", label: "In Progress" },
  { value: "Archived", label: "Archived" },
];

function ProjectFormModal({ open, loading, initialValues, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      status: initialValues?.status || "In Progress",
      stars: initialValues?.stars || 0,
      thumbnail: initialValues?.thumbnail || "",
      liveDemoUrl: initialValues?.liveDemoUrl || "",
      githubUrl: initialValues?.githubUrl || "",
      technologies: initialValues?.technologies || [],
    });
  }, [open, initialValues, form]);

  async function handleOk() {
    const values = await form.validateFields();
    onSubmit(values);
  }

  return (
    <Modal
      open={open}
      title={initialValues?.id ? "Cập nhật dự án" : "Thêm dự án mới"}
      okText={initialValues?.id ? "Lưu thay đổi" : "Tạo mới"}
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Tên dự án" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
          <Select options={statusOptions} />
        </Form.Item>
        <Form.Item label="Stars" name="stars">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Thumbnail URL" name="thumbnail">
          <Input />
        </Form.Item>
        <Form.Item label="Live Demo URL" name="liveDemoUrl">
          <Input />
        </Form.Item>
        <Form.Item label="GitHub URL" name="githubUrl">
          <Input />
        </Form.Item>
        <Form.Item label="Công nghệ" name="technologies">
          <Select mode="tags" placeholder="Nhập React, Node.js, ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProjectFormModal;
