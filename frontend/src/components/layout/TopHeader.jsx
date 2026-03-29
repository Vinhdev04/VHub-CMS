import { useNavigate, useLocation } from 'react-router-dom';
import { BellOutlined, PlusOutlined, SearchOutlined, UserOutlined, LogoutOutlined, SyncOutlined, GithubOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Dropdown, Input, Space, Typography, Tooltip } from 'antd';
import { useState } from 'react';
import { useAuth } from '../../shared/contexts/auth-context';
import { SIDEBAR_NAV } from '../../shared/config/menu.config';
import { ROUTES } from '../../shared/constants/routes';

const { Text } = Typography;

// Page-specific primary action buttons
const PAGE_ACTIONS = {
  [ROUTES.PROJECTS]:  { label: 'Add New', event: 'cms:open-add-project' },
  [ROUTES.BLOG]:      { label: 'New Post', event: 'cms:open-add-post' },
  [ROUTES.PERSONNEL]: { label: 'Add Member', event: 'cms:open-add-member' },
};

// Page-specific search placeholders
const SEARCH_PLACEHOLDER = {
  [ROUTES.PROJECTS]:  'Search projects...',
  [ROUTES.BLOG]:      'Search blog...',
  [ROUTES.PERSONNEL]: 'Search personnel...',
  [ROUTES.ANALYTICS]: 'Search analytics...',
  [ROUTES.ACCOUNT]:   'Search account...',
};

export default function TopHeader() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const activeNav = SIDEBAR_NAV.find((n) => n.path === pathname);
  const pageLabel = activeNav?.label || 'Dashboard';
  const pageAction = PAGE_ACTIONS[pathname];
  const searchPlaceholder = SEARCH_PLACEHOLDER[pathname] || 'Search...';

  const userMenu = {
    items: [
      { key: 'account', label: 'Tài khoản',  icon: <UserOutlined /> },
      { type: 'divider' },
      { key: 'logout',  label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') { logout(); navigate(ROUTES.LOGIN); }
      if (key === 'account') navigate(ROUTES.ACCOUNT);
    },
  };

  function handleRefresh() {
    setRefreshing(true);
    window.dispatchEvent(new CustomEvent('cms:refresh-data'));
    setTimeout(() => setRefreshing(false), 800);
  }

  function handleActionClick() {
    if (pageAction) {
      window.dispatchEvent(new CustomEvent(pageAction.event));
    }
  }

  return (
    <header className="top-header">
      {/* Breadcrumb */}
      <Breadcrumb
        className="header-breadcrumb"
        items={[{ title: 'Dashboard' }, { title: pageLabel }]}
      />

      {/* Right side */}
      <Space size={12} className="header-right">
        <Input
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          placeholder={searchPlaceholder}
          className="header-search glass-panel"
          style={{ width: 220 }}
          allowClear
        />

        <Tooltip title="Làm mới dữ liệu">
          <Button 
            icon={<SyncOutlined spin={refreshing} />} 
            onClick={handleRefresh}
            className="header-bell-btn"
          />
        </Tooltip>

        <div style={{ position: 'relative' }}>
          <Button icon={<BellOutlined />} className="header-bell-btn" />
          <span className="bell-dot" />
        </div>

        {pathname === ROUTES.PROJECTS && (
          <Tooltip title="Import từ GitHub">
            <Button 
              icon={<GithubOutlined />} 
              onClick={() => window.dispatchEvent(new CustomEvent('cms:github-import'))}
              className="header-bell-btn"
            />
          </Tooltip>
        )}

        {pageAction && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="header-add-btn"
            onClick={handleActionClick}
          >
            {pageAction.label}
          </Button>
        )}


        <Dropdown menu={userMenu} placement="bottomRight" arrow>
          <div className="header-user">
            <Avatar icon={<UserOutlined />} style={{ background: '#ff7a1a', flexShrink: 0 }} size={34} />
            <div>
              <div className="header-user-name">{user?.name || 'Alex Carter'}</div>
              <div className="header-user-role">{user?.role || 'Administrator'}</div>
            </div>
          </div>
        </Dropdown>
      </Space>
    </header>
  );
}
