# Hướng dẫn cấu hình Database

## Lỗi hiện tại
```
Access denied for user 'root'@'localhost' (using password: NO)
```

## Cách khắc phục

### Bước 1: Cập nhật file `.env`

Mở file `e:\demo_trust\be\.env` và cập nhật mật khẩu MySQL:

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE  # ← Thay bằng mật khẩu MySQL của bạn
DB_DATABASE=naisu
```

### Bước 2: Tạo database (nếu chưa có)

Mở MySQL command line hoặc phpMyAdmin và chạy:

```sql
CREATE DATABASE IF NOT EXISTS naisu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 3: Restart backend server

Sau khi cập nhật `.env`, backend sẽ tự động restart và kết nối database.

## Kiểm tra kết nối

Nếu kết nối thành công, bạn sẽ thấy:

```
[Nest] LOG [TypeOrmModule] TypeORM connection initialized
✅ Seeded 6 products into database
🚀 Application is running on: http://localhost:3001
```

## Nếu vẫn lỗi

### Kiểm tra MySQL service đang chạy

**Windows:**
```bash
# Kiểm tra status
sc query MySQL80

# Start service nếu chưa chạy
net start MySQL80
```

### Kiểm tra thông tin kết nối

1. Mở MySQL Workbench hoặc phpMyAdmin
2. Xác nhận:
   - Host: 127.0.0.1
   - Port: 3306
   - Username: root
   - Password: (mật khẩu bạn đã set)

### Reset mật khẩu MySQL (nếu quên)

Nếu quên mật khẩu MySQL, bạn có thể reset bằng cách:

1. Stop MySQL service
2. Start MySQL với `--skip-grant-tables`
3. Đăng nhập và reset password
4. Restart MySQL service

## Alternative: Sử dụng user khác

Nếu không muốn dùng root, tạo user mới:

```sql
CREATE USER 'naisu_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON naisu.* TO 'naisu_user'@'localhost';
FLUSH PRIVILEGES;
```

Sau đó cập nhật `.env`:
```env
DB_USERNAME=naisu_user
DB_PASSWORD=your_password
```
