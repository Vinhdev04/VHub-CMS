import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function AdminLayout() {
  return (
    <div className="app-root">
      <Sidebar />
      <div className="app-content-wrapper">
        <TopHeader />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
