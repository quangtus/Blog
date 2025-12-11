# 📚 LUỒNG CHÍNH VÀ KIẾN TRÚC DỰ ÁN BLOG

## 🎯 1. TỔNG QUAN DỰ ÁN

### Yêu cầu ban đầu:
✅ **ĐÃ HOÀN THÀNH** - Tạo blog đơn giản với các bảng:
1. ✅ **User** - Quản lý người dùng (đăng ký, đăng nhập, phân quyền)
2. ✅ **Category** - Quản lý danh mục bài viết
3. ✅ **Post** - Quản lý bài viết (CRUD đầy đủ)
4. ✅ **Comment** - Quản lý bình luận (có thể reply, admin approve)

### Công nghệ sử dụng:
- **Backend**: Laravel 10 (PHP)
- **Frontend**: React + Vite
- **Database**: MongoDB (NoSQL)
- **Cache**: Redis (hiện tại dùng File cache vì chưa cài Redis extension)
- **Authentication**: Laravel Sanctum (Token-based)

---

## 🔄 2. LUỒNG CHÍNH CỦA DỰ ÁN

### 2.1. Luồng Đăng Ký/Đăng Nhập

```
User (Browser)
    ↓
React Frontend (Register.jsx / Login.jsx)
    ↓
Axios Request → http://localhost:8000/api/register hoặc /api/login
    ↓
Laravel Backend (routes/api.php)
    ↓
AuthController → Validate → MongoDB (User Model)
    ↓
Tạo Token (Sanctum) → Trả về JSON {user, token}
    ↓
Frontend lưu token vào localStorage
    ↓
Axios tự động thêm header: Authorization: Bearer {token}
```

### 2.2. Luồng Xem Bài Viết

```
User (Browser)
    ↓
React Frontend (Home.jsx)
    ↓
useQuery → Axios GET /api/posts
    ↓
Laravel Backend (PostController::index)
    ↓
Kiểm tra Cache (Redis/File) → Nếu có → Trả về cache
    ↓
Nếu không có → Query MongoDB (Post Model)
    ↓
Cache kết quả (3600 giây) → Trả về JSON
    ↓
React hiển thị danh sách bài viết
```

### 2.3. Luồng Tạo Bài Viết

```
User đã đăng nhập
    ↓
React Frontend (CreatePost.jsx)
    ↓
Form Submit → Axios POST /api/posts (có token trong header)
    ↓
Laravel Middleware (auth:sanctum) → Kiểm tra token
    ↓
PostController::store → Validate → MongoDB (Post Model)
    ↓
Tạo bài viết → Xóa cache → Trả về JSON
    ↓
React redirect đến trang chi tiết bài viết
```

### 2.4. Luồng Bình Luận

```
User đã đăng nhập
    ↓
React Frontend (CommentForm.jsx)
    ↓
Axios POST /api/comments (có token)
    ↓
CommentController::store → Validate → MongoDB (Comment Model)
    ↓
Tạo comment (status: pending) → Xóa cache → Trả về JSON
    ↓
React refresh danh sách comments
```

---

## 🗄️ 3. DATABASE (MONGODB) - Ở ĐÂU VÀ CÁCH XEM

### 3.1. Database ở đâu?

**MongoDB chạy trên máy local của bạn:**
- **Host**: `localhost` hoặc `127.0.0.1`
- **Port**: `27017` (port mặc định)
- **Database name**: `blog_db` (theo file `.env`)
- **Connection string**: `mongodb://localhost:27017`

### 3.2. Cách xem Database

#### Cách 1: Dùng MongoDB Compass (GUI - Đã cài)
1. Mở **MongoDB Compass**
2. Kết nối đến: `mongodb://localhost:27017`
3. Chọn database `blog_db`
4. Xem các collections:
   - `users` - Bảng người dùng
   - `posts` - Bảng bài viết
   - `categories` - Bảng danh mục
   - `comments` - Bảng bình luận

#### Cách 2: Dùng Command Line
```bash
# Kết nối MongoDB shell
mongosh mongodb://localhost:27017

# Chọn database
use blog_db

# Xem tất cả collections
show collections

# Xem dữ liệu trong collection
db.users.find()
db.posts.find()
db.categories.find()
db.comments.find()
```

#### Cách 3: Dùng Laravel Tinker
```bash
php artisan tinker

# Xem users
App\Models\User::all();

# Xem posts
App\Models\Post::all();

# Xem categories
App\Models\Category::all();

# Xem comments
App\Models\Comment::all();
```

#### Cách 4: Dùng Command Test (Đã tạo)
```bash
php artisan mongodb:test
```

### 3.3. Cấu hình Database trong dự án

