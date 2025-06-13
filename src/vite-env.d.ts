/// <reference types="vite/client" />

// Type declarations for Vite and its plugins
declare module '@vitejs/plugin-react-swc' {
  import { Plugin } from 'vite';
  function reactSwc(options?: {
    tsDecorators?: boolean;
    devTarget?: string;
  }): Plugin;
  export default reactSwc;
}
