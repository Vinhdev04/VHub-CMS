import { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, Col, Row, Spin, Typography, Card, Space, Divider, Table, Tag, Progress, Statistic } from 'antd';
import {
  AppstoreOutlined,
  EyeOutlined,
  HeartOutlined,
  StarOutlined,
  DeploymentUnitOutlined,
  GithubOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  FileTextOutlined,
  RiseOutlined,
  ArrowUpOutlined
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
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { getBlogPosts } from '../api/blog.api';
import { getPersonnel } from '../api/personnel.api';
import { getProjects } from '../api/projects.api';

const { Title } = Typography;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [projectData, postData] = await Promise.all([
        getProjects(),
        getBlogPosts(),
      ]);
      setProjects(projectData || []);
      setPosts(postData || []);
    } catch (loadError) {
      setError(loadError.message || 'Error loading analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);
  useEffect(() => {
    window.addEventListener('cms:refresh-data', loadAnalytics);
    return () => window.removeEventListener('cms:refresh-data', loadAnalytics);
  }, [loadAnalytics]);

  // --- Realtime Metrics ---
  const projectStats = useMemo(() => {
    const total = projects.length;
    const deployed = projects.filter(p => p.is_deployed || (p.liveDemoUrl && p.liveDemoUrl !== '#')).length;
    const withDesc = projects.filter(p => p.description && p.description.trim() !== '').length;
    const totalCommits = projects.reduce((sum, p) => sum + (p.commits || 0), 0);
    const totalProjectViews = projects.reduce((sum, p) => sum + (p.views_count || 0), 0);

    return { total, deployed, withDesc, totalCommits, totalProjectViews };
  }, [projects]);

  // --- Commits vs Stars Distribution ---
  const commitStarsData = useMemo(() => 
    projects.map(p => ({
        name: p.name.length > 10 ? p.name.substring(0, 8) + '..' : p.name,
        commits: p.commits || 0,
        stars: p.stars || 0,
        views: (p.views_count || 0) / 10 // Scale for chart
    })), [projects]);

  // --- Tech Stack Frequency ---
  const techFrequency = useMemo(() => {
    const map = new Map();
    projects.forEach(p => {
        (p.technologies || []).forEach(t => map.set(t, (map.get(t) || 0) + 1));
    });
    return [...map.entries()]
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value);
  }, [projects]);

  // --- Coverage Statistics ---
  const coverageData = useMemo(() => [
    { name: 'Deployed', value: projectStats.deployed, color: '#10b981' },
    { name: 'Documentation', value: projectStats.withDesc, color: '#3b82f6' },
    { name: 'In Progress', value: projects.length - projectStats.deployed, color: '#f59e0b' }
  ], [projectStats, projects.length]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spin size="large" /></div>;

  return (
    <div className="analytics-container animate-fade-in" style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} className="page-title">Project Intelligence Hub</Title>
        <Typography.Text type="secondary">Deep analysis of repository performance, commitment trends, and deployment coverage.</Typography.Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} lg={6}>
            <Card className="glass-panel" variant="borderless">
                <Statistic title="Total Repositories" value={projectStats.total} prefix={<GithubOutlined />} valueStyle={{ color: '#3b82f6', fontWeight: 800 }} />
                <Progress percent={100} size="small" showInfo={false} strokeColor="#3b82f6" />
            </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
            <Card className="glass-panel" variant="borderless">
                <Statistic title="Total Code Commits" value={projectStats.totalCommits} prefix={<CodeOutlined />} valueStyle={{ color: '#8b5cf6', fontWeight: 800 }} />
                <Progress percent={75} size="small" showInfo={false} strokeColor="#8b5cf6" />
            </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
            <Card className="glass-panel" variant="borderless">
                <Statistic title="Deployment Coverage" value={Math.round((projectStats.deployed / projects.length) * 100 || 0)} suffix="%" prefix={<DeploymentUnitOutlined />} valueStyle={{ color: '#10b981', fontWeight: 800 }} />
                <Progress percent={Math.round((projectStats.deployed / projects.length) * 100 || 0)} size="small" showInfo={false} strokeColor="#10b981" />
            </Card>
        </Col>
        <Col xs={24} sm={24} lg={6}>
            <Card className="glass-panel" variant="borderless">
                <Statistic title="Visibility Scope" value={projectStats.totalProjectViews.toLocaleString()} prefix={<EyeOutlined />} valueStyle={{ color: '#f59e0b', fontWeight: 800 }} />
                <Progress percent={92} size="small" showInfo={false} strokeColor="#f59e0b" />
            </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
            <Card variant="borderless" className="glass-panel" title={<Space><RiseOutlined /> Commit Density & Impact Index</Space>}>
                <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={commitStarsData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="commits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Commits" />
                            <Line yAxisId="right" type="monotone" dataKey="stars" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} name="GitHub Stars" />
                            <Area yAxisId="left" type="monotone" dataKey="views" fill="#10b981" stroke="none" fillOpacity={0.1} name="Popularity Scale" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>
        <Col xs={24} lg={8}>
            <Card variant="borderless" className="glass-panel" title={<Space><DeploymentUnitOutlined /> Coverage Metrics</Space>}>
                <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={coverageData}
                                cx="50%" cy="50%"
                                innerRadius={70} outerRadius={100}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {coverageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="middle" align="right" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
            <Card variant="borderless" className="glass-panel" title={<Space><FileTextOutlined /> Advanced Portfolio Statistics</Space>}>
                <Table 
                    dataSource={projects}
                    rowKey="id"
                    pagination={false}
                    className="premium-table"
                    columns={[
                        { 
                            title: 'Project Repository', 
                            dataIndex: 'name', 
                            key: 'name',
                            render: (text, record) => (
                                <div>
                                    <Typography.Text strong style={{ fontSize: 15 }}>{text}</Typography.Text>
                                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Push: {record.last_push ? new Date(record.last_push).toLocaleDateString() : 'Active'}</div>
                                </div>
                            )
                        },
                        { 
                            title: 'Health', 
                            dataIndex: 'status', 
                            key: 'status',
                            render: s => <Tag color={s === 'Live' ? 'green' : 'orange'} style={{ borderRadius: 6 }}>{s}</Tag>
                        },
                        { 
                            title: 'Commit Count', 
                            dataIndex: 'commits', 
                            key: 'commits',
                            sorter: (a, b) => (a.commits || 0) - (b.commits || 0),
                            render: c => <Typography.Text strong>{c || 0}</Typography.Text>
                        },
                        { 
                            title: 'Reach', 
                            dataIndex: 'views_count', 
                            key: 'views_count',
                            render: v => <Space><EyeOutlined style={{ color: '#3b82f6' }} /> {v?.toLocaleString() || 0}</Space>
                        },
                        { 
                            title: 'Docs Coverage', 
                            key: 'docs',
                            render: (_, record) => (
                                record.description ? 
                                <Tag color="#3b82f6" icon={<CheckCircleOutlined />}>Full</Tag> : 
                                <Tag color="#e2e8f0" style={{ color: '#64748b' }}>Missing</Tag>
                            )
                        },
                        {
                            title: 'Live Link',
                            dataIndex: 'liveDemoUrl',
                            key: 'link',
                            render: (url, record) => (
                                record.is_deployed || (url && url !== '#') ? 
                                <Tag color="green">Deployed</Tag> : 
                                <Tag color="default">Local</Tag>
                            )
                        }
                    ]}
                />
            </Card>
        </Col>
      </Row>
    </div>
  );
}
