<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Hospital;
use App\Models\BloodRequest;
use App\Models\BloodBank;

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

        return response()->json([
            'message' => 'User registration successful',
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
            ],
        ]);
    }

    // LOGIN FUNCTION (for users, hospitals, and admin)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = strtolower(trim($request->email));
        $password = $request->password;

        // Admin static login
        if ($email === 'admin@bloodbridge.com' && $password === 'admin123') {
            $admin = (object)[
                'id' => 1,
                'firstname' => 'Admin',
                'lastname' => '',
                'email' => 'admin@bloodbridge.com',
                'role' => 'admin'
            ];

            $token = 'admin_static_token_' . time();

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'userType' => 'admin',
                'user' => [
                    'id' => $admin->id,
                    'name' => $admin->firstname,
                    'firstname' => $admin->firstname,
                    'lastname' => $admin->lastname,
                    'email' => $admin->email,
                    'role' => 'admin'
                ],
            ]);
        }

        // Try finding user
        $user = User::where('email', $request->email)->first();
        $userType = 'user';

        // If not found, try hospital
        if (!$user) {
            $user = Hospital::where('email', $request->email)->first();
            $userType = 'hospital';
        }

        // Check credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

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

    // HOSPITAL REGISTER
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
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Hospital registration successful',
            'hospital' => [
                'id' => $hospital->id,
                'hospitalName' => $hospital->hospitalName,
                'email' => $hospital->email,
            ],
        ]);
    }

    // FORGOT PASSWORD
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|confirmed|min:6',
        ]);

        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->update(['password' => Hash::make($request->password)]);
            return response()->json(['message' => 'Password reset successful for user account']);
        }

        $hospital = Hospital::where('email', $request->email)->first();
        if ($hospital) {
            $hospital->update(['password' => Hash::make($request->password)]);
            return response()->json(['message' => 'Password reset successful for hospital account']);
        }

        return response()->json(['message' => 'Email address not found'], 404);
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

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    // UPDATE USER PASSWORD
    public function updatePassword(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|max:12',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 401);
        }

        $user->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['message' => 'Password updated successfully']);
    }

    // GET ALL USERS (admin)
    public function getAllUsers(Request $request)
    {
        // Check for admin static token
        $token = $request->bearerToken();
        if ($token && strpos($token, 'admin_static_token_') === 0) {
            $users = User::select('id', 'firstname', 'lastname', 'bloodgroup', 'gender', 'email', 'contactNumber', 'area', 'lastDonationDate', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(['users' => $users]);
        }

        // For regular authenticated users (if needed)
        $users = User::select('id', 'firstname', 'lastname', 'bloodgroup', 'gender', 'email', 'contactNumber', 'area', 'lastDonationDate', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['users' => $users]);
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

        $hospital->update($request->only([
            'hospitalName','registrationId','hospitalType','yearEstablished','address','city','district','email','contactNumber','emergencyHotline','hasBloodBank'
        ]));

        return response()->json(['message' => 'Hospital profile updated successfully','hospital' => $hospital]);
    }

    // UPDATE HOSPITAL PASSWORD
    public function updateHospitalPassword(Request $request)
    {
        $hospital = $request->user();
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|max:12',
        ]);

        if (!Hash::check($request->current_password, $hospital->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 401);
        }

        $hospital->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['message' => 'Password updated successfully']);
    }

    // SUBMIT BLOOD REQUEST
    public function submitBloodRequest(Request $request)
    {
        $request->validate([
            'patient_name' => 'nullable|string|max:255',
            'hospital_name' => 'nullable|string|max:255',
            'blood_group' => 'required|string',
            'units' => 'required|integer|min:1',
            'requested_by' => 'required|string|max:255',
        ]);

        $prefix = $request->patient_name ? 'BR' : 'HR';
        $lastRequest = BloodRequest::where('request_id', 'like', $prefix.'-%')->orderBy('id','desc')->first();
        $newNumber = $lastRequest ? ((int)substr($lastRequest->request_id, strlen($prefix)+1)+1) : 1;
        $requestId = $prefix.'-'.str_pad($newNumber, 3, '0', STR_PAD_LEFT);

        $bloodRequest = BloodRequest::create([
            'request_id' => $requestId,
            'patient_name' => $request->patient_name,
            'hospital_name' => $request->hospital_name,
            'blood_group' => $request->blood_group,
            'units' => $request->units,
            'requested_by' => $request->requested_by,
            'status' => 'Pending',
        ]);

        return response()->json(['message' => 'Blood request submitted successfully', 'request' => $bloodRequest], 201);
    }

    // GET ALL BLOOD REQUESTS
    public function getAllBloodRequests()
    {
        $requests = BloodRequest::orderBy('created_at','desc')->get();
        return response()->json(['requests' => $requests]);
    }

    // GET HOSPITAL BLOOD REQUESTS
    public function getHospitalBloodRequests(Request $request)
    {
        $hospitalName = $request->query('hospital_name');
        
        if (!$hospitalName) {
            return response()->json(['message' => 'Hospital name is required'], 400);
        }

        $requests = BloodRequest::where('hospital_name', $hospitalName)
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => $requests->count(),
            'pending' => $requests->where('status', 'Pending')->count(),
            'approved' => $requests->where('status', 'Approved')->count(),
            'rejected' => $requests->where('status', 'Rejected')->count(),
        ];

        return response()->json([
            'requests' => $requests,
            'stats' => $stats
        ]);
    }

    // GET STATS
    public function getStats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_requests' => BloodRequest::count(),
            'approved_requests' => BloodRequest::where('status','Approved')->count(),
            'total_units' => null
        ]);
    }

    // UPDATE BLOOD BANK INVENTORY
    public function updateBloodBank(Request $request)
    {
        $request->validate([
            'hospital_name' => 'required|string',
            'a_positive' => 'required|integer|min:0',
            'a_negative' => 'required|integer|min:0',
            'b_positive' => 'required|integer|min:0',
            'b_negative' => 'required|integer|min:0',
            'ab_positive' => 'required|integer|min:0',
            'ab_negative' => 'required|integer|min:0',
            'o_positive' => 'required|integer|min:0',
            'o_negative' => 'required|integer|min:0',
        ]);

        $bloodBank = BloodBank::updateOrCreate(
            ['hospital_name' => $request->hospital_name],
            [
                'a_positive' => $request->a_positive,
                'a_negative' => $request->a_negative,
                'b_positive' => $request->b_positive,
                'b_negative' => $request->b_negative,
                'ab_positive' => $request->ab_positive,
                'ab_negative' => $request->ab_negative,
                'o_positive' => $request->o_positive,
                'o_negative' => $request->o_negative,
            ]
        );

        return response()->json([
            'message' => 'Blood bank inventory updated successfully',
            'data' => $bloodBank
        ]);
    }

    // GET BLOOD BANK INVENTORY
    public function getBloodBank(Request $request)
    {
        $hospitalName = $request->query('hospital_name');
        
        if (!$hospitalName) {
            return response()->json(['message' => 'Hospital name is required'], 400);
        }

        $bloodBank = BloodBank::where('hospital_name', $hospitalName)->first();

        if (!$bloodBank) {
            return response()->json([
                'data' => [
                    'a_positive' => 0,
                    'a_negative' => 0,
                    'b_positive' => 0,
                    'b_negative' => 0,
                    'ab_positive' => 0,
                    'ab_negative' => 0,
                    'o_positive' => 0,
                    'o_negative' => 0,
                ]
            ]);
        }

        return response()->json(['data' => $bloodBank]);
    }

    // GET TOTAL BLOOD INVENTORY FOR ADMIN
    public function getTotalBloodInventory()
    {
        $totalInventory = BloodBank::selectRaw('
            SUM(a_positive) as a_positive,
            SUM(a_negative) as a_negative,
            SUM(b_positive) as b_positive,
            SUM(b_negative) as b_negative,
            SUM(ab_positive) as ab_positive,
            SUM(ab_negative) as ab_negative,
            SUM(o_positive) as o_positive,
            SUM(o_negative) as o_negative
        ')->first();

        return response()->json([
            'data' => [
                'A+' => (int)$totalInventory->a_positive ?? 0,
                'A-' => (int)$totalInventory->a_negative ?? 0,
                'B+' => (int)$totalInventory->b_positive ?? 0,
                'B-' => (int)$totalInventory->b_negative ?? 0,
                'AB+' => (int)$totalInventory->ab_positive ?? 0,
                'AB-' => (int)$totalInventory->ab_negative ?? 0,
                'O+' => (int)$totalInventory->o_positive ?? 0,
                'O-' => (int)$totalInventory->o_negative ?? 0,
            ]
        ]);
    }
}
