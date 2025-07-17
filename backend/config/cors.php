<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    
    // Mengizinkan semua origin untuk kemudahan development
    'allowed_origins' => ['*'], 

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
