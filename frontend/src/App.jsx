import AdminLayout from "./layouts/AdminLayout";
import ProjectsPage from "./modules/projects/pages/ProjectsPage";

function App() {
  return (
    <AdminLayout activeKey="projects">
      <ProjectsPage />
    </AdminLayout>
  );
}

export default App;
