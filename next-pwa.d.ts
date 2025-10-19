declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
      };
    }>;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    publicExcludes?: string[];
    buildExcludes?: Array<string | RegExp>;
  }

  function withPWA(pwaConfig: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
