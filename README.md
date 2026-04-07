# E-Bike Multiplatform

Hệ thống bán xe điện đa nền tảng theo mô hình monorepo, định hướng giống các hãng như Yadea:
- `backend`: Spring Boot, quản lý nghiệp vụ, dữ liệu, phân quyền
- `packages/web`: web storefront/admin
- `packages/mobile`: mobile app
- `packages/desktop`: desktop app nội bộ
- `packages/shared-code`: phần shared cho frontend clients

Hiện tại nhóm đang đi theo hướng `backend-first`: xây domain model, database, phân quyền và API trước, sau đó mới kết nối web/mobile/desktop.

## Mục tiêu dự án

Project hướng tới một hệ thống thương mại điện tử cho xe điện với các khả năng chính:
- quản lý danh mục xe điện, biến thể, màu sắc, hình ảnh, thông số kỹ thuật
- quản lý người dùng, địa chỉ, preferences
- đặt hàng, thanh toán, giao hàng
- chatbot tư vấn sản phẩm và FAQ
- phân quyền chi tiết theo `Permission-based Access Control (PBAC)`

## Công nghệ chính

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Flyway
- Maven

### Frontend/Clients
- React + Vite
- React Native + Expo
- Electron + React
- shared TypeScript package trong monorepo

## Cấu trúc repository

```text
e-bike-multiplatform/
├─ backend/
│  ├─ src/main/java/com/ebike/
│  │  ├─ authModule/
│  │  ├─ productModule/
│  │  ├─ orderModule/
│  │  ├─ userModule/
│  │  ├─ chatbotModule/
│  │  ├─ shared/
│  │  └─ config/
│  └─ src/main/resources/db/migration/
├─ packages/
│  ├─ shared-code/
│  ├─ web/
│  ├─ mobile/
│  └─ desktop/
└─ package.json
```

## Kiến trúc hiện tại

### 1. Monorepo
- tất cả source nằm trong một repo
- backend và các app client phát triển song song
- frontend clients có thể dùng chung types, API clients, hooks, redux từ `packages/shared-code`

### 2. Backend theo module

Backend hiện được chia theo module nghiệp vụ:

- `authModule`
  - người dùng đăng nhập
  - role, permission, PBAC
  - authentication log
- `productModule`
  - category
  - product
  - review
  - specification, variant, image cho xe điện
- `orderModule`
  - order
  - order item
  - payment
  - shipment
- `userModule`
  - địa chỉ người dùng
  - preference người dùng
- `chatbotModule`
  - đã tạo skeleton thư mục, chưa build đầy đủ entity/service
- `shared`
  - constants và các phần dùng chung

### 3. Permission-based Access Control

Project không dừng ở RBAC đơn thuần. Hiện backend đang theo PBAC:

- `Role`: nhóm quyền
- `Permission`: quyền thao tác cụ thể
- `UserPermission`: quyền gán trực tiếp cho user, có thể `grant` hoặc `deny`

Ví dụ quyền:
- `product:view`
- `product:create`
- `order:create`
- `order:update-status`
- `payment:refund`
- `permission:manage`

File hằng số quyền:
- [backend/src/main/java/com/ebike/shared/constants/PermissionConstants.java](backend/src/main/java/com/ebike/shared/constants/PermissionConstants.java)

## Những gì backend đã build xong

### Auth domain
- `User`
- `Role`
- `Permission`
- `UserPermission`
- `AuthenticationLog`

### Product domain

Phần này đã được thiết kế chi tiết theo domain xe điện kiểu Yadea:

- `Category`
- `Product`
- `Review`
- `ProductSpecification`
- `ProductVariant`
- `ProductImage`

Một số thông tin kỹ thuật đã có trong `ProductSpecification`:
- loại xe
- loại pin
- dung lượng pin
- điện áp pin
- thời gian sạc
- tốc độ tối đa
- quãng đường tối đa
- công suất motor
- tải trọng
- kích thước bánh
- loại phanh
- kiểu truyền động
- smart features
- bảo hành

### Order domain
- `Order`
- `OrderItem`
- `Payment`
- `Shipment`

### User domain
- `UserAddress`
- `UserPreference`

### Database migration

