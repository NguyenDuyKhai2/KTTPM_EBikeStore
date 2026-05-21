# KINETIC E-Bike Store (Web)

Monorepo cho cửa hàng xe điện KINETIC: **frontend web** (React + Vite) và **backend API** (Spring Boot), dùng chung types/API qua `packages/shared-code`.

## Thành phần

- `backend` — Spring Boot API, PostgreSQL, Flyway
- `packages/web` — ứng dụng web (khách hàng, admin, manager)
- `packages/shared-code` — Redux, API client, types dùng chung với web

## Tính năng web

- Trang chủ, danh sách & chi tiết sản phẩm
- Đăng nhập, đăng ký, yêu thích
- Checkout, VNPay, chatbot
- Khu vực khách hàng: dashboard, đơn hàng, hồ sơ
- Khu vực admin & manager (đơn hàng, thanh toán, khách hàng, sản phẩm)

## Yêu cầu

- Node.js 18+, npm 9+
- Java 17, Maven 3.9+ (cho backend)
- Docker (tùy chọn, chạy PostgreSQL)

## Chạy local

```bash
# Cài dependencies
npm install

# Database (từ thư mục backend)
cd backend
docker compose up -d postgres

# API (terminal khác)
cd backend
mvn spring-boot:run
```

API mặc định: `http://localhost:8080/api/v1`

```bash
# Web (từ root)
npm run dev
# hoặc
npm run dev:web
```

Web: `http://localhost:5173`

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy Vite dev server (web) |
| `npm run dev:web` | Giống `dev` |
| `npm run dev:backend` | Spring Boot |
| `npm run build` | Build web + shared-code |
| `npm run build:web` | Build production web |

## Đọc code nhanh

1. `packages/web/src/router/index.tsx` — routing
2. `packages/shared-code/src/api/` — API client
3. `backend/.../SecurityConfiguration.java` — phân quyền

Chi tiết backend, DB, migration: xem các mục còn lại trong lịch sử repo hoặc `backend/README` nếu có.
