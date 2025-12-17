<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class CommentController extends Controller
{
    /**
     * Display a listing of comments for a post
     * 
     * IPO Analysis:
     * - INPUT: post_id (required), user auth (optional)
     * - PROCESS: Query comments with conditions
     * - OUTPUT: JSON array of comments
     * 
     * Logic: Hiển thị comments approved + pending của chính user đang đăng nhập
     */
    public function index(Request $request)
    {
        $request->validate([
            'post_id' => 'required|string',
        ]);

        // Verify post exists (MongoDB way)
        $post = Post::find($request->post_id);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $currentUserId = $request->user()?->_id;

        $comments = Comment::where('post_id', $request->post_id)
            ->where(function($query) use ($currentUserId) {
                // Hiển thị: approved OR pending của chính user
                $query->where('status', 'approved');
                if ($currentUserId) {
                    $query->orWhere(function($q) use ($currentUserId) {
                        $q->where('status', 'pending')
                          ->where('user_id', $currentUserId);
                    });
                }
            })
            ->with(['user', 'replies.user'])
            ->whereNull('parent_id')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Get all comments for admin (including pending)
     * 
     * IPO Analysis:
     * - INPUT: status filter (optional)
     * - PROCESS: Query all comments
     * - OUTPUT: JSON array with pagination
     */
    public function adminIndex(Request $request)
    {
        $query = Comment::with(['user', 'post']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $comments = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($comments);
    }

    /**
     * Store a newly created comment
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'post_id' => 'required|string',
            'parent_id' => 'nullable|string',
        ]);

        // Verify post exists (MongoDB way)
        $post = Post::find($request->post_id);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Verify parent comment exists if provided (MongoDB way)
        if ($request->parent_id) {
            $parentComment = Comment::find($request->parent_id);
            if (!$parentComment) {
                return response()->json(['message' => 'Parent comment not found'], 404);
            }
        }

        $comment = Comment::create([
            'content' => $request->content,
            'post_id' => $request->post_id,
            'user_id' => $request->user()->_id,
            'parent_id' => $request->parent_id,
            'status' => 'pending', // Admin can approve later
        ]);

        Cache::flush(); // Clear cache when new comment is created

        return response()->json($comment, 201);
    }

    /**
     * Update the specified comment
     */
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if user owns the comment or is admin
        if ($comment->user_id !== $request->user()->_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        Cache::flush();

        return response()->json($comment);
    }

    /**
     * Remove the specified comment
     */
    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if user owns the comment or is admin
        if ($comment->user_id !== $request->user()->_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        Cache::flush();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    /**
     * Approve comment (Admin only)
     */
    public function approve(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment = Comment::findOrFail($id);
        $comment->update(['status' => 'approved']);
        Cache::flush();

        return response()->json($comment);
    }

    /**
     * Reject comment (Admin only)
     * 
     * IPO Analysis:
     * - INPUT: comment id
     * - PROCESS: Update status to rejected
     * - OUTPUT: JSON success message
     */
    public function reject(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment = Comment::findOrFail($id);
        $comment->update(['status' => 'rejected']);
        Cache::flush();

        return response()->json(['message' => 'Comment rejected successfully']);
    }
}

