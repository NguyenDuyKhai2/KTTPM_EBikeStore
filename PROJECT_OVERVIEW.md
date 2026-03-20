# E-Bike Multiplatform Project Overview

> A multi-platform electric bike commerce system built as a monorepo with a Spring Boot backend, shared frontend code, and client apps for web, mobile, and desktop.  
> The current development strategy is **backend-first** so the team can stabilize the domain model, database schema, permissions, and API contracts before building complete UIs.

---

## Project Vision

This project is designed to support an e-bike business similar to Yadea, with focus on:
- product catalog management for electric scooters, e-bikes, and related accessories
- rich product specifications such as battery, motor, range, speed, brake type, and variants
- customer account, address, and preference management
- order, payment, and shipment workflows
- chatbot and FAQ support for product consultation
- granular permission management using **Permission-based Access Control (PBAC)**

---

## Repository Structure

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

---

## Architecture Summary

### 1. Monorepo Strategy

The repository contains all backend and client applications in one place.

Benefits for the team:
- shared visibility across backend and frontend work
- easier API contract alignment
- shared frontend code through `packages/shared-code`
- simpler onboarding because everything lives in one repo

### 2. Backend-First Development

The team is currently prioritizing:
1. database schemas and migrations
2. entity modeling
3. permission and security design
4. repositories and business services
5. DTOs and controller endpoints
6. frontend integration after contracts are stable

### 3. Modular Backend Design

The backend is organized by business domain:

- `authModule`
  - users
  - roles
  - permissions
  - direct user permission overrides
  - authentication logs
- `productModule`
  - categories
  - products
  - reviews
  - specifications
  - variants
  - images
- `orderModule`
  - orders
  - order items
  - payments
  - shipments
- `userModule`
  - user addresses
  - user preferences
- `chatbotModule`
  - folder structure is prepared
  - detailed entities and services are still pending
- `shared`
  - constants and shared backend utilities

---

## Current Backend Domain Model

### Authentication and Access Control

Implemented core entities:
- `User`
- `Role`
- `Permission`
- `UserPermission`
- `AuthenticationLog`

The backend uses **PBAC**, not only basic RBAC.

This means:
- a role groups multiple permissions
- a user can inherit permissions from roles
- a user can also receive direct permission overrides
- direct permissions can be used to allow or deny specific actions

Example permission codes:
- `product:view`
- `product:create`
- `order:create`
- `order:update-status`
- `payment:refund`
- `permission:manage`

Permission constants file:
- [backend/src/main/java/com/ebike/shared/constants/PermissionConstants.java](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/java/com/ebike/shared/constants/PermissionConstants.java)

### Product Domain for Yadea-Style E-Bikes

Implemented product-related entities:
- `Category`
- `Product`
- `Review`
- `ProductSpecification`
- `ProductVariant`
- `ProductImage`

The `ProductSpecification` model already supports important e-bike technical data:
- vehicle type
- battery type
- battery capacity
- battery voltage
- charging time
- max speed
- max range
- motor power
- peak motor power
- max load
- product weight
- wheel size
- brake type
- drive type
- water resistance rating
- frame material
- suspension type
- display type
- smart features
- warranty months

The `ProductVariant` model supports:
- SKU
- color name and hex code
- stock quantity
- battery-capacity-specific variants
- default variant selection
- additional price per variant

The `ProductImage` model supports:
- product-level images
- variant-level images
- primary image selection
- sort order

### Order Domain

Implemented order-related entities:
- `Order`
- `OrderItem`
- `Payment`
- `Shipment`

These entities cover the main e-commerce flow:
- create order
- store line items
- track payment state
- track shipment state

### User Profile Domain

Implemented user profile entities:
- `UserAddress`
- `UserPreference`

These support:
- billing/shipping addresses
- theme, language, and notification preferences

---

## Database and Migrations

The backend uses Flyway migrations to manage schema evolution.

