# 網誌系統程式碼詳細解說

## 專案技術栈
- **後端框架**：Express.js
- **資料庫**：SQLite（透過 sql.js 在記憶體/檔案中操作）
- **模板引擎**：EJS（Embedded JavaScript templates）
- **密碼加密**：bcryptjs
- **Session 管理**：express-session

---

## 一、server.js 程式碼解析

### 1. 模組引入（第 1-6 行）

```javascript
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
```

- `express`：Web 應用框架
- `express-session`：處理使用者登入狀態的 session
- `bcryptjs`：密碼加密（單向雜湊）
- `sql.js`：SQLite 的 JavaScript 實作，可儲存為檔案
- `path` / `fs`：檔案系統操作，用於讀寫資料庫檔案

### 2. Express 設定（第 12-21 行）

```javascript
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ ... }));
```

- `view engine`：設定 EJS 為模板引擎
- `urlencoded`：解析 POST 請求的表單資料
- `static`：靜態檔案（圖片、CSS 等）目錄
- `session`：設定 session 中介軟體，secret 用於簽章驗證

### 3. 資料庫初始化（第 25-57 行）

```javascript
async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    db.run(`CREATE TABLE IF NOT EXISTS users (...)`);
    db.run(`CREATE TABLE IF NOT EXISTS posts (...)`);
  }
}
```

**原理**：
- 檢查資料庫檔案是否存在
- 若存在，從檔案載入（支援持久化）
- 若不存在，建立新資料庫並建立資料表

**sql.js 的兩種模式**：
1. **記憶體模式**：`new SQL.Database()` - 每次重啟資料遺��
2. **檔案模式**：從檔案讀取/寫入 - 支援持久化

### 4. 資料持久化 saveDb()（第 53-57 行）

```javascript
function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
}
```

**原理**：
- `db.export()` 將資料庫內容匯出為 Uint8Array
- 轉換為 Node.js 的 Buffer
- 寫入檔案（database.sqlite）

### 5. getUser() 函數（第 59-69 行）

```javascript
function getUser(req) {
  if (!req.session.userId) return null;
  const stmt = db.prepare('SELECT ... FROM users WHERE id = ?');
  stmt.bind([req.session.userId]);
  let user = null;
  if (stmt.step()) {
    user = stmt.getAsObject();
  }
  stmt.free();
  return user;
}
```

**原理**：
- 從 session 取得目前登入使用者的 ID
- 使用 Prepared Statement（預處理語句）查詢
- `bind()` 綁定參數，防止 SQL Injection
- `step()` 執行並移動指標
- `getAsObject()` 取得該列的物件格式

### 6. 中介軟體 res.locals.user（第 71-74 行）

```javascript
app.use((req, res, next) => {
  res.locals.user = getUser(req);
  next();
});
```

**原理**：
- 每個請求都會先執行此中介軟體
- 將目前登入使用者資訊存入 `res.locals`
- 所有 EJS 模板都能直接取用 `user` 變數

### 7. 路由解析

#### GET /for-you（第 76-84 行）- 公共貼文區

```javascript
app.get('/for-you', async (req, res) => {
  const stmt = db.prepare(`
    SELECT posts.*, users.username
    FROM posts JOIN users ON posts.user_id = users.id
    ORDER BY created_at DESC LIMIT 50
  `);
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  stmt.free();
  res.render('for-you', { posts, user: getUser(req) });
});
```

**SQL JOIN 原理**：
- `JOIN users ON posts.user_id = users.id`
- 將 posts 表和 users 表透過 user_id 關聯
- 取出每則貼文作者的 username

**迴圈讀取原理**（sql.js 特有）：
- `stmt.step()` 每次取一列
- 直到沒有下一列為止（回傳 false）

#### GET /my-posts（第 86-96 行）- 個人貼文區

```javascript
app.get('/my-posts', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  // 只查詢自己發的貼文
  const stmt = db.prepare(`... WHERE posts.user_id = ?`);
  stmt.bind([req.session.userId]);
  ...
});
```

**原理**：
- 先檢查是否已登入（session 中有 userId）
- 未登入則重定向到登入頁
- 使用 `WHERE posts.user_id = ?` 只取自己的貼文

#### GET /user/:username（第 98-120 行）- 用戶個人頁面

```javascript
app.get('/user/:username', async (req, res) => {
  const username = req.params.username;
  // 先查詢用戶是否存在
  const userStmt = db.prepare('SELECT id, username FROM users WHERE username = ?');
  userStmt.bind([username]);
  let profileUser = null;
  if (userStmt.step()) {
    profileUser = userStmt.getAsObject();
  }
  userStmt.free();

  if (!profileUser) {
    return res.status(404).send('User not found');
  }
  // 再查詢該用戶的貼文
  const stmt = db.prepare(`... WHERE posts.user_id = ?`);
  stmt.bind([profileUser.id]);
  ...
});
```

**原理**：
- 動態路由參數 `/:username`
- 先確認用戶存在（404 處理）
- 再查詢該用戶的所有貼文

#### POST /new（第 141-149 行）- 發布貼文

```javascript
app.post('/new', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const { title, content } = req.body;
  if (title && content) {
    db.run('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
      [req.session.userId, title, content]);
    saveDb();  // 存檔！
  }
  res.redirect('/my-posts');
});
```

