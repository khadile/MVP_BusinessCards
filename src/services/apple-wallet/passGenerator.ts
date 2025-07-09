import { PassKit } from 'passkit-generator';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { AppleWalletPassData, AppleWalletConfig, PassGenerationResult, QRCodeData } from './types';

export class AppleWalletPassGenerator {
  private config: AppleWalletConfig;

  constructor(config: AppleWalletConfig) {
    this.config = config;
  }

  /**
   * Generate a .pkpass file for the given business card data
   */
  async generatePass(passData: AppleWalletPassData): Promise<PassGenerationResult> {
    try {
      // Generate QR code for the public card URL
      const qrCodeBuffer = await this.generateQRCode(passData.publicCardUrl);
      
      // Create the pass
      const pass = new PassKit({
        model: path.join(process.cwd(), 'src/services/apple-wallet/pass-template'),
        certificates: {
          wwdr: this.config.wwdrCertPath,
          signerCert: this.config.passTypeIdCertPath,
          signerKey: this.config.signingKeyPath,
          signerKeyPassphrase: this.config.p12Password,
        },
      });

      // Set pass metadata
      pass.type = 'generic';
      pass.passTypeIdentifier = this.config.passTypeId;
      pass.teamIdentifier = this.config.teamId;
      pass.organizationName = this.config.organizationName;
      pass.description = this.config.description;
      pass.serialNumber = `businesscard-${passData.cardId}-${Date.now()}`;

      // Set pass colors and branding
      pass.backgroundColor = 'rgb(253, 186, 116)'; // Orange theme
      pass.foregroundColor = 'rgb(0, 0, 0)';
      pass.labelColor = 'rgb(0, 0, 0)';

      // Add primary fields (name and company)
      pass.primaryFields = [
        {
          key: 'name',
          label: 'Name',
          value: passData.name,
        },
        {
          key: 'company',
          label: 'Company',
          value: passData.company,
        },
      ];

      // Add QR code barcode
      pass.barcodes = [
        {
          format: 'PKBarcodeFormatQR',
          message: passData.publicCardUrl,
          messageEncoding: 'iso-8859-1',
        },
      ];

      // Add back fields with additional info
      pass.backFields = [
        {
          key: 'website',
          label: 'View Full Card',
          value: passData.publicCardUrl,
        },
        {
          key: 'powered-by',
          label: 'Powered by',
          value: 'ILX Digital Business Cards',
        },
      ];

      // Generate the pass buffer
      const passBuffer = await pass.getAsBuffer();

      return {
        success: true,
        passBuffer,
      };
    } catch (error) {
      console.error('❌ Error generating Apple Wallet pass:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate QR code as buffer
   */
  private async generateQRCode(url: string): Promise<Buffer> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Convert data URL to buffer
      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
      return Buffer.from(base64Data, 'base64');
    } catch (error) {
      console.error('❌ Error generating QR code:', error);
      throw error;
    }
  }

  /**
   * Validate that all required certificates exist
   */
  static validateCertificates(config: AppleWalletConfig): boolean {
    const requiredFiles = [
      config.wwdrCertPath,
      config.passTypeIdCertPath,
      config.signingKeyPath,
    ];

    for (const filePath of requiredFiles) {
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing certificate file: ${filePath}`);
        return false;
      }
    }

    return true;
  }
}

/**
 * Factory function to create a configured pass generator
 */
export function createAppleWalletPassGenerator(): AppleWalletPassGenerator {
  const config: AppleWalletConfig = {
    passTypeId: process.env.APPLE_WALLET_PASS_TYPE_ID || '',
    teamId: process.env.APPLE_WALLET_TEAM_ID || '',
    organizationName: process.env.APPLE_WALLET_ORGANIZATION_NAME || 'ILX',
    description: process.env.APPLE_WALLET_DESCRIPTION || 'Digital Business Card',
    p12Password: process.env.APPLE_WALLET_P12_PASSWORD || '',
    wwdrCertPath: path.join(process.cwd(), 'certificates/apple-wallet/WWDR.cer'),
    passTypeIdCertPath: path.join(process.cwd(), 'certificates/apple-wallet/PassTypeID.cer'),
    signingKeyPath: path.join(process.cwd(), 'certificates/apple-wallet/WalletPassSigningKey.p12'),
  };

  // Validate configuration
  if (!config.passTypeId || !config.teamId || !config.p12Password) {
    throw new Error('Missing required Apple Wallet environment variables');
  }

  // Validate certificates
  if (!AppleWalletPassGenerator.validateCertificates(config)) {
    throw new Error('Missing required Apple Wallet certificates');
  }

  return new AppleWalletPassGenerator(config);
} 