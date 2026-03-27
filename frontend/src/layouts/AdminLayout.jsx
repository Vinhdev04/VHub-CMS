import { Layout } from "antd";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";

const { Content } = Layout;

function AdminLayout({ children, activeKey }) {
  return (
    <Layout className="app-layout">
      <Sidebar activeKey={activeKey} />
      <Layout>
        <TopHeader />
        <Content className="app-content">{children}</Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
