<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Clean all user emails
$users = App\Models\User::all();

foreach ($users as $user) {
    $cleanEmail = trim($user->email);
    if ($cleanEmail !== $user->email) {
        echo "Cleaning email for user {$user->id}: [{$user->email}] -> [{$cleanEmail}]\n";
        $user->email = $cleanEmail;
        $user->save();
    }
}

echo "\nDone! All emails cleaned.\n";