**File cấu hình**: `config/database.php`
```php
'default' => env('DB_CONNECTION', 'mongodb'),
'connections' => [
    'mongodb' => [
        'driver' => 'mongodb',
        'dsn' => env('MONGODB_URI', 'mongodb://localhost:27017'),
        'database' => env('MONGODB_DATABASE', 'blog_db'),
    ],
]
```

**File environment**: `.env`
```env
DB_CONNECTION=mongodb
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=blog_db
```

---

## 🔗 4. CÁC THÀNH PHẦN LIÊN KẾT VỚI NHAU

### 4.1. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Pages    │  │Components│  │ Contexts │            │
│  │ - Home   │  │ - Layout │  │ - Auth   │            │
│  │ - Login  │  │ - Forms  │  │          │            │
│  │ - Post   │  │ - Lists  │  │          │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │            │              │                   │
│       └────────────┼──────────────┘                   │
│                    │                                    │
│              ┌─────▼─────┐                            │
│              │   Axios    │                            │
│              │  Config    │                            │
│              └─────┬─────┘                            │
└────────────────────┼──────────────────────────────────┘
                     │ HTTP Request (JSON)
                     │ Authorization: Bearer {token}
                     │
┌────────────────────▼──────────────────────────────────┐
│              BACKEND (Laravel)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Routes   │→ │Middleware │→ │Controller│          │
│  │ api.php  │  │ - Auth    │  │ - API    │          │
│  │          │  │ - Admin   │  │          │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │             │              │                 │
│       └─────────────┼──────────────┘                 │
│                     │                                  │
│              ┌──────▼──────┐                          │
│              │   Models    │                          │
│              │ - User      │                          │
│              │ - Post      │                          │
│              │ - Category  │                          │
│              │ - Comment   │                          │
│              └──────┬──────┘                          │
└─────────────────────┼────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼────┐  ┌─────▼─────┐  ┌───▼────┐
│  MongoDB   │  │   Redis   │  │ Sanctum│
│  Database  │  │   Cache   │  │ Tokens  │
│            │  │           │  │         │
│ blog_db    │  │ File/Redis│  │ Database│
└────────────┘  └───────────┘  └────────┘
```

### 4.2. Chi tiết các thành phần

#### A. Frontend (React)

**Cấu trúc thư mục:**
```
resources/js/
├── app.jsx              # Entry point
├── MainApp.jsx          # Router setup
├── config/
│   └── axios.js        # Axios config (baseURL, interceptors)
├── contexts/
│   └── AuthContext.jsx # Quản lý authentication state
├── pages/
│   ├── Home.jsx        # Trang chủ (danh sách bài viết)
│   ├── Login.jsx      # Đăng nhập
│   ├── Register.jsx    # Đăng ký
│   ├── PostDetail.jsx # Chi tiết bài viết
│   ├── CreatePost.jsx # Tạo bài viết
│   └── EditPost.jsx   # Sửa bài viết
└── components/
    ├── Layout/        # Layout chung
    ├── CommentForm.jsx # Form bình luận
    ├── CommentList.jsx # Danh sách bình luận
    └── CategoryFilter.jsx # Lọc theo danh mục
```

**Luồng dữ liệu Frontend:**
1. **AuthContext**: Quản lý user state, token, các hàm login/register/logout
2. **Axios Config**: Tự động thêm token vào header mỗi request
3. **React Query**: Quản lý cache và fetch data từ API
4. **Pages**: Hiển thị UI và gọi API qua Axios

#### B. Backend (Laravel)

**Cấu trúc thư mục:**
```
app/
├── Http/
│   ├── Controllers/
│   │   └── API/
│   │       ├── AuthController.php    # Xử lý đăng ký/đăng nhập
│   │       ├── PostController.php    # CRUD bài viết
│   │       ├── CategoryController.php # CRUD danh mục
│   │       └── CommentController.php # CRUD bình luận
│   └── Middleware/
│       ├── Authenticate.php          # Kiểm tra đăng nhập
│       └── AdminMiddleware.php        # Kiểm tra quyền admin
├── Models/
│   ├── User.php       # Model User
│   ├── Post.php       # Model Post
│   ├── Category.php   # Model Category
│   └── Comment.php    # Model Comment
└── Providers/
    └── AppServiceProvider.php

routes/
└── api.php            # Định nghĩa API routes

