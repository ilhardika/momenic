import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Run after npm run build
console.log("Preparing build for cPanel deployment...");

// Copy .htaccess to dist folder
try {
  fs.copyFileSync(
    path.resolve(__dirname, ".htaccess"),
    path.resolve(__dirname, "dist", ".htaccess")
  );
  console.log("✅ .htaccess file copied to dist folder");
} catch (err) {
  console.error("❌ Failed to copy .htaccess file:", err);
}

console.log("Build ready for cPanel deployment!");
console.log(
  "Upload the entire contents of the dist folder to your cPanel public_html directory"
);
