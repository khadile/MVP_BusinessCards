import QRCode from 'qrcode';

export interface AppleWalletPassData {
  name: string;
  company: string;
  jobTitle: string;
  cardId: string;
  userId: string;
  publicCardUrl: string;
}

export interface AppleWalletConfig {
  teamId?: string;
  passTypeId?: string;
  keyPassword?: string;
}

export class AppleWalletService {
  private static instance: AppleWalletService;
  
  private constructor() {}
  
  public static getInstance(): AppleWalletService {
    if (!AppleWalletService.instance) {
      AppleWalletService.instance = new AppleWalletService();
    }
    return AppleWalletService.instance;
  }

  /**
   * Gets Apple Wallet configuration from environment variables
   */
  public getConfiguration(): AppleWalletConfig {
    return {
      teamId: import.meta.env.VITE_APPLE_WALLET_TEAM_ID,
      passTypeId: import.meta.env.VITE_APPLE_WALLET_PASS_TYPE_ID,
      keyPassword: import.meta.env.VITE_APPLE_WALLET_KEY_PASSWORD,
    };
  }

  /**
   * Validates that all required Apple Wallet configuration is present
   */
  public validateConfiguration(): { isValid: boolean; missingFields: string[] } {
    const config = this.getConfiguration();
    const requiredFields = [
      { key: 'teamId', value: config.teamId },
      { key: 'passTypeId', value: config.passTypeId },
      { key: 'keyPassword', value: config.keyPassword },
    ];

    const missingFields = requiredFields
      .filter(field => !field.value)
      .map(field => field.key);

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Generates a QR code as a base64 data URL
   */
  public async generateQRCode(url: string): Promise<string> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Prepares pass data for backend generation
   */
  public async preparePassData(passData: AppleWalletPassData): Promise<{
    passData: AppleWalletPassData;
    qrCodeDataUrl: string;
    passTemplate: any;
  }> {
    // Validate configuration
    const { isValid, missingFields } = this.validateConfiguration();
    if (!isValid) {
      throw new Error(`Apple Wallet configuration missing: ${missingFields.join(', ')}`);
    }

    try {
      // Generate QR code
      const qrCodeDataUrl = await this.generateQRCode(passData.publicCardUrl);
      
      // Create pass template
      const passTemplate = {
        formatVersion: 1,
        passTypeIdentifier: this.getConfiguration().passTypeId,
        serialNumber: `${passData.userId}-${passData.cardId}-${Date.now()}`,
        teamIdentifier: this.getConfiguration().teamId,
        organizationName: 'ILX Digital Business Cards',
        description: `${passData.name} - Digital Business Card`,
        logoText: 'ILX',
        backgroundColor: 'rgb(255, 255, 255)',
        foregroundColor: 'rgb(0, 0, 0)',
        labelColor: 'rgb(102, 102, 102)',
        
        // Pass structure - using generic pass type
        generic: {
          primaryFields: [
            {
              key: 'name',
              label: 'Name',
              value: passData.name,
              textAlignment: 'PKTextAlignmentCenter'
            }
          ],
          secondaryFields: [
            {
              key: 'company',
              label: 'Company',
              value: passData.company,
              textAlignment: 'PKTextAlignmentCenter'
            }
          ],
          auxiliaryFields: [
            {
              key: 'website',
              label: 'View Full Card',
              value: 'Tap QR Code',
              textAlignment: 'PKTextAlignmentCenter'
            }
          ]
        },

        // Barcode (QR code)
        barcodes: [
          {
            message: passData.publicCardUrl,
            format: 'PKBarcodeFormatQR',
            messageEncoding: 'iso-8859-1',
            altText: 'Scan to view digital business card'
          }
        ],

        // Relevance and behavior
        relevantDate: new Date().toISOString(),
        maxDistance: 100,
        
        // Web service (optional - for pass updates)
        webServiceURL: window.location.origin,
        authenticationToken: passData.cardId
      };

      return {
        passData,
        qrCodeDataUrl,
        passTemplate
      };
    } catch (error) {
      console.error('Error preparing Apple Wallet pass data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to prepare Apple Wallet pass data: ${errorMessage}`);
    }
  }

  /**
   * Downloads a .pkpass file from the backend
   */
  public async downloadPass(passData: AppleWalletPassData): Promise<void> {
    try {
      console.log('🔥 Frontend: Starting Apple Wallet pass download');
      console.log('🔥 Frontend: Pass data:', passData);
      
      // For iOS devices, we need to navigate directly to the .pkpass URL
      // instead of downloading it, so iOS can handle it properly
      const isIOS = AppleWalletService.isIOSDevice();
      console.log('🔥 Frontend: iOS device detected:', isIOS);
      
      if (isIOS) {
        // For iOS: Create a direct link to the Firebase Function with pass data as query params
        const params = new URLSearchParams({
          name: passData.name,
          company: passData.company,
          jobTitle: passData.jobTitle,
          cardId: passData.cardId,
          userId: passData.userId,
          publicCardUrl: passData.publicCardUrl
        });
        
        const passUrl = `https://us-central1-aircardapp1.cloudfunctions.net/generateAppleWalletPass?${params.toString()}`;
        console.log('🔥 Frontend: Opening pass URL for iOS Safari:', passUrl);
        
        // For iOS: Navigate directly to the pass URL
        window.location.href = passUrl;
        
        console.log('🔥 Frontend: Safari navigation triggered for iOS');
        return;
      }
      
      // For non-iOS devices: Use the download approach
      console.log('🔥 Frontend: Using download approach for non-iOS device');
      
      // Call Firebase Function to generate the .pkpass file
      const response = await fetch('https://us-central1-aircardapp1.cloudfunctions.net/generateAppleWalletPass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: passData.name,
          company: passData.company,
          jobTitle: passData.jobTitle,
          cardId: passData.cardId,
          userId: passData.userId,
          publicCardUrl: passData.publicCardUrl
        })
      });
      
      console.log('🔥 Frontend: Response status:', response.status);
      console.log('🔥 Frontend: Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔥 Frontend: Error response body:', errorText);
        throw new Error(`Failed to generate pass: ${response.status} ${response.statusText}`);
      }

