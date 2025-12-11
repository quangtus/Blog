# 📊 HƯỚNG DẪN XEM CƠ SỞ DỮ LIỆU

## ✅ Dữ liệu đã được tạo thành công!

Sau khi chạy seeder, database hiện có:
- ✅ **Users**: 1 user (user bạn đã đăng ký)
- ✅ **Categories**: 6 categories
- ✅ **Posts**: 6 bài viết
- ✅ **Comments**: Nhiều comments (mỗi post có 3-4 comments)

---

## 🔍 CÁCH XEM DATABASE

### 1. Dùng MongoDB Compass (GUI - Dễ nhất)

1. **Mở MongoDB Compass**
2. **Kết nối**: `mongodb://localhost:27017`
3. **Chọn database**: `blog_db`
4. **Xem collections**:
   - `users` - Bảng người dùng
   - `categories` - Bảng danh mục (6 categories)
   - `posts` - Bảng bài viết (6 posts)
   - `comments` - Bảng bình luận

**Các categories đã tạo:**
- Công Nghệ
- Lập Trình
- Web Development
- Mobile Development
- Database
- DevOps

**Các bài viết đã tạo:**
1. Giới thiệu về Laravel Framework
2. React Hooks: useState và useEffect
3. MongoDB vs MySQL: So sánh NoSQL và SQL
4. Docker cho người mới bắt đầu
5. Redis: In-Memory Database cho Cache
6. RESTful API với Laravel

---

### 2. Dùng Laravel Tinker (Command Line)

```bash
php artisan tinker
```

**Xem số lượng:**
```php
App\Models\User::count();
App\Models\Category::count();
App\Models\Post::count();
App\Models\Comment::count();
```

**Xem dữ liệu:**
```php
// Xem tất cả categories
App\Models\Category::all();

// Xem tất cả posts
App\Models\Post::all();

// Xem posts với relationships
App\Models\Post::with(['user', 'category', 'comments'])->get();

// Xem comments
App\Models\Comment::with(['user', 'post'])->get();
```

---

### 3. Dùng MongoDB Shell (mongosh)

```bash
mongosh mongodb://localhost:27017
```

```javascript
// Chọn database
use blog_db

// Xem collections
show collections

// Xem dữ liệu
db.users.find().pretty()
db.categories.find().pretty()
db.posts.find().pretty()
db.comments.find().pretty()

// Đếm số lượng
db.users.count()
db.categories.count()
db.posts.count()
db.comments.count()
```

---

### 4. Dùng Command Test (Đã tạo)

```bash
php artisan mongodb:test
```

---

## 📋 CẤU TRÚC DỮ LIỆU

### Collection: `users`
```json
{
  "_id": "ObjectId(...)",
  "name": "Tên người dùng",
  "email": "email@example.com",
  "password": "$2y$...",
  "role": "user" hoặc "admin",
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

### Collection: `categories`
```json
{
  "_id": "ObjectId(...)",
  "name": "Công Nghệ",
  "slug": "cong-nghe",
  "description": "Tin tức về công nghệ...",
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

### Collection: `posts`
```json
{
  "_id": "ObjectId(...)",
  "title": "Giới thiệu về Laravel Framework",
  "slug": "gioi-thieu-ve-laravel-framework-...",
  "content": "<h2>Laravel là gì?</h2>...",
  "excerpt": "Laravel là một PHP framework...",
  "status": "published",
  "user_id": "ObjectId(...)",
  "category_id": "ObjectId(...)",
  "featured_image": null,
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

### Collection: `comments`
```json
{
  "_id": "ObjectId(...)",
  "content": "Bài viết rất hay và hữu ích!",
  "post_id": "ObjectId(...)",
  "user_id": "ObjectId(...)",
  "parent_id": null hoặc "ObjectId(...)",
  "status": "approved" hoặc "pending",
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

---

## 🔄 CHẠY LẠI SEEDER

Nếu muốn xóa và tạo lại dữ liệu:

```bash
# Xóa tất cả dữ liệu (cẩn thận!)
php artisan tinker
# Trong tinker:
App\Models\Comment::truncate();
App\Models\Post::truncate();
App\Models\Category::truncate();
// KHÔNG xóa users nếu bạn muốn giữ tài khoản

# Chạy lại seeder
php artisan db:seed
```

Hoặc chạy seeder cụ thể:
```bash
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=PostSeeder
php artisan db:seed --class=CommentSeeder
```

---

## ✅ HOÀN THÀNH YÊU CẦU

Theo yêu cầu trong `yêu cầu .txt`:
- ✅ **User**: Đã có (1 user)
- ✅ **Category**: Đã có (6 categories)
- ✅ **Post**: Đã có (6 posts)
- ✅ **Comment**: Đã có (nhiều comments)

**Tất cả các bảng đã được tạo và có dữ liệu mẫu!**

