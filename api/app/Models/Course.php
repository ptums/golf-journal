<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'holes', 'played_at', 'user_id'];

    protected $hidden = [
        'updated_at', 'created_at',
    ];
}
