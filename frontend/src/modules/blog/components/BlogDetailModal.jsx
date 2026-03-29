import { Descriptions, Modal, Space, Tag, Typography, Divider, Avatar, Input, Button, List, Badge, Card, Image, Tooltip, Row, Col } from 'antd';
import { 
  EyeOutlined, 
  LikeOutlined, 
  MessageOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined, 
  ShareAltOutlined,
  PlayCircleOutlined,
  UserOutlined,
  SendOutlined,
  BookOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Paragraph, Text, Title } = Typography;

export default function BlogDetailModal({ open, post, onCancel }) {
  const mockComments = [
    { author: 'Linh Dev', avatar: 'https://i.pravatar.cc/150?u=linh', content: 'Bài viết rất hữu ích, cảm ơn anh Vinh nhiều!', time: '2 giờ trước' },
    { author: 'Quân Nguyễn', avatar: 'https://i.pravatar.cc/150?u=quan', content: 'Em đang gặp vấn đề với Docker pattern này, anh có thể giải thích thêm không?', time: '5 giờ trước' },
    { author: 'Hương Trà', avatar: 'https://i.pravatar.cc/150?u=huong', content: 'Kiến trúc này áp dụng cho dự án lớn cực kỳ hiệu quả luôn.', time: '1 ngày trước' }
  ];

  const galleryImages = [
    post?.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&fit=crop'
  ];

  return (
    <Modal 
      open={open} 
      title={
        <Space>
            <BookOutlined style={{ color: '#ff7a1a' }} />
            <span>Blog Content Explorer</span>
        </Space>
      } 
      footer={null} 
      onCancel={onCancel} 
      width={900}
      className="premium-modal"
      centered
      styles={{ body: { padding: '24px 32px' } }}
    >
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 12 }}>{post?.title}</Title>
            <Space wrap size={[8, 8]}>
                <Tag color={post?.status === 'Published' ? 'green' : 'orange'} style={{ borderRadius: 6, padding: '2px 10px', fontWeight: 600 }}>
                    {post?.status}
                </Tag>
                {(post?.tags || []).map((tag) => (
                    <Tag key={tag} style={{ borderRadius: 6, background: '#f4f6fb', border: 'none' }}>{tag}</Tag>
                ))}
            </Space>
        </div>

        <Row gutter={24}>
            <Col xs={24} lg={16}>
                <Title level={5} className="section-title"><MessageOutlined /> Description & Content</Title>
                <div className="glass-panel" style={{ padding: 20, borderRadius: 12, marginBottom: 24, background: '#fafafa' }}>
                    <Paragraph strong>{post?.excerpt}</Paragraph>
                    <Divider style={{ margin: '16px 0' }} />
                    <Paragraph style={{ whiteSpace: 'pre-wrap', color: '#374151', fontSize: 15, lineHeight: 1.7 }}>
                        {post?.content || "Hôm nay Vinh sẽ chia sẻ cho anh em kiến trúc tối ưu nhất để triển khai một hệ thống scalable. Trong video này mình sẽ đi sâu vào việc xử lý Async/Await patterns và cách kết hợp với Clean Architecture...\n\nAnh em nhớ theo dõi và subcribe kênh TikTok devcraftt để nhận thêm nhiều kiến thức bổ ích nhé!"}
                    </Paragraph>
                </div>

                <Title level={5} className="section-title"><PlayCircleOutlined /> Short Video Demo (5s)</Title>
                <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 32, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        style={{ width: '100%', display: 'block' }}
                    >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-laptop-34440-large.mp4" type="video/mp4" />
                    </video>
                    <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                        <Tag color="rgba(0,0,0,0.6)" style={{ border: 'none', backdropFilter: 'blur(4px)' }}>00:05 Demo</Tag>
                    </div>
                </div>

                <Title level={5} className="section-title"><MessageOutlined /> Community Comments ({mockComments.length})</Title>
                <div className="comment-section">
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                        <Avatar icon={<UserOutlined />} />
                        <div style={{ flex: 1 }}>
                            <Input.TextArea placeholder="Nhập bình luận của bạn..." autoSize={{ minRows: 2 }} style={{ borderRadius: 12 }} />
                            <div style={{ textAlign: 'right', marginTop: 8 }}>
                                <Button type="primary" size="small" icon={<SendOutlined />} style={{ borderRadius: 6 }}>Gửi</Button>
                            </div>
                        </div>
                    </div>
                    <List
                        dataSource={mockComments}
                        renderItem={item => (
                            <List.Item style={{ padding: '16px 0', border: 'none', alignItems: 'flex-start' }}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<Space><Text strong>{item.author}</Text><Text type="secondary" style={{ fontSize: 11 }}>• {item.time}</Text></Space>}
                                    description={<Text style={{ color: '#4b5563' }}>{item.content}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </Col>

            <Col xs={24} lg={8}>
                <Card variant="borderless" className="glass-panel" style={{ borderRadius: 16, marginBottom: 20 }}>
                    <Title level={5}>MetaData</Title>
                    <div className="meta-row"><EyeOutlined /> <Text>Views: </Text> <Text strong>{post?.views?.toLocaleString()}</Text></div>
                    <div className="meta-row"><LikeOutlined /> <Text>Likes: </Text> <Text strong>{post?.likes?.toLocaleString()}</Text></div>
                    <div className="meta-row"><ClockCircleOutlined /> <Text>Read time: </Text> <Text strong>{post?.readTime || '5 min'}</Text></div>
                    <div className="meta-row"><CalendarOutlined /> <Text>Published: </Text> <Text strong>{post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Mar 29, 2026'}</Text></div>
                    <Divider style={{ margin: '12px 0' }} />
                    <Button icon={<ShareAltOutlined />} block style={{ borderRadius: 8 }}>Share Article</Button>
                </Card>

                <Title level={5} className="section-title">Media Gallery</Title>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {galleryImages.map((img, i) => (
                        <div key={i} style={{ borderRadius: 8, overflow: 'hidden', height: i === 0 ? 168 : 80, gridColumn: i === 0 ? 'span 2' : 'span 1' }}>
                            <Image src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            </Col>
        </Row>
      </motion.div>
    </Modal>
  );
}
