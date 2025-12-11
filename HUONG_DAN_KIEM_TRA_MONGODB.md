# Hướng Dẫn Kiểm Tra Kết Nối MongoDB

## 1. Kiểm tra MongoDB đã được cài đặt và chạy chưa

### Windows:
```powershell
# Kiểm tra MongoDB service
Get-Service -Name MongoDB

# Hoặc kiểm tra process
Get-Process -Name mongod -ErrorAction SilentlyContinue
```

### Kiểm tra MongoDB đang chạy trên port 27017:
```powershell
netstat -an | findstr 27017
```

## 2. Chạy lệnh test MongoDB connection trong Laravel

```bash
php artisan mongodb:test
```

Lệnh này sẽ kiểm tra:
- MongoDB PHP Extension đã được cài đặt chưa
- Cấu hình connection trong `.env`
- Kết nối đến MongoDB server
- Laravel DB connection
- Truy cập database
- Model connection

## 3. Kiểm tra cấu hình trong file `.env`

Đảm bảo các dòng sau có trong file `.env`:

```env
DB_CONNECTION=mongodb
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=blog_db
```

## 4. Kiểm tra MongoDB PHP Extension

```bash
php -m | findstr mongodb
```

Hoặc tạo file `test_mongodb.php`:
```php
<?php
if (extension_loaded('mongodb')) {
    echo "MongoDB extension is loaded\n";
    echo "Version: " . phpversion('mongodb') . "\n";
} else {
    echo "MongoDB extension is NOT loaded\n";
    echo "Please install: pecl install mongodb\n";
}
```

## 5. Nếu MongoDB chưa được cài đặt

### Cài đặt MongoDB trên Windows:
1. Download MongoDB Community Server từ: https://www.mongodb.com/try/download/community
2. Cài đặt và chạy MongoDB service
3. Hoặc chạy MongoDB bằng Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Cài đặt MongoDB PHP Extension:
```bash
# Với PECL
pecl install mongodb

# Sau đó thêm vào php.ini:
extension=mongodb.so  # Linux/Mac
extension=mongodb.dll  # Windows
```

## 6. Kiểm tra kết nối trực tiếp bằng PHP

Tạo file `test_connection.php`:
```php
<?php
require 'vendor/autoload.php';

try {
    $client = new MongoDB\Client('mongodb://localhost:27017');
    $admin = $client->selectDatabase('admin');
    $result = $admin->command(['ping' => 1]);
    echo "Connected successfully!\n";
    print_r($result->toArray());
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
```

Chạy:
```bash
php test_connection.php
```

## 7. Kiểm tra trong Laravel Tinker

```bash
php artisan tinker
```

Sau đó chạy:
```php
DB::connection('mongodb')->getMongoClient()->selectDatabase('admin')->command(['ping' => 1]);
```

## 8. Vị trí cấu hình MongoDB trong Laravel

- **Cấu hình database**: `config/database.php`
- **Cấu hình môi trường**: `.env`
- **Service Provider**: Tự động đăng ký bởi package `mongodb/laravel-mongodb`
- **Models**: `app/Models/` (User, Post, Category, Comment)

## 9. Troubleshooting

### Lỗi "Call to a member function prepare() on null"
- Nguyên nhân: Validation rules đang cố dùng SQL syntax
- Giải pháp: Đã sửa trong code, dùng manual check thay vì `Rule::exists()` và `Rule::unique()`

### Lỗi "Class 'Jenssegers\Mongodb\Eloquent\Model' not found"
- Nguyên nhân: Namespace cũ
- Giải pháp: Đã sửa thành `MongoDB\Laravel\Eloquent\Model`

### MongoDB không kết nối được
- Kiểm tra MongoDB service đang chạy
- Kiểm tra port 27017 không bị block
- Kiểm tra `MONGODB_URI` trong `.env` đúng chưa

