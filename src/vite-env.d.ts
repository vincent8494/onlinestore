/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Type declarations for Vite and its plugins
declare module '@vitejs/plugin-react-swc' {
  import { Plugin } from 'vite';
  function reactSwc(options?: {
    tsDecorators?: boolean;
    devTarget?: string;
  }): Plugin;
  export default reactSwc;
}
