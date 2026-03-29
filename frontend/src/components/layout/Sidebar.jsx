import { useNavigate, useLocation } from 'react-router-dom';
import { QUICK_STATS_CONFIG, SIDEBAR_NAV } from '../../shared/config/menu.config';

export default function Sidebar() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  // map pathname → active key
  const activeKey = SIDEBAR_NAV.find((item) => item.path === pathname)?.key || 'projects';

  return (
    <aside className="app-sidebar">
      <div className="sidebar-inner">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">⚡</div>
          <div className="brand-text">
            <strong>DevCMS</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <p className="sidebar-section-label">Navigation</p>
        <ul className="sidebar-menu-custom">
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;
            return (
              <li key={item.key} className="sidebar-menu-item">
                <button
                  className={`sidebar-menu-link${isActive ? ' active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="sidebar-menu-icon"><Icon /></span>
                  <span>{item.label}</span>
                  {item.badge != null && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Quick Stats */}
        <div className="sidebar-stats">
          <p className="sidebar-section-label">Quick Stats</p>
          {QUICK_STATS_CONFIG.map((s) => (
            <div key={s.label} className="sidebar-stat-row">
              <span>{s.label}</span>
              <span>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
