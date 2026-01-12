interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_API_URL: string;
  readonly AUTH0_EMAIL: string;
  readonly AUTH0_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
