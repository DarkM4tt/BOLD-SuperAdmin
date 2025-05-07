interface ImportMetaEnv {
  readonly VITE_API_RIDE_URL: string;
  readonly VITE_API_CHAT_URL: string;
  readonly VITE_API_ORG_URL: string;
  readonly VITE_API_AUTH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
