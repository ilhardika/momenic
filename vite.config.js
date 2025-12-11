import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  base: "/", // Keep as root path
  server: {
    proxy: {
      "/api": {
        target: "https://the.invisimple.id",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            // Add cookies from the original request
            const cookies =
              "wordpress_sec_bd5d0acaeeab268a8bb3afbd3f7602fe=ilhamhardika48%40gmail.com%7C1766664876%7CL0UmlhCvzoPT2BM1tm6mcoWSrD3ogBMoIsRjKRMqik7%7Cb23b9f9619d37decf5489c484b35b472d7d4258f62b3cb7f0652255b5ff6e523; PHPSESSID=37d4nglkp1asilcgoqiknu73mi; wordpress_logged_in_bd5d0acaeeab268a8bb3afbd3f7602fe=ilhamhardika48%40gmail.com%7C1766664876%7CL0UmlhCvzoPT2BM1tm6mcoWSrD3ogBMoIsRjKRMqik7%7Ce012fc96e7a4e2dc0c56546b8c940ebfa82312c9c4822f2739160fcbd5eab165";
            proxyReq.setHeader("Cookie", cookies);
          });
        },
      },
    },
  },
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
