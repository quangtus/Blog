<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class Category extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Get the posts for the category.
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'category_id');
    }
}