      // Get the .pkpass file as a blob
      const blob = await response.blob();
      console.log('🔥 Frontend: Blob size:', blob.size, 'bytes');
      console.log('🔥 Frontend: Blob type:', blob.type);
      
      // Create download link for the .pkpass file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${passData.name.replace(/\s+/g, '_')}_BusinessCard.pkpass`;
      
      console.log('🔥 Frontend: Triggering download...');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      console.log('🔥 Frontend: Download completed successfully');
      
    } catch (error) {
      console.error('Error downloading Apple Wallet pass:', error);
      throw error;
    }
  }

  /**
   * Checks if the current device is iOS
   */
  public static isIOSDevice(): boolean {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Primary check: User agent for iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    
    // Secondary check: Platform API (more reliable on newer devices)
    const isIOSPlatform = /iPad|iPhone|iPod/.test(platform);
    
    // Tertiary check: WebKit on mobile (but not Android)
    const isIOSWebKit = /WebKit/.test(userAgent) && /Mobile/.test(userAgent) && !/Android/.test(userAgent);
    
    const result = isIOS || isIOSPlatform || isIOSWebKit;
    
    // Log for debugging on your iPhone
    if (result) {
      console.log('✅ iOS device detected');
    } else {
      console.log('❌ Not iOS device detected');
    }
    
    return result;
  }

  /**
   * Checks if the current device supports Apple Wallet
   */
  public static supportsAppleWallet(): boolean {
    return this.isIOSDevice();
  }

  /**
   * Checks if Apple Wallet configuration is available
   */
  public isConfigured(): boolean {
    return this.validateConfiguration().isValid;
  }
}

export default AppleWalletService; 