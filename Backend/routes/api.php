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

// Admin Routes (accessible with static token)
Route::get('/admin/users', [UsersController::class, 'getAllUsers']);
Route::put('/admin/users/{id}', [UsersController::class, 'updateUser']);
Route::delete('/admin/users/{id}', [UsersController::class, 'deleteUser']);
Route::get('/admin/hospitals', [UsersController::class, 'getAllHospitals']);
Route::put('/admin/hospitals/{id}', [UsersController::class, 'updateHospital']);
Route::delete('/admin/hospitals/{id}', [UsersController::class, 'deleteHospital']);
Route::get('/admin/blood-inventory', [UsersController::class, 'getTotalBloodInventory']);
Route::get('/admin/dashboard-stats', [UsersController::class, 'getDashboardStats']);
Route::get('/admin/reports-stats', [UsersController::class, 'getReportsStats']);
Route::post('/admin/add', [UsersController::class, 'addAdmin']);
Route::post('/admin/change-password', [UsersController::class, 'changeAdminPassword']);

// Admin Donations Routes
Route::get('/admin/donations', [UsersController::class, 'getAdminDonations']);
Route::post('/admin/donations', [UsersController::class, 'createDonation']);
Route::patch('/admin/donations/{id}', [UsersController::class, 'updateDonation']);

// BLOOD REQUEST ROUTES
Route::post('/blood-requests', [UsersController::class, 'submitBloodRequest']);
Route::get('/blood-requests', [UsersController::class, 'getAllBloodRequests']);
Route::patch('/blood-requests/{id}', [UsersController::class, 'updateBloodRequestStatus']);
Route::get('/hospital/blood-requests', [UsersController::class, 'getHospitalBloodRequests']);

// BLOOD BANK ROUTES
Route::post('/hospital/blood-bank', [UsersController::class, 'updateBloodBank']);
Route::get('/hospital/blood-bank', [UsersController::class, 'getBloodBank']);

// STATS ROUTE
Route::get('/stats', [UsersController::class, 'getStats']);

// DONORS ROUTE (PUBLIC)
Route::get('/donors', [UsersController::class, 'getDonors']);

// PROTECTED ROUTES
Route::middleware('auth:sanctum')->group(function () {

    // Get authenticated user info (works for both roles)
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // User Profile & Password Routes
    Route::put('/user/profile', [UsersController::class, 'updateProfile']);
    Route::put('/user/password', [UsersController::class, 'updatePassword']);

    // User Donations Route
    Route::get('/user/donations', [UsersController::class, 'getUserDonations']);

    // Hospital Profile & Password Routes
    Route::put('/hospital/profile', [UsersController::class, 'updateHospitalProfile']);
    Route::put('/hospital/password', [UsersController::class, 'updateHospitalPassword']);

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
