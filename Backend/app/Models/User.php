<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // For API token if needed

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'firstname',
        'lastname',
        'bloodgroup',
        'gender',
        'lastDonationDate',
        'email',
        'contactNumber',
        'area',
        'password',
        'role', // added role field
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'lastDonationDate' => 'date',
    ];

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