Flyway đã có migration cho:
- tạo schema ban đầu
- auth tables
- product tables
- order tables
- user tables

Các file chính:
- [backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql](backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql)
- [backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql](backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql)
- [backend/src/main/resources/db/migration/V1_0_2__product_tables.sql](backend/src/main/resources/db/migration/V1_0_2__product_tables.sql)
- [backend/src/main/resources/db/migration/V1_0_3__order_tables.sql](backend/src/main/resources/db/migration/V1_0_3__order_tables.sql)
- [backend/src/main/resources/db/migration/V1_0_5__user_tables.sql](backend/src/main/resources/db/migration/V1_0_5__user_tables.sql)

## Database structure & migration workflow

Mục tiêu của phần này là giúp thành viên mới biết nên xem file nào trước, file nào chạy thật, và khi thay đổi database thì phải làm theo cách nào để không làm rối lịch sử migration.

### 1. Cách hiểu nhanh

- thư mục `backend/src/main/resources/db/migration/` là nơi Flyway chạy thật
- file [backend/src/main/resources/db/schema-overview.sql](backend/src/main/resources/db/schema-overview.sql) là file tổng hợp để đọc nhanh toàn bộ schema hiện tại
- `schema-overview.sql` không thay thế migration versioned của Flyway
- `backend/sql-init/` là nơi để các file hỗ trợ local/dev nếu nhóm cần khởi tạo nhanh môi trường

### 2. Nên mở file nào khi mới vào dự án

Nếu chỉ muốn hiểu “database hiện có những gì”, đọc theo thứ tự:

1. [backend/src/main/resources/db/schema-overview.sql](backend/src/main/resources/db/schema-overview.sql)
2. [backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql](backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql)
3. [backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql](backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql)
4. [backend/src/main/resources/db/migration/V1_0_2__product_tables.sql](backend/src/main/resources/db/migration/V1_0_2__product_tables.sql)
5. [backend/src/main/resources/db/migration/V1_0_3__order_tables.sql](backend/src/main/resources/db/migration/V1_0_3__order_tables.sql)
6. [backend/src/main/resources/db/migration/V1_0_5__user_tables.sql](backend/src/main/resources/db/migration/V1_0_5__user_tables.sql)

### 3. Ý nghĩa của từng loại file

- `V1_0_0__Initial_Schema.sql`: tạo các schema logic như `ebike_auth`, `ebike_product`, `ebike_order`, `ebike_user`, `ebike_chatbot`
- `V1_0_1...V1_0_5`: mỗi file phụ trách một nhóm bảng theo module nghiệp vụ
- `schema-overview.sql`: file tài liệu để nhìn toàn cảnh ở một chỗ

### 4. Quy tắc khi thay đổi database

- không sửa bừa các migration cũ đã được commit và có thể đã chạy ở máy người khác
- mỗi thay đổi mới phải tạo một migration mới
- tên file phải mô tả đúng mục đích thay đổi
- sau khi thêm migration mới, cập nhật lại `schema-overview.sql`

Ví dụ:

- `V1_0_6__add_cart_tables.sql`
- `V1_0_7__alter_products_add_brand.sql`
- `V1_0_8__add_chatbot_conversations.sql`

### 5. Workflow đề xuất cho team

Khi cần thêm hoặc sửa schema:

1. xác định module bị ảnh hưởng
2. tạo migration mới trong `backend/src/main/resources/db/migration/`
3. viết thay đổi theo hướng chỉ thêm mới hoặc alter rõ ràng
4. chạy app để Flyway apply migration
5. kiểm tra lại entity/repository/service liên quan
6. cập nhật [backend/src/main/resources/db/schema-overview.sql](backend/src/main/resources/db/schema-overview.sql)

### 6. Câu ngắn để nhớ

- muốn xem toàn bộ DB: mở `schema-overview.sql`
- muốn biết app chạy DB thế nào: xem `db/migration`
- muốn đổi DB: tạo migration mới, không sửa lịch sử cũ

## Các file quan trọng để đọc trước

Nếu là thành viên mới trong nhóm, nên đọc theo thứ tự này:

