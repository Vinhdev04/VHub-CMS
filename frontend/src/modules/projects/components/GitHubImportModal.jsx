import { Modal, Input, List, Button, Checkbox, Space, message, Spin, Typography, Avatar, Tooltip, Tag, Progress, Result } from 'antd';
import { GithubOutlined, SearchOutlined, RocketOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useState, useCallback } from 'react';
import { getGitHubRepos } from '../../../api/projects.api';

const { Text, Title } = Typography;

export default function GitHubImportModal({ open, onCancel, onImport }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, status: 'normal', currentRepo: '' });
  const [lastResult, setLastResult] = useState(null);

  const extractUsername = (input) => {
    if (!input) return '';
    try {
      if (input.includes('github.com')) {
        const parts = input.split('github.com/')[1]?.split('/');
        if (parts && parts[0]) return parts[0];
      }
    } catch (e) {}
    return input.trim();
  };

  const handleSearch = useCallback(async (inputVal) => {
    const targetUser = extractUsername(inputVal || username);
    if (!targetUser) return;
    
    try {
      setLoading(true);
      setLastResult(null);
      const data = await getGitHubRepos(targetUser);
      setRepos(data || []);
      setSelectedIds([]);
      if (targetUser !== username) setUsername(targetUser);
    } catch (err) {
      message.error(err.message || 'Không thể lấy dữ liệu GitHub.');
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleImport = async (targetRepos = []) => {
    const toImport = targetRepos.length > 0 
      ? targetRepos 
      : repos.filter(r => selectedIds.includes(r.githubUrl));
      
    if (toImport.length === 0) return;
    
    setImporting(true);
    setImportProgress({ current: 0, total: toImport.length, status: 'active', currentRepo: '' });
    
    let success = 0;
    let failed = 0;

    for (let i = 0; i < toImport.length; i++) {
        const repo = toImport[i];
        setImportProgress(prev => ({ ...prev, current: i + 1, currentRepo: repo.name }));
        try {
            // We expect onImport to handle the creation and return a promise
            await onImport([repo]);
            success++;
        } catch (err) {
            console.error(`Import failed for ${repo.name}:`, err);
            failed++;
        }
    }

    setImportProgress(prev => ({ ...prev, status: failed > 0 ? 'exception' : 'success' }));
    setLastResult({ success, failed });
    message.info(`Đã hoàn tất đồng bộ: ${success} thành công, ${failed} thất bại.`);
    
    if (failed === 0) {
        setTimeout(() => {
            onCancel();
            setRepos([]);
            setUsername('');
            setLastResult(null);
            setImporting(false);
        }, 1500);
    } else {
        setImporting(false);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === repos.length) setSelectedIds([]);
    else setSelectedIds(repos.map(r => r.githubUrl));
  };

  const percent = importProgress.total > 0 ? Math.round((importProgress.current / importProgress.total) * 100) : 0;

  return (
    <Modal
      title={<span><GithubOutlined /> Quick Sync with GitHub</span>}
      open={open}
      onCancel={() => !importing && onCancel()}
      width={600}
      maskClosable={!importing}
      footer={importing || lastResult?.failed > 0 ? null : [
        <Button key="cancel" onClick={onCancel}>Hủy</Button>,
        <Button 
          key="import-all" 
          onClick={() => handleImport(repos)} 
          disabled={repos.length === 0 || loading}
        >
          Nhập tất cả ({repos.length})
        </Button>,
        <Button 
          key="import-selected" 
          type="primary" 
          disabled={selectedIds.length === 0} 
          onClick={() => handleImport()}
          icon={<RocketOutlined />}
        >
          Nhập đã chọn {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
        </Button>
      ]}
    >
      {importing ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 24 }}>
                  <Title level={4}>Đang đồng bộ dữ liệu...</Title>
                  <Text type="secondary">Vui lòng không đóng cửa sổ này</Text>
                  <div style={{ marginTop: 24, padding: '0 40px' }}>
                    <Progress 
                        percent={percent} 
                        status={importProgress.status} 
                        strokeColor={{ '0%': '#108ee9', '100%': '#ff7a1a' }}
                    />
                    <div style={{ marginTop: 8 }}>
                        <Text strong style={{ color: '#ff7a1a' }}>{importProgress.currentRepo}</Text>
                        <br/>
                        <Text type="secondary" style={{ fontSize: 12 }}>({importProgress.current} / {importProgress.total})</Text>
                    </div>
                  </div>
              </div>
          </div>
      ) : lastResult?.failed > 0 ? (
          <Result
            status="warning"
            title="Đồng bộ hoàn tất với một số lỗi"
            subTitle={`Đã nhập thành công ${lastResult.success} dự án, nhưng ${lastResult.failed} dự án gặp lỗi (thường do trùng lặp hoặc kết nối database).`}
            extra={[
                <Button key="close" onClick={() => { setLastResult(null); onCancel(); }}>Đóng</Button>,
                <Button key="retry" type="primary" onClick={() => { setLastResult(null); setRepos([]); setUsername(''); }}>Thử lại bằng Username khác</Button>
            ]}
          />
      ) : (
          <>
            <div style={{ marginBottom: 20 }}>
                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                Dán link trang cá nhân GitHub hoặc nhập Username để tải danh sách Repo:
                </Text>
                <Input 
                size="large"
                prefix={<GithubOutlined />} 
                placeholder="https://github.com/ten-cua-ban" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                onPressEnter={() => handleSearch()}
                onPaste={(e) => {
                    const pastedText = e.clipboardData.getData('text');
                    handleSearch(pastedText);
                }}
                suffix={
                    <Button 
                    type="primary" 
                    icon={<SearchOutlined />} 
                    onClick={() => handleSearch()} 
                    loading={loading}
                    className="header-add-btn"
                    style={{ marginRight: -7 }}
                    >
                    Analyze
                    </Button>
                }
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 12 }}>Đang đọc dữ liệu GitHub...</div>
                </div>
            ) : (
                <>
                {repos.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <Text strong>{repos.length} Repositories found</Text>
                    <Button size="small" type="link" onClick={toggleAll}>
                        {selectedIds.length === repos.length ? 'Bỏ chọn hết' : 'Chọn hết'}
                    </Button>
                    </div>
                )}
                <List
                    dataSource={repos}
                    className="glass-panel"
                    style={{ maxHeight: 400, overflowY: 'auto', borderRadius: 12, border: '1px solid #f0f0f0' }}
                    renderItem={item => (
                    <List.Item 
                        key={item.githubUrl}
                        style={{ 
                        cursor: 'pointer', 
                        padding: '12px 16px',
                        background: selectedIds.includes(item.githubUrl) ? 'rgba(255, 122, 26, 0.05)' : 'transparent',
                        }}
                        onClick={() => {
                        const url = item.githubUrl;
                        setSelectedIds(prev => prev.includes(url) ? prev.filter(id => id !== url) : [...prev, url]);
                        }}
                        extra={<Checkbox checked={selectedIds.includes(item.githubUrl)} />}
                    >
                        <List.Item.Meta
                        avatar={<Avatar src={`https://github.com/${username.includes('/') ? extractUsername(username) : username}.png`} />}
                        title={<Text strong>{item.name}</Text>}
                        description={
                            <div style={{ fontSize: 12 }}>
                            {item.description ? <div style={{ color: '#6b7280', marginBottom: 4 }}>{item.description}</div> : null}
                            <Space>
                                <Tooltip title="Stars"><Text style={{ fontSize: 11, color: '#ff7a1a' }}>⭐ {item.stars}</Text></Tooltip>
                                <Tag style={{ fontSize: 10, borderRadius: 4, height: 18, lineHeight: '16px', background: '#f4f6fb', border: 'none' }}>{item.technologies[0]}</Tag>
                            </Space>
                            </div>
                        }
                        />
                    </List.Item>
                    )}
                    locale={{ emptyText: 'Hãy dán link GitHub để lấy dữ liệu' }}
                />
                </>
            )}
          </>
      )}
    </Modal>
  );
}
