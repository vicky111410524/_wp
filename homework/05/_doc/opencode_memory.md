# OpenCode 記憶檔案 - 網誌系統專案

## 基本資訊
- **專案路徑**：C:\Users\abc45\OneDrive\Desktop\vicky\html2server\_wp\_wp\homework\05
- **技術棧**：Node.js + Express + SQLite (sql.js) + EJS + bcryptjs + express-session
- **功能**：Threads 風格網誌系統

## 專案結構

```
homework/05/
├── _doc/
│   ├── blog-ai-vicky-chat.md      # AI對話記錄
│   ├── blog_code_detail.md        # 程式碼詳細解說
│   └── blog-summary.md            # 專案摘要
├── blog/
│   ├── package.json
│   ├── server.js                 # 主程式
│   ├── database.sqlite           # SQLite 資料庫檔案
│   └── views/
│       ├── for-you.ejs           # 公共貼文區
│       ├── my-posts.ejs           # 個人貼文區
│       ├── profile.ejs             # 用戶個人頁面
│       ├── post.ejs               # 貼文詳情
│       ├── login.ejs              # 登入頁
│       └── register.ejs           # 註冊頁
└── .gitignore                    # 忽略 node_modules, *.sqlite 等
```

## 執行方式

```bash
cd blog
npm install     # 第一次需要安裝依賴
npm start      # 啟動 server
# 訪問 http://localhost:3000
```

## 路由列表

| 路由 | 說明 |
|------|------|
| / | 跳轉到 /for-you |
| /for-you | 公共貼文區 |
| /my-posts | 個人貼文區（需登入） |
| /user/:username | 用戶個人頁面 |
| /register | 註冊頁面 |
| /login | 登入頁面 |
| /logout | 登出 |

## 資料表結構

### users
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password (TEXT, bcrypt hash)
- created_at (DATETIME)

### posts
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER, FK to users)
- title (TEXT)
- content (TEXT)
- created_at (DATETIME)

## 設計特色

- **Threads 風格**：黑色背景 (#000)、紅色 accent (#ff4444)
- **三欄佈局**：左側導航固定、中間內容、右側面板
- **響應式**：平板以下隱藏右側、手機縮窄側邊欄
- **頭像**：取帳號第一個字母，漸層背景 (#ff4444 → #ff8844)

## 重要程式碼位置

### server.js
- 資料庫初始化：initDb() - 第 25-51 行
- 資料持久化：saveDb() - 第 53-57 行
- 用戶查詢：getUser() - 第 59-69 行
- Session 中介軟體：res.locals.user - 第 71-74 行
- 公共貼文區：/for-you - 第 76-84 行
- 個人貼文區：/my-posts - 第 86-96 行
- 用戶頁面：/user/:username - 第 98-120 行
- 註冊：/register POST - 第 172-188 行
- 登入：/login POST - 第 195-212 行

### 注意事項
- 刪除貼文後需呼叫 saveDb() 才會寫入檔案
- session 有效期 1 小時（3600000ms）
- bcrypt cost factor 設為 10
- 資料庫檔案 database.sqlite 在 .gitignore 中

## 已記錄文件

- `_doc/blog-ai-vicky-chat.md` - 完整對話記錄
- `_doc/blog_code_detail.md` - 程式碼原理詳解
- `_doc/blog-summary.md` - 專案摘要