export interface AppleWalletPassData {
  name: string;
  company: string;
  cardId: string;
  publicCardUrl: string;
}

export interface AppleWalletConfig {
  passTypeId: string;
  teamId: string;
  organizationName: string;
  description: string;
  p12Password: string;
  wwdrCertPath: string;
  passTypeIdCertPath: string;
  signingKeyPath: string;
}

export interface PassGenerationResult {
  success: boolean;
  passBuffer?: Buffer;
  error?: string;
}

export interface QRCodeData {
  url: string;
  format: 'PKBarcodeFormatQR';
  message: string;
  messageEncoding: 'iso-8859-1';
} 