import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {},
    extensions: [".js", ".jsx"],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://momenic.webinvit.id",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        headers: {
          Accept: "text/html",
          "User-Agent": "Mozilla/5.0",
        },
      },
    },
  },
});