1. [backend/pom.xml](backend/pom.xml)
2. [backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql](backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql)
3. [backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql](backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql)
4. [backend/src/main/resources/db/migration/V1_0_2__product_tables.sql](backend/src/main/resources/db/migration/V1_0_2__product_tables.sql)
5. [backend/src/main/java/com/ebike/productModule/entity/Product.java](backend/src/main/java/com/ebike/productModule/entity/Product.java)
6. [backend/src/main/java/com/ebike/productModule/entity/ProductSpecification.java](backend/src/main/java/com/ebike/productModule/entity/ProductSpecification.java)
7. [backend/src/main/java/com/ebike/shared/constants/PermissionConstants.java](backend/src/main/java/com/ebike/shared/constants/PermissionConstants.java)
8. [packages/shared-code/src/index.ts](packages/shared-code/src/index.ts)

## Trạng thái hiện tại của project

### Đã có
- skeleton monorepo
- backend entities và repositories cốt lõi
- migration SQL cho auth/product/order/user
- PBAC model
- shared-code skeleton cho frontend
- skeleton cho web/mobile/desktop

### Chưa hoàn thiện
- DTO cho backend
- service business logic thật
- controller endpoint thật
- Spring Security tích hợp PBAC đầy đủ
- seed dữ liệu role/permission mặc định
- chatbot entity/service hoàn chỉnh
- frontend UI thật sự kết nối API

## Cách chạy backend

```bash
cd backend
mvn clean compile
```

Nếu muốn chạy app:

```bash
cd backend
mvn spring-boot:run
```
chạy seed data sản phẩm : 
chạy theo thứ tự : 

1.
docker cp backend/dataCawl/yadea_products.seed.sql ebike-postgres:/tmp/yadea_products.seed.sql
2.
docker exec -i ebike-postgres psql -U ebike_user -d ebike_db -v ON_ERROR_STOP=1 -f /tmp/yadea_products.seed.sql



Lưu ý:
- cần cấu hình thêm `application.properties` và database nếu muốn chạy đầy đủ
- hiện tại compile backend đã pass

## Cách làm việc nhóm đề xuất

### Nhánh Backend
- hoàn thiện DTO
- viết service cho auth/product/order
- tích hợp security + permission check
- thêm seed data role/permission/category/product

### Nhánh Frontend
- dựa vào entity và DB model để chốt contract API
- xây types shared bám theo backend
- tạo UI cho catalog sản phẩm, chi tiết sản phẩm, giỏ hàng, đơn hàng

### Nhánh Chatbot
- định nghĩa entity/migration cho conversation, faq, history
- nối chatbot với product data để tư vấn xe điện

## Đề xuất permission mẫu cho hệ thống

### Guest
- xem sản phẩm
- tìm kiếm sản phẩm
- xem danh mục
- xem review

### Customer
- quản lý giỏ hàng
- tạo đơn hàng
- xem đơn của chính mình
- thanh toán
- cập nhật hồ sơ
- viết review

### Staff/Admin
- tạo/sửa/xóa sản phẩm
- quản lý tồn kho
- cập nhật trạng thái đơn
- hoàn tiền
- quản lý user, role, permission
- xem dashboard và báo cáo

## Hướng phát triển tiếp theo

Các bước nên làm tiếp theo theo thứ tự:

1. hoàn thiện auth DTO + login/register flow
2. seed `roles` và `permissions` mặc định từ `PermissionConstants`
3. tích hợp PBAC vào Spring Security
4. viết `ProductDTO`, `ProductDetailDTO`, `ProductService`, `ProductController`
5. viết `OrderService` và flow checkout cơ bản
6. sau đó mới nối web/mobile/desktop vào API

## Ghi chú cho nhóm

- Repo này hiện đang trong giai đoạn dựng nền kiến trúc, chưa phải production-ready
- Nếu muốn thêm tính năng mới, ưu tiên cập nhật:
  - migration SQL
  - entity
  - repository/service
  - DTO/controller
  - cuối cùng mới tới frontend
- Không nên tự ý đổi tên permission code nếu chưa thống nhất vì frontend và security sau này sẽ phụ thuộc vào chúng

## Tác giả và nhóm

Project được xây để phục vụ bài tập/đồ án kiến trúc phần mềm. Mọi thành viên trong nhóm nên dùng README này làm điểm bắt đầu để hiểu codebase trước khi code tiếp.
