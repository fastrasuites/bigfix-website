<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingSession extends Model
{
    protected $table = 'tracking_sessions';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id', 'ip_address', 'ip_address_str', 'user_agent', 'first_seen',
        'last_seen', 'page_count', 'total_time', 'is_converted', 'converted_at',
        'user_id', 'submission_id', 'country_code', 'region', 'city',
        'latitude', 'longitude', 'isp', 'org', 'company_name', 'is_b2b',
        'b2b_confidence', 'landing_page', 'referrer', 'utm_source',
        'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        'exit_intent_captured', 'exit_intent_email', 'exit_intent_phone',
        'exit_intent_captured_at',
    ];

    protected $casts = [
        'is_b2b' => 'boolean',
        'b2b_confidence' => 'float',
        'page_count' => 'integer',
        'total_time' => 'integer',
        'first_seen' => 'datetime',
        'last_seen' => 'datetime',
        'converted_at' => 'datetime',
        'exit_intent_captured' => 'boolean',
        'exit_intent_captured_at' => 'datetime',
    ];

    public function events()
    {
        return $this->hasMany(TrackingEvent::class, 'session_id');
    }
}
