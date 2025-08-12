<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CallRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'call_time', 'call_id', 'from', 'to', 'direction', 'status', 'ringing', 'talking', 'cost'
    ];

    protected $casts = [
        'call_time' => 'datetime',
    ];
}
