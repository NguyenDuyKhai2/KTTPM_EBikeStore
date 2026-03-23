# Roadmap 4 Tuan Thuc Te Cho Do An E-Bike Multiplatform

## 1. Muc tieu roadmap

Roadmap nay duoc rut gon tu tai lieu implementation ban dau de phu hop hon voi:

- thoi gian toi da 4 tuan
- nhom 4 sinh vien nam cuoi
- yeu cau cua mon Kien truc va thiet ke phan mem
- hien trang codebase dang o giai doan xay nen tang
- chatbot la mot phan quan trong, khong the thieu

Muc tieu khong phai la xay dung mot he thong kinh doanh day du cho doanh nghiep, ma la hoan thanh mot san pham do an co:

- kien truc hop ly
- phan chia module ro rang
- luong nghiep vu chinh demo duoc
- chatbot hoat dong that
- co kha nang mo rong ve sau

## 2. Dinh huong tong the

Roadmap nay giu nguyen huong phat trien backend-first cua repo hien tai:

1. Chot domain model va migration
2. Hoan thien service va controller cho cac luong chinh
3. Tich hop phan quyen o muc vua du
4. Khoa contract API va shared types
5. Ket noi web de demo end-to-end

Muc tieu san pham cuoi cung la:

- nguoi dung xem danh sach xe dien
- nguoi dung xem chi tiet san pham
- nguoi dung su dung chatbot de duoc tu van
- nguoi dung them gio hang va tao don hang
- he thong co dang nhap, phan quyen co ban, luu duoc du lieu chinh

## 3. Pham vi MVP can dat trong 4 tuan

### 3.1 Pham vi bat buoc

- Auth co ban
  - register
  - login
  - xem profile co ban
- PBAC muc co ban
  - guest
  - customer
  - admin hoac staff
- Product catalog
  - danh sach san pham
  - chi tiet san pham
  - filter hoac tim kiem co ban
- Cart va order
  - them vao gio hang
  - tao don hang
  - xem lich su don hang co ban
- Chatbot
  - FAQ co cau truc
  - tu van xe dua tren nhu cau
  - goi y san pham dua tren thuoc tinh
  - luu lich su chat theo user hoac session
- Web app
  - la client chinh de demo
  - goi API that
  - co cac man hinh phuc vu luong chinh

### 3.2 Gia tri hoc thuat cua MVP

MVP nay du de trinh bay cac y trong tam cua mon hoc:

- monorepo architecture
- modular backend design
- database migration voi Flyway
- API-based integration
- permission-based access control
- su tach biet giua frontend, backend, shared-code
- chatbot duoc mo hinh nhu mot module nghiep vu ro rang

## 4. Pham vi tam hoan

Nhung tinh nang sau khong nen dua vao commitment 4 tuan:

- warranty
- service booking
- spare parts
- maintenance reminder
- vehicle registration
- compliance checks
- virtual showroom
- community forum
- battery health monitoring
- support ticketing
- logistics
- sales CRM
- AI/ML phuc tap
- mobile va desktop feature day du

Ly do tam hoan:

- scope lon hon nang luc 4 tuan
- repo hien tai chua hoan thien service/controller/security thuc chien
- neu om qua nhieu tinh nang se lam giam chat luong code va giam kha nang demo on dinh

## 5. Dinh nghia chatbot trong do an

Chatbot la mot feature trong tam, nhung can duoc gioi han thuc te de lam tot.

### 5.1 Chatbot nen lam duoc

- tra loi FAQ tu bo du lieu co san
- tra loi cau hoi co lien quan den san pham
- goi y xe dua tren nhu cau nhu:
  - ngan sach
  - toc do
  - quang duong
  - loai xe
  - tinh nang
- de xuat 1 den 5 san pham phu hop
- dan nguoi dung den trang chi tiet san pham
- luu lich su chat de demo tinh lien tuc cua hoi thoai

### 5.2 Chatbot khong nen om trong 4 tuan

- mo hinh AI tu huan luyen rieng
- multi-agent
- voice assistant
- phan tich cam xuc
- chatbot tu dong thao tac don hang phuc tap
- NLP nang hoac vector search phuc tap

### 5.3 Huong ky thuat de lam chatbot nhanh va on

Nen uu tien chatbot theo huong rule-based va retrieval co cau truc:

- FAQ data
- keyword matching
- product attribute matching
- goi y theo bo quy tac don gian

