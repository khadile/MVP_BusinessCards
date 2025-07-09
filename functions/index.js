const functions = require('firebase-functions');
const admin = require('firebase-admin');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const archiver = require('archiver');
const os = require('os');

// Initialize Firebase Admin
admin.initializeApp();

// Apple Wallet Pass Generator - Manual Implementation v4

// Environment variables
const APPLE_WALLET_CONFIG = {
  teamId: functions.config().apple_wallet?.team_id,
  passTypeId: functions.config().apple_wallet?.pass_type_id,
  keyPassword: functions.config().apple_wallet?.key_password,
};

// Certificate paths (these would be in your Firebase Functions environment)
const CERT_PATHS = {
  wwdr: path.join(__dirname, 'certificates/apple-wallet/WWDR.pem'), // Apple WWDR G4 Certificate
  passType: path.join(__dirname, 'certificates/apple-wallet/PassTypeID.pem'),
  signerKey: path.join(__dirname, 'certificates/apple-wallet/WalletPassSigningKey.pem'), // Changed from .p12 to .pem
};

async function generateQRCode(url) {
  try {
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'M',
      type: 'png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });
    return qrCodeBuffer;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

function validateConfiguration() {
  const missingFields = [];
  
  // Debug: Log the configuration
  console.log('Apple Wallet Config:', APPLE_WALLET_CONFIG);
  console.log('Certificate paths:', CERT_PATHS);
  
  if (!APPLE_WALLET_CONFIG.teamId) missingFields.push('teamId');
  if (!APPLE_WALLET_CONFIG.passTypeId) missingFields.push('passTypeId');
  if (!APPLE_WALLET_CONFIG.keyPassword) missingFields.push('keyPassword');
  
  // Check if certificate files exist
  console.log('Checking certificate directory:', path.dirname(CERT_PATHS.wwdr));
  try {
    const certDir = path.dirname(CERT_PATHS.wwdr);
    if (fs.existsSync(certDir)) {
      const files = fs.readdirSync(certDir);
      console.log('Files in certificate directory:', files);
    } else {
      console.log('Certificate directory does not exist');
    }
  } catch (dirError) {
    console.log('Error reading certificate directory:', dirError);
  }
  
  if (!fs.existsSync(CERT_PATHS.wwdr)) {
    console.log('WWDR certificate not found at:', CERT_PATHS.wwdr);
    missingFields.push('WWDR certificate');
  }
  if (!fs.existsSync(CERT_PATHS.passType)) {
    console.log('PassTypeID certificate not found at:', CERT_PATHS.passType);
    missingFields.push('PassTypeID certificate');
  }
  if (!fs.existsSync(CERT_PATHS.signerKey)) {
    console.log('Signing key not found at:', CERT_PATHS.signerKey);
    missingFields.push('Signing key');
  }
  
  console.log('Validation result:', { isValid: missingFields.length === 0, missingFields });
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

async function createManualAppleWalletPass(passData) {
  console.log('🔧 Starting manual Apple Wallet pass creation...');
  
  const { name, company, cardId, userId, publicCardUrl } = passData;
  
  // Create temporary directory for pass files
  const tempDir = path.join(os.tmpdir(), `pass-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  
  try {
    // 1. Create pass.json
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: APPLE_WALLET_CONFIG.passTypeId,
      serialNumber: `${cardId}-${Date.now()}`,
      teamIdentifier: APPLE_WALLET_CONFIG.teamId,
      organizationName: 'ILX Digital Business Cards',
      description: `${name} - Digital Business Card`,
      logoText: 'ILX',
      
      // Add webServiceURL and authenticationToken for proper validation
      webServiceURL: 'https://us-central1-aircardapp1.cloudfunctions.net/passWebService',
      authenticationToken: 'ilx-auth-token-2024', // 16+ character token as required
      
      // Use rgb() colors as specified in Apple documentation
      backgroundColor: 'rgb(255, 255, 255)',
      foregroundColor: 'rgb(0, 0, 0)',
      labelColor: 'rgb(102, 102, 102)',
      
      // Add expiration date (1 year from now)
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      
      // Pass structure - using generic pass type
      generic: {
        primaryFields: [
          {
            key: 'name',
            label: 'Name',
            value: name,
            textAlignment: 'PKTextAlignmentCenter'
          }
        ],
        secondaryFields: [
          {
            key: 'company',
            label: 'Company', 
            value: company,
            textAlignment: 'PKTextAlignmentCenter'
          }
        ],
        auxiliaryFields: [
          {
            key: 'website',
            label: 'View Full Card',
            value: 'Scan QR Code',
            textAlignment: 'PKTextAlignmentCenter'
          }
        ]
      },

      // Barcode (QR code) - fixed structure without altText inside
      barcodes: [
        {
          message: publicCardUrl,
          format: 'PKBarcodeFormatQR',
          messageEncoding: 'iso-8859-1'
        }
      ],
      
      // Add back fields with contact information (required by Apple)
      backFields: [
        {
          key: 'website',
          label: 'Website',
          value: 'https://aircardapp1.web.app'
        },
        {
          key: 'support',
          label: 'Support',
          value: 'Digital Business Card by ILX'
        },
        {
          key: 'contact',
          label: 'Contact',
          value: 'support@ilxapp.com'
        }
      ]
    };
    
    const passJsonPath = path.join(tempDir, 'pass.json');
    fs.writeFileSync(passJsonPath, JSON.stringify(passJson, null, 2));
    console.log('✅ Created pass.json');
    console.log('📋 Pass JSON content:', JSON.stringify(passJson, null, 2));
    
    // 2. Generate and add QR code image
    const qrCodeBuffer = await generateQRCode(publicCardUrl);
    const qrCodePath = path.join(tempDir, 'strip.png');
    fs.writeFileSync(qrCodePath, qrCodeBuffer);
    console.log('✅ Created QR code image');
    
    // 3. Create a proper 29x29 icon as required by Apple
    // This is a simple 29x29 white square icon
    const iconBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x1D, 0x00, 0x00, 0x00, 0x1D, 0x08, 0x06, 0x00, 0x00, 0x00, 0x8E, 0x11, 0x33,
      0x23, 0x00, 0x00, 0x00, 0x09, 0x70, 0x48, 0x59, 0x73, 0x00, 0x00, 0x0B, 0x13, 0x00, 0x00, 0x0B,
      0x13, 0x01, 0x00, 0x9A, 0x9C, 0x18, 0x00, 0x00, 0x00, 0x4F, 0x49, 0x44, 0x41, 0x54, 0x48, 0x4B,
      0x63, 0xFC, 0xFF, 0xFF, 0xFF, 0x3F, 0x03, 0x25, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C,
      0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52,
      0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14,
      0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00,
      0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
      0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const iconPath = path.join(tempDir, 'icon.png');
    fs.writeFileSync(iconPath, iconBuffer);
    console.log('✅ Created 29x29 icon image');
    
    // 4. Create manifest.json with SHA-1 hashes
    const manifest = {};
    const files = fs.readdirSync(tempDir);
    
    console.log('📁 Files in temp directory:', files);
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const fileContent = fs.readFileSync(filePath);
      const hash = crypto.createHash('sha1').update(fileContent).digest('hex');
      manifest[file] = hash;
      console.log(`📄 ${file}: ${hash} (${fileContent.length} bytes)`);
    }
    
    const manifestPath = path.join(tempDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Created manifest.json with file hashes');
    console.log('📋 Manifest content:', JSON.stringify(manifest, null, 2));
    
    // 5. Sign the manifest using OpenSSL
    const signaturePath = path.join(tempDir, 'signature');
    
    // Use OpenSSL to sign the manifest
    const signCommand = `openssl smime -binary -sign -certfile "${CERT_PATHS.wwdr}" -signer "${CERT_PATHS.passType}" -inkey "${CERT_PATHS.signerKey}" -in "${manifestPath}" -out "${signaturePath}" -outform DER`;
    
    console.log('🔐 Signing manifest with OpenSSL...');
    console.log('Sign command:', signCommand);
    
    try {
      execSync(signCommand, { stdio: 'pipe' });
      console.log('✅ Manifest signed successfully');
    } catch (signError) {
      console.error('❌ Error signing manifest:', signError.message);
      throw new Error(`Failed to sign manifest: ${signError.message}`);
    }
    
    // 6. Create .pkpass file (zip archive)
    console.log('📦 Creating .pkpass archive...');
    
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks = [];
      
      archive.on('data', (chunk) => chunks.push(chunk));
      archive.on('end', () => {
        const buffer = Buffer.concat(chunks);
        console.log('✅ .pkpass file created successfully');
        resolve(buffer);
      });
      archive.on('error', reject);
      
      // Add all files to the archive
      const finalFiles = fs.readdirSync(tempDir);
      for (const file of finalFiles) {
        const filePath = path.join(tempDir, file);
        archive.file(filePath, { name: file });
      }
      
      archive.finalize();
    });
    
  } finally {
    // Clean up temporary directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('🧹 Cleaned up temporary files');
    } catch (cleanupError) {
      console.warn('⚠️ Failed to clean up temporary files:', cleanupError.message);
    }
  }
}

exports.generateAppleWalletPass = functions.https.onRequest(async (req, res) => {
  console.log('=== FUNCTION START - MANUAL IMPLEMENTATION v4 ===');
  console.log('🚀 Apple Wallet Pass Generation Started (Manual Implementation)!');
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  console.log('Request query:', req.query);
  
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request, returning 200');
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST' && req.method !== 'GET') {
    console.log('Invalid request method, returning 405');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  console.log('Request received, processing...');
  
  try {
    // Extract parameters from either query string (GET) or request body (POST)
    let name, company, cardId, userId, publicCardUrl;
    
    if (req.method === 'GET') {
      // For iOS devices using GET with query parameters
      console.log('Processing GET request with query parameters');
      ({ name, company, cardId, userId, publicCardUrl } = req.query);
    } else {
      // For other devices using POST with JSON body
      console.log('Processing POST request with JSON body');
      ({ name, company, cardId, userId, publicCardUrl } = req.body);
    }
    
    console.log('Extracted request data:', { name, company, cardId, userId, publicCardUrl });
    
    // Validate input
    if (!name || !company || !cardId || !userId || !publicCardUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, company, cardId, userId, publicCardUrl' 
      });
    }
    
    // Validate Apple Wallet configuration
    console.log('Starting Apple Wallet configuration validation...');
    const { isValid, missingFields } = validateConfiguration();
    console.log('Validation complete. IsValid:', isValid, 'Missing fields:', missingFields);
    
    if (!isValid) {
      console.log('Validation failed, returning error');
      return res.status(500).json({ 
        error: `Apple Wallet configuration incomplete: ${missingFields.join(', ')}` 
      });
    }
    
    console.log('Validation passed, proceeding with manual pass generation...');
    
    // Generate the pass using manual implementation
    const passBuffer = await createManualAppleWalletPass({
      name, company, cardId, userId, publicCardUrl
    });
    
    // Check if this is an iOS request by looking at User-Agent
    const userAgent = req.get('User-Agent') || '';
    const isIOSRequest = /iPad|iPhone|iPod/.test(userAgent) || req.method === 'GET';
    
    console.log('🔍 User-Agent:', userAgent);
    console.log('🔍 iOS request detected:', isIOSRequest);
    
    if (isIOSRequest) {
      // For iOS: Serve the .pkpass file directly with proper headers
      console.log('📱 Serving .pkpass file directly for iOS');
      res.set('Content-Type', 'application/vnd.apple.pkpass');
      res.set('Content-Length', passBuffer.length);
      console.log('🎉 Sending .pkpass file to client');
      res.status(200).send(passBuffer);
      return;
    } else {
      // For other devices: Force download with full headers
      console.log('💻 Serving .pkpass as download for non-iOS');
      res.set('Content-Type', 'application/vnd.apple.pkpass');
      res.set('Content-Length', passBuffer.length);
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('Content-Disposition', `attachment; filename="${name.replace(/\s+/g, '_')}_BusinessCard.pkpass"`);
      console.log('🎉 Sending .pkpass file to client');
      res.status(200).send(passBuffer);
      return;
    }
    
  } catch (error) {
    console.error('Error generating Apple Wallet pass:', error);
    res.status(500).json({ 
      error: 'Failed to generate Apple Wallet pass',
      details: error.message 
    });
  }
}); 