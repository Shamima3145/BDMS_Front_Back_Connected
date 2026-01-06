<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Donation;
use App\Models\BloodRequest;
use Carbon\Carbon;

class ReportsTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        
        // Create test users for last 6 months
        echo "Creating test users...\n";
        $users = [];
        
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $usersCount = rand(3, 8);
            
            for ($j = 0; $j < $usersCount; $j++) {
                $user = User::create([
                    'firstname' => 'Test',
                    'lastname' => 'User' . uniqid(),
                    'email' => 'testuser' . uniqid() . '@example.com',
                    'password' => bcrypt('password'),
                    'bloodgroup' => $bloodGroups[array_rand($bloodGroups)],
                    'contactNumber' => '01' . rand(700000000, 799999999),
                    'gender' => ['male', 'female'][rand(0, 1)],
                    'area' => 'Dhaka',
                    'created_at' => $month->copy()->addDays(rand(1, 25)),
                    'updated_at' => $month->copy()->addDays(rand(1, 25)),
                ]);
                $users[] = $user;
            }
        }
        
        echo "Created " . count($users) . " test users\n";
        
        // Create donations for last 6 months
        echo "Creating test donations...\n";
        $donationsCount = 0;
        
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthDonations = rand(5, 15);
            
            for ($j = 0; $j < $monthDonations; $j++) {
                $user = $users[array_rand($users)];
                $donationDate = $month->copy()->addDays(rand(1, 28));
                
                Donation::create([
                    'user_id' => $user->id,
                    'donated_at' => $donationDate,
                    'blood_group' => $user->bloodgroup,
                    'units' => rand(1, 2),
                    'type' => ['Whole Blood', 'Plasma', 'Platelets'][rand(0, 2)],
                    'center_name' => 'Test Blood Bank ' . rand(1, 5),
                    'status' => 'Completed',
                    'notes' => 'Test donation',
                    'created_at' => $donationDate,
                    'updated_at' => $donationDate,
                ]);
                $donationsCount++;
            }
        }
        
        echo "Created {$donationsCount} test donations\n";
        
        // Create blood requests for last 6 months
        echo "Creating test blood requests...\n";
        $requestsCount = 0;
        
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthRequests = rand(3, 10);
            
            for ($j = 0; $j < $monthRequests; $j++) {
                $requestDate = $month->copy()->addDays(rand(1, 28));
                
                BloodRequest::create([
                    'request_id' => 'REQ' . uniqid(),
                    'patient_name' => 'Test Patient ' . rand(1, 100),
                    'hospital_name' => 'Test Hospital ' . rand(1, 5),
                    'blood_group' => $bloodGroups[array_rand($bloodGroups)],
                    'units' => rand(1, 3),
                    'requested_by' => 'Test Requester ' . rand(1, 50),
                    'contact' => '01' . rand(700000000, 799999999),
                    'status' => ['pending', 'accepted', 'rejected'][rand(0, 2)],
                    'created_at' => $requestDate,
                    'updated_at' => $requestDate,
                ]);
                $requestsCount++;
            }
        }
        
        echo "Created {$requestsCount} test blood requests\n";
        echo "\nTest data seeding completed successfully!\n";
    }
}
