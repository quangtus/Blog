<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     * 
     * SỬ DỤNG REDIS CACHE:
     * Categories ít thay đổi nên cache 24 giờ
     * Giảm query MongoDB đáng kể
     */
    public function index()
    {
        $categories = Cache::remember('all_categories', 86400, function () {
            return Category::all();
        });
        
        return response()->json($categories);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified category
     * 
     * Cache chi tiết category kèm posts
     */
    public function show($id)
    {
        $category = Cache::remember("category_{$id}", 3600, function () use ($id) {
            return Category::with('posts')->findOrFail($id);
        });
        
        return response()->json($category);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        // Xóa cache khi update
        Cache::forget('all_categories');
        Cache::forget("category_{$id}");

        return response()->json($category);
    }

    /**
     * Remove the specified category
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        // Xóa cache khi delete
        Cache::forget('all_categories');
        Cache::forget("category_{$id}");

        return response()->json(['message' => 'Category deleted successfully']);
    }
}

