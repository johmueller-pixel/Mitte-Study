# Deployment Guide: Island Study on Railway

This guide walks you through deploying your Island Study web application to Railway.app (free hosting).

## What You'll Need

- A GitHub account (free at github.com)
- A Railway account (free at railway.app)
- Your Island Study code pushed to GitHub

## Step 1: Push Your Code to GitHub

### If you don't have a GitHub repo yet:

1. Create a new repository on [github.com/new](https://github.com/new)
   - Name: `island-study`
   - Choose Public or Private

2. In your terminal:

```bash
cd /path/to/Island\ Study
git init
git add .
git commit -m "Initial commit: Island Study application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/island-study.git
git push -u origin main
```

### If your code is already on GitHub:

Just make sure all files are committed and pushed:

```bash
git status
git add .
git commit -m "Ready for Railway deployment"
git push
```

## Step 2: Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up or log in
3. Click **New Project**
4. Click **Deploy from GitHub repo**
5. Click **Authorize GitHub** and follow the prompts
6. Select your `island-study` repository
7. Railway will automatically detect it's a Node.js app and start building

## Step 3: Configure Environment Variables

Railway found the app and is building. Now set the environment variables:

1. In Railway Dashboard, your project should be showing
2. Click on the **environment.cfg** icon or **Variables** tab
3. Click **Add Variable** and add these four:

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `3000` | Railway assigns this port |
| `NODE_ENV` | `production` | Tells Node.js this is production |
| `JWT_SECRET` | `your-random-key-here` | Generate a random key (see below) |
| `DB_PATH` | `/tmp/app.db` | SQLite file (ephemeral, reset on deploy) |

### Generating a Secure JWT_SECRET

In your terminal, run this command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET`.

Example secure key:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## Step 4: Deploy!

1. After adding your environment variables, Railway automatically redeploys
2. Watch the build logs in the Railway console
3. Once it says **Success**, your app is live!

## Step 5: Test Your Deployment

1. Railway will give you a URL like: `project-name-production.up.railway.app`
2. Open that URL in your browser
3. You should see the Study Village login page
4. Create a test account
5. Log in and explore!

### Testing the API

- **Health check**: `https://your-url.railway.app/api/health`
- **Register**: `POST /auth/register` with JSON body
- **Login**: `POST /auth/login` with email/password
- **Users**: `GET /users` (needs Authorization header)

## Troubleshooting

### **App keeps crashing?**

Check the Railway build logs:

1. Click your project in Railway
2. Click **Deployments** tab
3. Click the latest deployment
4. Check **Build logs** for errors
5. Check **Deployment logs** for runtime errors

Common issues:

- **Missing JWT_SECRET**: Add it in Variables section
- **DB_PATH is wrong**: Use `/tmp/app.db` for Railway
- **PORT not set**: Should be `3000` or auto-assigned

### **Users aren't persisting between deploys?**

This is normal! Railway's `/tmp` storage is ephemeral. Each deploy creates a fresh database.

**To keep data between deploys**, upgrade to PostgreSQL:

1. In Railway, click **Create New Service**
2. Select **PostgreSQL**
3. Railway will auto-link it to your app
4. Update your app code to use PostgreSQL instead of SQLite (requires code changes)

### **Stuck on building?**

1. Click the **Redeploy** button
2. Or push a new commit to GitHub (git push)
3. Check that `package.json` has all dependencies listed

## Next Steps

- **Connect a domain**: Railway lets you add a custom domain
- **Monitor logs**: Check Railway Dashboard → Logs for errors
- **Update code**: Push to GitHub, Railway auto-deploys
- **Scale up**: Upgrade from Railway's free tier if needed

## Important Notes

⚠️ **Database is ephemeral**: Data resets on each deploy. For persistence, use PostgreSQL.

⚠️ **Change your JWT_SECRET**: The example key is public. Always use a unique random key.

⚠️ **Keep secrets secret**: Never put real JWT_SECRET in GitHub. Use Railway's Variables section.

## Success!

If you see your Study Village login page at your Railway URL, you're done! 🎉

Users can now:
- Register accounts
- Login with their email
- View the community of users
- See their profile

Enjoy your deployed web app!
