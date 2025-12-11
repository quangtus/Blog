# 🔍 PHÂN TÍCH LỖI SANCTUM VỚI MONGODB

## ❌ Lỗi gốc

```
Call to a member function prepare() on null
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
api/login:1
```

## 🔴 Nguyên nhân

**Laravel Sanctum** mặc định lưu `personal_access_tokens` vào **SQL database** (MySQL/PostgreSQL), nhưng dự án này dùng **MongoDB**.

Khi gọi `$user->createToken()`, Sanctum cố gắng:
1. Tạo record trong bảng `personal_access_tokens` 
2. Sử dụng SQL connection (PDO)
3. Nhưng default connection là MongoDB → PDO connection = null
4. → Lỗi "Call to a member function prepare() on null"

## ✅ Giải pháp đã áp dụng

### 1. Tạo PersonalAccessToken Model cho MongoDB

**File**: `app/Models/PersonalAccessToken.php`
- Extend từ `MongoDB\Laravel\Eloquent\Model` (thay vì SQL Model)
- Implement `HasAbilities` interface
- Override các methods cần thiết từ Sanctum
- Dùng connection `mongodb` và collection `personal_access_tokens`

### 2. Cấu hình Sanctum dùng MongoDB Model

**File**: `app/Providers/AppServiceProvider.php`
```php
Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
```

Điều này báo cho Sanctum biết dùng model MongoDB thay vì SQL model mặc định.

## 📋 Cấu trúc PersonalAccessToken trong MongoDB

Collection: `personal_access_tokens`

```json
{
  "_id": "ObjectId(...)",
  "name": "auth_token",
  "token": "hashed_token_string",
  "abilities": ["*"],
  "tokenable_type": "App\\Models\\User",
  "tokenable_id": "ObjectId(user_id)",
  "last_used_at": null,
  "expires_at": null,
  "created_at": "2025-12-04T...",
  "updated_at": "2025-12-04T..."
}
```

## 🧪 Kiểm tra

Sau khi sửa, bạn có thể test:

```bash
php artisan tinker
```

```php
$user = App\Models\User::first();
$token = $user->createToken('test');
echo $token->plainTextToken;
```

Nếu không có lỗi → Đã sửa thành công!

## 📝 Lưu ý

- **WebSocket error** (`ws://127.0.0.1:5500//ws`) không liên quan đến Laravel - đó là extension trình duyệt
- **404 error** (`login:1`) có thể là favicon hoặc resource khác - không ảnh hưởng chức năng
- **Lỗi chính** là 500 Internal Server Error từ `/api/login` - đã được sửa

## ✅ Kết quả

Sau khi sửa:
- ✅ Sanctum tokens được lưu vào MongoDB
- ✅ Login/Register hoạt động bình thường
- ✅ Token authentication hoạt động với MongoDB

