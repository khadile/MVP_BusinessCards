# Add to Apple Wallet (.pkpass) Feature Specification

## Overview
Enable iOS users to add their digital business card to Apple Wallet. The Wallet pass will display the user's Name, Company, and a large QR code linking to their public card view.

---

## User Story
- As a user, I want to add my digital business card to my Apple Wallet.
- The Wallet pass should display my **Name**, **Company**, and a **large QR code** that links to my public card view.

---

## Technical Overview

### What is a .pkpass?
- A `.pkpass` is a file format for Apple Wallet passes.
- It is a signed JSON package containing pass data, images, and a manifest.
- Must be generated and signed server-side using an Apple-issued certificate.

### Key Requirements
- **Frontend:**
  - Add an "Add to Apple Wallet" button (using the official badge).
  - On click, call a backend endpoint to generate and download the `.pkpass` file.
- **Backend:**
  - Generate a `.pkpass` file on demand, using the user’s Name, Company, and a QR code (linking to their public card).
  - Sign the pass with an Apple-issued certificate (required for Wallet compatibility).
  - Serve the `.pkpass` file for download (Content-Type: `application/vnd.apple.pkpass`).
- **QR Code:**
  - QR code should link to the user’s public card view (e.g., `/card/{id}`).
- **Security:**
  - Only allow authenticated users to generate passes for their own cards.
  - Store Apple Wallet certificates securely (environment variables or secret manager).

---

## Implementation Plan

### 1. Backend: pkpass Generation Endpoint
- Use a Node.js library like [`passkit-generator`](https://www.npmjs.com/package/passkit-generator) or [`node-passbook`](https://www.npmjs.com/package/node-passbook).
- Endpoint: `POST /api/wallet-pass`
  - Input: Card ID (or use authenticated user’s active card)
  - Output: `.pkpass` file
- Generate pass with:
  - **Primary fields:** Name, Company
  - **Barcode:** QR code with public card URL
  - **Branding:** Your logo/colors if desired

### 2. Frontend: Add to Wallet Button
- Show the "Add to Apple Wallet" button for iOS users (feature-detect or always show).
- On click, call the backend endpoint and trigger the download of the `.pkpass` file.

### 3. QR Code
- Use a QR code library (e.g., `qrcode`) to generate the QR code for the pass.

### 4. Certificates
- Register with Apple Developer, create a Pass Type ID, and download the certificate for signing passes.
- Store certificates securely and reference them in backend code.

---

## Example Pass Layout
- **Front:**
  - Name (large)
  - Company (smaller)
  - QR code (centered, large)
- **Back:**
  - Optionally, a link or more info

---

## Integration Notes
- Use existing card data (Name, Company, Card ID) from Zustand stores.
- Ensure only authenticated users can generate passes for their own cards.
- Consider rate limiting or abuse prevention for the endpoint.

---

## References
- [Apple Wallet Passes Documentation](https://developer.apple.com/wallet/)
- [passkit-generator (npm)](https://www.npmjs.com/package/passkit-generator)
- [node-passbook (npm)](https://www.npmjs.com/package/node-passbook)

---

## Status
- **Planned for Phase 2+**
- Not yet implemented. This document serves as a blueprint for future development. 