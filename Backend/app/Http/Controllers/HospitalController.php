<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class HospitalController extends Controller
{
    // HOSPITAL REGISTER FUNCTION
    public function register(Request $request)
    {
        // Validation
        $request->validate([
            'hospitalName'      => 'required|string|max:255',
            'registrationId'    => 'required|string|max:255|unique:hospitals,registrationId',
            'hospitalType'      => 'required|string',
            'yearEstablished'   => 'required|integer',
            'address'           => 'required|string|max:255',
            'city'              => 'required|string|max:100',
            'district'          => 'required|string|max:100',
            'email'             => 'required|email|unique:hospitals,email',
            'contactNumber'     => 'required|string|max:20',
            'emergencyHotline'  => 'nullable|string|max:20',
            'hasBloodBank'      => 'required|string',
            'availableBloodGroups' => 'nullable|array',
            'password'          => 'required|string|confirmed',
        ]);

        // Create hospital
        $hospital = Hospital::create([
            'hospitalName'        => $request->hospitalName,
            'registrationId'      => $request->registrationId,
            'hospitalType'        => $request->hospitalType,
            'yearEstablished'     => $request->yearEstablished,
            'address'             => $request->address,
            'city'                => $request->city,
            'district'            => $request->district,
            'email'               => $request->email,
            'contactNumber'       => $request->contactNumber,
            'emergencyHotline'    => $request->emergencyHotline,
            'hasBloodBank'        => $request->hasBloodBank,
            'availableBloodGroups'=> $request->availableBloodGroups,
            'password'            => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Hospital registration successful!',
            'hospital' => $hospital,
        ], 201);
    }
}
