# NestJS Backend API

Backend API được xây dựng với NestJS framework.

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install
```

## ⚙️ Cấu hình

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Application
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=demo_trust

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d
```

## 🏃 Chạy ứng dụng

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Server sẽ chạy tại: `http://localhost:3001`

## 📚 API Endpoints

### Users API

- **GET** `/users` - Lấy danh sách tất cả users
- **GET** `/users/:id` - Lấy thông tin user theo ID
- **POST** `/users` - Tạo user mới
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **PATCH** `/users/:id` - Cập nhật thông tin user
- **DELETE** `/users/:id` - Xóa user

### Health Check

- **GET** `/` - Kiểm tra server status

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📁 Cấu trúc thư mục

```
src/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## 🔧 Công nghệ sử dụng

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Typed superset of JavaScript
- **class-validator** - Validation decorators
- **class-transformer** - Object transformation

## 📝 Ghi chú

- Backend này đang sử dụng in-memory storage cho demo
- Để sử dụng database thực, cần cấu hình TypeORM và entities
- CORS đã được enable cho frontend chạy trên port 3000 và 5173
