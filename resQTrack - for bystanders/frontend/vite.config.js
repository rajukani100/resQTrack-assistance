import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: "/",  // Ensure correct asset paths for deployment
  build: {
    outDir: "dist",  // Default Vite output folder
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
});
