import React, { useState, useEffect } from 'react';
import './LicenseScreen.css';
import licenseManager from '../utils/LicenseManager';

function LicenseScreen({ onLicenseActivated }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeviceId, setShowDeviceId] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = licenseManager.generateDeviceFingerprint();
    setDeviceId(id);
  }, []);

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const license = await licenseManager.activateLicense(licenseKey.trim().toUpperCase(), email.trim());
      
      onLicenseActivated(license);
    } catch (err) {
      setError(err.message || 'Failed to activate license');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleActivate();
    }
  };

  const handleCopyDeviceId = () => {
    navigator.clipboard.writeText(deviceId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="license-screen">
      <div className="license-container">
        <div className="license-header">
          <div className="license-icon">🔐</div>
          <h1>E-Invoice Converter</h1>
          <p className="license-subtitle">Professional CSV to JSON Converter</p>
        </div>

        <div className="license-content">
          <h2>Activate Your License</h2>
          <p className="license-description">
            Enter your license key to unlock the E-Invoice converter. 
            Your license is tied to this device for security.
          </p>

          <div className="license-form">
            <div className="form-group">
              <label htmlFor="license-key">License Key</label>
              <input
                id="license-key"
                type="text"
                className="license-input"
                placeholder="EINV-2025-XXXX-XXXX-XXXX"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={loading}
                maxLength={24}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                id="email"
                type="email"
                className="license-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="license-error">
                ⚠️ {error}
              </div>
            )}

            <button
              className="activate-button"
              onClick={handleActivate}
              disabled={loading}
            >
              {loading ? 'Activating...' : 'Activate License'}
            </button>
          </div>

          <div className="device-id-section">
            <button 
              className="show-device-id-btn"
              onClick={() => setShowDeviceId(!showDeviceId)}
              type="button"
            >
              {showDeviceId ? '🔽 Hide Device ID' : '🔼 Show Device ID'}
            </button>
            
            {showDeviceId && (
              <div className="device-id-display">
                <p className="device-id-label">Your Device ID:</p>
                <div className="device-id-box">
                  <code className="device-id-code">{deviceId}</code>
                  <button 
                    className="copy-btn"
                    onClick={handleCopyDeviceId}
                    type="button"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <p className="device-id-help">
                  Send this Device ID to get your license key
                </p>
              </div>
            )}
          </div>

          <div className="license-info">
            <h3>License Types:</h3>
            <ul>
              <li><strong>Lifetime:</strong> One-time payment, unlimited use</li>
              <li><strong>Annual:</strong> Yearly subscription with updates</li>
            </ul>
            
            <p className="license-help">
              Need a license? Contact us at: <strong>+91-8328447318</strong>
            </p>
          </div>
        </div>

        <div className="license-footer">
          <p>© 2025 E-Invoice Converter. All rights reserved.</p>
          <p className="version">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default LicenseScreen;
