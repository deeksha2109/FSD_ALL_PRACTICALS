import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // 👈 Treat all .js files as JSX
    include: /src\/.*\.js$/, // 👈 Only apply to your source files
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // 👈 VERY IMPORTANT: Force esbuild to parse JSX in .js files
      },
    },
  },
})
