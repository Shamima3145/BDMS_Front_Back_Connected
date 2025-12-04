<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// LOGIN (works for both users & hospitals)
Route::post('/login', [UsersController::class, 'login'])->name('login');

// REGISTER ROUTES
Route::post('/register', [UsersController::class, 'register'])->name('register');
Route::post('/hospital-register', [UsersController::class, 'hospitalRegister'])->name('hospital.register');

// FORGOT PASSWORD ROUTE
Route::post('/forgot-password', [UsersController::class, 'forgotPassword'])->name('forgot.password');

// BLOOD REQUEST ROUTES
Route::post('/blood-requests', [UsersController::class, 'submitBloodRequest']);
Route::get('/blood-requests', [UsersController::class, 'getAllBloodRequests']);
// STATS ROUTE
Route::get('/stats', [UsersController::class, 'getStats']);

// PROTECTED ROUTES
Route::middleware('auth:sanctum')->group(function () {

    // Get authenticated user info (works for both roles)
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // User Profile & Password Routes
    Route::put('/user/profile', [UsersController::class, 'updateProfile']);
    Route::put('/user/password', [UsersController::class, 'updatePassword']);

    // Hospital Profile & Password Routes
    Route::put('/hospital/profile', [UsersController::class, 'updateHospitalProfile']);
    Route::put('/hospital/password', [UsersController::class, 'updateHospitalPassword']);

    // Admin Routes
    Route::get('/admin/users', [UsersController::class, 'getAllUsers']);

    // User Dashboard
    Route::get('/user/dashboard', function (Request $request) {
        return response()->json([
            'message' => 'Welcome to User Dashboard',
            'user' => $request->user(),
        ]);
    })->middleware('role:user');

    // Hospital Dashboard
    Route::get('/hospital/dashboard', function (Request $request) {
        return response()->json([
            'message' => 'Welcome to Hospital Dashboard',
            'hospital' => $request->user(),
        ]);
    })->middleware('role:hospital');
});
