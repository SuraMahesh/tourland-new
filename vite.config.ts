import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from "vite-sitemap";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  sitemap({
    base: "https://modotravels.com",
    urls: [
      "/",
      "/destinations",
      "/seasons",
      "/activities",
      "/planner",
      "/contact"
    ],
  }),
  ],
})
