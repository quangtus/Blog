<?php

use Illuminate\Support\Facades\Route;

// Catch-all route cho React SPA
// Tất cả các route sẽ được xử lý bởi React Router
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');

