<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodBank extends Model
{
    use HasFactory;

    protected $fillable = [
        'hospital_name',
        'a_positive',
        'a_negative',
        'b_positive',
        'b_negative',
        'ab_positive',
        'ab_negative',
        'o_positive',
        'o_negative',
    ];
}
