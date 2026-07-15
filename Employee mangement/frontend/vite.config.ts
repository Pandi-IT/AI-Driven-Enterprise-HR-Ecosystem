import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load backend environment variables to resolve the server port dynamically
  const backendEnv = loadEnv(mode, '../employee', '');
  const backendPort = backendEnv.SERVER_PORT || '8080';
  const backendUrl = `http://localhost:${backendPort}`;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        }
      }
    }
  };
});
