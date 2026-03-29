import {
  AppstoreOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { ROUTES } from '../utils/constants';

export const SIDEBAR_NAV = [
  { key: 'projects',  label: 'Dự án',     icon: AppstoreOutlined, path: ROUTES.PROJECTS,  badge: 6 },
  { key: 'blog',      label: 'Blog',       icon: BookOutlined,     path: ROUTES.BLOG,      badge: 6 },
  { key: 'personnel', label: 'Nhân sự',   icon: TeamOutlined,     path: ROUTES.PERSONNEL, badge: 4 },
  { key: 'analytics', label: 'Analytics', icon: BarChartOutlined, path: ROUTES.ANALYTICS },
  { key: 'account',   label: 'Tài khoản', icon: UserOutlined,     path: ROUTES.ACCOUNT },
];

export const QUICK_STATS = [
  { label: 'Projects',   value: 6 },
  { label: 'Blog Posts', value: 6 },
  { label: 'Team',       value: 4 },
];
