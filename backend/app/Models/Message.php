<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'device_id', // Tambahkan 'device_id'
    ];

    /**
     * Sebuah pesan dimiliki oleh satu perangkat.
     */
    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
