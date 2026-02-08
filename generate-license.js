const CryptoJS = require('crypto-js');

function generateLicenseKey(deviceFingerprint, expiryMonthYear = '0000') {
  const year = new Date().getFullYear();
  const deviceHash = deviceFingerprint.substring(0, 4).toUpperCase();
  
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  const checksumData = `EINV${year}${deviceHash}${expiryMonthYear}`;
  const checksum = CryptoJS.SHA256(checksumData).toString().substring(0, 4).toUpperCase();
  
  const licenseKey = `EINV-${year}-${deviceHash}-${checksum}-${expiryMonthYear}`;
  
  return licenseKey;
}

function generateDeviceFingerprint(userAgent, platform, screenResolution) {
  const fingerprint = {
    userAgent: userAgent || 'Mozilla/5.0',
    platform: platform || 'Win32',
    screenResolution: screenResolution || '1920x1080'
  };
  
  const fingerprintString = JSON.stringify(fingerprint);
  return CryptoJS.SHA256(fingerprintString).toString();
}

console.log('\n=== E-Invoice License Key Generator ===\n');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node generate-license.js <device-fingerprint> [expiry-MMYY]');
  console.log('\nExamples:');
  console.log('  Lifetime license:');
  console.log('    node generate-license.js abc123def456... 0000');
  console.log('\n  Annual license (expires Dec 2025):');
  console.log('    node generate-license.js abc123def456... 1225');
  console.log('\n  Generate sample device fingerprint:');
  console.log('    node generate-license.js --sample');
  console.log('\n');
  process.exit(0);
}

if (args[0] === '--sample') {
  console.log('Sample Device Fingerprint:');
  const sampleFingerprint = generateDeviceFingerprint(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Win32',
    '1920x1080'
  );
  console.log(sampleFingerprint);
  console.log('\nUse this fingerprint to generate a license key:');
  console.log(`node generate-license.js ${sampleFingerprint} 0000`);
  console.log('\n');
  process.exit(0);
}

const deviceFingerprint = args[0];
const expiryMonthYear = args[1] || '0000';

if (expiryMonthYear !== '0000' && !/^\d{4}$/.test(expiryMonthYear)) {
  console.error('Error: Expiry must be in MMYY format (e.g., 1225 for Dec 2025) or 0000 for lifetime');
  process.exit(1);
}

const licenseKey = generateLicenseKey(deviceFingerprint, expiryMonthYear);

console.log('Generated License Key:');
console.log('━'.repeat(50));
console.log(licenseKey);
console.log('━'.repeat(50));
console.log('\nLicense Details:');
console.log(`  Type: ${expiryMonthYear === '0000' ? 'Lifetime' : 'Annual'}`);
console.log(`  Device Hash: ${deviceFingerprint.substring(0, 4).toUpperCase()}`);
if (expiryMonthYear !== '0000') {
  const month = expiryMonthYear.substring(0, 2);
  const year = '20' + expiryMonthYear.substring(2, 4);
  console.log(`  Expires: ${month}/${year}`);
}
console.log('\nProvide this key to your customer.');
console.log('');
