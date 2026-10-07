# Installation Guide - ScentCafe PWA

Complete step-by-step installation guide for different operating systems and deployment scenarios.

## Quick Start (5 minutes)

### Windows

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org)
   - Run the installer and follow the setup wizard
   - Verify installation: Open Command Prompt and type `node --version`

2. **Clone and Install**
   ```cmd
   git clone https://github.com/scentcafe28-creator/ScentCafe.git
   cd ScentCafe
   npm install
   npm start
   ```

3. **Access the App**
   - Open browser to `http://localhost:3000`

### macOS

1. **Install Node.js** (using Homebrew recommended)
   ```bash
   brew install node
   ```
   Or download from [nodejs.org](https://nodejs.org)

2. **Clone and Install**
   ```bash
   git clone https://github.com/scentcafe28-creator/ScentCafe.git
   cd ScentCafe
   npm install
   npm start
   ```

3. **Access the App**
   - Open browser to `http://localhost:3000`

### Linux (Ubuntu/Debian)

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Install**
   ```bash
   git clone https://github.com/scentcafe28-creator/ScentCafe.git
   cd ScentCafe
   npm install
   npm start
   ```

3. **Access the App**
   - Open browser to `http://localhost:3000`

## Detailed Installation

### Prerequisites Check

**Windows Command Prompt:**
```cmd
node --version
npm --version
git --version
```

**macOS/Linux Terminal:**
```bash
node --version
npm --version
git --version
```

All three should return version numbers. If not, install the missing tools.

### Clone Repository

Using HTTPS (recommended for first-time setup):
```bash
git clone https://github.com/scentcafe28-creator/ScentCafe.git
cd ScentCafe
```

Or using SSH (if you have SSH keys configured):
```bash
git clone git@github.com:scentcafe28-creator/ScentCafe.git
cd ScentCafe
```

### Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`:
- ✅ express
- ✅ cors
- ✅ bcryptjs

### Verify Installation

Check if all files are in place:
```bash
# Should show: app.js, index.html, package.json, server.js, etc.
ls
```

Or on Windows:
```cmd
dir
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Output should show:
```
ScentCafe backend is running at http://localhost:3000
```

### Production Mode

```bash
npm start
```

### Custom Port

```bash
# Windows
set PORT=3001 && npm start

# macOS/Linux
PORT=3001 npm start
```

### Stop the Server

Press `Ctrl+C` in the terminal

## Browser Access

1. Open your web browser
2. Go to `http://localhost:3000`
3. You should see the ScentCafe app

## Deployment Options

### Option 1: Heroku (Free Tier)

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create Heroku account: https://www.heroku.com
3. Deploy:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

### Option 2: Vercel (Recommended for frontend)

1. Push to GitHub
2. Connect to Vercel: https://vercel.com
3. Select repository and deploy

### Option 3: AWS

1. EC2 instance with Node.js
2. SSH into server
3. Follow Linux installation steps above
4. Use PM2 to run as daemon:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t scentcafe .
docker run -p 3000:3000 scentcafe
```

## Troubleshooting

### Issue: "npm: command not found"

**Solution**: Node.js/npm not installed or not in PATH
```bash
# Reinstall Node.js from nodejs.org
# Restart terminal/command prompt after installation
```

### Issue: "Port 3000 already in use"

**Solution**: Use a different port
```bash
PORT=3001 npm start
```

Or find and kill the process using port 3000:

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### Issue: "ERR! code EACCES" (Permission denied)

**Windows Command Prompt as Administrator:**
```cmd
npm install --global --production windows-build-tools
npm install
```

**macOS/Linux:**
```bash
sudo npm install -g npm@latest
npm install
```

### Issue: "Cannot find module 'express'"

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS errors in browser console

**Solution**: Ensure requests use correct backend URL
- Frontend should make requests to `http://localhost:3000/api/...`
- Check DevTools Network tab for actual request URLs

### Issue: Service Worker not registering

**Solution**:
1. Make sure you're on `http://localhost` or `https://` (not HTTP on non-localhost)
2. Clear browser cache and service workers:
   - DevTools > Application > Service Workers > Unregister
   - DevTools > Application > Cache Storage > Clear All
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Issue: "ENOENT: no such file or directory, open 'data/store.json'"

**Solution**: This error usually resolves on first API call
- The `data/` directory is created automatically
- Make a test request to ensure it's created:
  ```bash
  curl http://localhost:3000/api/health
  ```

## Verification Checklist

After installation, verify:

- [ ] Node.js version is 14+: `node --version`
- [ ] npm is installed: `npm --version`
- [ ] Dependencies installed: `ls node_modules` (should show folders)
- [ ] Server starts without errors: `npm start`
- [ ] App accessible at `http://localhost:3000`
- [ ] Can view HTML and CSS styling
- [ ] Console shows no JavaScript errors (F12 > Console)
- [ ] Demo login works: email `customer@scentcafe.com`, password `password123`
- [ ] Can create new account
- [ ] Can submit service request (if logged in)

## Next Steps

1. ✅ **Basic Setup Complete**
2. 📚 Read [README.md](README.md) for feature overview
3. 🧪 Test with demo account
4. 🔧 Explore the code
5. 🚀 Deploy to production server
6. 🔐 Set up HTTPS with SSL certificate
7. 📦 Configure environment variables
8. 🗄️ Connect to production database

## Getting Help

- **Documentation**: See [README.md](README.md)
- **GitHub Issues**: https://github.com/scentcafe28-creator/ScentCafe/issues
- **Node.js Help**: https://nodejs.org/docs
- **npm Help**: `npm help` in terminal

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Node.js | v14 | v18+ |
| RAM | 512 MB | 1 GB+ |
| Disk Space | 200 MB | 500 MB |
| npm | v6 | v9+ |

## Performance Tips

- **Development**: Use `npm run dev`
- **Production**: Use `npm start` with PM2
- **Caching**: Service Worker enables offline mode
- **Database**: Consider MongoDB/PostgreSQL for scaling

---

**Last Updated**: October 7, 2026  
**Version**: 1.0.0
