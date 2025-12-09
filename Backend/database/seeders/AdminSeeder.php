<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('admins')->insert([
            'admin_id' => 'admin_001',
            'email' => 'admin@bloodbridge.com',
            'password' => Hash::make('Admin@123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
