<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'patient_name',
        'hospital_name',
        'blood_group',
        'units',
        'requested_by',
        'contact',
        'status',
    ];
}
