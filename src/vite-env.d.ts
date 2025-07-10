/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPLE_WALLET_TEAM_ID: string
  readonly VITE_APPLE_WALLET_PASS_TYPE_ID: string
  readonly VITE_APPLE_WALLET_KEY_PASSWORD: string
  readonly VITE_MASTER_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 