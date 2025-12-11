# 🔴 HƯỚNG DẪN REDIS TRONG DỰ ÁN LARAVEL BLOG

## 📚 MỤC LỤC
1. [Configuration (Cấu hình)](#1-configuration---cánh-cổng-kết-nối)
2. [Interacting (Tương tác)](#2-interacting---kho-lưu-trữ-tốc-độ-cao)
3. [Pub/Sub (Xuất bản/Đăng ký)](#3-pubsub---hệ-thống-phát-thanh)
4. [Ứng dụng thực tế trong dự án](#4-ứng-dụng-thực-tế-trong-dự-án)

---

## 1. Configuration - "Cánh cổng kết nối"

### 🎯 Khái niệm

**Configuration** là bước thiết lập thông số để Laravel "bắt tay" được với Redis Server.

### 📦 Bao gồm những gì?

#### **Driver (Client)** - Người phiên dịch giữa PHP và Redis

```
┌─────────────────────────────────────────┐
│         LARAVEL (PHP)                   │
│                                         │
│  Cache::remember()                      │
│  Redis::set()                           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  DRIVER (Predis)    │  ← Chuyển đổi lệnh PHP sang Redis Protocol
        └─────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      REDIS SERVER (Port 6379)           │
│  - Lưu trữ data trong RAM               │
│  - Cực nhanh (microsecond)              │
└─────────────────────────────────────────┘
```

**2 loại driver:**

1. **phpredis** (Extension C của PHP) - Nhanh hơn nhưng phải cài extension
2. **predis** (Thư viện PHP thuần) - Dễ cài đặt hơn (chỉ cần composer)

**Dự án này dùng:** `predis`

---

#### **Connection Details** - Thông tin kết nối

```env
REDIS_CLIENT=phpredis      # Driver sử dụng
REDIS_HOST=127.0.0.1       # Địa chỉ Redis Server
REDIS_PASSWORD=null        # Mật khẩu (nếu có)
REDIS_PORT=6379            # Cổng (mặc định 6379)
REDIS_DB=0                 # Database index (Redis chia thành db 0, 1, 2...)
```

---

### 🔌 Cách kết nối

```
[1] Laravel khởi động
     ↓
[2] Đọc file .env
     ↓
[3] Nạp config/database.php (lấy thông tin Redis)
     ↓
[4] Code gọi Redis::set()
     ↓
[5] Predis tạo kết nối TCP đến 127.0.0.1:6379
     ↓
[6] Redis Server nhận lệnh và xử lý
```

---

### ✅ Bạn đã làm gì trong dự án?

**File: `.env`**
```env
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0

# Bật Redis cho Cache
CACHE_STORE=redis

# Bật Redis cho Session
SESSION_DRIVER=redis
```

**File: `composer.json`**
```json
"require": {
    "predis/predis": "^2.0"
}
```

**Cài đặt:**
```bash
composer install
# hoặc
composer require predis/predis
```

---

## 2. Interacting - "Kho lưu trữ tốc độ cao"

### 🎯 Khái niệm

**Interacting** = Tương tác với Redis để lưu/lấy dữ liệu.

### 📊 So sánh tốc độ

```
┌──────────────────────────────────────────────────────────┐
│  Query MongoDB (Disk)         → ~50-200ms                │
│  Query Redis (RAM)            → ~0.5-2ms                 │
│                                                          │
│  Nhanh hơn 100 LẦN!                                      │
└──────────────────────────────────────────────────────────┘
```

---

### 🔑 Key-Value Structure

```
Key (Khóa)              Value (Giá trị)                 TTL
────────────────────────────────────────────────────────────
user:123:online         true                           7200 giây
post:456:views          1523                           Vĩnh viễn
trending_posts          [{...}, {...}]                 3600 giây
```

---

### 💻 Cách 1: Redis Facade (Thao tác thô)

**Khi nào dùng?**
- Đếm lượt view
- Tracking user online
- Rate limiting

**Ví dụ:**

```php
use Illuminate\Support\Facades\Redis;

// 1. Lưu dữ liệu (SET)
Redis::set('site_name', 'My Amazing Blog');

// 2. Lấy dữ liệu (GET)
$name = Redis::get('site_name');

// 3. Tăng biến đếm (INCREMENT) - Rất tốt cho lượt view
Redis::incr('post:100:views');

// 4. Lấy giá trị sau khi tăng
$views = Redis::get('post:100:views'); // 1, 2, 3...

// 5. Set với thời gian tự động xóa (TTL)
Redis::set('temp_data', 'value', 'EX', 3600); // Tự xóa sau 1 giờ

// 6. Xóa key
Redis::del('site_name');
```

---

### 🚀 Cách 2: Cache Facade (Khuyên dùng)

**Khi nào dùng?**
- Cache kết quả query từ MongoDB
- Lưu danh sách posts, categories
- Giảm tải database

**Ví dụ:**

```php
use Illuminate\Support\Facades\Cache;

// Logic: Thử lấy từ Redis. Nếu KHÔNG có → chạy function → lưu vào Redis
$trendingPosts = Cache::remember('trending_posts', 3600, function () {
    // Đoạn này CHỈ chạy khi Redis chưa có dữ liệu
    return Post::where('views', '>', 1000)->get();
});

// Lần 1: Query MongoDB (chậm) → Lưu vào Redis
// Lần 2-N: Lấy từ Redis (nhanh)
```

**Xóa cache thủ công:**
```php
Cache::forget('trending_posts');      // Xóa 1 key
Cache::flush();                       // Xóa toàn bộ cache
```

---

### 🎯 Ứng dụng trong dự án này

#### **PostController.php** - Đếm lượt view

```php
public function show($id)
{
    // Cache thông tin post
    $post = Cache::remember("post_{$id}", 3600, function () use ($id) {
        return Post::with(['user', 'category', 'comments'])->findOrFail($id);
    });

    // Tăng view count bằng Redis (cực nhanh)
    Redis::incr("post:{$id}:views");
    
    // Lấy tổng views
    $post->views_count = Redis::get("post:{$id}:views") ?? 0;

    return response()->json($post);
}
```

**Luồng hoạt động:**
```
User truy cập /api/posts/123
    ↓
[1] Laravel kiểm tra Redis: Có key "post_123" không?
    ├─ CÓ → Trả về luôn (nhanh)
    └─ KHÔNG → Query MongoDB → Lưu vào Redis → Trả về
    ↓
[2] Tăng view: Redis INCR post:123:views
    (0.5ms thay vì update MongoDB ~50ms)
```

---

#### **CategoryController.php** - Cache danh sách

```php
public function index()
{
    // Categories ít thay đổi → cache 24 giờ
    $categories = Cache::remember('all_categories', 86400, function () {
        return Category::all();
    });
    
    return response()->json($categories);
}
```

---

## 3. Pub/Sub - "Hệ thống phát thanh"

### 🎯 Khái niệm

**Pub/Sub** = Publish (Xuất bản) / Subscribe (Đăng ký)

Cho phép các phần khác nhau của ứng dụng nói chuyện với nhau **BẤT ĐỒNG BỘ**.

---

### 📡 Mô hình hoạt động

```
┌─────────────────────────────────────────────────────────┐
│  PUBLISHER (Người phát)                                 │
│  - User comment vào bài viết                            │
│  - System gửi tin: "Có comment mới!"                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  REDIS (Channel)      │
         │  Kênh: "blog-updates" │
         └───────────────────────┘
                     │
                     ├────────────────┐
                     ▼                ▼
      ┌──────────────────┐  ┌──────────────────┐
      │  SUBSCRIBER 1    │  │  SUBSCRIBER 2    │
      │  Gửi Email       │  │  Push Notification│
      └──────────────────┘  └──────────────────┘
```

---

### 💡 Tại sao cần Pub/Sub?

#### **Cách cũ (Đồng bộ - Chậm):**
```
User comment → Lưu MongoDB → Gửi Email → Tạo thông báo → Trả về
                (50ms)        (500ms)       (100ms)
                
→ User phải đợi 650ms
```

#### **Cách mới (Bất đồng bộ - Nhanh):**
```
User comment → Lưu MongoDB → Bắn tin vào Redis → Trả về ngay
                (50ms)                            
                
→ User chỉ đợi 50ms

[Trong nền] Worker nhận tin → Gửi email → Tạo thông báo
```

---

### 📝 Triển khai Pub/Sub

#### **Bước 1: Gửi tin (Publisher)**

**File: `CommentController.php`**
```php
use Illuminate\Support\Facades\Redis;

public function store(Request $request)
{
    // Lưu comment vào MongoDB
    $comment = Comment::create([...]);
    
    // Bắn tin vào Redis
    Redis::publish('blog-updates', json_encode([
        'type' => 'new_comment',
        'post_id' => $request->post_id,
        'user_name' => $request->user()->name,
    ]));
    
    return response()->json($comment, 201);
}
```

---

#### **Bước 2: Lắng nghe (Subscriber)**

**Tạo Command:**
```bash
php artisan make:command RedisSubscribe
```

**File: `app/Console/Commands/RedisSubscribe.php`**
```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class RedisSubscribe extends Command
{
    protected $signature = 'redis:subscribe';
    protected $description = 'Lắng nghe sự kiện từ Redis Pub/Sub';

    public function handle()
    {
        $this->info('Đang lắng nghe kênh blog-updates...');
        
        Redis::subscribe(['blog-updates'], function ($message) {
            $data = json_decode($message, true);
            
            // Xử lý theo loại sự kiện
            if ($data['type'] === 'new_comment') {
                $this->info("📬 Comment mới từ: {$data['user_name']}");
                
                // TODO: Gửi email thông báo
                // Mail::to($postAuthor)->send(new NewCommentNotification(...));
            }
        });
    }
}
```

**Chạy Worker:**
```bash
php artisan redis:subscribe
```

---

### 🔥 Use Cases cho Blog

1. **Thông báo realtime:**
   - User A comment → User B nhận thông báo ngay

2. **Xử lý tác vụ nặng:**
   - Tạo thumbnail ảnh
   - Gửi email hàng loạt
   - Generate PDF

3. **Logging và Analytics:**
   - Track user behavior
   - Đếm số người online

---

## 4. Ứng dụng thực tế trong dự án

### ✅ Đã triển khai

#### **1. Session Authentication (Redis Session)**

**File: `AuthController.php`**
```php
public function login(Request $request)
{
    // Tìm user
    $user = User::where('email', $request->email)->first();
    
    // TẠO SESSION - Laravel tự động:
    // - Tạo Session ID
    // - Lưu vào Redis (SESSION_DRIVER=redis)
    // - Gửi Cookie về trình duyệt
    Auth::login($user);
    
    // Tracking user online
    Redis::set("user:{$user->_id}:online", true, 'EX', 7200);
    
    return response()->json(['message' => 'Logged in']);
}
```

**Luồng hoạt động:**
```
[Login]
React gửi email + password
    ↓
Laravel validate → Tạo Session ID: "abc123xyz"
    ↓
Redis lưu: session:abc123xyz = {user_id: 1, ...}
    ↓
Laravel gửi Cookie về trình duyệt: laravel_session=abc123xyz
```

```
[Request tiếp theo]
React gửi /api/posts (kèm Cookie tự động)
    ↓
Laravel đọc Cookie: abc123xyz
    ↓
Redis kiểm tra: session:abc123xyz còn hợp lệ không?
    ├─ CÓ → User đã đăng nhập
    └─ KHÔNG → 401 Unauthorized
```

---

#### **2. Cache MongoDB Queries**

**CategoryController.php:**
```php
// Cache 24 giờ (ít thay đổi)
Cache::remember('all_categories', 86400, function () {
    return Category::all();
});
```

**PostController.php:**
```php
// Cache 1 giờ
Cache::remember("post_{$id}", 3600, function () use ($id) {
    return Post::with(['user', 'category', 'comments'])->findOrFail($id);
});
```

---

#### **3. View Counter (Redis INCR)**

```php
// Tăng view mỗi lần xem bài
Redis::incr("post:{$id}:views");

// Lấy tổng views
$views = Redis::get("post:{$id}:views");
```

**Tại sao không update MongoDB trực tiếp?**
- Redis INCR: ~0.5ms
- MongoDB Update: ~50ms
- **Nhanh hơn 100 lần!**

---

### 🚀 Có thể mở rộng

#### **1. Pub/Sub cho Real-time Comments**

```php
// CommentController.php
Redis::publish('new-comment', json_encode([
    'post_id' => $postId,
    'comment' => $comment,
]));

// Worker lắng nghe → Broadcast qua WebSocket → React nhận realtime
```

---

#### **2. Rate Limiting (Giới hạn số lần request)**

```php
$key = "rate_limit:user_{$userId}";
$requests = Redis::incr($key);

if ($requests === 1) {
    Redis::expire($key, 60); // Reset sau 60 giây
}

if ($requests > 100) {
    return response()->json(['error' => 'Too many requests'], 429);
}
```

---

#### **3. Leaderboard (Bảng xếp hạng)**

```php
// Tăng điểm user
Redis::zincrby('user_scores', 10, "user:{$userId}");

// Lấy top 10
$topUsers = Redis::zrevrange('user_scores', 0, 9, 'WITHSCORES');
```

---

## 📋 Tóm tắt cần nhớ

### **1. Configuration (Cấu hình)**
```env
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CACHE_STORE=redis
SESSION_DRIVER=redis
```

### **2. Interacting (Tương tác)**

**Cache Facade (Khuyên dùng):**
```php
Cache::remember('key', 3600, function () {
    return Post::all();
});
```

**Redis Facade (Cho biến đếm):**
```php
Redis::incr('post:123:views');
```

### **3. Pub/Sub (Realtime)**
```php
// Gửi
Redis::publish('channel', 'message');

// Nhận
Redis::subscribe(['channel'], function ($msg) {
    // Xử lý
});
```

---

## 🎯 Checklist triển khai

- [x] Cài Predis: `composer require predis/predis`
- [x] Cấu hình `.env`: `CACHE_STORE=redis`, `SESSION_DRIVER=redis`
- [x] Chạy Redis: `docker run -d -p 6379:6379 --name redis redis:latest`
- [x] AuthController: Dùng Session thay vì Token
- [x] PostController: Cache queries + đếm views
- [x] CategoryController: Cache danh sách
- [ ] (Tùy chọn) Tạo Command cho Pub/Sub
- [ ] (Tùy chọn) Integrate WebSocket cho realtime

---

## 🔗 Tài liệu tham khảo

- [Laravel Redis Documentation](https://laravel.com/docs/10.x/redis)
- [Predis GitHub](https://github.com/predis/predis)
- [Redis Commands](https://redis.io/commands/)

---

**Được tạo bởi:** Laravel Blog Optimization Team  
**Ngày:** <?php echo date('Y-m-d'); ?>
