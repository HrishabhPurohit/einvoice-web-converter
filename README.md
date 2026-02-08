# 🔐 E-Invoice Converter Pro - PWA

A professional Progressive Web App for converting CSV files to E-Invoice V4 JSON format with **offline license protection**.

## ✨ Features

- 🔒 **Device-Locked Licensing** - Secure license keys tied to specific devices
- 📱 **Progressive Web App** - Install on desktop and mobile devices
- 🌐 **Offline Capable** - Works completely offline after activation
- 🚀 **Fast Conversion** - Instant CSV to JSON conversion
- 🎨 **Modern UI** - Beautiful, responsive design
- 🔐 **Encrypted Storage** - License data stored securely in IndexedDB
- ✅ **E-Invoice V4 Compliant** - Follows official schema

## 🚀 Quick Start

### For Users

1. Visit: **https://HrishabhPurohit.github.io/einvoice-web-converter**
2. Click "Show Device ID" and copy your device fingerprint
3. Contact us to purchase a license: **+91-8328447318**
4. Enter your license key to activate
5. Install as PWA (optional) for offline use

### For Developers

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

## 🔑 License Types

### Lifetime License
- **Price**: ₹1,999
- One-time payment
- Unlimited use
- Never expires
- Tied to one device

### Annual License
- **Price**: ₹999/year
- Yearly subscription
- Includes updates
- Renews annually
- Tied to one device

## 📖 Documentation

- **[PWA Deployment Guide](PWA-DEPLOYMENT-GUIDE.md)** - Complete deployment instructions
- **[License Generation Guide](LICENSE-GENERATION-GUIDE.md)** - How to generate license keys

## 🛠️ Tech Stack

- **React** - UI framework
- **IndexedDB** - Encrypted license storage
- **Service Worker** - Offline caching
- **CryptoJS** - Encryption & device fingerprinting
- **Papa Parse** - CSV parsing

## 🔒 Security Features

1. **Device Fingerprinting** - Unique device identification
2. **AES Encryption** - Secure license storage
3. **Checksum Validation** - Prevents fake keys
4. **Offline Validation** - No internet required after activation
5. **Expiry Checking** - Automatic license validation

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the app
2. Click install icon (⊕) in address bar
3. Click "Install"

### Mobile (Android)
1. Open in Chrome
2. Tap menu (⋮) → "Add to Home Screen"

### iPhone/iPad
1. Open in Safari
2. Tap share icon → "Add to Home Screen"

## 🧪 Testing

### Generate Test License

```bash
# Generate sample device fingerprint
node generate-license.js --sample

# Generate lifetime license
node generate-license.js <device-fingerprint> 0000

# Generate annual license (expires Dec 2025)
node generate-license.js <device-fingerprint> 1225
```

## 📞 Support

Need a license or have questions?

**Contact**: +91-8328447318

## 📄 License

© 2025 E-Invoice Converter Pro. All rights reserved.

---

## 🎯 For License Administrators

### Generate Customer License Keys

```bash
# Customer sends you their Device ID from the app
# Generate lifetime license
node generate-license.js <customer-device-id> 0000

# Generate annual license
node generate-license.js <customer-device-id> 1225
```

See [LICENSE-GENERATION-GUIDE.md](LICENSE-GENERATION-GUIDE.md) for detailed instructions.

## 🔄 Version History

### v1.0.0 (Current)
- ✅ PWA with offline support
- ✅ Device-locked licensing system
- ✅ Encrypted license storage
- ✅ E-Invoice V4 conversion
- ✅ Modern responsive UI
- ✅ Show Device ID feature

---

**Live App**: https://HrishabhPurohit.github.io/einvoice-web-converter