Huong nay phu hop voi do an vi:

- de mo ta kien truc
- de kiem thu
- de giai thich tai buoi bao ve
- de mo rong ve sau

## 6. Kien truc chuc nang de team bam theo

### 6.1 Backend modules uu tien

- authModule
- productModule
- orderModule
- userModule
- chatbotModule
- shared

### 6.2 Nguyen tac implementation

Moi feature moi nen bam theo trinh tu:

1. migration
2. entity
3. repository
4. service
5. DTO
6. controller
7. permission
8. shared types va frontend integration

### 6.3 Nguyen tac de de mo rong sau nay

- khong viet business logic lon trong controller
- khong de frontend tu do dinh nghia API contract
- chatbot phai tach rieng module, khong tron logic voi product hay order
- permission code phai dat tap trung
- migration va entity phai di cung nhau
- shared-code chi nhan contract da chot tu backend

## 7. Timeline chi tiet 4 tuan

## Tuan 1: Chot nen backend va contract

### Muc tieu tuan 1

Hoan thien khung backend de team co the phat trien song song va khong bi lech contract.

### Cong viec chinh

- Auth
  - DTO cho login/register
  - service co ban
  - endpoint login/register
- Product
  - ProductDTO
  - ProductDetailDTO
  - API list va detail
  - filter tim kiem co ban
- Order
  - ra soat lai model order/cart
  - xac dinh luong checkout toi thieu
  - tao endpoint can thiet cho gio hang va tao don
- Chatbot
  - thiet ke entity cho FAQ, conversation, message, hoac lich su hoi dap
  - migration cho chatbot data
  - xac dinh kieu input va output cua chatbot API
- Shared contract
  - chot JSON response cho auth, product, order, chatbot
  - dong bo shared-code types theo backend

### Deliverable cuoi tuan 1

- backend compile va chay duoc
- auth API co ban co the goi
- product API list/detail co the goi
- chatbot schema va API contract da duoc chot
- team thong nhat pham vi MVP, khong mo rong them scope

## Tuan 2: Hoan thien chatbot va nen bao mat co ban

### Muc tieu tuan 2

Bien chatbot thanh mot tinh nang that su dung duoc, dong thoi hoan thien phan quyen co ban.

### Cong viec chinh

- Security va PBAC
  - seed role va permission co ban
  - tich hop Spring Security o muc vua du
  - tach quyen guest, customer, admin/staff
- Product data
  - seed category, product, specification, image
  - tao bo du lieu dep de chatbot tu van
- Chatbot backend
  - API gui cau hoi
  - API lay lich su chat
  - logic FAQ matching
  - logic product recommendation theo nhu cau
  - luu conversation va message
- Chatbot content
  - tao bo cau hoi FAQ mau
  - tao tap quy tac de goi y san pham

### Deliverable cuoi tuan 2

- nguoi dung co the dat cau hoi cho chatbot
- chatbot tra loi duoc FAQ
- chatbot goi y san pham co lien quan den du lieu that
- role va permission co ban da hoat dong

## Tuan 3: Web demo end-to-end

### Muc tieu tuan 3

Ket noi web voi backend de co luong demo day du tren giao dien.

### Cong viec chinh

- Web storefront
  - trang home co noi dung thuc te hon
  - trang danh sach san pham
  - trang chi tiet san pham
  - filter hoac tim kiem co ban
- Web chatbot
  - man hinh chat
  - hien thi lich su hoi dap
  - hien thi danh sach san pham duoc goi y
  - link tu chatbot sang product detail
- Cart va order
  - them san pham vao gio
  - tao don hang
  - xem danh sach don cua minh o muc co ban
- Shared code
  - hooks
  - API client
  - types
  - state management toi thieu neu can

### Deliverable cuoi tuan 3

Luot demo chinh phai chay duoc:

1. Dang nhap hoac vao voi guest
2. Xem danh sach xe dien
3. Hoi chatbot de duoc tu van
4. Mo chi tiet san pham duoc goi y
5. Them vao gio
6. Tao don hang

## Tuan 4: Hoan thien, test va chuan bi bao ve

### Muc tieu tuan 4

Tang do on dinh, bo sung tai lieu kien truc, va chuan bi demo cho buoi bao ve.

### Cong viec chinh

- Sua bug va hoan thien validation
- Bo sung error handling va logging
- Test cac luong quan trong
  - auth
  - product list/detail
  - chatbot ask/recommendation
  - create order
