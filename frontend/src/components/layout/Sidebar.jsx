import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SIDEBAR_NAV } from '../../shared/config/menu.config';
import { useProjects } from '../../hooks/useProjects';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { usePersonnel } from '../../hooks/usePersonnel';

export default function Sidebar() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const { projects, fetchItems: fetchProj } = useProjects();
  const { posts, fetchItems: fetchBlog } = useBlogPosts();
  const { personnel, fetchItems: fetchPers } = usePersonnel();

  const counts = {
      projects: projects.length,
      blog: posts.length,
      personnel: personnel.length
  };

  useEffect(() => {
    const refresh = () => {
        fetchProj();
        fetchBlog();
        fetchPers();
    };
    window.addEventListener('cms:refresh-data', refresh);
    return () => window.removeEventListener('cms:refresh-data', refresh);
  }, [fetchProj, fetchBlog, fetchPers]);

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
            const badgeValue = counts[item.key];

            return (
              <li key={item.key} className="sidebar-menu-item">
                <button
                  className={`sidebar-menu-link${isActive ? ' active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="sidebar-menu-icon"><Icon /></span>
                  <span>{item.label}</span>
                  {badgeValue !== undefined && (
                    <span className="sidebar-badge">{badgeValue}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Quick Stats */}
        <div className="sidebar-stats">
          <p className="sidebar-section-label">Quick Stats</p>
          <div className="sidebar-stat-row">
            <span>Projects</span>
            <span>{counts.projects}</span>
          </div>
          <div className="sidebar-stat-row">
            <span>Blog Posts</span>
            <span>{counts.blog}</span>
          </div>
          <div className="sidebar-stat-row">
            <span>Team</span>
            <span>{counts.personnel}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
