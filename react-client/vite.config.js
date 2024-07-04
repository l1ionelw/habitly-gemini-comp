import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import {fileURLToPath} from "url";

// https://vitejs.dev/config/
console.log(__dirname);
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
})