config/
├── database.php       # Cấu hình MongoDB
├── auth.php          # Cấu hình authentication
└── cache.php         # Cấu hình cache
```

**Luồng xử lý Backend:**
1. **Routes** (`routes/api.php`): Định nghĩa endpoints và middleware
2. **Middleware**: Kiểm tra authentication, authorization
3. **Controllers**: Xử lý logic, validate, gọi Models
4. **Models**: Tương tác với MongoDB, định nghĩa relationships
5. **Cache**: Lưu cache kết quả query để tăng tốc độ

---

## 🐳 5. DOCKER LÀ GÌ?

### 5.1. Docker là gì?

**Docker** là công cụ để đóng gói ứng dụng và các dependencies vào trong một "container" - giống như một máy ảo nhẹ.

**Ví dụ đơn giản:**
- Thay vì cài MongoDB, Redis, PHP, Node.js trực tiếp trên máy
- Bạn có thể chạy chúng trong Docker containers
- Mỗi container độc lập, không ảnh hưởng đến hệ thống

### 5.2. Docker trong dự án này

**Hiện tại dự án CHƯA dùng Docker**, nhưng có thể dùng để chạy:
- MongoDB: `docker run -d -p 27017:27017 --name mongodb mongo:latest`
- Redis: `docker run -d -p 6379:6379 --name redis redis:latest`

**Lợi ích:**
- Không cần cài MongoDB/Redis trực tiếp
- Dễ dàng chạy trên mọi máy
- Dễ dàng xóa và tạo lại

**File Docker (nếu muốn tạo):**
```dockerfile
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
  
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
```

---

## ⚡ 6. REDIS THỂ HIỆN Ở ĐÂU?

### 6.1. Redis là gì?

**Redis** là in-memory database (lưu trên RAM) - cực kỳ nhanh, dùng để:
- **Cache**: Lưu tạm kết quả query để không phải query lại
- **Session**: Lưu thông tin đăng nhập
- **Queue**: Xử lý job bất đồng bộ

### 6.2. Redis trong dự án này

#### A. Cấu hình Redis

**File**: `config/cache.php`
```php
'default' => env('CACHE_STORE', 'redis'), // Mặc định dùng Redis
'stores' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'cache',
    ],
    'file' => [
        'driver' => 'file', // Fallback nếu Redis không có
    ],
]
```

**File**: `config/database.php`
```php
'redis' => [
    'default' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_DB', '0'),
    ],
    'cache' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_CACHE_DB', '1'),
    ],
]
```

**File**: `.env`
```env
CACHE_STORE=file  # Hiện tại dùng file vì chưa cài Redis extension
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_DB=0
```

#### B. Redis được dùng ở đâu trong code?

**1. PostController - Cache danh sách bài viết:**
```php
// app/Http/Controllers/API/PostController.php
public function index(Request $request)
{
    $cacheKey = 'posts_' . md5(json_encode($request->all()));
    
    // Lưu cache 3600 giây (1 giờ)
    $posts = Cache::remember($cacheKey, 3600, function () use ($request) {
        // Query MongoDB nếu cache không có
        return Post::with(['user', 'category', 'comments'])->get();
    });
    
    return response()->json($posts);
}
```

**2. PostController - Cache chi tiết bài viết:**
```php
public function show($id)
{
    $cacheKey = 'post_' . $id;
    
    $post = Cache::remember($cacheKey, 3600, function () use ($id) {
        return Post::with(['user', 'category', 'comments.user'])->findOrFail($id);
    });
    
    return response()->json($post);
}
```

**3. Xóa cache khi có thay đổi:**
```php
// Khi tạo/sửa/xóa bài viết
Cache::flush(); // Xóa tất cả cache
```

#### C. Redis hoạt động như thế nào?

**Luồng Cache:**
```
Request → Kiểm tra Cache
    ↓
Có cache? → YES → Trả về cache (nhanh)
    ↓
NO → Query MongoDB → Lưu vào cache → Trả về kết quả
```

**Ví dụ:**
1. User đầu tiên xem danh sách bài viết
   - Không có cache → Query MongoDB → Lưu cache → Trả về
2. User thứ 2 xem cùng danh sách
   - Có cache → Trả về ngay (nhanh hơn 10-100 lần)

#### D. Hiện tại dự án dùng gì?

**Hiện tại**: Dùng **File Cache** (vì chưa cài Redis extension)
- Cache lưu trong: `storage/framework/cache/data/`
- Chậm hơn Redis nhưng vẫn hoạt động

**Để dùng Redis thật:**
1. Cài Redis server: `docker run -d -p 6379:6379 redis:latest`
2. Cài PHP Redis extension: `pecl install redis`
3. Đổi `.env`: `CACHE_STORE=redis`
4. Restart Laravel server

---

## 🌐 7. FRONTEND VÀ BACKEND NỐI NHAU NHƯ THẾ NÀO?

### 7.1. Kiến trúc kết nối

```
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)                     │
│              Port: 5173 (dev) hoặc build                │
│                                                          │
│  Browser → React App → Axios → HTTP Request             │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │ JSON Data
                         │ Authorization Header
                         │
