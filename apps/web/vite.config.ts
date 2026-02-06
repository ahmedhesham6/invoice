import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    port: 3001,
    proxy: {
      // Proxy auth requests to Convex
      '/api/auth': {
        target: 'http://127.0.0.1:3211',
        changeOrigin: true,
        // Preserve cookies
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  ssr: {
    noExternal: ['@convex-dev/better-auth'],
  },
});
