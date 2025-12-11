# 🚀 Hướng dẫn chạy dự án Laravel Blog

## ⚡ Cách chạy nhanh nhất

**Chỉ cần double-click:** `START.bat`

Script sẽ tự động:
- ✅ Kiểm tra PHP, Composer, Node.js
- ✅ Cài đặt dependencies (nếu thiếu)
- ✅ Tạo file .env và APP_KEY
- ✅ Tạo các thư mục cần thiết
- ✅ Khởi động MongoDB & Redis
- ✅ Chạy Laravel và Vite

---

## 📋 Yêu cầu hệ thống

- **PHP** >= 8.1
- **Composer**
- **Node.js** >= 16
- **Docker Desktop** (cho MongoDB & Redis)

---

## 🎯 Các bước chạy dự án

### Bước 1: Kiểm tra toàn bộ dự án (Tùy chọn)

```bash
KIEM_TRA_TOAN_BO.bat
```

Script này sẽ:
- Kiểm tra tất cả file và thư mục cần thiết
- Tự động sửa các vấn đề có thể sửa được
- Tạo APP_KEY nếu thiếu
- Tạo các thư mục cần thiết

### Bước 2: Chạy dự án

```bash
START.bat
```

Hoặc chạy thủ công (2 terminal):

**Terminal 1 - Laravel:**
```bash
php artisan serve
```

**Terminal 2 - Vite:**
```bash
npm run dev
```

### Bước 3: Truy cập

Mở trình duyệt: **http://localhost:8000**

---

## 📝 Các Port

| Service | Port | URL |
|---------|------|-----|
| Laravel | 8000 | http://localhost:8000 |
| Vite | 5173 | http://localhost:5173 |
| MongoDB | 27017 | localhost:27017 |
| Redis | 6379 | localhost:6379 |

---

## ⚠️ Lưu ý quan trọng

1. **Phải chạy cả 2 server** (Laravel + Vite) cùng lúc
2. **MongoDB và Redis** phải chạy trước khi start Laravel
3. **APP_KEY** phải được tạo trong file .env

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "bootstrap\cache directory must be present"
→ Chạy: `TAO_THU_MUC.bat` hoặc `KIEM_TRA_TOAN_BO.bat`

### Lỗi: "APP_KEY not set"
→ Chạy: `php artisan key:generate`

### Lỗi: "MongoDB connection failed"
→ Khởi động MongoDB: `docker start mongodb` hoặc chạy `CAI_REDIS.bat`

### Lỗi: "Redis connection failed"
→ Khởi động Redis: `docker start redis` hoặc chạy `CAI_REDIS.bat`

### Lỗi: "Vite manifest not found"
→ Chạy `npm run dev` trong terminal riêng

---

## ✅ Checklist

Trước khi chạy, đảm bảo:
- [ ] Đã cài PHP >= 8.1
- [ ] Đã cài Composer
- [ ] Đã cài Node.js >= 16
- [ ] Đã cài Docker Desktop
- [ ] Đã chạy `composer install`
- [ ] Đã chạy `npm install`
- [ ] Đã có file `.env`
- [ ] Đã có `APP_KEY` trong `.env`
- [ ] MongoDB đang chạy
- [ ] Redis đang chạy

---

## 📚 Tài liệu thêm

- `README.md` - Tổng quan dự án
- API endpoints: Xem trong `routes/api.php`
