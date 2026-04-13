# Island Study Backend

A complete Express backend with authentication and SQLite persistence.

## Features

- JSON API with Express
- CORS support
- User registration and login
- JWT authentication
- SQLite database storage
- Protected `/users` routes
- Static frontend (HTML/CSS/JS)

## Local Development

1. Install dependencies:

```sh
npm install
```

2. Copy environment variables:

```sh
cp .env.example .env
```

3. Initialize the database:

```sh
npm run migrate
```

4. Start the server:

```sh
npm start
```

5. Open `http://localhost:4000`

Your frontend is served from `public/index.html` and connects to the backend API.

## 🚀 Deploying to Railway

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Deploy Island Study"
git remote add origin https://github.com/YOUR_USERNAME/island-study.git
git push -u origin main
```

### Step 2: Connect to Railway

1. Go to [Railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway will automatically detect it's a Node.js app

### Step 3: Set Environment Variables

In Railway Dashboard → Variables tab, add:

```
PORT=3000
NODE_ENV=production
JWT_SECRET=abcd1234efgh5678ijkl9012mnop3456qrst
DB_PATH=/tmp/app.db
```

🔑 **Generate a secure JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Deploy!

Railway automatically deploys when you push. Your app will be live at a generated URL.

### Testing Your Deployment

- Visit your Railway URL
- Register: use the signup form
- Login: test authentication
- View members: see database working
- Check logs in Railway dashboard for errors

## Endpoints

- `GET /` - health check
- `POST /auth/register` - register a new user
- `POST /auth/login` - login and receive JWT
- `GET /auth/me` - get current user profile
- `GET /users` - list users (requires Authorization header)
- `GET /users/:id` - get user by id (requires Authorization)
- `PATCH /users/:id` - update user (requires Authorization)
- `DELETE /users/:id` - delete user (requires Authorization)

## Authorization

Send the JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```
