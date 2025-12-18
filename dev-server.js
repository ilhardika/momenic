// Local Development Server with Auto-Login
// Run this with: node dev-server.js
// This provides the same auto-login functionality locally

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let cachedCookies = null;
let cachedNonce = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 60 * 10; // 10 hours

// Login credentials from environment
const EMAIL = process.env.INVISIMPLE_EMAIL || "ilhamhardika48@gmail.com";
const PASSWORD = process.env.INVISIMPLE_PASSWORD || "@Tuzaqyz5";

async function getLoginNonce() {
  const loginPageUrl = "https://the.invisimple.id/login";
  const response = await fetch(loginPageUrl);
  const html = await response.text();

  const nonceMatch = html.match(/__nonce[\s:="']+([a-f0-9]{10})/i);
  if (nonceMatch) {
    return nonceMatch[1];
  }

  // Fallback
  return process.env.INVISIMPLE_LOGIN_NONCE || "d6c22f171c";
}

async function loginAndGetNonce() {
  // Get fresh login nonce from login page
  const LOGIN_NONCE = await getLoginNonce();
  console.log("🔑 Using login nonce:", LOGIN_NONCE);

  // Step 1: Login with multipart form data
  const boundary = "----WebKitFormBoundary" + Math.random().toString(36);
  let body = "";

  const fields = {
    email: EMAIL,
    password: PASSWORD,
    name: "login",
    action: "run_wds",
    __nonce: LOGIN_NONCE,
  };

  for (const [name, value] of Object.entries(fields)) {
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="${name}"\r\n\r\n`;
    body += `${value}\r\n`;
  }
  body += `--${boundary}--\r\n`;

  const loginResponse = await fetch(
    "https://the.invisimple.id/wp-admin/admin-ajax.php",
    {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: body,
      redirect: "manual",
    }
  );

  // Extract cookies
  const setCookieHeaders = loginResponse.headers.raw()["set-cookie"] || [];
  const cookies = setCookieHeaders
    .map((cookie) => cookie.split(";")[0])
    .join("; ");

  if (!cookies) {
    throw new Error("Login failed: No cookies received");
  }

  // Step 2: Get dashboard page to extract nonce
  const dashboardResponse = await fetch(
    "https://the.invisimple.id/dashboard/invitation/create/",
    {
      headers: {
        Cookie: cookies,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }
  );

  const dashboardHtml = await dashboardResponse.text();

  // Extract nonce from HTML
  const nonceMatch =
    dashboardHtml.match(/__nonce["\s:=]+([a-f0-9]{10})/i) ||
    dashboardHtml.match(/nonce["\s:=]+([a-f0-9]{10})/i);

  const extractedNonce = nonceMatch ? nonceMatch[1] : LOGIN_NONCE;

  console.log("✅ Nonce extracted:", extractedNonce);

  return { cookies, nonce: extractedNonce };
}

// API endpoint
app.post("/api/themes", async (req, res) => {
  try {
    const API_URL = "https://the.invisimple.id/wp-admin/admin-ajax.php";

    // Check if we need to refresh login
    const now = Date.now();
    if (
      !cachedCookies ||
      !cacheTimestamp ||
      now - cacheTimestamp > CACHE_DURATION
    ) {
      const auth = await loginAndGetNonce();
      cachedCookies = auth.cookies;
      cachedNonce = auth.nonce;
      cacheTimestamp = now;
    }

    // Build form data
    const formData = new URLSearchParams({
      name: "invitation_get_theme",
      action: "run_wds",
      __nonce: cachedNonce,
      category: req.body?.category || "",
      subcategory: req.body?.subcategory || "",
      subtheme: req.body?.subtheme || "",
    });

    console.log("📤 [dev-server] Request to invisimple:", {
      url: API_URL,
      nonce: cachedNonce,
      formData: formData.toString(),
    });

    // Forward request
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Cookie: cachedCookies,
      },
      body: formData.toString(),
    });

    console.log("📥 [dev-server] Response status:", response.status);

    const data = await response.json();

    // Log raw response for debugging
    console.log(
      "📦 [dev-server] Raw API Response:",
      JSON.stringify(data).substring(0, 500)
    );
    console.log("📦 [dev-server] Full data keys:", Object.keys(data));
    console.log("📦 [dev-server] Data.success:", data.success);
    console.log(
      "📦 [dev-server] Data.data type:",
      typeof data.data,
      Array.isArray(data.data)
    );

    // If data is directly an array (not wrapped in {data: []})
    if (Array.isArray(data)) {
      console.log(
        "✅ [dev-server] Direct array response:",
        data.length,
        "items"
      );
      return res.json(data);
    }

    // Check for nonce expired error
    if (
      data.success === false &&
      (data.data?.includes("Nonce") || data.data?.includes("nonce"))
    ) {
      console.log("⚠️ Nonce expired, re-logging in...");

      // Re-login and retry
      const auth = await loginAndGetNonce();
      cachedCookies = auth.cookies;
      cachedNonce = auth.nonce;
      cacheTimestamp = Date.now();

      formData.set("__nonce", cachedNonce);
      const retryResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Cookie: cachedCookies,
        },
        body: formData.toString(),
      });

      const retryData = await retryResponse.json();
      console.log("✅ [dev-server] Retry Response:", {
        success: retryData.success,
        dataType: typeof retryData.data,
        isArray: Array.isArray(retryData.data),
        itemCount: Array.isArray(retryData.data) ? retryData.data.length : 0,
      });
      return res.json(retryData);
    }

    console.log("✅ [dev-server] API Response:", {
      success: data.success,
      dataType: typeof data.data,
      isArray: Array.isArray(data.data),
      itemCount: Array.isArray(data.data) ? data.data.length : 0,
      sampleItem: data.data?.[0],
    });

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `\n🚀 Development API server running on http://localhost:${PORT}`
  );
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/themes\n`);
});