**原理**：
- 從 POST body 取得 title 和 content
- 插入資料庫時使用 session 中的 userId
- 插入後立即呼叫 `saveDb()` 將變更寫入檔案

#### POST /register（第 172-188 行）- 用戶註冊

```javascript
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 檢查帳號是否已被使用
  const checkStmt = db.prepare('SELECT id FROM users WHERE username = ?');
  checkStmt.bind([username]);
  if (checkStmt.step()) {
    checkStmt.free();
    return res.render('register', { error: 'Username already exists' });
  }

  // 密碼加密（bcrypt）
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword]);
  saveDb();
  res.redirect('/login');
});
```

**bcrypt 加密原理**：
- `bcrypt.hash(password, 10)` - 10 是 cost factor
- 每次加密產生不同的鹽（salt）
- 驗證時用 `bcrypt.compare()` 比對

#### POST /login（第 195-212 行）- 用戶登入

```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const stmt = db.prepare('SELECT id, password FROM users WHERE username = ?');
  stmt.bind([username]);
  let user = null;
  if (stmt.step()) {
    user = stmt.getAsObject();
  }
  stmt.free();

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;  // 登入成功，寫入 session
    return res.redirect('/');
  }
  res.render('login', { error: 'Invalid username or password' });
});
```

**Session 登入原理**：
- 驗證成功後將 userId 存入 `req.session`
- 之後的請求都會帶著這個 session
- Session 預設 1 小時後過期（3600000ms）

---

## 二、EJS 模板解析

### EJS 基本語法

| 語法 | 說明 |
|------|------|
| `<% %>` | 執行 JS 程式碼 |
| `<%= %>` | 輸出 HTML 編碼後的內容 |
| `<%- %>` | 輸出原始 HTML |

### for-you.ejs 結構

```
+------------------------+------------------------+
|        sidebar         |        main            |
|  (左側導航，固定位置)  |  (中間內容，可滾動)    |
|                        |                        |
|  Logo                 |  For You               |
|  For You (active)     |  ─────────────────    |
|  My Posts             |  [貼文 1]             |
|  Login/Logout         |  [貼文 2]             |
|                        |  [貼文 3]             |
+------------------------+                        |
|        right-panel    |                        |
|  (右側面板，隱藏平板)  |                        |
+------------------------+------------------------+
```

### 迴圈渲染貼文

```ejs
<% posts.forEach(post => { %>
<a href="/user/<%= post.username %>" class="post">
  <div class="post-avatar"><%= post.username.charAt(0).toUpperCase() %></div>
  <div class="post-user"><%= post.username %></div>
  <div class="post-content"><%= post.content %></div>
</a>
<% }); %>
```

**原理**：
- 使用 `forEach` 迴圈
- `post.username.charAt(0).toUpperCase()` 取帳號第一個字母大寫當頭像

### 條件判斷（登入狀態）

```ejs
<% if (user) { %>
  <a href="/my-posts">My Posts</a>
  <a href="/logout">Logout</a>
<% } else { %>
  <a href="/login">Login</a>
<% } %>
```

**原理**：
- 由後端中介軟體注入的 `user` 變數
- 有值代表已登入，顯示登出選項
- 無值代表未登入，顯示登入選項

---

## 三、CSS 版面設計原理

### 三欄佈局

```css
.container { display: flex; max-width: 1200px; margin: 0 auto; }
.sidebar { width: 275px; position: fixed; height: 100vh; }
.main { flex: 1; margin-left: 275px; }
.right-panel { flex: 1; max-width: 350px; }
```

**原理**：
- `display: flex` 水平排列三個區塊
- `position: fixed` 側邊欄固定不滾動
- `margin-left: 275px` 讓主內容不被側邊欄覆蓋

### 響應式設計

```css
@media (max-width: 1000px) {
  .right-panel { display: none; }
}
@media (max-width: 700px) {
  .sidebar { width: 80px; }
  .nav-item span { display: none; }
}
```

**原理**：
- 平板以下（<1000px）：隱藏右側面板
- 手機（<700px）：側邊欄縮窄，只顯示圖示

---

## 四、資料流程總結

### 發布貼文流程
```
使用者輸入內容
    ↓
POST /new (form submit)
    ↓
server.js 接收 title, content
    ↓
INSERT INTO posts (user_id, title, content)
    ↓
saveDb() 寫入 database.sqlite
    ↓
redirect /my-posts
    ↓
重新渲染頁面顯示新貼文
```

### 登入流程
```
使用者輸入帳號密碼
    ↓
POST /login
    ↓
bcrypt.compare() 驗證密碼
    ↓
req.session.userId = user.id
    ↓
redirect /
    ↓
res.locals.user 可取得登入資訊
    ↓
各頁面顯示登入狀態
```

---

## 五、資安考量

| 問題 | 解決方式 |
|------|----------|
| SQL Injection | 使用 Prepared Statement (`?` 參數) |
| 密碼明文儲存 | bcrypt 雜湊加密 |
| Session 盜用 | express-session 加密簽章 |
| 未登入訪問 | 路由中檢查 session.userId |

---

## 六、啟動流程

```bash
cd blog
npm install      # 安裝依賴 express, sql.js, ejs, bcryptjs, express-session
npm start       # 執行 node server.js
```

啟動時會：
1. 初始化 sql.js
2. 檢查/建立 database.sqlite
3. 建立 tables（若不存在）
4. 監聽 port 3000