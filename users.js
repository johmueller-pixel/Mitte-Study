const express = require('express');
const db = require('../db');
const router = express.Router();

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT id, name, email FROM users ORDER BY id DESC').all();
  res.json(rows.map(sanitizeUser));
});

router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(sanitizeUser(user));
});

router.patch('/:id', (req, res) => {
  const { name, email } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const updated = {
    name: name || user.name,
    email: email || user.email
  };
  db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(updated.name, updated.email, req.params.id);
  res.json({ id: user.id, ...updated });
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

module.exports = router;
