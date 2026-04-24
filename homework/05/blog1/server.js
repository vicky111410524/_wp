const express = require('express');
const initSqlJs = require('sql.js');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let db;

async function initDb() {
  const SQL = await initSqlJs();
  db = new SQL.Database();
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`INSERT INTO posts (title, content) VALUES (?, ?)`, [
    'Welcome to My Blog',
    'This is my first blog post! Start writing your own posts below.'
  ]);
}

app.get('/', async (req, res) => {
  const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  stmt.free();
  res.render('index', { posts });
});

app.get('/post/:id', async (req, res) => {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
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
  res.render('new');
});

app.post('/new', (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
  }
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  db.run('DELETE FROM posts WHERE id = ?', [req.params.id]);
  res.redirect('/');
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
});