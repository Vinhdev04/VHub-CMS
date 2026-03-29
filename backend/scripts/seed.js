import { db, hasFirebaseConfig } from '../lib/firebase.js';

const seed = async () => {
    if (!hasFirebaseConfig || !db) {
        console.error('❌ Firebase config is missing or DB is not initialized. Cannot seed.');
        process.exit(1);
    }

    console.log('🚀 Starting Seed process with firebase-admin...');

    try {
        // 1. Setup Admin Accounts
        const personnelRef = db.collection('personnel');
        
        // Clean old admins
        const snapMembers = await personnelRef.where('role', '==', 'Administrator').get();
        const batch = db.batch();
        snapMembers.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();

        const admins = [
            { name: 'Vinh Dev', email: 'vaniizit@gmail.com', role: 'Administrator', status: 'Active', projects: 12, avatar: 'https://i.pravatar.cc/150?u=vinh' },
            { name: 'Demo User', email: 'demo@vhub.io', role: 'Viewer', status: 'Active', projects: 10, avatar: 'https://i.pravatar.cc/150?u=demo' },
            { name: 'System Admin', email: 'admin@vhub.io', role: 'Administrator', status: 'Active', projects: 5, avatar: 'https://i.pravatar.cc/150?u=admin' }
        ];

        for (const admin of admins) {
            await personnelRef.add({ ...admin, created_at: new Date().toISOString() });
            console.log(`✅ Added Member: ${admin.name} (${admin.role})`);
        }

        // 2. Setup Sample Personnel (Team)
        const team = [
            { name: 'Vaniizit', email: 'vaniizit@gmail.com', role: 'Senior Developer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=vani' },
            { name: 'Alex Johnson', email: 'alex@vhub.io', role: 'Developer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=alex' },
            { name: 'Sarah Miller', email: 'sarah@vhub.io', role: 'Designer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=sarah' }
        ];
        for (const member of team) {
            await personnelRef.add({ ...member, created_at: new Date().toISOString() });
            console.log(`✅ Added Team Member: ${member.name}`);
        }

        // 3. Setup Sample Projects with Analytics Data
        const projectRef = db.collection('projects');
        const snapProj = await projectRef.get();
        const projBatch = db.batch();
        snapProj.docs.forEach(doc => projBatch.delete(doc.ref));
        await projBatch.commit();

        const sampleProjects = [
            { 
                name: 'VHub CMS Infrastructure (V_Portfolio)', 
                description: '### Position: Fullstack Developer (CMS Architect)\n\n**Công nghệ**: ReactJS, Vite, Ant Design, Framer Motion, Firebase, Supabase.\n\n**Mô tả**:\n- Thiết kế và phát triển hệ thống quản trị nội dung (**CMS**) chuyên sâu cho Developer, tích hợp AI và khả năng đồng bộ đa nền tảng.\n- Dự án tập trung vào trải nghiệm Dashboard mượt mà, phân quyền quản trị thông minh và bảo mật dữ liệu tuyệt đối.\n\n**Chức năng chính**:\n- **Cloud Persistence**: Kết hợp sức mạnh của **Firebase** (Realtime DB) và **Supabase** (Auth/Storage).\n- **Content Hub**: Đồng bộ dữ liệu TikTok, GitHub Repo chỉ với một click.\n- **Advanced Analytics**: Hệ thống báo cáo thông minh với độ trễ cực thấp.\n- **Responsive Design**: Tối ưu hiển thị đa thiết bị.', 
                status: 'Live', 
                stars: 1250, 
                commits: 1142, 
                views_count: 5600, 
                is_deployed: true, 
                technologies: ['ReactJS', 'Firebase', 'Supabase', 'Ant Design'], 
                liveDemoUrl: 'https://effulgent-cendol-0bf93e.netlify.app/' 
            },
            { name: 'AI Image Generator', description: 'DALL-E 3 integration.', status: 'Live', stars: 890, commits: 124, views_count: 2300, is_deployed: true, technologies: ['Next.js', 'OpenAI'], liveDemoUrl: 'https://ai-gen.vhub.io' },
            { name: 'E-commerce Engine', description: 'Headless commerce.', status: 'In Progress', stars: 2100, commits: 567, views_count: 1200, is_deployed: false, technologies: ['Node.js', 'Redis'], liveDemoUrl: '#' },
            { name: 'Blockchain Explorer', description: 'Real-time Ethereum dashboard.', status: 'Archived', stars: 230, commits: 45, views_count: 340, is_deployed: false, technologies: ['Web3.js', 'Solidity'], liveDemoUrl: '#' }
        ];

        for (const proj of sampleProjects) {
            await projectRef.add({ 
                ...proj, 
                last_push: new Date().toISOString(),
                created_at: new Date().toISOString() 
            });
            console.log(`✅ Added Project: ${proj.name}`);
        }

        console.log('🎉 Seed completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    }
};

seed();
