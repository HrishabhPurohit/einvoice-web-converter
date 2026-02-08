# License Key Generation Guide

## Overview

The E-Invoice Converter uses device-locked license keys to restrict access. Each license key is tied to a specific device fingerprint, ensuring that the license cannot be shared across multiple devices.

## License Key Format

```
EINV-[YEAR]-[DEVICE_HASH]-[CHECKSUM]-[EXPIRY]
```

Example: `EINV-2025-A7F3-9K2L-0000`

- **EINV**: Product identifier
- **2025**: Year of generation
- **A7F3**: First 4 characters of device fingerprint hash
- **9K2L**: Checksum for validation
- **0000**: Expiry date (0000 = lifetime, MMYY = expires month/year)

## How to Generate License Keys

### Step 1: Install Dependencies

```bash
cd /Users/h0p04fo/CascadeProjects/einvoice-web-converter
npm install crypto-js
```

### Step 2: Get Customer's Device Fingerprint

**Option A: Customer provides fingerprint**
- Customer opens the app
- App shows "No license" screen
- Add a "Show Device ID" button that displays their device fingerprint
- Customer sends you this fingerprint

**Option B: Generate test fingerprint**
```bash
node generate-license.js --sample
```

### Step 3: Generate License Key

**For Lifetime License:**
```bash
node generate-license.js <device-fingerprint> 0000
```

**For Annual License (expires Dec 2025):**
```bash
node generate-license.js <device-fingerprint> 1225
```

### Step 4: Send Key to Customer

Email or message the generated license key to your customer. They enter it in the app to activate.

## License Types & Pricing

### Lifetime License
- **Price**: ₹1,999
- **Expiry**: Never (0000)
- **Devices**: 1 device
- **Command**: `node generate-license.js <fingerprint> 0000`

### Annual License
- **Price**: ₹999/year
- **Expiry**: 12 months from purchase
- **Devices**: 1 device
- **Command**: `node generate-license.js <fingerprint> 1225` (for Dec 2025)

### Multi-Device License
- Generate separate keys for each device
- Each key uses different device fingerprint
- Charge premium for multiple devices

## Security Features

1. **Device Locking**: Each key works only on the device it was generated for
2. **Encrypted Storage**: License stored encrypted in IndexedDB
3. **Offline Validation**: Works without internet after activation
4. **Checksum Validation**: Prevents fake key generation
5. **Expiry Checking**: Automatic expiry validation for annual licenses

## Customer Activation Process

1. Customer opens app → sees license screen
2. Customer enters license key
3. App validates key against device fingerprint
4. If valid → app unlocks and stores encrypted license
5. App works offline with stored license

## Troubleshooting

### "License key not valid for this device"
- Customer is using key generated for different device
- Generate new key with correct device fingerprint

### "License key has expired"
- Annual license has expired
- Generate new key with future expiry date

### "Invalid license key format"
- Key was typed incorrectly
- Ensure key is in exact format: EINV-YYYY-XXXX-XXXX-XXXX

## Adding Device ID Display

To help customers get their device fingerprint, add this to LicenseScreen.js:

```javascript
const [showDeviceId, setShowDeviceId] = useState(false);
const [deviceId, setDeviceId] = useState('');

useEffect(() => {
  const id = licenseManager.generateDeviceFingerprint();
  setDeviceId(id);
}, []);

// In render:
<button onClick={() => setShowDeviceId(!showDeviceId)}>
  Show Device ID
</button>
{showDeviceId && (
  <div className="device-id-display">
    <p>Your Device ID:</p>
    <code>{deviceId}</code>
    <button onClick={() => navigator.clipboard.writeText(deviceId)}>
      Copy
    </button>
  </div>
)}
```

## Record Keeping

Keep a spreadsheet with:
- Customer Name
- Email
- License Key
- Device Fingerprint (first 8 chars)
- Purchase Date
- Expiry Date
- Amount Paid
- License Type

This helps with:
- Customer support
- License renewal
- Preventing duplicate keys
- Tracking revenue

## Example Workflow

1. Customer contacts you: "I want to buy E-Invoice Converter"
2. You ask: "Would you like Lifetime (₹1,999) or Annual (₹999)?"
3. Customer pays
4. You ask: "Please open the app and send me your Device ID"
5. Customer sends: `a7f3b2c1d4e5f6...`
6. You run: `node generate-license.js a7f3b2c1d4e5f6... 0000`
7. You send key: `EINV-2025-A7F3-9K2L-0000`
8. Customer activates and starts using app

## PWA Installation

Once customer activates license:
1. They can install app as PWA (Add to Home Screen)
2. App works offline with cached license
3. No internet needed for conversion
4. License persists across sessions

## Future Enhancements

- Online license validation API (optional)
- Automatic renewal reminders
- License transfer between devices
- Usage analytics
- Multi-user licenses for enterprises