┌────────────────────────▼─────────────────────────────────┐
│              BACKEND (Laravel)                          │
│              Port: 8000                                 │
│                                                          │
│  Route → Middleware → Controller → Model → MongoDB      │
└─────────────────────────────────────────────────────────┘
```

### 7.2. Chi tiết kết nối

#### A. Cấu hình Axios (Frontend)

**File**: `resources/js/config/axios.js`
```javascript
// Base URL - trỏ đến Laravel backend
axios.defaults.baseURL = 'http://localhost:8000';

// Tự động thêm token vào mỗi request
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Interceptor - xử lý lỗi 401 (unauthorized)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn → Xóa token → Redirect login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
);
```

#### B. API Routes (Backend)

**File**: `routes/api.php`
```php
// Public routes (không cần token)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/posts', [PostController::class, 'index']);

// Protected routes (cần token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/me', [AuthController::class, 'me']);
});
```

#### C. Ví dụ luồng kết nối cụ thể

**Ví dụ 1: Đăng ký**
```javascript
// Frontend: Register.jsx
const handleSubmit = async (e) => {
    const response = await axios.post('/api/register', {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
        password_confirmation: 'password123'
    });
    // Response: { user: {...}, token: "abc123..." }
    localStorage.setItem('token', response.data.token);
};
```

```php
// Backend: AuthController.php
public function register(Request $request)
{
    // Validate
    $user = User::create([...]);
    $token = $user->createToken('auth_token')->plainTextToken;
    
    return response()->json([
        'user' => $user,
        'token' => $token
    ], 201);
}
```

**Ví dụ 2: Lấy danh sách bài viết**
```javascript
// Frontend: Home.jsx
const { data: posts } = useQuery('posts', async () => {
    const response = await axios.get('/api/posts');
    return response.data;
});
```

```php
// Backend: PostController.php
public function index(Request $request)
{
    $posts = Cache::remember('posts', 3600, function () {
        return Post::with(['user', 'category'])->get();
    });
    
    return response()->json($posts);
}
```

**Ví dụ 3: Tạo bài viết (cần token)**
```javascript
// Frontend: CreatePost.jsx
const createMutation = useMutation((data) => 
    axios.post('/api/posts', data) // Token tự động thêm vào header
);
```

```php
// Backend: routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
});

// Backend: PostController.php
public function store(Request $request)
{
    // $request->user() → Lấy user từ token
    $post = Post::create([
        'title' => $request->title,
        'user_id' => $request->user()->_id, // User từ token
    ]);
    
    return response()->json($post, 201);
}
```

### 7.3. CORS (Cross-Origin Resource Sharing)

**File**: `config/cors.php`
```php
'allowed_origins' => [
    'http://localhost:8000',  // Laravel
    'http://localhost:5173',  // Vite dev server
],
```

**Giải thích:**
- Frontend chạy trên port 5173 (Vite)
- Backend chạy trên port 8000 (Laravel)
- CORS cho phép frontend gọi API từ backend

### 7.4. Authentication Flow

```
1. User đăng nhập
   Frontend → POST /api/login → Backend
   Backend → Tạo token → Trả về {user, token}

2. Frontend lưu token vào localStorage

3. Mỗi request sau đó:
   Axios tự động thêm: Authorization: Bearer {token}

4. Backend kiểm tra token:
   Middleware auth:sanctum → Validate token → Cho phép request

5. Nếu token hết hạn:
   Backend trả về 401 → Frontend interceptor → Redirect login
```

---

## 📋 8. TÓM TẮT

### ✅ Đã hoàn thành:
- ✅ 4 bảng: User, Category, Post, Comment
- ✅ CRUD đầy đủ cho tất cả bảng
- ✅ Authentication (đăng ký, đăng nhập)
- ✅ Authorization (phân quyền admin)
- ✅ Cache (File cache, có thể nâng cấp Redis)
- ✅ Frontend React hoàn chỉnh
- ✅ API RESTful đầy đủ

### 🔍 Database:
- **Vị trí**: MongoDB trên localhost:27017
- **Database**: blog_db
- **Xem bằng**: MongoDB Compass, mongosh, hoặc Laravel Tinker

### 🔗 Kết nối:
- **Frontend ↔ Backend**: HTTP/JSON qua Axios
- **Backend ↔ MongoDB**: MongoDB Laravel Package
- **Backend ↔ Cache**: Laravel Cache (File/Redis)

### 📍 Các file quan trọng:
- **Routes**: `routes/api.php`
- **Controllers**: `app/Http/Controllers/API/`
- **Models**: `app/Models/`
- **Frontend**: `resources/js/`
- **Config**: `config/database.php`, `config/cache.php`

