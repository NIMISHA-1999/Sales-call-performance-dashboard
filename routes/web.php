<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\DashboardSummaryController;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});



Route::post('/login', [AuthController::class, 'login']);
Route::get('/dashboard', function () {
    return view('dashboard'); // or your main blade that mounts React
});

Route::post('/upload', [FileUploadController::class, 'store']);
Route::get('/uploaded-files', [FileUploadController::class, 'index']);
Route::get('/agent-performance', [FileUploadController::class, 'agentPerformance']);
Route::get('/dashboard-summary', [DashboardSummaryController::class, 'dashboardSummary']);

