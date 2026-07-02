# Form Manager - Hệ thống Quản lý Form Khảo sát

Hệ thống Quản lý Form Khảo sát (Form Manager) là một ứng dụng web hiện đại cho phép người dùng và quản trị viên tạo lập các form khảo sát động, phân phối và thu thập phản hồi một cách nhanh chóng và an toàn.

Dự án được phát triển theo mô hình Client-Server với cấu trúc phân tách rõ ràng giữa Backend (Spring Boot) và Frontend (React).

---

## 🛠️ Công nghệ sử dụng

### Backend
*   **Java 21** & **Spring Boot 4.1.0** (với Spring Web, Security, Data JPA, Validation)
*   **JSON Web Token (JWT)** cho xác thực không trạng thái (stateless authentication)
*   **MySQL Database** làm cơ sở dữ liệu quan hệ
*   **Springdoc OpenAPI (Swagger)** để tự động hóa tài liệu API

### Frontend
*   **React 19** & **Vite**
*   **Tailwind CSS v4** cho giao diện hiện đại và tối ưu biến giao diện
*   **React Router v7** điều hướng trang
*   **Axios** để giao tiếp API (kèm interceptor xử lý envelope phản hồi)
*   **Shadcn UI** & **Lucide Icons** cho các component UI chuẩn hóa
*   **Sonner Toasts** thông báo hệ thống trực quan

---

## ⚙️ Hướng dẫn Cài đặt & Chạy ứng dụng

### 1. Yêu cầu hệ thống
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
*   **Java Development Kit (JDK) 21** trở lên.
*   **Node.js (v18+)** và trình quản lý gói **npm**.
*   **MySQL Server (8.0+)** đang chạy cục bộ hoặc trên cloud.

---

### 2. Cài đặt và Chạy Backend

1.  **Chuẩn bị cơ sở dữ liệu:**
    Tru cập vào MySQL CLI hoặc công cụ quản trị (như DBeaver, phpMyAdmin) và tạo một database mới:
    ```sql
    CREATE DATABASE form_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```

2.  **Cấu hình biến môi trường:**
    *   Tạo file `.env.properties` tại thư mục `backend/` (hoặc copy từ file mẫu `backend/.env.properties.example`):
    *   Cấu hình thông tin database và các khóa bảo mật cần thiết:
        ```properties
        PORT=8080
        DB_URL=jdbc:mysql://localhost:3306/form_manager?useSSL=false&serverTimezone=UTC
        DB_USERNAME=root
        DB_PASSWORD=your_mysql_password
        
        # Cấu hình JWT
        JWT_SECRET=your_jwt_secret_key_must_be_at_least_32_characters_long
        
        # Cấu hình CORS (nếu cần)
        FRONTEND_URL=http://localhost:5173
        ```

3.  **Khởi động Backend:**
    Mở terminal tại thư mục `backend/` và thực thi:
    ```bash
    # Sử dụng Maven Wrapper
    ./mvnw spring-boot:run
    ```
    *Lưu ý: Trên Windows PowerShell, bạn có thể chạy: `./mvnw.cmd spring-boot:run` hoặc `mvn spring-boot:run` nếu đã cấu hình Maven trong biến môi trường.*

    Sau khi chạy thành công, backend sẽ mở tại cổng `8080`. Cơ sở dữ liệu sẽ tự động tạo bảng nhờ cơ chế `spring.jpa.hibernate.ddl-auto=update` trong `application.properties`.

4.  **Dữ liệu mẫu ban đầu (Database Seeding):**
    Hệ thống sử dụng `DataInitializer.java` để tự động tạo dữ liệu mẫu nếu cơ sở dữ liệu trống. Bạn có thể sử dụng các tài khoản sau để thử nghiệm ngay lập tức:
    *   **Tài khoản Quản trị viên (Admin):**
        *   **Email:** `admin@example.com`
        *   **Mật khẩu:** `admin123`
    *   **Tài khoản Người dùng (User):**
        *   **Email:** `user@example.com`
        *   **Mật khẩu:** `user123`

5.  **Tài liệu API (Swagger):**
    Khi backend đang chạy, bạn có thể truy cập tài liệu và thử nghiệm các API trực tiếp tại:
    `http://localhost:8080/swagger-ui/index.html`

---

### 3. Cài đặt và Chạy Frontend

1.  **Cấu hình biến môi trường:**
    *   Di chuyển vào thư mục `frontend/`.
    *   Tạo file `.env` bằng cách copy từ file mẫu `frontend/.env.example`:
        ```env
        VITE_API_BASE_URL=http://localhost:8080/api
        ```

2.  **Cài đặt thư viện:**
    Mở terminal tại thư mục `frontend/` và chạy:
    ```bash
    npm install
    ```

3.  **Khởi chạy môi trường Phát triển:**
    Chạy lệnh sau để khởi động Vite Development Server:
    ```bash
    npm run dev
    ```
    Mặc định, ứng dụng frontend sẽ chạy tại địa chỉ: `http://localhost:5173`.

---
