const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const archiver = require('archiver');
const os = require('os');

// Test configuration - matching your Firebase function
const APPLE_WALLET_CONFIG = {
  teamId: "82DCWGV64A",
  passTypeId: "pass.com.aircardapp.ilxapp",
  keyPassword: "ilxaircardwalletidentifier",
};

// Certificate paths
const CERT_PATHS = {
  wwdr: path.join(__dirname, 'certificates/apple-wallet/WWDR.pem'),
  passType: path.join(__dirname, 'certificates/apple-wallet/PassTypeID.pem'),
  signerKey: path.join(__dirname, 'certificates/apple-wallet/WalletPassSigningKey.pem'),
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
  
  console.log('🔍 Validating configuration...');
  console.log('Apple Wallet Config:', APPLE_WALLET_CONFIG);
  console.log('Certificate paths:', CERT_PATHS);
  
  if (!APPLE_WALLET_CONFIG.teamId) missingFields.push('teamId');
  if (!APPLE_WALLET_CONFIG.passTypeId) missingFields.push('passTypeId');
  if (!APPLE_WALLET_CONFIG.keyPassword) missingFields.push('keyPassword');
  
  // Check if certificate files exist
  if (!fs.existsSync(CERT_PATHS.wwdr)) {
    console.log('❌ WWDR certificate not found at:', CERT_PATHS.wwdr);
    missingFields.push('WWDR certificate');
  } else {
    console.log('✅ WWDR certificate found');
  }
  
  if (!fs.existsSync(CERT_PATHS.passType)) {
    console.log('❌ PassTypeID certificate not found at:', CERT_PATHS.passType);
    missingFields.push('PassTypeID certificate');
  } else {
    console.log('✅ PassTypeID certificate found');
  }
  
  if (!fs.existsSync(CERT_PATHS.signerKey)) {
    console.log('❌ Signing key not found at:', CERT_PATHS.signerKey);
    missingFields.push('Signing key');
  } else {
    console.log('✅ Signing key found');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

async function createTestAppleWalletPass(passData) {
  console.log('🔧 Starting test Apple Wallet pass creation...');
  
  const { name, company, jobTitle, cardId, userId, publicCardUrl } = passData;
  
  // Create temporary directory for pass files
  const tempDir = path.join(os.tmpdir(), `test-pass-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  
  console.log('📁 Created temp directory:', tempDir);
  
  try {
    // 1. Validate and sanitize input data with robust fallbacks
    const sanitizedName = (name && name.trim()) || 'Digital Business Card';
    const sanitizedCompany = (company && company.trim()) || '';
    const sanitizedJobTitle = (jobTitle && jobTitle.trim()) || '';
    
    console.log('📝 Field validation:');
    console.log(`   Name: "${sanitizedName}" ${name !== sanitizedName ? '(fallback applied)' : ''}`);
    console.log(`   Company: "${sanitizedCompany}" ${!sanitizedCompany ? '(empty - will be handled)' : ''}`);
    console.log(`   Job Title: "${sanitizedJobTitle}" ${!sanitizedJobTitle ? '(empty - will be handled)' : ''}`);
    
    // Build dynamic secondary fields based on available data
    const secondaryFields = [];
    
    // Strategy: Include only fields that have meaningful data
    if (sanitizedJobTitle && sanitizedCompany) {
      // Both title and company - use left/right alignment
      secondaryFields.push(
        {
          key: 'title',
          label: 'Title',
          value: sanitizedJobTitle,
          textAlignment: 'PKTextAlignmentLeft'
        },
        {
          key: 'company',
          label: 'Company',
          value: sanitizedCompany,
          textAlignment: 'PKTextAlignmentRight'
        }
      );
    } else if (sanitizedJobTitle) {
      // Only title - center alignment
      secondaryFields.push({
        key: 'title',
        label: 'Title',
        value: sanitizedJobTitle,
        textAlignment: 'PKTextAlignmentCenter'
      });
    } else if (sanitizedCompany) {
      // Only company - center alignment
      secondaryFields.push({
        key: 'company',
        label: 'Company',
        value: sanitizedCompany,
        textAlignment: 'PKTextAlignmentCenter'
      });
    } else {
      // Neither - use professional fallback
      secondaryFields.push({
        key: 'professional',
        label: 'Professional',
        value: 'Digital Business Card',
        textAlignment: 'PKTextAlignmentCenter'
      });
    }
    
    console.log(`📋 Generated ${secondaryFields.length} secondary field(s):`, secondaryFields.map(f => `${f.label}: ${f.value}`));
    
    // Create pass.json with dynamic field structure
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: APPLE_WALLET_CONFIG.passTypeId,
      serialNumber: `${cardId}-${Date.now()}`,
      teamIdentifier: APPLE_WALLET_CONFIG.teamId,
      organizationName: 'ILX Digital Solutions',
      description: `${sanitizedName} - Digital Business Card`,
      logoText: 'ILX',
      
      // Add webServiceURL and authenticationToken for proper validation
      webServiceURL: 'https://us-central1-aircardapp1.cloudfunctions.net/passWebService',
      authenticationToken: 'ilx-auth-token-2024',
      
      // Colors matching CardPreview theme (#FDBA74 = rgb(253, 186, 116))
      backgroundColor: 'rgb(253, 186, 116)',  // ILX orange theme
      foregroundColor: 'rgb(17, 24, 39)',    // Dark gray for text (gray-900)
      labelColor: 'rgb(107, 114, 128)',      // Medium gray for labels (gray-500)
      
      // Add expiration date
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      
      // Pass structure - dynamic layout based on available data
      generic: {
        primaryFields: [{
          key: 'name',
          label: 'Name',
          value: sanitizedName,
          textAlignment: 'PKTextAlignmentCenter'
        }],
        secondaryFields: secondaryFields,
        auxiliaryFields: [{
          key: 'website',
          label: 'Digital Card',
          value: 'Scan QR Code',
          textAlignment: 'PKTextAlignmentCenter'
        }]
      },

      // Barcode (QR code)
      barcodes: [{
        message: publicCardUrl,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1'
      }],
      
      // Back fields with contact information
      backFields: [{
        key: 'website',
        label: 'Website',
        value: 'https://aircardapp1.web.app'
      }, {
        key: 'support',
        label: 'Support',
        value: 'Digital Business Cards by ILX'
      }, {
        key: 'contact',
        label: 'Contact',
        value: 'support@ilxapp.com'
      }, {
        key: 'fullcard',
        label: 'Full Digital Card',
        value: publicCardUrl
      }]
    };
    
    const passJsonPath = path.join(tempDir, 'pass.json');
    fs.writeFileSync(passJsonPath, JSON.stringify(passJson, null, 2));
    console.log('✅ Created pass.json');
    
    // 2. Generate QR code image
    const qrCodeBuffer = await generateQRCode(publicCardUrl);
    const qrCodePath = path.join(tempDir, 'strip.png');
    fs.writeFileSync(qrCodePath, qrCodeBuffer);
    console.log('✅ Created QR code image');
    
    // 3. Create multiple icon sizes (CRITICAL FIX)
    const iconSizes = [
      { name: 'icon.png', size: 29 },
      { name: 'icon@2x.png', size: 58 },
      { name: 'icon@3x.png', size: 87 }
    ];
    
    // Simple colored square icon (you can replace with actual ILX logo)
    for (const iconConfig of iconSizes) {
      const iconBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, iconConfig.size, 0x00, 0x00, 0x00, iconConfig.size, 0x08, 0x06, 0x00, 0x00, 0x00,
        0x8E, 0x11, 0x33, 0x23, 0x00, 0x00, 0x00, 0x4F, 0x49, 0x44, 0x41, 0x54, 0x48, 0x4B, 0x63, 0xFC,
        0xFF, 0xFF, 0xFF, 0x3F, 0x03, 0x25, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14,
        0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00,
        0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44,
        0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x44, 0x8C,
        0x52, 0x14, 0x00, 0x44, 0x8C, 0x52, 0x14, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
        0x42, 0x60, 0x82
      ]);
      
      const iconPath = path.join(tempDir, iconConfig.name);
      fs.writeFileSync(iconPath, iconBuffer);
      console.log(`✅ Created ${iconConfig.name} (${iconConfig.size}x${iconConfig.size})`);
    }
    
    // 4. Create manifest.json with SHA-1 hashes
    const manifest = {};
    const files = fs.readdirSync(tempDir);
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const fileContent = fs.readFileSync(filePath);
      const hash = crypto.createHash('sha1').update(fileContent).digest('hex');
      manifest[file] = hash;
      console.log(`📄 ${file}: ${hash}`);
    }
    
    const manifestPath = path.join(tempDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Created manifest.json');
    
    // 5. Sign the manifest using OpenSSL
    const signaturePath = path.join(tempDir, 'signature');
    const signCommand = `openssl smime -binary -sign -certfile "${CERT_PATHS.wwdr}" -signer "${CERT_PATHS.passType}" -inkey "${CERT_PATHS.signerKey}" -in "${manifestPath}" -out "${signaturePath}" -outform DER`;
    
    console.log('🔐 Signing manifest...');
    
    try {
      execSync(signCommand, { stdio: 'pipe' });
      console.log('✅ Manifest signed successfully');
    } catch (signError) {
      console.error('❌ Error signing manifest:', signError);
      throw new Error(`Failed to sign manifest: ${signError.message}`);
    }
    
    // 6. Create .pkpass file
    console.log('📦 Creating .pkpass file...');
    
    const passOutputPath = path.join(__dirname, `test-pass-${Date.now()}.pkpass`);
    
    const passBuffer = await new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks = [];
      
      archive.on('data', (chunk) => chunks.push(chunk));
      archive.on('end', () => {
        const buffer = Buffer.concat(chunks);
        console.log('✅ .pkpass archive created');
        console.log('📊 Archive size:', buffer.length, 'bytes');
        resolve(buffer);
      });
      archive.on('error', reject);
      
      // Add all files to the archive
      const finalFiles = fs.readdirSync(tempDir);
      console.log('📁 Files to add to archive:', finalFiles);
      
      for (const file of finalFiles) {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        console.log(`📄 Adding ${file} (${stats.size} bytes)`);
        archive.file(filePath, { name: file });
      }
      
      archive.finalize();
    });
    
    // Write the buffer to file
    fs.writeFileSync(passOutputPath, passBuffer);
    console.log('✅ .pkpass file written to:', passOutputPath);
    
    return passOutputPath;
    
  } finally {
    // Clean up temporary directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('🧹 Cleaned up temporary files');
    } catch (cleanupError) {
      console.warn('⚠️ Failed to clean up temporary files:', cleanupError);
    }
  }
}

// Test function
async function runTest() {
  console.log('🚀 Starting Apple Wallet Pass Test');
  console.log('=====================================');
  
  // Validate configuration
  const { isValid, missingFields } = validateConfiguration();
  
  if (!isValid) {
    console.error('❌ Configuration validation failed:', missingFields);
    process.exit(1);
  }
  
  console.log('✅ Configuration validated successfully');
  
  // Test pass data
  const testPassData = {
    name: 'John Doe',
    company: 'ILX Digital Solutions',
    jobTitle: 'Senior Developer',
    cardId: 'test-card-123',
    userId: 'test-user-456',
    publicCardUrl: 'https://aircardapp1.web.app/card/test-card-123'
  };
  
  try {
    const passFilePath = await createTestAppleWalletPass(testPassData);
    console.log('🎉 SUCCESS! Pass file created at:', passFilePath);
    console.log('');
    console.log('Next steps:');
    console.log('1. Test the pass file at: https://pkpassvalidator.azurewebsites.net/');
    console.log('2. If validation passes, test on a real iOS device');
    console.log('3. If it works, deploy the Firebase function');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  runTest();
}

module.exports = { createTestAppleWalletPass, validateConfiguration }; 