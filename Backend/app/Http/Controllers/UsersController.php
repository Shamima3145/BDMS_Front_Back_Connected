<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Hospital;
use App\Models\BloodRequest;

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

    // UPDATE HOSPITAL PROFILE
    public function updateHospitalProfile(Request $request)
    {
        $hospital = $request->user();

        $request->validate([
            'hospitalName' => 'required|string|max:255',
            'registrationId' => 'required|string|max:255',
            'hospitalType' => 'required|string',
            'yearEstablished' => 'required|integer',
            'address' => 'required|string',
            'city' => 'required|string',
            'district' => 'required|string',
            'email' => 'required|email|unique:hospitals,email,' . $hospital->id,
            'contactNumber' => 'required|string',
            'emergencyHotline' => 'nullable|string',
            'hasBloodBank' => 'required|string',
        ]);

        $hospital->update([
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
        ]);

        return response()->json([
            'message' => 'Hospital profile updated successfully',
            'hospital' => $hospital,
        ]);
    }

    // UPDATE HOSPITAL PASSWORD
    public function updateHospitalPassword(Request $request)
    {
        $hospital = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|max:12',
        ]);

        // Check if current password is correct
        if (!Hash::check($request->current_password, $hospital->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 401);
        }

        // Update password
        $hospital->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    // SUBMIT BLOOD REQUEST (for public and hospitals)
    public function submitBloodRequest(Request $request)
    {
        $request->validate([
            'patient_name' => 'nullable|string|max:255',
            'hospital_name' => 'nullable|string|max:255',
            'blood_group' => 'required|string',
            'units' => 'required|integer|min:1',
            'requested_by' => 'required|string|max:255',
        ]);

        // Generate unique request ID
        $prefix = $request->patient_name ? 'BR' : 'HR';
        $lastRequest = BloodRequest::where('request_id', 'like', $prefix . '-%')
            ->orderBy('id', 'desc')
            ->first();
        
        if ($lastRequest) {
            $lastNumber = (int) substr($lastRequest->request_id, strlen($prefix) + 1);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        $requestId = $prefix . '-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);

        // Create blood request
        $bloodRequest = BloodRequest::create([
            'request_id' => $requestId,
            'patient_name' => $request->patient_name,
            'hospital_name' => $request->hospital_name,
            'blood_group' => $request->blood_group,
            'units' => $request->units,
            'requested_by' => $request->requested_by,
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Blood request submitted successfully',
            'request' => $bloodRequest,
        ], 201);
    }

    // GET ALL BLOOD REQUESTS (for admin)
    public function getAllBloodRequests()
    {
        $requests = BloodRequest::orderBy('created_at', 'desc')->get();

        return response()->json([
            'requests' => $requests,
        ]);
    }

}

