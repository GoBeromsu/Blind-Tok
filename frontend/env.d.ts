interface ImportMetaEnv {
  readonly VITE_STORAGE_SECRET_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_OAUTH_REDIRECTURI: string;
  readonly VITE_GOOGLE_OAUTH_REDIRECTPATH: string;
  readonly VITE_GOOGLE_OAUTH_SECRET: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