Existing migration files:
- [backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql)
- [backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql)
- [backend/src/main/resources/db/migration/V1_0_2__product_tables.sql](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/resources/db/migration/V1_0_2__product_tables.sql)
- [backend/src/main/resources/db/migration/V1_0_3__order_tables.sql](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/resources/db/migration/V1_0_3__order_tables.sql)
- [backend/src/main/resources/db/migration/V1_0_5__user_tables.sql](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/resources/db/migration/V1_0_5__user_tables.sql)

Database schemas currently used:
- `ebike_auth`
- `ebike_product`
- `ebike_order`
- `ebike_chatbot`
- `ebike_user`

---

## Frontend and Shared Packages

The repository already includes scaffolding for:
- `packages/shared-code`
- `packages/web`
- `packages/mobile`
- `packages/desktop`

These packages are not feature-complete yet, but the structure is ready so the team can:
- share types and API clients
- reuse hooks and Redux slices
- build platform-specific UI on top of a shared core

Current status:
- architecture skeleton exists
- entry files and package configs exist
- real business UI and API integration are still pending

---

## What Is Already Working

- backend entity layer for auth, product, order, and user domains
- repository layer for the main entities
- PBAC data model
- Flyway migration structure
- monorepo workspace setup
- frontend package scaffolding
- backend compile check passes with Maven

---

## What Is Not Finished Yet

- authentication DTOs and login/register flow
- business services with real logic
- REST controllers with real endpoints
- Spring Security integration for PBAC enforcement
- permission and role seed data
- chatbot entities and conversation model
- frontend pages connected to backend APIs
- test coverage

---

## Suggested Team Reading Order

For any teammate joining the project, this is the best order to read:

1. [backend/pom.xml](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/pom.xml)
2. [backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/resources/db/migration/V1_0_0__Initial_Schema.sql)
3. [backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/resources/db/migration/V1_0_1__auth_tables.sql)
4. [backend/src/main/resources/db/migration/V1_0_2__product_tables.sql](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/resources/db/migration/V1_0_2__product_tables.sql)
5. [backend/src/main/java/com/ebike/productModule/entity/Product.java](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/java/com/ebike/productModule/entity/Product.java)
6. [backend/src/main/java/com/ebike/productModule/entity/ProductSpecification.java](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/java/com/ebike/productModule/entity/ProductSpecification.java)
7. [backend/src/main/java/com/ebike/shared/constants/PermissionConstants.java](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/backend/src/main/java/com/ebike/shared/constants/PermissionConstants.java)
8. [packages/shared-code/src/index.ts](/d:/HK8/KTTKPm/BTL/e-bike-multiplatform/packages/shared-code/src/index.ts)

---

## Recommended Next Steps

### Backend Team
- implement auth DTOs and authentication flow
- seed default roles and permissions from `PermissionConstants`
- integrate PBAC into Spring Security
- build `ProductDTO`, `ProductDetailDTO`, and product service layer
- implement checkout basics in order service

### Frontend Team
- align shared TypeScript models with backend DTOs
- build product listing and product detail flows
- integrate cart and order APIs after backend endpoints are ready

### Chatbot Team
- define chatbot entities and migrations
- connect FAQ and conversation history with product data
- support product consultation based on e-bike specifications

---

## Development Notes

- This project is still in the architecture and foundation phase.
- Team members should avoid changing permission codes casually because backend security and frontend guards will depend on them.
- New features should ideally follow this order:
  1. migration
  2. entity
  3. repository/service
  4. DTO/controller
  5. frontend integration

---

## Quick Commands

Compile backend:

```bash
cd backend
mvn clean compile
```

Run backend:

```bash
cd backend
mvn spring-boot:run
```

Root workspace overview:

```bash
npm workspaces list
```

---

## Final Note

This document is intended as a high-level onboarding guide for the team.  
Use it together with `README.md`, database migrations, and the backend entity classes to understand the current state of the project before starting new work.
