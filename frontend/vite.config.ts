import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import packageJson from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_NAME__: JSON.stringify(packageJson.name),
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __AUTHOR_NAME__: JSON.stringify(packageJson.author.name),
  },
})
