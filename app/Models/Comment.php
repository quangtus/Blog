<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class Comment extends Eloquent
{
    protected $connection = 'mongodb';
    protected $table = 'comments';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'content',
        'post_id',
        'user_id',
        'parent_id',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the post that owns the comment.
     */
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    /**
     * Get the user that owns the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the parent comment.
     */
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * Get the replies for the comment.
     */
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }
}

