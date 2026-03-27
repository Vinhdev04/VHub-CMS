import {
  BellOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Input, Space, Typography } from "antd";

const { Text } = Typography;

function TopHeader() {
  return (
    <div className="top-header">
      <Breadcrumb
        items={[
          { title: "Dashboard" },
          { title: "Dự án" },
        ]}
      />
      <Space size={16}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search projects..."
          className="search-input"
        />
        <Button icon={<BellOutlined />} />
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm dự án mới
        </Button>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>Admin</Text>
        </Space>
      </Space>
    </div>
  );
}

export default TopHeader;
