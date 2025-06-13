import 'react-router-dom';

declare module 'react-router-dom' {
  interface FutureConfig {
    v7_startTransition?: boolean;
    v7_normalizeFormMethod?: boolean;
    v7_relativeSplatPath?: boolean;
    v7_prependBasename?: boolean;
  }

  interface RouterOptions {
    future?: FutureConfig;
  }
}
