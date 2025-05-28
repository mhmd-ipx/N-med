import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


export default defineConfig({
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://app.webu.ir/public',
        changeOrigin: true,
        secure: false, // برای HTTPS غیرمعتبر در توسعه
        rewrite: (path) => path.replace(/^\/api/, ''), // حذف پیشوند /api
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
