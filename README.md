# 🚀 VHub-CMS: Ready-to-use Developer Content Management System

![VHub-CMS Dashboard](/frontend/src/assets/images/devCMS.png)

VHub-CMS là một hệ thống quản trị nội dung hiện đại dành riêng cho các Developer, được tối ưu hóa để quản lý Portfolio dự án, bài đăng Blog (với tính năng đồng bộ TikTok) và thông tin nhân sự.

---

## 🔗 Project Links
- **GitHub Repository**: [https://github.com/Vinhdev04/VHub-CMS](https://github.com/Vinhdev04/VHub-CMS)
- **Live Preview**: [https://vhub-cms.netlify.app/](https://vhub-cms.netlify.app/)

---

## 🌟 Chức năng nổi bật

### 1. Project Project Intelligence Hub
Hệ thống báo cáo dự án chuyên sâu giúp theo dõi hiệu suất phát triển:
- **Repo Analytics**: Thống kê Commits, lượt Views, Stars và độ phủ Documentation.
- **Impact Index**: Đánh giá sức ảnh hưởng của repo qua biểu đồ đa chiều.
- **Real-time Engine**: Dữ liệu đồng bộ tức thì với Firebase Firestore.

### 2. TikTok Content Sync 2.0
Đồng bộ bài viết blog từ TikTok một cách chuyên nghiệp:
- **Dynamic Pull**: Chọn số lượng video muốn lấy về (Qty: 1 - 50).
- **Auto-Formatting**: Nội dung video tiktok được chuyển đổi sang định dạng Blog Hub cao cấp.
- **Premium Reader**: Giao diện xem bài viết tích hợp Video demo, Image Gallery và Comment section.

### 3. Personnel Control & Security
Quản lý nhân sự và phân quyền người dùng linh hoạt:
- **Admin Access**: Kiểm tra quyền quản trị qua email tĩnh hoặc database động.
- **Viewer Role (Demo Mode)**: Chế độ chỉ xem cho khách tham quan, bảo vệ dữ liệu gốc khỏi thay đổi trái phép.

---

## 🔐 Tài khoản Trải nghiệm (Demo)

Bạn có thể đăng nhập vào hệ thống để trải nghiệm giao diện quản trị với quyền **Chỉ xem (Read-only)**:

- **Email**: `demo@vhub.io`
- **Mật khẩu**: `demo123456`

*(Lưu ý: Chế độ demo không cho phép Thay đổi/Xoá dữ liệu để bảo vệ tính nhất quán của môi trường dùng thử).*

---

## 🏗️ Công nghệ sử dụng

- **Frontend**: React 19, Vite, Ant Design 5.x, Framer Motion, Recharts.
- **Backend**: Node.js, Express, Firebase Firestore (NoSQL).
- **Authentication**: Firebase Auth (Google, GitHub, Email).
- **Infrastructure**: Supabase (Storage), GitHub Actions, Netlify.

---

## 🛠️ Hướng dẫn cài đặt

1. **Clone Repo**:
   ```bash
   git clone https://github.com/Vinhdev04/VHub-CMS.git
   ```

2. **Cài đặt Dependency**:
   ```bash
   # Backend
   cd backend && npm install
   # Frontend
   cd ../frontend && npm install
   ```

3. **Cấu hình Môi trường**: Tạo file `.env` theo `example.env` và điền cấu hình Firebase của bạn.

4. **Kích hoạt Dữ liệu mẫu**:
   ```bash
   cd backend && node scripts/seed.js
   ```

---

© 2026 Vinh Dev - Powered by VHub Intelligence System.
