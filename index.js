require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const { authenticate } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 4000;
const publicPath = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

app.use('/auth', authRouter);
app.use('/users', authenticate, usersRouter);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Island Study backend is running.' });
});

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/auth') && !req.path.startsWith('/users')) {
    return res.sendFile(path.join(publicPath, 'index.html'));
  }
  next();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
