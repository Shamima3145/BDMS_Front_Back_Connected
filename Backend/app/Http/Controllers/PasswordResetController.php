<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Hospital;
use App\Models\Otp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Notifications\SendOtpNotification;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    // Send OTP for password reset
    public function sendOtp(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            $email = $request->email;

            // Check if user or hospital exists
            $user = User::where('email', $email)->first();
            $hospital = Hospital::where('email', $email)->first();

            if (!$user && !$hospital) {
                return response()->json(['message' => 'Email address not found'], 404);
            }

            $account = $user ?? $hospital;

            // Generate 6-digit OTP
            $token = (string) random_int(100000, 999999);

            // Delete old OTPs for this account
            Otp::where('user_id', $account->id)->delete();

            // Create new OTP
            Otp::create([
                'user_id' => $account->id,
                'channel' => 'email',
                'target' => $email,
                'token' => $token,
                'expires_at' => Carbon::now()->addMinutes(10),
                'used' => false,
            ]);

            // Send OTP notification
            try {
                Notification::send($account, new SendOtpNotification($token, 'email'));
            } catch (\Exception $e) {
                Log::error('Failed to send OTP email: ' . $e->getMessage());
                // Continue anyway - OTP is saved in database
            }

            return response()->json([
                'message' => 'OTP sent to your email successfully',
                'otp' => $token, // Remove this in production!
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in sendOtp: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send OTP',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Verify OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $email = $request->email;
        $otpCode = $request->otp;

        // Find user or hospital
        $user = User::where('email', $email)->first();
        $hospital = Hospital::where('email', $email)->first();

        if (!$user && !$hospital) {
            return response()->json(['message' => 'Email address not found'], 404);
        }

        $account = $user ?? $hospital;

        // Find OTP
        $otp = Otp::where('user_id', $account->id)
            ->where('token', $otpCode)
            ->where('used', false)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Invalid OTP code'], 422);
        }

        // Check if expired
        if ($otp->expires_at && Carbon::now()->gt($otp->expires_at)) {
            return response()->json(['message' => 'OTP has expired'], 422);
        }

        // Mark OTP as used
        $otp->used = true;
        $otp->save();

        return response()->json([
            'message' => 'OTP verified successfully',
        ], 200);
    }

    // Reset password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|confirmed|min:6',
        ]);

        $email = $request->email;

        // Find user or hospital
        $user = User::where('email', $email)->first();
        $hospital = Hospital::where('email', $email)->first();

        if (!$user && !$hospital) {
            return response()->json(['message' => 'Email address not found'], 404);
        }

        $account = $user ?? $hospital;

        // Verify that OTP was recently verified (within last 5 minutes)
        $recentOtp = Otp::where('user_id', $account->id)
            ->where('used', true)
            ->where('created_at', '>=', Carbon::now()->subMinutes(5))
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$recentOtp) {
            return response()->json(['message' => 'Please verify OTP first'], 422);
        }

        // Update password
        $account->password = Hash::make($request->password);
        $account->save();

        // Delete all OTPs for this account
        Otp::where('user_id', $account->id)->delete();

        return response()->json([
            'message' => 'Password reset successful',
        ], 200);
    }
}
