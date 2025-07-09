#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CERT_DIR = path.join(__dirname, '..', 'certificates', 'apple-wallet');
const REQUIRED_FILES = [
  'WWDR.cer',
  'PassTypeID.cer', 
  'WalletPassSigningKey.p12'
];

const REQUIRED_ENV_VARS = [
  'APPLE_WALLET_PASS_TYPE_ID',
  'APPLE_WALLET_TEAM_ID',
  'APPLE_WALLET_P12_PASSWORD',
  'APPLE_WALLET_ORGANIZATION_NAME'
];

console.log('🍎 Apple Wallet Setup Validation\n');

// Check if certificates directory exists
if (!fs.existsSync(CERT_DIR)) {
  console.error('❌ Certificates directory does not exist:', CERT_DIR);
  console.log('📝 Please create the directory and add your certificates');
  process.exit(1);
}

// Check for required certificate files
console.log('📋 Checking certificate files...');
let missingFiles = [];

REQUIRED_FILES.forEach(filename => {
  const filepath = path.join(CERT_DIR, filename);
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    console.log(`✅ ${filename} (${Math.round(stats.size / 1024)}KB)`);
  } else {
    console.log(`❌ ${filename} - MISSING`);
    missingFiles.push(filename);
  }
});

if (missingFiles.length > 0) {
  console.log('\n📝 Missing certificate files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\n📖 Please refer to certificates/apple-wallet/README.md for setup instructions');
}

// Check environment variables
console.log('\n📋 Checking environment variables...');
let missingEnvVars = [];

REQUIRED_ENV_VARS.forEach(varName => {
  const value = process.env[varName];
  if (value && value.trim() !== '') {
    console.log(`✅ ${varName}`);
  } else {
    console.log(`❌ ${varName} - MISSING`);
    missingEnvVars.push(varName);
  }
});

if (missingEnvVars.length > 0) {
  console.log('\n📝 Missing environment variables:');
  missingEnvVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n📖 Please add these to your .env file');
}

// Summary
console.log('\n📊 Summary:');
if (missingFiles.length === 0 && missingEnvVars.length === 0) {
  console.log('✅ All requirements met! Apple Wallet feature is ready to use.');
} else {
  console.log(`❌ ${missingFiles.length + missingEnvVars.length} issues found. Please resolve them before using Apple Wallet feature.`);
  process.exit(1);
}

// Optional: Test certificate loading (if all files exist)
if (missingFiles.length === 0) {
  console.log('\n🧪 Testing certificate loading...');
  try {
    const wwdrPath = path.join(CERT_DIR, 'WWDR.cer');
    const passTypeIdPath = path.join(CERT_DIR, 'PassTypeID.cer');
    const signingKeyPath = path.join(CERT_DIR, 'WalletPassSigningKey.p12');
    
    // Basic file reading test
    fs.readFileSync(wwdrPath);
    fs.readFileSync(passTypeIdPath);
    fs.readFileSync(signingKeyPath);
    
    console.log('✅ All certificate files are readable');
  } catch (error) {
    console.log('❌ Error reading certificate files:', error.message);
  }
} 