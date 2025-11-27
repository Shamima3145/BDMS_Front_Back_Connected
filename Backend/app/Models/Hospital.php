<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Hospital extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'hospitalName',
        'registrationId',
        'hospitalType',
        'yearEstablished',
        'address',
        'city',
        'district',
        'email',
        'contactNumber',
        'emergencyHotline',
        'hasBloodBank',
        'availableBloodGroups',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'availableBloodGroups' => 'array',
    ];
}
