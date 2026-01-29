# Designer Portfolio System

一個專為設計師打造的作品集網站系統。只需簡單部署到 Zeabur，即可擁有一個專業、美觀的個人作品集網站。

## 特色功能

### 前台展示
- 極簡優雅的設計風格
- 流暢的動畫與微互動效果
- 完整響應式設計（桌機、平板、手機）
- SEO 優化（SSR 伺服器端渲染）
- 作品集展示與詳情頁
- 個人簡介與技能展示
- 聯絡資訊整合

### 後台管理
- 直覺的管理介面
- 作品 CRUD（新增、編輯、刪除、發布）
- 個人資料管理
- 技能分類管理
- 聯絡資訊管理
- 使用者權限管理
- JWT 安全認證

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | Nuxt 4 (Vue 3 + TypeScript) |
| UI | Tailwind CSS 4 + @nuxt/ui |
| 資料庫 | MongoDB |
| 認證 | JWT + httpOnly Cookie |
| 部署 | Zeabur |

## 快速開始

### 一鍵部署到 Zeabur

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates)

詳細部署教學請參考：[Zeabur 部署指南](./docs/zeabur-deploy.md)

### 本地開發

1. **複製專案**
   ```bash
   git clone https://github.com/your-username/designer-portfolio.git
   cd designer-portfolio
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定環境變數**
   ```bash
   cp .env.example .env
   ```
   編輯 `.env` 檔案，填入你的 MongoDB 連線資訊和 JWT 密鑰。

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

   開啟 http://localhost:3000 查看前台
   開啟 http://localhost:3000/admin 進入後台

### 預設管理員帳號

首次啟動時，系統會自動建立預設管理員帳號：

| 帳號 | 密碼 |
|------|------|
| admin | Admin123456 |

> 請在首次登入後立即修改密碼！

## 環境變數

| 變數名稱 | 必填 | 說明 | 範例 |
|---------|------|------|------|
| `MONGO_URI` | 是 | MongoDB 連接字串 | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | 是 | JWT 加密密鑰（至少 32 字元） | `your-super-secret-key-at-least-32-chars` |
| `COOKIE_SECURE` | 否 | Cookie 安全設定 | `true`（生產環境）/ `false`（本地開發） |

詳細環境變數設定請參考：[環境變數設定指南](./docs/zeabur-deploy.md#環境變數設定)

## 專案結構

```
├── app/
│   ├── components/       # Vue 元件
│   │   └── admin/        # 後台專用元件
│   ├── composables/      # 組合式函數
│   │   └── admin/        # 後台專用 composables
│   ├── pages/            # 頁面路由
│   │   ├── admin/        # 後台頁面
│   │   └── work/         # 作品詳情頁
│   └── types/            # TypeScript 型別定義
├── server/
│   ├── api/              # API 路由
│   │   ├── admin/        # 後台 API（需認證）
│   │   └── public/       # 公開 API
│   ├── middleware/       # 伺服器中介軟體
│   ├── plugins/          # Nitro 插件
│   └── utils/            # 工具函數
├── docs/                 # 文件
└── public/               # 靜態資源
```

## 常用指令

```bash
# 開發
npm run dev              # 啟動開發伺服器

# 建置
npm run build            # 建置生產版本（SSR）
npm run generate         # 生成靜態網站

# 資料庫
npm run seed:admin       # 建立/更新管理員帳號（互動式）
npm run reset-password   # 重置 admin 密碼為預設值
```

## 文件

- [Zeabur 部署指南](./docs/zeabur-deploy.md) - 完整的部署教學
- [CLAUDE.md](./CLAUDE.md) - 開發者技術文件

## 授權

MIT License

---

Made with Vue.js + Nuxt
