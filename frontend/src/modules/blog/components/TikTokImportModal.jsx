import { Modal, Input, List, Button, Checkbox, Space, message, Spin, Typography, Avatar, Tooltip, Tag, Progress, Result, Divider, InputNumber } from 'antd';
import { TikTokOutlined, SearchOutlined, RocketOutlined, CheckCircleOutlined, CloseCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useState, useCallback } from 'react';

const { Text, Title } = Typography;

export default function TikTokImportModal({ open, onCancel, onImport }) {
  const [url, setUrl] = useState('https://www.tiktok.com/@devcraftt');
  const [fetchCount, setFetchCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, status: 'normal', currentVideo: '' });
  const [lastResult, setLastResult] = useState(null);

  const extractUsername = (input) => {
    if (!input) return '';
    try {
      if (input.includes('tiktok.com/@')) {
        const matches = input.match(/@([a-zA-Z0-9._]+)/);
        if (matches && matches[1]) return matches[1];
      }
    } catch (e) {}
    return input.trim().replace('@', '');
  };

  const handleSearch = useCallback(async (inputVal) => {
    const username = extractUsername(inputVal || url);
    if (!username) return message.warning('Vui lòng nhập Username hoặc URL TikTok');
    
    try {
      setLoading(true);
      setLastResult(null);
      
      // Giả lập lấy dữ liệu TikTok vì API thật rất khó
      await new Promise(r => setTimeout(r, 1500));
      
      const topics = ['Architecture', 'Clean Code', 'Node.js', 'React 19', 'Next.js 15', 'Docker', 'Microservices', 'Frontend', 'Backend', 'DevOps', 'UI/UX', 'Cloud'];
      const images = [
        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400&fit=crop',
        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=400&fit=crop',
        'https://images.unsplash.com/photo-1558494949-ef010ca68ae2?q=80&w=400&fit=crop',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&fit=crop',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&fit=crop'
      ];

      const generatedVideos = Array.from({ length: fetchCount }).map((_, i) => {
        const topic = topics[i % topics.length];
        return {
          id: `v${i + 1}`,
          title: `[${username}] ${topic} Mastery #${i + 1}`,
          excerpt: `Khám phá chuyên sâu về ${topic} để tối ưu hóa hiệu suất hệ thống của bạn. Video này Vinh sẽ đi sâu vào các patterns quan trọng nhất.`,
          tags: [topic, 'TikTok', 'DevLive'],
          views: Math.floor(Math.random() * 10000) + 500,
          likes: Math.floor(Math.random() * 1000) + 50,
          thumbnail: images[i % images.length]
        };
      });
      
      setVideos(generatedVideos);
      setSelectedIds([]);
      if (username !== url && !url.includes('tiktok.com')) setUrl(username);
    } catch (err) {
      message.error('Không thể lấy dữ liệu TikTok.');
    } finally {
      setLoading(false);
    }
  }, [url, fetchCount]);

  const handleImport = async (targetVideos = []) => {
    const toImport = targetVideos.length > 0 
      ? targetVideos 
      : videos.filter(v => selectedIds.includes(v.id));
      
    if (toImport.length === 0) return;
    
    setImporting(true);
    setImportProgress({ current: 0, total: toImport.length, status: 'active', currentVideo: '' });
    
    let success = 0;
    let failed = 0;

    for (let i = 0; i < toImport.length; i++) {
        const video = toImport[i];
        setImportProgress(prev => ({ ...prev, current: i + 1, currentVideo: video.title }));
        try {
            await onImport({
                title: video.title,
                content: video.excerpt,
                tags: video.tags,
                views: video.views,
                likes: video.likes,
                thumbnail: video.thumbnail,
                status: 'Published',
                publishedAt: new Date().toISOString()
            });
            success++;
        } catch (err) {
            console.error(`Import failed:`, err);
            failed++;
        }
    }

    setImportProgress(prev => ({ ...prev, status: failed > 0 ? 'exception' : 'success' }));
    setLastResult({ success, failed });
    message.info(`Đã đồng bộ TikTok: ${success} thành công, ${failed} thất bại.`);
    
    if (failed === 0) {
        setTimeout(() => {
            onCancel();
            setVideos([]);
            setLastResult(null);
            setImporting(false);
        }, 1500);
    } else {
        setImporting(false);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === videos.length) setSelectedIds([]);
    else setSelectedIds(videos.map(v => v.id));
  };

  const percent = importProgress.total > 0 ? Math.round((importProgress.current / importProgress.total) * 100) : 0;

  return (
    <Modal
      title={<span><TikTokOutlined /> Sync Videos from TikTok</span>}
      open={open}
      onCancel={() => !importing && onCancel()}
      width={650}
      maskClosable={!importing}
      footer={importing || lastResult?.failed > 0 ? null : [
        <Button key="cancel" onClick={onCancel}>Hủy</Button>,
        <Button 
          key="import-all" 
          onClick={() => handleImport(videos)} 
          disabled={videos.length === 0 || loading}
        >
          Nhập tất cả ({videos.length})
        </Button>,
        <Button 
          key="import-selected" 
          type="primary" 
          disabled={selectedIds.length === 0} 
          onClick={() => handleImport()}
          icon={<RocketOutlined />}
        >
          Nhập bài đăng đã chọn {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
        </Button>
      ]}
    >
      {importing ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 24 }}>
                  <Title level={4}>Đang lấy video TikTok...</Title>
                  <Text type="secondary">Vui lòng chờ trong giây lát</Text>
                  <div style={{ marginTop: 24, padding: '0 40px' }}>
                    <Progress percent={percent} status={importProgress.status} strokeColor="#ff0050" />
                    <div style={{ marginTop: 8 }}>
                        <Text strong style={{ color: '#ff0050' }}>{importProgress.currentVideo}</Text>
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
            subTitle={`Đã nhập thành công ${lastResult.success} video, nhưng ${lastResult.failed} video gặp lỗi.`}
            extra={[
                <Button key="close" onClick={() => { setLastResult(null); onCancel(); }}>Đóng</Button>,
                <Button key="retry" type="primary" onClick={() => { setLastResult(null); setVideos([]); }}>Thử lại</Button>
            ]}
          />
      ) : (
          <>
            <div style={{ marginBottom: 20 }}>
                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                Dán link kênh TikTok và thiết lập số lượng video muốn lấy:
                </Text>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input 
                        size="large"
                        prefix={<TikTokOutlined />} 
                        placeholder="https://www.tiktok.com/@username" 
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onPressEnter={() => handleSearch()}
                        style={{ flex: 1 }}
                    />
                    <InputNumber 
                        size="large"
                        min={1} 
                        max={50} 
                        value={fetchCount} 
                        onChange={setFetchCount}
                        placeholder="Qty"
                        style={{ width: 80 }}
                    />
                    <Button 
                        size="large"
                        type="primary" 
                        icon={<SearchOutlined />} 
                        onClick={() => handleSearch()} 
                        loading={loading}
                        style={{ background: '#000', borderColor: '#000' }}
                    >
                        Fetch
                    </Button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 12 }}>Đang phân tích kênh TikTok...</div>
                </div>
            ) : (
                <>
                {videos.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <Text strong>{videos.length} Videos discovered</Text>
                    <Button size="small" type="link" onClick={toggleAll}>
                        {selectedIds.length === videos.length ? 'Bỏ chọn hết' : 'Chọn hết'}
                    </Button>
                    </div>
                )}
                <List
                    dataSource={videos}
                    style={{ maxHeight: 400, overflowY: 'auto', borderRadius: 12, border: '1px solid #f0f0f0', padding: '0 8px' }}
                    renderItem={item => (
                    <List.Item 
                        key={item.id}
                        style={{ 
                          cursor: 'pointer', 
                          padding: '12px',
                          marginBottom: 8,
                          borderRadius: 8,
                          background: selectedIds.includes(item.id) ? 'rgba(255, 0, 80, 0.05)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          setSelectedIds(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                        }}
                        extra={<Checkbox checked={selectedIds.includes(item.id)} />}
                    >
                        <List.Item.Meta
                        avatar={<Avatar shape="square" size={64} src={item.thumbnail} />}
                        title={<Text strong style={{ fontSize: 14 }}>{item.title}</Text>}
                        description={
                            <div style={{ fontSize: 12 }}>
                            <div style={{ color: '#6b7280', marginBottom: 4 }}>{item.excerpt}</div>
                            <Space split={<Divider type="vertical" />}>
                                <Text style={{ fontSize: 11, color: '#ff0050' }}><VideoCameraOutlined /> {item.views.toLocaleString()} views</Text>
                                <Space size={4}>
                                    {item.tags.map(t => <Tag key={t} style={{ fontSize: 10, borderRadius: 4, margin: 0, border: 'none', background: '#f3f4f6' }}>{t}</Tag>)}
                                </Space>
                            </Space>
                            </div>
                        }
                        />
                    </List.Item>
                    )}
                    locale={{ emptyText: 'Dán link hoặc nhập username để tải video' }}
                />
                </>
            )}
          </>
      )}
    </Modal>
  );
}
