# E-Invoice Web Converter - Deployment Guide

## 🚀 Live Demo
Once deployed, your app will be available at:
**https://YOUR_GITHUB_USERNAME.github.io/einvoice-web-converter**

## 📦 What's Included
- ✅ CSV to JSON conversion with E-Invoice V4 format
- ✅ Drag & drop file upload
- ✅ All validation fixes (date format, state codes, ValDtls calculation, 2 decimal precision)
- ✅ Modern responsive UI
- ✅ Works 100% in browser (no backend needed)

## 🔧 Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `einvoice-web-converter`
3. Keep it **Public** (required for free GitHub Pages)
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### Step 2: Push Code to GitHub
```bash
cd /Users/h0p04fo/CascadeProjects/einvoice-web-converter

# Initialize git (already done by create-react-app)
git add .
git commit -m "Initial commit - E-Invoice web converter"

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/einvoice-web-converter.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to GitHub Pages
```bash
npm run deploy
```

This will:
1. Build the production version
2. Create a `gh-pages` branch
3. Push the build to GitHub Pages
4. Your site will be live in 1-2 minutes!

### Step 4: Enable GitHub Pages (if needed)
1. Go to your repo on GitHub
2. Settings → Pages
3. Source should be set to `gh-pages` branch
4. Save

## 🧪 Test Locally First
```bash
npm start
# Opens at http://localhost:3000/einvoice-web-converter
```

## 📝 Update Homepage URL
Before deploying, update `package.json` line 5:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/einvoice-web-converter"
```
Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

## 🔄 Future Updates
After making changes:
```bash
git add .
git commit -m "Your update message"
git push origin main
npm run deploy
```

## ⚠️ Important Notes
- Repository must be **Public** for free GitHub Pages
- First deployment takes 2-3 minutes
- Updates take 30-60 seconds to reflect
- All processing happens in the browser (your CSV data never leaves your computer)

## 🆚 Web vs Desktop Version
**Web Version (this):**
- ✅ No installation needed
- ✅ Works on any device with a browser
- ✅ Easy to share (just send the URL)
- ✅ Auto-updates when you deploy
- ⚠️ Requires internet to access the page (but works offline after first load)

**Desktop Version (Electron):**
- ✅ Fully offline
- ✅ Native app experience
- ⚠️ Requires installation
- ⚠️ Need to distribute updates manually

## 🎯 Recommended Approach
Use the **web version** for easy distribution and updates. The desktop version is only needed if users absolutely require offline functionality.
