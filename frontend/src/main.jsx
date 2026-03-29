import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary:  '#ff7a1a',
          borderRadius:  10,
          fontFamily:    "Inter, 'Segoe UI', system-ui, sans-serif",
          colorBgContainer: '#ffffff',
          colorBorder:   '#e5e9f2',
        },
        components: {
          Menu:   { itemBg: 'transparent', itemColor: 'rgba(255,255,255,0.55)', itemSelectedColor: '#ff9d50', itemSelectedBg: 'rgba(255,122,26,0.15)' },
          Table:  { headerBg: '#f4f6fb' },
          Button: { fontWeight: 600 },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
