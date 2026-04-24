# 網誌系統開發摘要

## 專案概述
使用 Node.js + Express + SQLite (sql.js) + EJS 建立一個類似 Threads 風格的網誌系統。

## 功能列表

### 用戶系統
- 用戶註冊 (/register)
- 用戶登入 (/login)
- 用戶登出 (/logout)
- 密碼使用 bcryptjs 加密

### 貼文系統
- 公共貼文區 (/for-you) - 所有用戶的貼文
- 個人貼文區 (/my-posts) - 登入後才能查看，只能看到自己的貼文
- 個人用戶頁面 (/user/:username) - 查看該用戶的所有貼文
- 刪除貼文功能

### 資料持久化
- 使用 sql.js 的檔案模式
- 資料庫檔案：blog/database.sqlite
- 每次新增/刪除資料後自動儲存

## 檔案結構

```
homework/
├── _doc/
│   └── vicky_ai_chat_blog.md
├── .gitignore
└── blog/
    ├── package.json
    ├── server.js
    ├── database.sqlite
    └── views/
        ├── for-you.ejs
        ├── my-posts.ejs
        ├── profile.ejs
        ├── post.ejs
        ├── login.ejs
        └── register.ejs
```

## 路由列表

| 路由 | 說明 |
|------|------|
| / | 自動跳轉到 /for-you |
| /for-you | 公共貼文區 |
| /my-posts | 個人貼文區（需登入） |
| /user/:username | 用戶個人頁面 |
| /register | 註冊頁面 |
| /login | 登入頁面 |
| /logout | 登出 |

## 設計風格
- Threads 風格深色主題
- 黑色背景 (#000)
- 紅色 accent (#ff4444)
- 左側導航欄
- 響應式設計

## 安裝與執行

```bash
cd blog
npm install
npm start
```

然後訪問 http://localhost:3000

## 修改記錄

1. 建立基本 Express + SQLite 網誌系統
2. 新增用戶註冊、登入、登出功能
3. 改造為 Threads 風格介面
4. 分離公共區與私人區（不同網址）
5. 加入用戶個人頁面功能
6. 移除 New Post 連結（改用 My Posts 頁面發文）
7. 資料庫改為檔案模式，支援重啟後資料保留
8. 加入 .gitignore 檔案