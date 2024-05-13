import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

import tsconfigPaths from 'vite-tsconfig-paths'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    optimizeDeps: { exclude: [] },
    define: {
      __APP_ENV__: env.APP_ENV,
      APP_VERSION: JSON.stringify(process.env.npm_package_version)
    },
    build: {
      minify: 'terser',
      outDir: 'build',
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          }
        }
      }
    },
    server: {
      watch: {
        usePolling: true
      },
      host: true,
      strictPort: true,
      port: 8000,
      proxy: {
        '/api': env.PROXY_URL
      }
    },
    plugins: [react(), svgr(), legacy(), tsconfigPaths()]
  }
})
