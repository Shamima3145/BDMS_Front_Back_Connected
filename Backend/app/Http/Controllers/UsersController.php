<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Hospital;

class UsersController extends Controller
{
    // REGISTER FUNCTION (for users)
    public function register(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'bloodgroup' => 'required|string',
            'gender' => 'required|string',
            'lastDonationDate' => 'nullable|date',
            'email' => 'required|email|unique:users,email',
            'contactNumber' => 'required|string',
            'area' => 'required|string',
            'password' => 'required|string|confirmed|min:6',
        ]);

        // Create user
        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'bloodgroup' => $request->bloodgroup,
            'gender' => $request->gender,
            'lastDonationDate' => $request->lastDonationDate,
            'email' => $request->email,
            'contactNumber' => $request->contactNumber,
            'area' => $request->area,
            'password' => Hash::make($request->password),
        ]);

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registration successful',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'userType' => 'user',
        ]);
    }

    // LOGIN FUNCTION (works for users & hospitals & admin)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Check for admin static login (case-insensitive email)
        $email = strtolower(trim($request->email));
        $password = $request->password;
        
        if ($email === 'admin@bloodbridge.com' && $password === 'admin123') {
            return response()->json([
                'message' => 'Login successful',
                'access_token' => 'static_admin_token_' . time(),
                'token_type' => 'Bearer',
                'userType' => 'admin',
                'user' => [
                    'id' => 1,
                    'name' => 'Admin',
                    'firstname' => 'Admin',
                    'email' => 'admin@bloodbridge.com',
                ],
            ]);
        }

        // Try finding user first
        $user = User::where('email', $request->email)->first();
        $userType = 'user';

        // If no user found, try hospital
        if (!$user) {
            $user = Hospital::where('email', $request->email)->first();
            $userType = 'hospital';
        }

        // If still not found or password wrong
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Create API token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return response
        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'userType' => $userType,
            'user' => [
                'id' => $user->id,
                'name' => $user->firstname ?? $user->hospitalName ?? '',
                'firstname' => $user->firstname ?? null,
                'lastname' => $user->lastname ?? null,
                'hospitalName' => $user->hospitalName ?? null,
                'email' => $user->email,
                'bloodgroup' => $user->bloodgroup ?? null,
                'gender' => $user->gender ?? null,
                'contactNumber' => $user->contactNumber ?? null,
                'area' => $user->area ?? null,
                'lastDonationDate' => $user->lastDonationDate ?? null,
            ],
        ]);
    }

    // HOSPITAL REGISTER FUNCTION
public function hospitalRegister(Request $request)
{
    $request->validate([
        'hospitalName' => 'required|string|max:255',
        'registrationId' => 'required|string|max:255|unique:hospitals,registrationId',
        'hospitalType' => 'required|string',
        'yearEstablished' => 'required|integer',
        'address' => 'required|string',
        'city' => 'required|string',
        'district' => 'required|string',
        'email' => 'required|email|unique:hospitals,email',
        'contactNumber' => 'required|string',
        'emergencyHotline' => 'nullable|string',
        'hasBloodBank' => 'required|string|in:yes,no',
        'availableBloodGroups' => 'nullable|array',
        'password' => 'required|string|confirmed',
    ]);

    // Create hospital
    $hospital = Hospital::create([
        'hospitalName' => $request->hospitalName,
        'registrationId' => $request->registrationId,
        'hospitalType' => $request->hospitalType,
        'yearEstablished' => $request->yearEstablished,
        'address' => $request->address,
        'city' => $request->city,
        'district' => $request->district,
        'email' => $request->email,
        'contactNumber' => $request->contactNumber,
        'emergencyHotline' => $request->emergencyHotline,
        'hasBloodBank' => $request->hasBloodBank,
        'availableBloodGroups' => $request->availableBloodGroups ?? [],
        'password' => \Hash::make($request->password),
    ]);

    // Create token
    $token = $hospital->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Hospital registration successful',
        'user' => $hospital,
        'access_token' => $token,
        'token_type' => 'Bearer',
        'userType' => 'hospital',
    ]);
}

    // UPDATE USER PROFILE
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'bloodgroup' => 'required|string',
            'gender' => 'required|string',
            'area' => 'required|string',
            'contactNumber' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'bloodgroup' => $request->bloodgroup,
            'gender' => $request->gender,
            'area' => $request->area,
            'contactNumber' => $request->contactNumber,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    // UPDATE USER PASSWORD
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|max:12',
        ]);

        // Check if current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 401);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    // GET ALL USERS (for admin)
    public function getAllUsers()
    {
        $users = User::select('id', 'firstname', 'lastname', 'bloodgroup', 'gender', 'email', 'contactNumber', 'area', 'lastDonationDate', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

}