- Chuan bi du lieu demo dep
- Chuan bi tai lieu mon hoc
  - tong quan kien truc
  - module diagram
  - sequence diagram cho login, chatbot, order
  - database schema
  - luong tich hop frontend-backend
- Neu con thoi gian
  - them compare san pham
  - hoac them review co ban

### Deliverable cuoi tuan 4

- ban demo on dinh
- tai lieu kien truc khop voi implementation
- code du sach de giai thich trong luc bao ve
- chatbot tro thanh diem nhan chinh cua do an

## 8. Phan cong 4 thanh vien

Day la cach chia thuc te de han che giam xung dot:

### Thanh vien 1: Auth va Security owner

- login/register
- user profile co ban
- PBAC
- Spring Security integration
- seed roles va permissions

### Thanh vien 2: Product owner

- product DTO/service/controller
- category, specification, image, variant neu can
- filter tim kiem
- seed product data

### Thanh vien 3: Order owner

- cart flow
- order flow
- checkout co ban
- order history co ban

### Thanh vien 4: Chatbot owner

- chatbot migration
- chatbot entity/repository/service/controller
- FAQ logic
- recommendation logic
- chatbot UI flow tren web

### Nguyen tac phoi hop

- backend contract doi voi moi module phai duoc chot som
- moi owner la nguoi chiu trach nhiem chinh cho file/module cua minh
- thay doi cross-module phai thong bao som
- khong doi permission code tuy y

## 9. Scope in va scope out ro rang

### Scope in

- backend API cho auth, product, order, chatbot
- web demo cho luong chinh
- chatbot co xu ly du lieu that
- test cho cac case chinh
- tai lieu kien truc phuc vu mon hoc

### Scope out

- mobile va desktop hoan chinh
- AI/ML nang
- dashboard staff day du
- after-sales modules lon
- he thong van hanh doanh nghiep day du

## 10. Tieu chi danh gia thanh cong

Roadmap duoc xem la thanh cong neu den cuoi tuan 4 team co:

- backend module ro rang
- migration duoc quan ly bang Flyway
- API that chu khong chi mock
- web goi duoc backend
- chatbot tra loi va goi y duoc
- luong mua hang co ban demo duoc
- co phan quyen co ban
- co tai lieu kien truc dong bo voi code

## 11. Rui ro va cach giam thieu

### Rui ro 1: Om qua nhieu tinh nang

Giam thieu:

- khoa scope ngay tu dau
- bat ky tinh nang nao khong nam trong MVP deu dua vao backlog

### Rui ro 2: Chatbot bi lam qua phuc tap

Giam thieu:

- su dung huong FAQ + rule-based recommendation
- khong theo duoi AI nang trong 4 tuan

### Rui ro 3: Frontend va backend lech contract

Giam thieu:

- chot DTO o tuan 1
- shared-code chi lay theo contract da thong nhat

### Rui ro 4: Security lam mat nhieu thoi gian

Giam thieu:

- chi lam muc PBAC du dung cho guest/customer/admin
- khong mo rong permission qua chi tiet trong MVP

### Rui ro 5: Demo loi vi thieu du lieu

Giam thieu:

- seed data tu som
- chuan bi bo du lieu demo cho product va chatbot

## 12. Ke hoach mo rong sau 4 tuan

Roadmap nay khong lam kho viec mo rong, ma nguoc lai tao nen de mo them module.

Neu sau nay con thoi gian, nen mo rong theo thu tu:

1. Compare san pham
2. Review va rating hoan chinh hon
3. Warranty
4. Service booking
5. Spare parts
6. Maintenance reminder
7. Support hoac ticketing

Khong nen mo rong bang cach nhay thang vao:

- logistics
- sales CRM
- community forum
- virtual showroom
- AI/ML nang

Ly do:

- cac module tren phu thuoc vao nen auth, product, order, chatbot da on dinh
- mo rong theo thu tu nay se it phai dap di lam lai hon

## 13. Ket luan

Roadmap 4 tuan nay uu tien su can bang giua:

- tinh thuc te
- gia tri do an
- kha nang demo
- kha nang mo rong tuong lai

Trong toan bo roadmap, chatbot khong phai la phan phu, ma la mot trong nhung diem nhan chinh cua he thong. Cach tiep can tot nhat la lam chatbot that tot trong pham vi vua du, thay vi co gang om them qua nhieu module nghiep vu khac.
