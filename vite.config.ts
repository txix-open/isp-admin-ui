import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      __APP_ENV__: env.APP_ENV,
      APP_VERSION: JSON.stringify(process.env.npm_package_version)
    },
    build: {
      minify: 'terser',
      outDir: 'build',
      sourcemap: false,
      chunkSizeWarningLimit: 200,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            return 'vendor'
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
      port: 8070,
      proxy: {
        '/api': 'https://land.mos.ru/'
      }
    },
    plugins: [react(), svgr(), tsconfigPaths(), splitVendorChunkPlugin()],
    resolve: {
      alias: {
        '@styles': path.resolve(__dirname, './src/styles')
      }
    }
  }
})
