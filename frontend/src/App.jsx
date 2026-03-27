import { useMemo, useState } from "react";
import AdminLayout from "./layouts/AdminLayout";
import BlogPage from "./modules/blog/pages/BlogPage";
import ProjectsPage from "./modules/projects/pages/ProjectsPage";

function App() {
  const [activeKey, setActiveKey] = useState("projects");
  const pageContent = useMemo(() => {
    if (activeKey === "blog") {
      return <BlogPage />;
    }
    if (activeKey === "account") {
      return <div>Tính năng Tài khoản sẽ được cập nhật tiếp theo.</div>;
    }
    if (activeKey === "personnel") {
      return <div>Tính năng Nhân sự sẽ được cập nhật tiếp theo.</div>;
    }
    return <ProjectsPage />;
  }, [activeKey]);

  return (
    <AdminLayout activeKey={activeKey} onMenuChange={setActiveKey}>
      {pageContent}
    </AdminLayout>
  );
}

export default App;
