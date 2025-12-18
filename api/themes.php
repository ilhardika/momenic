<?php
/**
 * PHP API Proxy for cPanel/Shared Hosting with Auto-Login
 * This handles API requests when deployed on shared hosting
 * Automatically logs in to get fresh nonce when needed
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Load configuration
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Configuration file not found. Please create api/config.php'
    ]);
    exit();
}

require_once $configFile;

// Check if credentials are configured
if (!defined('INVISIMPLE_EMAIL') || !defined('INVISIMPLE_PASSWORD')) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Email and password not configured in config.php'
    ]);
    exit();
}

// Session cache file
$cacheFile = __DIR__ . '/.session_cache';
$cacheDuration = 60 * 60 * 10; // 10 hours

/**
 * Get login nonce from login page
 */
function getLoginNonce() {
    $loginPageUrl = 'https://the.invisimple.id/login';
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $loginPageUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_HTTPHEADER => [
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ],
    ]);
    
    $html = curl_exec($ch);
    curl_close($ch);
    
    // Extract nonce from login page HTML
    if (preg_match('/__nonce["\'\s:=]+([a-f0-9]{10})/i', $html, $match)) {
        return $match[1];
    }
    
    // Fallback: try to find any 10-char hex string that looks like a nonce
    if (preg_match('/nonce["\'\s:=]+([a-f0-9]{10})/i', $html, $match)) {
        return $match[1];
    }
    
    // If defined in config, use it as fallback
    if (defined('INVISIMPLE_LOGIN_NONCE')) {
        return INVISIMPLE_LOGIN_NONCE;
    }
    
    throw new Exception('Could not extract login nonce from login page');
}

/**
 * Login and get authenticated session
 */
function loginAndGetSession() {
    // Get fresh login nonce
    $loginNonce = getLoginNonce();
    
    $loginUrl = 'https://the.invisimple.id/wp-admin/admin-ajax.php';
    
    // Prepare multipart form data for login
    $boundary = '----WebKitFormBoundary' . md5(time());
    $postData = '';
    
    $fields = [
        'email' => INVISIMPLE_EMAIL,
        'password' => INVISIMPLE_PASSWORD,
        'name' => 'login',
        'action' => 'run_wds',
        '__nonce' => $loginNonce,
    ];
    
    foreach ($fields as $name => $value) {
        $postData .= "--{$boundary}\r\n";
        $postData .= "Content-Disposition: form-data; name=\"{$name}\"\r\n\r\n";
        $postData .= "{$value}\r\n";
    }
    $postData .= "--{$boundary}--\r\n";
    
    // Login request
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $loginUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $postData,
        CURLOPT_HTTPHEADER => [
            "Content-Type: multipart/form-data; boundary={$boundary}",
            'Accept: */*',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ],
        CURLOPT_HEADER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    
    $response = curl_exec($ch);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $headerSize);
    curl_close($ch);
    
    // Extract cookies from Set-Cookie headers
    preg_match_all('/Set-Cookie:\s*([^;]+)/i', $headers, $matches);
    $cookies = implode('; ', $matches[1]);
    
    if (empty($cookies)) {
        throw new Exception('Login failed: No cookies received');
    }
    
    // Get dashboard page to extract nonce from HTML
    $dashboardUrl = 'https://the.invisimple.id/dashboard/invitation/create/';
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $dashboardUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Cookie: {$cookies}",
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ],
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    
    $dashboardHtml = curl_exec($ch);
    curl_close($ch);
    
    // Try to extract nonce from HTML
    if (preg_match('/__nonce[\s:="\']+([a-f0-9]{10})/i', $dashboardHtml, $match)) {
        $nonce = $match[1];
    } else if (preg_match('/nonce[\s:="\']+([a-f0-9]{10})/i', $dashboardHtml, $match)) {
        $nonce = $match[1];
    } else {
        // Fallback: use login nonce
        $nonce = INVISIMPLE_LOGIN_NONCE;
    }
    
    return [
        'cookies' => $cookies,
        'nonce' => $nonce,
        'timestamp' => time(),
    ];
}

/**
 * Get cached session or login if needed
 */
function getAuthSession() {
    global $cacheFile, $cacheDuration;
    
    // Check cache
    if (file_exists($cacheFile)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if ($cached && (time() - $cached['timestamp']) < $cacheDuration) {
            return $cached;
        }
    }
    
    // Login and cache
    $session = loginAndGetSession();
    file_put_contents($cacheFile, json_encode($session));
    chmod($cacheFile, 0600); // Secure file permissions
    
    return $session;
}

try {
    $API_URL = 'https://the.invisimple.id/wp-admin/admin-ajax.php';
    
    // Get authenticated session
    $session = getAuthSession();
    
    // Get request body
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    
    // Log for debugging (optional - remove in production)
    // error_log("Raw input: " . $rawInput);
    // error_log("Parsed input: " . print_r($input, true));
    
    // Handle both JSON and empty body
    if ($input === null && !empty($rawInput)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON in request body',
            'debug' => [
                'json_error' => json_last_error_msg(),
                'raw_input_length' => strlen($rawInput)
            ]
        ]);
        exit();
    }
    
    // If input is null or empty, use empty array
    if (!is_array($input)) {
        $input = [];
    }
    
    // Build form data
    $postData = http_build_query([
        'name' => 'invitation_get_theme',
        'action' => 'run_wds',
        '__nonce' => $session['nonce'],
        'category' => $input['category'] ?? '',
        'subcategory' => $input['subcategory'] ?? '',
        'subtheme' => $input['subtheme'] ?? '',
    ]);
    
    // Initialize cURL with authenticated session
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $API_URL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $postData,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
            'Accept: application/json, text/javascript, */*; q=0.01',
            'X-Requested-With: XMLHttpRequest',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Cookie: ' . $session['cookies'],
        ],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    
    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("cURL error: $error");
    }
    
    if ($httpCode !== 200) {
        throw new Exception("HTTP error! status: $httpCode");
    }
    
    $data = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON response");
    }
    
    // Check for API errors - if nonce expired, refresh session and retry
    if (isset($data['success']) && $data['success'] === false) {
        $errorMsg = $data['data'] ?? '';
        if (strpos($errorMsg, 'Nonce') !== false || strpos($errorMsg, 'nonce') !== false) {
            // Nonce expired, delete cache and retry
            if (file_exists($cacheFile)) {
                unlink($cacheFile);
            }
            
            // Get fresh session
            $session = getAuthSession();
            
            // Retry request
            $postData = http_build_query([
                'name' => 'invitation_get_theme',
                'action' => 'run_wds',
                '__nonce' => $session['nonce'],
                'category' => $input['category'] ?? '',
                'subcategory' => $input['subcategory'] ?? '',
                'subtheme' => $input['subtheme'] ?? '',
            ]);
            
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $API_URL,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $postData,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept: application/json, text/javascript, */*; q=0.01',
                    'X-Requested-With: XMLHttpRequest',
                    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Cookie: ' . $session['cookies'],
                ],
                CURLOPT_TIMEOUT => 30,
                CURLOPT_SSL_VERIFYPEER => true,
            ]);
            
            $response = curl_exec($ch);
            $data = json_decode($response, true);
            curl_close($ch);
        }
        
        if (isset($data['success']) && $data['success'] === false) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $data['data'] ?? 'API request failed',
            ]);
            exit();
        }
    }
    
    // Return successful response
    http_response_code(200);
    echo json_encode($data);
    
} catch (Exception $e) {
    error_log('Error in themes API: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
