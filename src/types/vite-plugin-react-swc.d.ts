declare module '@vitejs/plugin-react-swc' {
  import { Plugin } from 'vite';
  
  interface ReactSwcOptions {
    /**
     * Enable TypeScript decorators. Requires experimentalDecorators
     * in tsconfig to be enabled.
     */
    tsDecorators?: boolean;
    /**
     * Target ES version to transform JSX to.
     * @default 'es2020'
     */
    devTarget?: string;
  }

  /**
   * A plugin to use SWC for React fast refresh
   */
  function reactSwc(options?: ReactSwcOptions): Plugin;
  
  export default reactSwc;
}
