<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
       User::create([
    'firstname' => 'Shamima',
    'lastname' => 'Akter',
    'bloodgroup' => 'AB+',
    'gender' => 'Female',
    'lastDonationDate' => '2025-01-01',
    'email' => 'shamima@gmail.com',
    'contactNumber' => '01123456678',
    'area' => 'Dhaka',
    'password' => Hash::make('12345678'),
    'role' => 'admin', // Shamima is admin
]);

User::create([
    'firstname' => 'John',
    'lastname' => 'Doe',
    'bloodgroup' => 'A+',
    'gender' => 'Male',
    'lastDonationDate' => '2025-01-01',
    'email' => 'john@example.com',
    'contactNumber' => '01111111111',
    'area' => 'Dhaka',
    'password' => Hash::make('user123'),
    'role' => 'user',
]);

    }
}
