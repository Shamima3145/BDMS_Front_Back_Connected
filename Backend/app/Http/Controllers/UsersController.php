<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Hospital;
use App\Models\BloodRequest;
use App\Models\BloodBank;
use App\Models\Admin;
use App\Models\Donation;

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

        // Try finding admin first
        $admin = Admin::where('email', $email)->first();
        if ($admin && Hash::check($password, $admin->password)) {
            $token = 'admin_token_' . time();
            
            return response()->json([
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'userType' => 'admin',
                'user' => [
                    'id' => $admin->id,
                    'admin_id' => $admin->admin_id,
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

    // GET ALL HOSPITALS FOR ADMIN
    public function getAllHospitals(Request $request)
    {
        $hospitals = Hospital::select('id', 'hospitalName', 'registrationId', 'hospitalType', 'yearEstablished', 'address', 'city', 'district', 'email', 'contactNumber', 'emergencyHotline', 'hasBloodBank', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['hospitals' => $hospitals]);
    }

    // UPDATE USER (admin)
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'firstname' => 'sometimes|string|max:255',
            'lastname' => 'sometimes|string|max:255',
            'bloodgroup' => 'sometimes|string',
            'gender' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'contactNumber' => 'sometimes|string',
            'area' => 'sometimes|string',
        ]);

        $user->update($request->only(['firstname', 'lastname', 'bloodgroup', 'gender', 'email', 'contactNumber', 'area']));

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    // DELETE USER (admin)
    public function deleteUser(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    // UPDATE HOSPITAL (admin)
    public function updateHospital(Request $request, $id)
    {
        $hospital = Hospital::find($id);
        
        if (!$hospital) {
            return response()->json(['message' => 'Hospital not found'], 404);
        }

        $request->validate([
            'hospitalName' => 'sometimes|string|max:255',
            'registrationId' => 'sometimes|string|max:255',
            'hospitalType' => 'sometimes|string',
            'yearEstablished' => 'sometimes|integer',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'district' => 'sometimes|string',
            'email' => 'sometimes|email|unique:hospitals,email,' . $id,
            'contactNumber' => 'sometimes|string',
            'hasBloodBank' => 'sometimes|string',
        ]);

        $hospital->update($request->only(['hospitalName', 'registrationId', 'hospitalType', 'yearEstablished', 'address', 'city', 'district', 'email', 'contactNumber', 'hasBloodBank']));

        return response()->json([
            'message' => 'Hospital updated successfully',
            'hospital' => $hospital
        ]);
    }

    // DELETE HOSPITAL (admin)
    public function deleteHospital(Request $request, $id)
    {
        $hospital = Hospital::find($id);
        
        if (!$hospital) {
            return response()->json(['message' => 'Hospital not found'], 404);
        }

        $hospital->delete();

        return response()->json(['message' => 'Hospital deleted successfully']);
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
            'contact' => 'required|string|max:255',
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
            'contact' => $request->contact,
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

    // UPDATE BLOOD REQUEST STATUS
    public function updateBloodRequestStatus(Request $request, $id)
    {
        $bloodRequest = BloodRequest::find($id);
        
        if (!$bloodRequest) {
            return response()->json(['message' => 'Blood request not found'], 404);
        }

        $request->validate([
            'status' => 'required|string|in:pending,accepted,declined,Pending,Accepted,Declined,Accept,Decline',
        ]);

        $bloodRequest->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Blood request status updated successfully',
            'request' => $bloodRequest
        ]);
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

    // GET DASHBOARD STATISTICS
    public function getDashboardStats()
    {
        // Get total donors from users table
        $totalDonors = User::count();

        // Get total requests from blood_requests table
        $totalRequests = BloodRequest::count();

        // Get approved requests
        $approvedRequests = BloodRequest::where('status', 'approved')->count();

        // Get total blood inventory
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

        $totalBloodUnits = (
            ($totalInventory->a_positive ?? 0) +
            ($totalInventory->a_negative ?? 0) +
            ($totalInventory->b_positive ?? 0) +
            ($totalInventory->b_negative ?? 0) +
            ($totalInventory->ab_positive ?? 0) +
            ($totalInventory->ab_negative ?? 0) +
            ($totalInventory->o_positive ?? 0) +
            ($totalInventory->o_negative ?? 0)
        );

        return response()->json([
            'data' => [
                'totalDonors' => $totalDonors,
                'totalRequests' => $totalRequests,
                'approvedRequests' => $approvedRequests,
                'totalBloodUnits' => $totalBloodUnits,
                'inventory' => [
                    'A+' => (int)$totalInventory->a_positive ?? 0,
                    'A-' => (int)$totalInventory->a_negative ?? 0,
                    'B+' => (int)$totalInventory->b_positive ?? 0,
                    'B-' => (int)$totalInventory->b_negative ?? 0,
                    'AB+' => (int)$totalInventory->ab_positive ?? 0,
                    'AB-' => (int)$totalInventory->ab_negative ?? 0,
                    'O+' => (int)$totalInventory->o_positive ?? 0,
                    'O-' => (int)$totalInventory->o_negative ?? 0,
                ]
            ]
        ]);
    }

    // ADD NEW ADMIN
    public function addAdmin(Request $request)
    {
        $request->validate([
            'admin_id' => 'required|string|unique:admins,admin_id',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|string|min:8',
        ]);

        $admin = Admin::create([
            'admin_id' => $request->admin_id,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Admin created successfully',
            'admin' => [
                'id' => $admin->id,
                'admin_id' => $admin->admin_id,
                'email' => $admin->email,
            ],
        ]);
    }

    // CHANGE ADMIN PASSWORD
    public function changeAdminPassword(Request $request)
    {
        $request->validate([
            'admin_id' => 'required|string',
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        $admin = Admin::where('admin_id', $request->admin_id)->first();

        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        if (!Hash::check($request->current_password, $admin->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 401);
        }

        $admin->password = Hash::make($request->new_password);
        $admin->save();

        return response()->json(['message' => 'Password changed successfully']);
    }

    // GET USER DONATIONS WITH PAGINATION
    public function getUserDonations(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $perPage = $request->query('per_page', 5);
        $year = $request->query('year');
        $all = $request->query('all', false); // New parameter for fetching all records

        $query = Donation::where('user_id', $user->id)
            ->orderBy('donated_at', 'desc');

        // Filter by year if provided
        if ($year && $year !== 'all') {
            $query->whereYear('donated_at', $year);
        }

        // If 'all' parameter is true, return all records without pagination
        if ($all === 'true' || $all === true) {
            $donations = $query->get();
            
            return response()->json([
                'data' => $donations,
                'total' => $donations->count(),
            ]);
        }

        // Otherwise, return paginated results
        $donations = $query->paginate($perPage);

        return response()->json([
            'data' => $donations->items(),
            'current_page' => $donations->currentPage(),
            'per_page' => $donations->perPage(),
            'total' => $donations->total(),
            'last_page' => $donations->lastPage(),
        ]);
    }

    // ADMIN: Get all donations with pagination and search
    public function getAdminDonations(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');
        $page = $request->query('page', 1);

        $query = Donation::with('user:id,firstname,lastname,email')
            ->orderBy('donated_at', 'desc');

        // Search functionality
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('center_name', 'like', "%{$search}%")
                  ->orWhere('blood_group', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('firstname', 'like', "%{$search}%")
                                ->orWhere('lastname', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $donations = $query->paginate($perPage);

        // Format the response data
        $formattedData = $donations->map(function($donation) {
            return [
                'id' => $donation->id,
                'user_id' => $donation->user_id,
                'donor_name' => $donation->user ? $donation->user->firstname . ' ' . $donation->user->lastname : 'N/A',
                'donor_email' => $donation->user ? $donation->user->email : 'N/A',
                'donated_at' => $donation->donated_at,
                'blood_group' => $donation->blood_group,
                'units' => $donation->units,
                'type' => $donation->type,
                'center_name' => $donation->center_name,
                'status' => $donation->status,
                'notes' => $donation->notes,
            ];
        });

        return response()->json([
            'data' => $formattedData,
            'current_page' => $donations->currentPage(),
            'per_page' => $donations->perPage(),
            'total' => $donations->total(),
            'last_page' => $donations->lastPage(),
        ]);
    }

    // ADMIN: Create a new donation record
    public function createDonation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'donated_at' => 'required|date',
            'blood_group' => 'required|string',
            'units' => 'required|integer|min:1',
            'type' => 'nullable|string',
            'center_name' => 'required|string',
            'status' => 'required|in:Completed,In Process,Deferred,Cancelled',
        ]);

        $donation = Donation::create([
            'user_id' => $request->user_id,
            'donated_at' => $request->donated_at,
            'blood_group' => $request->blood_group,
            'units' => $request->units,
            'type' => $request->type ?? 'Whole Blood',
            'center_name' => $request->center_name,
            'status' => $request->status,
            'notes' => $request->notes ?? null,
        ]);

        // Update user's last donation date if status is Completed
        if ($request->status === 'Completed') {
            $user = User::find($request->user_id);
            if ($user) {
                $user->lastDonationDate = $request->donated_at;
                $user->save();
            }
        }

        return response()->json([
            'message' => 'Donation recorded successfully',
            'donation' => $donation,
        ], 201);
    }

    // ADMIN: Update a donation record
    public function updateDonation(Request $request, $id)
    {
        $donation = Donation::findOrFail($id);

        $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'donated_at' => 'sometimes|required|date',
            'blood_group' => 'sometimes|required|string',
            'units' => 'sometimes|required|integer|min:1',
            'type' => 'nullable|string',
            'center_name' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:Completed,In Process,Deferred,Cancelled',
        ]);

        $donation->update($request->only([
            'user_id',
            'donated_at',
            'blood_group',
            'units',
            'type',
            'center_name',
            'status',
            'notes',
        ]));

        // Update user's last donation date if status is Completed
        if ($request->has('status') && $request->status === 'Completed') {
            $user = User::find($donation->user_id);
            if ($user) {
                $lastDonation = Donation::where('user_id', $user->id)
                    ->where('status', 'Completed')
                    ->orderBy('donated_at', 'desc')
                    ->first();
                
                if ($lastDonation) {
                    $user->lastDonationDate = $lastDonation->donated_at;
                    $user->save();
                }
            }
        }

        return response()->json([
            'message' => 'Donation updated successfully',
            'donation' => $donation,
        ]);
    }

    // GET REPORTS STATISTICS
    public function getReportsStats(Request $request)
    {
        $selectedMonth = $request->input('month', now()->month);
        $selectedYear = $request->input('year', now()->year);

        // Calculate current and last month dates
        $currentMonthStart = \Carbon\Carbon::create($selectedYear, $selectedMonth, 1)->startOfMonth();
        $currentMonthEnd = \Carbon\Carbon::create($selectedYear, $selectedMonth, 1)->endOfMonth();
        
        $lastMonthStart = \Carbon\Carbon::create($selectedYear, $selectedMonth, 1)->subMonth()->startOfMonth();
        $lastMonthEnd = \Carbon\Carbon::create($selectedYear, $selectedMonth, 1)->subMonth()->endOfMonth();

        // 1. Total Donations (current month - only Completed status)
        $currentDonations = Donation::where('status', 'Completed')
            ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
            ->count();
        $lastDonations = Donation::where('status', 'Completed')
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->count();
        $donationsGrowth = $lastDonations > 0 ? round((($currentDonations - $lastDonations) / $lastDonations) * 100) : 0;

        // 2. New Donors (comparing registration dates)
        $currentDonors = User::whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])->count();
        $lastDonors = User::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
        $donorsGrowth = $lastDonors > 0 ? round((($currentDonors - $lastDonors) / $lastDonors) * 100) : 0;

        // 3. Blood Collected (units from donations table)
        $currentBloodUnits = Donation::whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])->sum('units');
        $lastBloodUnits = Donation::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->sum('units');
        $bloodGrowth = $lastBloodUnits > 0 ? round((($currentBloodUnits - $lastBloodUnits) / $lastBloodUnits) * 100) : 0;

        // 4. Requests Fulfilled (status = accepted from blood_requests table)
        $currentRequests = BloodRequest::where('status', 'accepted')
            ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
            ->count();
        $lastRequests = BloodRequest::where('status', 'accepted')
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->count();
        $requestsGrowth = $lastRequests > 0 ? round((($currentRequests - $lastRequests) / $lastRequests) * 100) : 0;

        // 5. Blood Group Distribution from donations table (current month)
        $bloodGroupStats = Donation::selectRaw('blood_group, SUM(units) as total_units, COUNT(*) as total_donations')
            ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
            ->groupBy('blood_group')
            ->get();

        $totalUnits = $bloodGroupStats->sum('total_units');
        $bloodGroupDistribution = [];

        foreach ($bloodGroupStats as $stat) {
            $percentage = $totalUnits > 0 ? round(($stat->total_units / $totalUnits) * 100, 1) : 0;
            $bloodGroupDistribution[] = [
                'group' => $stat->blood_group,
                'donations' => $stat->total_donations,
                'units' => $stat->total_units,
                'percentage' => $percentage,
            ];
        }

        // Sort by units descending
        usort($bloodGroupDistribution, function($a, $b) {
            return $b['units'] - $a['units'];
        });

        return response()->json([
            'data' => [
                'totalDonations' => $currentDonations,
                'donationsGrowth' => ($donationsGrowth >= 0 ? '+' : '') . $donationsGrowth . '%',
                'newDonors' => $currentDonors,
                'donorsGrowth' => ($donorsGrowth >= 0 ? '+' : '') . $donorsGrowth . '%',
                'bloodCollected' => $currentBloodUnits, // in units
                'bloodGrowth' => ($bloodGrowth >= 0 ? '+' : '') . $bloodGrowth . '%',
                'requestsFulfilled' => $currentRequests,
                'requestsGrowth' => ($requestsGrowth >= 0 ? '+' : '') . $requestsGrowth . '%',
                'bloodGroupDistribution' => $bloodGroupDistribution,
            ]
        ]);
    }
}

