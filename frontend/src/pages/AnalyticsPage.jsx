import { useEffect, useMemo, useState } from 'react';
import { Alert, Col, Row, Spin, Typography } from 'antd';
import {
  AppstoreOutlined,
  EyeOutlined,
  HeartOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getBlogPosts } from '../api/blog.api';
import { getPersonnel } from '../api/personnel.api';
import { getProjects } from '../api/projects.api';

const { Title, Text } = Typography;

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [personnel, setPersonnel] = useState([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError('');

        const [projectData, postData, personnelData] = await Promise.all([
          getProjects(),
          getBlogPosts(),
          getPersonnel(),
        ]);

        setProjects(projectData || []);
        setPosts(postData || []);
        setPersonnel(personnelData || []);
      } catch (loadError) {
        setError(loadError.message || 'Khong the tai du lieu analytics.');
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const starsData = useMemo(
    () =>
      projects.map((project) => ({
        name: project.name,
        stars: Number(project.stars || 0),
      })),
    [projects],
  );

  const trendData = useMemo(() => {
    const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' });
    const monthKeys = [];

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - index);
      monthKeys.push(monthFormatter.format(date));
    }

    const projectCounts = new Map(monthKeys.map((key) => [key, 0]));
    const starCounts = new Map(monthKeys.map((key) => [key, 0]));

    projects.forEach((project) => {
      const rawDate = project.createdAt || project.updatedAt || project.publishedAt || null;
      const label = rawDate ? monthFormatter.format(new Date(rawDate)) : monthKeys[monthKeys.length - 1];
      projectCounts.set(label, (projectCounts.get(label) || 0) + 1);
      starCounts.set(label, (starCounts.get(label) || 0) + Number(project.stars || 0));
    });

    let runningProjects = 0;
    let runningStars = 0;

    return monthKeys.map((month) => {
      runningProjects += projectCounts.get(month) || 0;
      runningStars += starCounts.get(month) || 0;
      return { month, projects: runningProjects, stars: runningStars };
    });
  }, [projects]);

  const statusData = useMemo(
    () => [
      { name: 'Live', value: projects.filter((item) => item.status === 'Live').length, color: '#22c55e' },
      { name: 'In Progress', value: projects.filter((item) => item.status === 'In Progress').length, color: '#ff7a1a' },
      { name: 'Archived', value: projects.filter((item) => item.status === 'Archived').length, color: '#9ca3af' },
    ],
    [projects],
  );

  const techData = useMemo(() => {
    const counts = new Map();

    projects.forEach((project) => {
      (project.technologies || []).forEach((tech) => {
        counts.set(tech, (counts.get(tech) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [projects]);

  const statCards = useMemo(() => {
    const liveProjects = projects.filter((item) => item.status === 'Live').length;
    const totalStars = projects.reduce((sum, item) => sum + Number(item.stars || 0), 0);
    const publishedPosts = posts.filter((item) => item.status === 'Published').length;
    const totalViews = posts.reduce((sum, item) => sum + Number(item.views || 0), 0);
    const totalLikes = posts.reduce((sum, item) => sum + Number(item.likes || 0), 0);
    const activeMembers = personnel.filter((item) => item.status === 'Active').length;

    return [
      { icon: <AppstoreOutlined />, colorClass: 'orange', label: 'Total Projects', value: projects.length, sub: `${liveProjects} live` },
      { icon: <StarOutlined />, colorClass: 'yellow', label: 'GitHub Stars', value: totalStars.toLocaleString(), sub: `${projects.length} tracked projects` },
      { icon: <EyeOutlined />, colorClass: 'blue', label: 'Blog Views', value: totalViews.toLocaleString(), sub: `${publishedPosts} published posts` },
      { icon: <HeartOutlined />, colorClass: 'purple', label: 'Total Likes', value: totalLikes.toLocaleString(), sub: `${activeMembers} active members` },
    ];
  }, [personnel, posts, projects]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} /> : null}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((item) => (
          <Col key={item.label} xs={24} sm={12} xl={6}>
            <div className="stat-card">
              <div className={`stat-card-icon ${item.colorClass}`}>{item.icon}</div>
              <div className="stat-card-body">
                <div className="stat-card-label">{item.label}</div>
                <div className="stat-card-value">{item.value}</div>
                <div className="stat-card-sub">{item.sub}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <div style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Projects Analytics</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Performance overview across all projects</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={16}>
          <div className="chart-card">
            <div className="chart-card-title">Stars per Project</div>
            <div className="chart-card-sub">Total GitHub stars by project</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={starsData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="stars" radius={[6, 6, 0, 0]}>
                  {starsData.map((_, index) => (
                    <Cell key={index} fill={['#ff7a1a', '#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][index % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="chart-card" style={{ height: '100%' }}>
            <div className="chart-card-title">Status Distribution</div>
            <div className="chart-card-sub">Live vs. in progress vs. archived</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData.filter((item) => item.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                >
                  {statusData.filter((item) => item.value > 0).map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <div className="chart-card">
            <div className="chart-card-title">Growth Trend</div>
            <div className="chart-card-sub">Projects added and star growth over time</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="projects" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="projects" />
                <Line type="monotone" dataKey="stars" stroke="#ff7a1a" strokeWidth={2} dot={{ r: 4 }} name="stars" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <div className="chart-card">
            <div className="chart-card-title">Tech Stack Usage</div>
            <div className="chart-card-sub">Number of projects using each technology</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={techData} layout="vertical" margin={{ top: 4, right: 4, bottom: 4, left: 10 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#ff7a1a" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}
