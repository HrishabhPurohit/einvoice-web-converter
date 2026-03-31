# E-Invoice Converter - Basic Version

A simple web-based CSV to E-Invoice V4 JSON converter.

## Features

- 🚀 Fast CSV to JSON conversion
- 📄 Drag & drop file upload
- ✅ E-Invoice V4 compliant
- 🎨 Modern, responsive UI
- 🌐 Works entirely in browser (no backend needed)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Live Demo

**https://HrishabhPurohit.github.io/einvoice-web-converter**

## Branch Strategy

This repository maintains two versions:

### `basic` (Current Branch)
- Simple CSV to JSON converter
- No license protection
- Free and open access
- Ideal for testing and demos

### `pwa-licensed`
- Full PWA with offline support
- Device-locked license protection
- Encrypted license storage
- Commercial version

## Switching Versions

To deploy the licensed version:
```bash
git checkout pwa-licensed
npm run deploy
```

To deploy the basic version:
```bash
git checkout basic
npm run deploy
```

## Tech Stack

- React 19
- Papa Parse (CSV parsing)
- GitHub Pages (hosting)

## License

© 2025 E-Invoice Converter. All rights reserved.
