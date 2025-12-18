<?php
/**
 * API Debug Script
 * Upload this to your cPanel and access it directly to debug API issues
 * URL: https://momenic.web.id/api/debug.php
 */

header('Content-Type: application/json');

$debug = [
    'timestamp' => date('Y-m-d H:i:s'),
    'checks' => []
];

// Check 1: PHP Version
$debug['checks']['php_version'] = [
    'value' => PHP_VERSION,
    'status' => version_compare(PHP_VERSION, '7.4.0', '>=') ? '✅ OK' : '❌ Too old (need 7.4+)'
];

// Check 2: cURL Extension
$debug['checks']['curl_enabled'] = [
    'value' => function_exists('curl_init'),
    'status' => function_exists('curl_init') ? '✅ OK' : '❌ Not installed'
];

// Check 3: Config file exists
$configPath = __DIR__ . '/config.php';
$debug['checks']['config_file'] = [
    'path' => $configPath,
    'exists' => file_exists($configPath),
    'status' => file_exists($configPath) ? '✅ OK' : '❌ Missing - Create this file!'
];

// Check 4: If config exists, check if constants are defined
if (file_exists($configPath)) {
    require_once $configPath;
    
    $debug['checks']['credentials'] = [
        'INVISIMPLE_EMAIL' => defined('INVISIMPLE_EMAIL') ? '✅ Defined' : '❌ Not defined',
        'INVISIMPLE_PASSWORD' => defined('INVISIMPLE_PASSWORD') ? '✅ Defined' : '❌ Not defined',
        'INVISIMPLE_LOGIN_NONCE' => defined('INVISIMPLE_LOGIN_NONCE') ? '✅ Defined (optional)' : 'ℹ️ Not defined (will auto-extract)',
    ];
    
    // Test auto-extract login nonce
    if (function_exists('curl_init')) {
        try {
            $loginPageUrl = 'https://the.invisimple.id/login';
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $loginPageUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_HTTPHEADER => ['User-Agent: Mozilla/5.0'],
            ]);
            $html = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            $nonceFound = preg_match('/__nonce["\'\s:=]+([a-f0-9]{10})/i', $html, $match);
            
            $debug['checks']['auto_nonce_extraction'] = [
                'login_page_accessible' => $httpCode === 200 ? '✅ OK' : '❌ Failed',
                'nonce_found' => $nonceFound ? '✅ Found' : '❌ Not found',
                'extracted_nonce' => $nonceFound ? $match[1] : null,
                'status' => $nonceFound ? '✅ Auto-extraction working' : '❌ May need manual nonce'
            ];
        } catch (Exception $e) {
            $debug['checks']['auto_nonce_extraction'] = [
                'status' => '❌ Error: ' . $e->getMessage()
            ];
        }
    }
}

// Check 5: File permissions
$debug['checks']['permissions'] = [
    'api_folder' => substr(sprintf('%o', fileperms(__DIR__)), -3),
    'themes_php' => file_exists(__DIR__ . '/themes.php') ? substr(sprintf('%o', fileperms(__DIR__ . '/themes.php')), -3) : 'Not found',
    'config_php' => file_exists($configPath) ? substr(sprintf('%o', fileperms($configPath)), -3) : 'Not found',
];

// Check 6: Test JSON input parsing
$debug['checks']['json_input'] = [
    'raw_input' => file_get_contents('php://input'),
    'parsed' => json_decode(file_get_contents('php://input'), true),
    'json_error' => json_last_error_msg(),
];

// Check 7: Request info
$debug['request'] = [
    'method' => $_SERVER['REQUEST_METHOD'],
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Not set',
    'request_uri' => $_SERVER['REQUEST_URI'],
    'query_string' => $_SERVER['QUERY_STRING'] ?? '',
];

// Check 8: Server info
$debug['server'] = [
    'software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'script_filename' => __FILE__,
];

// Check 9: Error log
if (file_exists($configPath)) {
    $debug['checks']['can_write_cache'] = [
        'cache_path' => __DIR__ . '/.session_cache',
        'writable' => is_writable(__DIR__),
        'status' => is_writable(__DIR__) ? '✅ OK' : '❌ Cannot write cache file'
    ];
}

// Summary
$allOK = true;
if (!version_compare(PHP_VERSION, '7.4.0', '>=')) $allOK = false;
if (!function_exists('curl_init')) $allOK = false;
if (!file_exists($configPath)) $allOK = false;

$debug['summary'] = [
    'ready_for_production' => $allOK,
    'status' => $allOK ? '✅ All checks passed' : '❌ Some checks failed',
    'next_steps' => $allOK 
        ? 'API is ready. Test with: curl -X POST https://momenic.web.id/api/themes.php -H "Content-Type: application/json" -d \'{"category":"","subcategory":"","subtheme":""}\''
        : 'Fix the issues marked with ❌ above'
];

echo json_encode($debug, JSON_PRETTY_PRINT);
