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
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
      "/portofolio": {
        target: "https://momenic.webinvit.id",
        changeOrigin: true,
        cors: true,
        secure: false,
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
    },
  },
});
