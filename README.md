# Laravel Blog Application

Ứng dụng blog đơn giản với Laravel + React + MongoDB + Redis.

## 🚀 Cách chạy nhanh

**Chỉ cần chạy:**
```bash
START.bat
```

Xem chi tiết trong file `HUONG_DAN_CHAY.md`

## 📋 Yêu cầu

- PHP >= 8.1
- Composer
- Node.js >= 16
- MongoDB (Docker)
- Redis (Docker)

## 📁 Cấu trúc

```
laravel/
├── app/                    # Backend Laravel
│   ├── Http/Controllers/   # API Controllers
│   ├── Models/             # MongoDB Models
│   └── Http/Middleware/   # Middleware
├── resources/js/           # Frontend React
│   ├── components/         # React Components
│   ├── pages/             # React Pages
│   └── contexts/          # React Contexts
├── routes/api.php          # API Routes
└── config/                 # Configuration
```

## 🔧 Scripts hỗ trợ

- `START.bat` - Chạy dự án tự động
- `CAI_REDIS.bat` - Cài Redis bằng Docker

## 📚 Tài liệu

- `HUONG_DAN_CHAY.md` - Hướng dẫn chi tiết cách chạy
- `README.md` - Tài liệu tổng quan

## 🌐 Ports

- Laravel: http://localhost:8000
- Vite: http://localhost:5173
- MongoDB: localhost:27017
- Redis: localhost:6379
