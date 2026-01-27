# Zeabur 部署指南

## 📦 部署步驟

### 1. 環境變數設定

在 Zeabur 的服務設定中，添加以下環境變數：

```bash
MONGODB_URI=mongodb://mongo:ODQjuNrA0Zk14vzEFc95UJ73fK2pLm86@sjc1.clusters.zeabur.com:20373
```

或者分開設定：

```bash
MONGODB_USERNAME=mongo
MONGODB_PASSWORD=ODQjuNrA0Zk14vzEFc95UJ73fK2pLm86
MONGODB_HOST=sjc1.clusters.zeabur.com
MONGODB_PORT=20373
MONGODB_DATABASE=zeabur
```

> **重要**：推薦使用 `MONGODB_URI` 完整連接字串的方式。

### 2. 提交變更

```bash
# 查看變更
git status

# 添加所有變更
git add .

# 提交
git commit -m "fix: 修正 Zeabur 部署配置

- 添加 zbpack.json 指定正確的構建和啟動命令
- 在 package.json 中添加 start 腳本
- 修正 .gitignore，允許提交 .env.example
- 更新 .env.example 為安全的範本格式"

# 推送到遠端
git push
```

### 3. 重新部署

推送程式碼後，Zeabur 會自動觸發重新部署。

## 🔧 配置說明

### zbpack.json

這個檔案告訴 Zeabur 如何構建和啟動 Nuxt 應用：

```json
{
  "build_command": "npm run build",
  "start_command": "node .output/server/index.mjs",
  "install_command": "npm install"
}
```

### package.json

添加了 `start` 腳本作為備用啟動命令：

```json
{
  "scripts": {
    "start": "node .output/server/index.mjs"
  }
}
```

## ✅ 驗證部署

部署成功後，訪問您的網站並檢查：

1. **首頁**：應顯示個人資訊和作品列表
2. **作品詳情頁**：點擊任一作品，應顯示完整詳情
3. **MongoDB 連線測試**：訪問 `https://your-domain.zeabur.app/api/db-test`

應該看到類似以下的回應：

```json
{
  "success": true,
  "message": "MongoDB 連線成功！",
  "database": "zeabur",
  "collections": ["profile", "projects", "skills", "contact"],
  "dataSize": "0.01 MB",
  "timestamp": "2026-01-27T..."
}
```

## 🚨 常見問題

### 問題 1: MODULE_NOT_FOUND

**錯誤**: `Cannot find module '/src/.output/server/index.mjs'`

**原因**: Zeabur 使用了錯誤的啟動路徑

**解決**: 確保 `zbpack.json` 檔案已正確提交並推送到遠端

### 問題 2: MongoDB 連線失敗

**錯誤**: `MongoDB 連線失敗`

**原因**: 環境變數未正確設定

**解決**:
1. 檢查 Zeabur 服務設定中的環境變數
2. 確認 `MONGODB_URI` 連接字串正確
3. 如果使用 Zeabur 內部的 MongoDB，確保服務已啟動並連接

### 問題 3: 構建失敗

**錯誤**: Build failed

**原因**: 依賴安裝或構建過程出錯

**解決**:
1. 檢查 Zeabur 構建日誌
2. 確認 `package.json` 中的依賴版本正確
3. 嘗試在本地執行 `npm run build` 確認沒有錯誤

## 📊 部署後檢查清單

- [ ] 環境變數已在 Zeabur 設定
- [ ] 程式碼已推送到遠端
- [ ] Zeabur 構建成功（檢查日誌）
- [ ] 網站可以正常訪問
- [ ] API 端點正常回應
- [ ] MongoDB 連線測試成功
- [ ] 首頁資料正確顯示
- [ ] 作品詳情頁正常運作

## 🔗 相關文檔

- [MONGODB-SETUP.md](./MONGODB-SETUP.md) - MongoDB 連線設定
- [DATABASE-STRUCTURE.md](./DATABASE-STRUCTURE.md) - 資料庫結構說明
- [DATABASE-DESIGN-SUMMARY.md](./DATABASE-DESIGN-SUMMARY.md) - 資料庫設計總結
