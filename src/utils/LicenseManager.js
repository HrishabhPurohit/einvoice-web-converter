import CryptoJS from 'crypto-js';

class LicenseManager {
  constructor() {
    this.dbName = 'EInvoiceLicenseDB';
    this.storeName = 'licenses';
    this.encryptionKey = 'EINV_2025_SECRET_KEY_DO_NOT_SHARE';
    this.db = null;
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  generateDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device Fingerprint', 2, 2);
    const canvasData = canvas.toDataURL();
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvasData
    };
    
    const fingerprintString = JSON.stringify(fingerprint);
    return CryptoJS.SHA256(fingerprintString).toString();
  }

  calculateChecksum(key) {
    const parts = key.split('-');
    if (parts.length !== 5) return null;
    
    const data = parts[0] + parts[1] + parts[2] + parts[4];
    const hash = CryptoJS.SHA256(data).toString();
    return hash.substring(0, 4).toUpperCase();
  }

  validateKeyFormat(key) {
    if (!key || typeof key !== 'string') return false;
    
    const parts = key.split('-');
    if (parts.length !== 5) return false;
    
    if (parts[0] !== 'EINV') return false;
    
    if (!/^\d{4}$/.test(parts[1])) return false;
    
    if (!/^[A-Z0-9]{4}$/.test(parts[2])) return false;
    if (!/^[A-Z0-9]{4}$/.test(parts[3])) return false;
    
    if (!/^\d{4}$/.test(parts[4])) return false;
    
    const expectedChecksum = this.calculateChecksum(key);
    if (parts[3] !== expectedChecksum) return false;
    
    return true;
  }

  validateDeviceMatch(key, deviceId) {
    const parts = key.split('-');
    const keyDeviceHash = parts[2];
    const deviceHash = deviceId.substring(0, 4).toUpperCase();
    
    return keyDeviceHash === deviceHash;
  }

  checkExpiry(key) {
    const parts = key.split('-');
    const expiryStr = parts[4];
    
    if (expiryStr === '0000') {
      return { expired: false, type: 'lifetime' };
    }
    
    const month = parseInt(expiryStr.substring(0, 2));
    const year = parseInt('20' + expiryStr.substring(2, 4));
    
    const expiryDate = new Date(year, month - 1, 1);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    expiryDate.setDate(0);
    
    const now = new Date();
    const expired = now > expiryDate;
    
    return { 
      expired, 
      type: 'annual',
      expiryDate: expiryDate.toISOString()
    };
  }

  async activateLicense(key, email = '') {
    try {
      if (!this.validateKeyFormat(key)) {
        throw new Error('Invalid license key format');
      }

      const deviceId = this.generateDeviceFingerprint();
      
      if (!this.validateDeviceMatch(key, deviceId)) {
        throw new Error('License key not valid for this device');
      }

      const expiryCheck = this.checkExpiry(key);
      if (expiryCheck.expired) {
        throw new Error('License key has expired');
      }

      const licenseData = {
        id: 'current_license',
        key: key,
        email: email,
        deviceId: deviceId,
        activatedAt: new Date().toISOString(),
        expiresAt: expiryCheck.type === 'lifetime' ? null : expiryCheck.expiryDate,
        type: expiryCheck.type
      };

      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(licenseData),
        this.encryptionKey
      ).toString();

      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put({ id: 'current_license', data: encrypted });
        
        request.onsuccess = () => resolve(licenseData);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      throw error;
    }
  }

  async getLicense() {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get('current_license');
        
        request.onsuccess = () => {
          if (!request.result) {
            resolve(null);
            return;
          }
          
          try {
            const decrypted = CryptoJS.AES.decrypt(
              request.result.data,
              this.encryptionKey
            ).toString(CryptoJS.enc.Utf8);
            
            const licenseData = JSON.parse(decrypted);
            resolve(licenseData);
          } catch (error) {
            resolve(null);
          }
        };
        
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      return null;
    }
  }

  async validateLicense() {
    try {
      const license = await this.getLicense();
      
      if (!license) {
        return { valid: false, reason: 'No license found' };
      }

      if (!this.validateKeyFormat(license.key)) {
        return { valid: false, reason: 'Invalid license format' };
      }

      const deviceId = this.generateDeviceFingerprint();
      if (license.deviceId !== deviceId) {
        return { valid: false, reason: 'Device mismatch' };
      }

      const expiryCheck = this.checkExpiry(license.key);
      if (expiryCheck.expired) {
        return { valid: false, reason: 'License expired' };
      }

      return { 
        valid: true, 
        license: license,
        expiryInfo: expiryCheck
      };
    } catch (error) {
      return { valid: false, reason: 'Validation error' };
    }
  }

  async removeLicense() {
    try {
      await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete('current_license');
        
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      throw error;
    }
  }
}

const licenseManager = new LicenseManager();
export default licenseManager;
