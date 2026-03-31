# 🌿 Branch Strategy & Deployment Guide

## 📋 Repository Structure

This repository uses a **multi-branch strategy** to maintain different versions of the E-Invoice Converter while preventing source code from being overwritten during deployments.

---

## 🌳 Branch Overview

### **`main`** - Protected Source Code
- **Purpose**: Primary development branch
- **Contains**: Latest stable source code
- **Protected**: Never gets overwritten by deployments
- **Deployment**: Does NOT deploy directly

### **`basic`** - Free Version
- **Purpose**: Simple CSV to JSON converter
- **Features**: 
  - ✅ CSV to JSON conversion
  - ✅ Drag & drop upload
  - ✅ No license protection
  - ✅ Free and open access
- **Use Case**: Demos, testing, free tier
- **Deployment**: `npm run deploy` from this branch

### **`pwa-licensed`** - Commercial Version
- **Purpose**: Full PWA with license protection
- **Features**:
  - ✅ All basic features
  - ✅ Device-locked licensing
  - ✅ Offline PWA support
  - ✅ Encrypted license storage
  - ✅ License key system
- **Use Case**: Paid customers, commercial distribution
- **Deployment**: `npm run deploy` from this branch

### **`gh-pages`** - Deployment Branch
- **Purpose**: Hosts the live application
- **Auto-generated**: Created by `gh-pages` package
- **Contains**: Built production files only
- **DO NOT EDIT**: This branch is managed automatically

---

## 🚀 Deployment Workflow

### **Deploy Basic Version**

```bash
# Switch to basic branch
git checkout basic

# Ensure you have latest changes
git pull origin basic

# Build and deploy
npm run deploy
```

**Result**: Free version live at https://HrishabhPurohit.github.io/einvoice-web-converter

---

### **Deploy Licensed Version**

```bash
# Switch to pwa-licensed branch
git checkout pwa-licensed

# Ensure you have latest changes
git pull origin pwa-licensed

# Build and deploy
npm run deploy
```

**Result**: Licensed version live at https://HrishabhPurohit.github.io/einvoice-web-converter

---

## 🔄 Development Workflow

### **Making Changes**

1. **Always start from `main` branch**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create feature branch** (optional)
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Edit files
   - Test locally with `npm start`

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Merge to main**
   ```bash
   git checkout main
   git merge feature/your-feature-name
   git push origin main
   ```

6. **Update target branches**
   
   **For basic version:**
   ```bash
   git checkout basic
   git merge main
   git push origin basic
   ```
   
   **For licensed version:**
   ```bash
   git checkout pwa-licensed
   git merge main
   # Add PWA-specific files if needed
   git push origin pwa-licensed
   ```

---

## ⚠️ Important Rules

### **DO:**
- ✅ Always commit source code to `main` first
- ✅ Merge `main` into `basic` or `pwa-licensed` for updates
- ✅ Test locally before deploying
- ✅ Use `npm run deploy` to deploy (not `git push`)
- ✅ Keep `package.json` deploy script as: `"deploy": "gh-pages -d build"`

### **DON'T:**
- ❌ Never push source code directly to `gh-pages`
- ❌ Never use `"deploy": "gh-pages -d build -b main"` (overwrites source!)
- ❌ Never edit files directly on `gh-pages` branch
- ❌ Never delete `main` branch
- ❌ Never force push to `main` without backup

---

## 🔧 Fixing Deployment Issues

### **If Source Code Gets Overwritten**

1. **Check git history**
   ```bash
   git log --oneline
   ```

2. **Restore from previous commit**
   ```bash
   # Find the last good commit before overwrite
   git checkout <commit-hash> -- package.json src/ public/
   ```

3. **Commit restored files**
   ```bash
   git add .
   git commit -m "Restore source code from backup"
   git push origin main
   ```

---

## 📊 Branch Comparison

| Feature | `main` | `basic` | `pwa-licensed` | `gh-pages` |
|---------|--------|---------|----------------|------------|
| Source Code | ✅ | ✅ | ✅ | ❌ |
| License System | ❌ | ❌ | ✅ | Varies |
| PWA Support | ❌ | ❌ | ✅ | Varies |
| Deployable | ❌ | ✅ | ✅ | Auto |
| Protected | ✅ | ✅ | ✅ | Auto |

---

## 🎯 Quick Reference

### **Check Current Branch**
```bash
git branch
```

### **List All Branches**
```bash
git branch -a
```

### **Switch Branch**
```bash
git checkout <branch-name>
```

### **View Deployment Status**
```bash
# Check what's deployed
curl -I https://HrishabhPurohit.github.io/einvoice-web-converter
```

### **View Branch Differences**
```bash
# Compare basic vs pwa-licensed
git diff basic..pwa-licensed
```

---

## 📝 Deployment Checklist

Before deploying:

- [ ] All changes committed to `main`
- [ ] Changes merged to target branch (`basic` or `pwa-licensed`)
- [ ] Tested locally with `npm start`
- [ ] No errors in console
- [ ] `package.json` has correct deploy script
- [ ] On correct branch for deployment
- [ ] `npm install` run if dependencies changed

After deploying:

- [ ] Wait 30-60 seconds for GitHub Pages
- [ ] Visit live URL to verify
- [ ] Test all features
- [ ] Check PWA installation (if pwa-licensed)
- [ ] Verify license system (if pwa-licensed)

---

## 🆘 Support

If you encounter issues:

1. Check this guide first
2. Review git history: `git log --oneline`
3. Check deployment logs in GitHub Actions
4. Restore from backup if needed

---

## 📚 Additional Resources

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **gh-pages Package**: https://www.npmjs.com/package/gh-pages
- **Git Branching**: https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging

---

**Last Updated**: March 31, 2026
**Maintained By**: Hrishabh Purohit
