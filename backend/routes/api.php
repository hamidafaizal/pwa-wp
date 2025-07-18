<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\MessageController;

// Route untuk Device
Route::get('/devices', [DeviceController::class, 'index']);
Route::post('/register-device', [DeviceController::class, 'register']);
Route::delete('/devices/{id}', [DeviceController::class, 'destroy']);
Route::get('/devices/status/{uuid}', [DeviceController::class, 'checkStatus']); // Route baru

// Route untuk Pesan
Route::prefix('messages')->group(function () {
    Route::get('/', [MessageController::class, 'index']);
    Route::post('/', [MessageController::class, 'store']);
    Route::delete('/all', [MessageController::class, 'destroyAll']);
    Route::delete('/{id}', [MessageController::class, 'destroy']);
});
