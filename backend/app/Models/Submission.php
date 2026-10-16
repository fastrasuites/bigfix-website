<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Submission extends Model
{
    use HasFactory;

    protected $table = 'submissions';

    protected $fillable = [
        'source', 'name', 'email', 'phone', 'subject', 'message',
        'company', 'product', 'operation', 'timeline', 'industry',
        'users', 'date', 'time', 'notes', 'session_id', 'visitor_id',
        'tracking_snapshot', 'email_status', 'email_error',
    ];

    protected $casts = [
        'date' => 'date',
        'tracking_snapshot' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
