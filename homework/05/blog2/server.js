const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const initSqlJs = require('sql.js');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'blog-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

let db;

async function initDb() {
  const SQL = await initSqlJs();
  db = new SQL.Database();
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

function getUser(req) {
  if (!req.session.userId) return null;
  const stmt = db.prepare('SELECT id, username FROM users WHERE id = ?');
  stmt.bind([req.session.userId]);
  let user = null;
  if (stmt.step()) {
    user = stmt.getAsObject();
  }
  stmt.free();
  return user;
}

app.use((req, res, next) => {
  res.locals.user = getUser(req);
  next();
});

app.get('/', async (req, res) => {
  const stmt = db.prepare('SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC');
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  stmt.free();
  res.render('index', { posts });
});

app.get('/post/:id', async (req, res) => {
  const stmt = db.prepare('SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?');
  stmt.bind([req.params.id]);
  let post = null;
  if (stmt.step()) {
    post = stmt.getAsObject();
  }
  stmt.free();
  if (post) {
    res.render('post', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.get('/new', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('new');
});

app.post('/new', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const { title, content } = req.body;
  if (title && content) {
    db.run('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)', [req.session.userId, title, content]);
  }
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const stmt = db.prepare('SELECT user_id FROM posts WHERE id = ?');
  stmt.bind([req.params.id]);
  let post = null;
  if (stmt.step()) {
    post = stmt.getAsObject();
  }
  stmt.free();
  if (post && post.user_id === req.session.userId) {
    db.run('DELETE FROM posts WHERE id = ?', [req.params.id]);
  }
  res.redirect('/');
});

app.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  if (req.session.userId) return res.redirect('/');
  const { username, password } = req.body;
  
  const checkStmt = db.prepare('SELECT id FROM users WHERE username = ?');
  checkStmt.bind([username]);
  if (checkStmt.step()) {
    checkStmt.free();
    return res.render('register', { error: 'Username already exists' });
  }
  checkStmt.free();
  
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  if (req.session.userId) return res.redirect('/');
  const { username, password } = req.body;
  
  const stmt = db.prepare('SELECT id, password FROM users WHERE username = ?');
  stmt.bind([username]);
  let user = null;
  if (stmt.step()) {
    user = stmt.getAsObject();
  }
  stmt.free();
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    return res.redirect('/');
  }
  res.render('login', { error: 'Invalid username or password' });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
});