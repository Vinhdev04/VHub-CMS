import { Layout, Menu, Typography } from "antd";
import { sidebarMenu } from "../../shared/config/menu.config";

const { Sider } = Layout;
const { Text } = Typography;

function Sidebar({ activeKey, onChange }) {
  const menuItems = sidebarMenu.map((item) => ({
    ...item,
    icon: <item.icon />,
  }));

  return (
    <Sider width={250} className="app-sidebar">
      <div className="brand">
        <div className="brand-dot" />
        <div>
          <strong>DevCMS</strong>
          <Text className="brand-subtitle">Admin Panel</Text>
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        className="sidebar-menu"
        onClick={({ key }) => onChange?.(key)}
      />
    </Sider>
  );
}

export default Sidebar;
