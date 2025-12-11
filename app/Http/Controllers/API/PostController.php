<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\Rule;

class PostController extends Controller
{
    /**
     * Display a listing of posts
     */
    public function index(Request $request)
    {
        $cacheKey = 'posts_' . md5(json_encode($request->all()));
        
        $posts = Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = Post::with(['user', 'category', 'comments']);

            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                $query->where('status', 'published');
            }

            // Search
            if ($request->has('search')) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('content', 'like', '%' . $request->search . '%');
                });
            }

            return $query->orderBy('created_at', 'desc')->paginate(10);
        });

        return response()->json($posts);
    }

    /**
     * Store a newly created post
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'category_id' => 'required|string',
            'featured_image' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
        ]);

        // Verify category exists (MongoDB way)
        $category = Category::find($request->category_id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $post = Post::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'content' => $request->content,
            'excerpt' => $request->excerpt ?? Str::limit(strip_tags($request->content), 150),
            'category_id' => $request->category_id,
            'featured_image' => $request->featured_image,
            'status' => $request->status ?? 'draft',
            'user_id' => $request->user()->_id,
        ]);

        Cache::flush(); // Clear cache when new post is created

        return response()->json($post, 201);
    }

    /**
     * Display the specified post
     * 
     * SỬ DỤNG REDIS:
     * 1. Cache toàn bộ thông tin post (giảm query MongoDB)
     * 2. Đếm lượt view bằng Redis INCR (cực nhanh)
     */
    public function show($id)
    {
        $cacheKey = 'post_' . $id;
        
        // Cache thông tin post trong 1 giờ
        $post = Cache::remember($cacheKey, 3600, function () use ($id) {
            return Post::with(['user', 'category', 'comments.user'])->findOrFail($id);
        });

        // Tăng view count bằng Redis (nhanh hơn update MongoDB)
        Redis::incr("post:{$id}:views");
        
        // Lấy tổng số views từ Redis
        $views = Redis::get("post:{$id}:views") ?? 0;
        $post->views_count = (int) $views;

        return response()->json($post);
    }

    /**
     * Update the specified post
     */
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        // Check if user owns the post or is admin
        if ($post->user_id !== $request->user()->_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'category_id' => 'required|string',
            'featured_image' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
        ]);

        // Verify category exists (MongoDB way)
        $category = Category::find($request->category_id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $post->update([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'content' => $request->content,
            'excerpt' => $request->excerpt ?? Str::limit(strip_tags($request->content), 150),
            'category_id' => $request->category_id,
            'featured_image' => $request->featured_image,
            'status' => $request->status ?? $post->status,
        ]);

        Cache::flush(); // Clear cache when post is updated

        return response()->json($post);
    }

    /**
     * Remove the specified post
     */
    public function destroy(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        // Check if user owns the post or is admin
        if ($post->user_id !== $request->user()->_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();
        Cache::flush(); // Clear cache when post is deleted

        return response()->json(['message' => 'Post deleted successfully']);
    }
}

