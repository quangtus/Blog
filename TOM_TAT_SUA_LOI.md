# Tóm Tắt Các Lỗi Đã Sửa

## 🔴 Lỗi Chính: "Call to a member function prepare() on null"

### Nguyên nhân:
- Validation rules `Rule::exists()` và `Rule::unique()` đang cố gắng sử dụng SQL database connection (PDO) thay vì MongoDB
- Laravel validation mặc định dùng SQL syntax, không tương thích với MongoDB

### Giải pháp đã áp dụng:

#### 1. **AuthController.php** - Sửa validation email unique
**Trước:**
```php
'email' => ['required', 'string', 'email', 'max:255', Rule::unique((new User)->getTable(), 'email')],
```

**Sau:**
```php
'email' => 'required|string|email|max:255',
// Manual check
$existingUser = User::where('email', $request->email)->first();
if ($existingUser) {
    throw ValidationException::withMessages([
        'email' => ['The email has already been taken.'],
    ]);
}
```

#### 2. **PostController.php** - Sửa validation category_id exists
**Trước:**
```php
'category_id' => ['required', Rule::exists((new Category)->getTable(), '_id')],
```

**Sau:**
```php
'category_id' => 'required|string',
// Manual check
$category = Category::find($request->category_id);
if (!$category) {
    return response()->json(['message' => 'Category not found'], 404);
}
```

#### 3. **CommentController.php** - Sửa validation post_id và parent_id exists
**Trước:**
```php
'post_id' => ['required', Rule::exists((new Post)->getTable(), '_id')],
'parent_id' => ['nullable', Rule::exists((new Comment)->getTable(), '_id')],
```

**Sau:**
```php
'post_id' => 'required|string',
'parent_id' => 'nullable|string',
// Manual checks
$post = Post::find($request->post_id);
if (!$post) {
    return response()->json(['message' => 'Post not found'], 404);
}
if ($request->parent_id) {
    $parentComment = Comment::find($request->parent_id);
    if (!$parentComment) {
        return response()->json(['message' => 'Parent comment not found'], 404);
    }
}
```

## ✅ Các Sửa Đổi Khác Đã Thực Hiện

### 1. Sửa Namespace MongoDB (Đã sửa trước đó)
- Tất cả Models: `Jenssegers\Mongodb` → `MongoDB\Laravel`

### 2. Sửa ID Usage
- Controllers: `$request->user()->id` → `$request->user()->_id`
- Frontend: `user?.id` → `user?._id`

### 3. Thêm Sanctum Guard
- `config/auth.php`: Thêm guard 'sanctum'

### 4. Sửa Frontend React Issues
- `CreatePost.jsx`: Thêm import `useEffect`
- `EditPost.jsx`: Sửa `React.useEffect` → `useEffect`
- `PostDetail.jsx`: Sửa `user?.id` → `user?._id`
- `CommentItem.jsx`: Sửa `user?.id` → `user?._id`

## 📍 Vị Trí Kết Nối MongoDB

### 1. Cấu hình Database
- **File**: `config/database.php`
- **Connection name**: `mongodb`
- **DSN**: `mongodb://localhost:27017` (từ `.env`)
- **Database**: `blog_db` (từ `.env`)

### 2. Cấu hình Environment
- **File**: `.env`
- **Các biến**:
  ```
  DB_CONNECTION=mongodb
  MONGODB_URI=mongodb://localhost:27017
  MONGODB_DATABASE=blog_db
  ```

### 3. Service Provider
- **Package**: `mongodb/laravel-mongodb`
- **Service Provider**: `MongoDB\Laravel\MongoDBServiceProvider`
- **Tự động đăng ký**: Package tự động đăng ký qua `composer.json`

### 4. Models
- **Location**: `app/Models/`
- **Connection**: Tất cả models đều dùng `protected $connection = 'mongodb'`
- **Collections**:
  - `User` → collection `users`
  - `Post` → collection `posts`
  - `Category` → collection `categories`
  - `Comment` → collection `comments`

## 🧪 Cách Kiểm Tra Kết Nối MongoDB

### 1. Chạy Command Test (Đã tạo)
```bash
php artisan mongodb:test
```

### 2. Kiểm tra trong Tinker
```bash
php artisan tinker
```
```php
DB::connection('mongodb')->getMongoClient()->selectDatabase('admin')->command(['ping' => 1]);
```

### 3. Kiểm tra Collections
```php
$db = DB::connection('mongodb')->getMongoClient()->selectDatabase('blog_db');
$collections = $db->listCollections();
foreach ($collections as $collection) {
    echo $collection->getName() . "\n";
}
```

## ✅ Kết Quả Kiểm Tra

Theo kết quả test command:
- ✓ MongoDB PHP Extension: Loaded (Version 1.19.4)
- ✓ MongoDB Server: Connected
- ✓ Laravel DB Connection: Established
- ✓ Database Access: Successful
- ✓ Model Connection: Working
- ✓ Collections: `users` (đã có)

## 🎯 Tóm Tắt

**Vấn đề chính**: Validation rules không tương thích với MongoDB
**Giải pháp**: Thay thế `Rule::exists()` và `Rule::unique()` bằng manual checks
**Kết quả**: MongoDB connection hoạt động tốt, validation đã được sửa

Bây giờ bạn có thể thử đăng ký lại và sẽ không còn lỗi "Call to a member function prepare() on null" nữa!

