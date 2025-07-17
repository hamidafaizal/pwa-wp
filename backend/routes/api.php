<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\MessageController;

// Route untuk Device
Route::post('/register-device', [DeviceController::class, 'register']);

// Route untuk Pesan
Route::prefix('messages')->group(function () {
    Route::get('/', [MessageController::class, 'index']);
    Route::post('/', [MessageController::class, 'store']);
    Route::delete('/all', [MessageController::class, 'destroyAll']); // URL diubah agar lebih spesifik
    Route::delete('/{id}', [MessageController::class, 'destroy']);
});
