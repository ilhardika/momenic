// Vercel Serverless Function with Auto-Login
// This handles API requests for Vercel deployment
// Automatically logs in to get fresh nonce when needed

let cachedCookies = null;
let cachedNonce = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 60 * 10; // 10 hours

async function loginAndGetNonce() {
  const email = process.env.INVISIMPLE_EMAIL;
  const password = process.env.INVISIMPLE_PASSWORD;
  const loginNonce = process.env.INVISIMPLE_LOGIN_NONCE || "d6c22f171c";

  if (!email || !password) {
    throw new Error("INVISIMPLE_EMAIL and INVISIMPLE_PASSWORD must be set");
  }

  // Step 1: Login with multipart form data
  const boundary = "----WebKitFormBoundary" + Math.random().toString(36);
  let body = "";

  const fields = {
    email: email,
    password: password,
    name: "login",
    action: "run_wds",
    __nonce: loginNonce,
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
      body: body,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }
  );

  // Extract cookies from Set-Cookie headers
  const setCookieHeaders = loginResponse.headers.getSetCookie?.() || [];
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

  // Extract nonce from HTML (common patterns)
  const nonceMatch =
    dashboardHtml.match(/__nonce["\s:=]+([a-f0-9]{10})/i) ||
    dashboardHtml.match(/nonce["\s:=]+([a-f0-9]{10})/i);

  let extractedNonce = nonceMatch ? nonceMatch[1] : loginNonce;

  if (!extractedNonce) {
    console.log(
      "Could not extract nonce from HTML, using login nonce as fallback"
    );
    extractedNonce = loginNonce;
  }

  return { cookies, nonce: extractedNonce };
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const API_URL = "https://the.invisimple.id/wp-admin/admin-ajax.php";

    // Check if we need to refresh login (cache expired or not exists)
    const now = Date.now();
    if (
      !cachedCookies ||
      !cacheTimestamp ||
      now - cacheTimestamp > CACHE_DURATION
    ) {
      console.log("Logging in to get fresh session...");
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

    // Forward request to invisimple with authenticated session
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check for API errors - if nonce expired, try login again
    if (
      data.success === false &&
      (data.data?.includes("Nonce") || data.data?.includes("nonce"))
    ) {
      console.log("Nonce expired, re-logging in...");
      const auth = await loginAndGetNonce();
      cachedCookies = auth.cookies;
      cachedNonce = auth.nonce;
      cacheTimestamp = Date.now();

      // Retry request with new nonce
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

      if (retryData.success === false) {
        console.error("API Error after retry:", retryData);
        return res.status(400).json({
          success: false,
          error: retryData.data || "API request failed after retry",
        });
      }

      return res.status(200).json(retryData);
    }

    if (data.success === false) {
      console.error("API Error:", data);
      return res.status(400).json({
        success: false,
        error: data.data || "API request failed",
      });
    }

    // Return successful response
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in themes API:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
