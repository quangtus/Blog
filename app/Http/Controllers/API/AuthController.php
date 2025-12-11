<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        // Manual validation for MongoDB compatibility
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Check if email already exists (MongoDB way)
        $existingUser = User::where('email', $request->email)->first();
        if ($existingUser) {
            throw ValidationException::withMessages([
                'email' => ['The email has already been taken.'],
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        // Tự động đăng nhập sau khi đăng ký
        Auth::login($user);

        // Lưu thông tin vào Redis để tracking
        Redis::set("user:{$user->_id}:online", true, 'EX', 7200); // 2 giờ

        return response()->json([
            'message' => 'Registered successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * Login user - SỬ DỤNG SESSION + COOKIE
     * 
     * Luồng hoạt động:
     * 1. Validate email + password
     * 2. Tìm user trong MongoDB
     * 3. Tạo Session (Laravel tự động lưu vào Redis)
     * 4. Lưu thông tin bổ sung vào Redis (tracking online status)
     * 5. Trả về thông tin user (trình duyệt tự động nhận Cookie)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm user trong MongoDB
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // TẠO SESSION - Laravel tự động:
        // - Tạo Session ID
        // - Lưu vào Redis (vì SESSION_DRIVER=redis)
        // - Gửi Cookie về trình duyệt
        Auth::login($user, $request->boolean('remember'));

        // Lưu thông tin bổ sung vào Redis (tùy chọn - để tracking)
        Redis::set("user:{$user->_id}:online", true, 'EX', 7200); // 2 giờ
        Redis::incr("user:{$user->_id}:login_count"); // Đếm số lần đăng nhập

        // Regenerate session để bảo mật
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => $user,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = Auth::user();

        // Xóa tracking trong Redis
        if ($user) {
            Redis::del("user:{$user->_id}:online");
        }

        // Đăng xuất - Laravel tự động xóa session trong Redis
        Auth::logout();

        // Invalidate session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json(Auth::user());
    }
}

