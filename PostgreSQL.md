PostgreSQL 連接資訊：
用戶名：root
密碼：03e8N6W1tEqKC4cVbx7d5pF2afPr9gIm
資料庫名：zeabur
連接字串：postgresql://root:03e8N6W1tEqKC4cVbx7d5pF2afPr9gIm@${CONTAINER_HOSTNAME}:${DATABASE_PORT}/zeabur


1. 在你的 Nuxt 4 專案中配置 .env.local：
# PostgreSQL 連接資訊  
```bash
DATABASE_URL="postgresql://root:03e8N6W1tEqKC4cVbx7d5pF2afPr9gIm@postgresql-xxxx.zeabur.app:5432/zeabur"  
```

2. 使用 Node.js 測試（適合 Nuxt 開發）
在你的本地 Nuxt 4 專案中，建立一個測試檔案 test-db.js：

// 使用 pg 套件  
```js
const { Client } = require('pg');  
const client = new Client({  
  user: 'root',  
  password: '03e8N6W1tEqKC4cVbx7d5pF2afPr9gIm',  
  host: 'postgresql-xxxx.zeabur.app',  
  port: 5432,  
  database: 'zeabur',  
});  
client.connect()  
  .then(() => {  
    console.log('✅ 連接成功！');  
    return client.query('SELECT NOW()');  
  })  
  .then(result => {  
    console.log('📅 資料庫時間：', result.rows[0]);  
    client.end();  
  })  
  .catch(err => {  
    console.error('❌ 連接失敗：', err.message);  
    process.exit(1);  
  });  

```
然後執行：
```bash
node test-db.js  
```

3. 確保 .env.local 在 .gitignore 中，不要提交到 GitHub