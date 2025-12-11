<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Cấu hình để React (localhost:5173) có thể gửi Cookie đến Laravel
    | 
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:8000', 'http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // QUAN TRỌNG: Cho phép gửi Cookie từ React
    'supports_credentials' => true,

];

