import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  base: "/", // Keep as root path
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    // Copy the .htaccess file to the build directory
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
});
