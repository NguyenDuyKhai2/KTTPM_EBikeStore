# 🚴‍♂️ E-Bike MultiPlatform E-Commerce System

> A comprehensive, enterprise-grade electric bicycle e-commerce system built with **Spring Boot 3.5+**, **React 19**, **React Native**, **PostgreSQL 16**, **Milvus Vector Database**, and **AI Chatbot** with **LLM + RAG**.  
> This project was developed as part of the **Software Architecture** course at **Industrial University of Ho Chi Minh City (IUH)**.

---

## 👥 Team Members

| Name | Role | Contact |
|------|------|---------|
| **Team Member 1** | Team Lead & Backend Developer | [@username](https://github.com/username) |
| **Team Member 2** | Frontend Developer | [@username](https://github.com/username) |
| **Team Member 3** | Mobile Developer | [@username](https://github.com/username) |
| **Team Member 4** | Backend Developer (AI/ML) | [@username](https://github.com/username) |

---

## 🚀 Tech Stack

### 🎨 Frontend (Web)
- ⚛️ **React 19** - Latest React with Compiler
- 🚀 **Vite 7+** - Next generation frontend tooling
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 📝 **TypeScript 5.8+** - Type-safe JavaScript
- 🗂️ **Redux Toolkit** - State management
- 🌐 **React Router v7** - Client-side routing
- 🎭 **Framer Motion** - Animation library
- 📡 **Axios** - HTTP client
- 🛠️ **ESLint & Prettier** - Code quality

### 📱 Mobile (iOS/Android)
- ⚛️ **React Native** - Native mobile framework
- 🚀 **Expo** - React Native framework
- 🗂️ **Redux Toolkit** - State management
- 📡 **Axios** - HTTP client
- 🎨 **React Native Paper** - UI components
- 🗺️ **React Native Maps** - Map integration

### 🖥️ Desktop (Windows/macOS)
- ⚛️ **React** - UI layer
- 📦 **Electron** - Desktop framework
- 🎨 **TailwindCSS** - Styling
- 🗂️ **Redux** - State management

### ⚙️ Backend (Spring Boot)
- ☕ **Java 17+** - Modern Java
- 🍃 **Spring Boot 3.5+** - Production-ready framework
- 🔐 **Spring Security** - Authentication & Authorization
- 🎫 **JWT (JJWT)** - Token-based authentication
- 🗄️ **Spring Data JPA** - Data persistence with Hibernate
- ✅ **Spring Validation** - Input validation
- 🛠️ **Lombok 1.18+** - Reduce boilerplate
- 🔄 **MapStruct** - Object mapping
- 🔍 **AOP** - Cross-cutting concerns
- 📊 **Slf4j + Logback** - Logging
- 🤖 **HuggingFace Transformers** - ML models

### 📦 Modular Architecture (7 Modules)
```
✅ auth-module/        - Authentication & Authorization
✅ product-module/     - Products, Categories, Reviews
✅ order-module/       - Orders, Payments, Shipping
✅ chatbot-module/ ⭐  - AI Chatbot with LLM + RAG
✅ user-module/        - User Profiles & Management
✅ shared/             - Common services & utilities
✅ config/             - Application configuration
```

### 🗄️ Database & Cache
- 🐘 **PostgreSQL 16** - Primary database with 5 schemas
- 📊 **Milvus** - Vector database for RAG/embeddings
- 🔴 **Redis 7** - Caching layer
- 🔧 **Flyway** - Database migrations (9 versions)
- 📦 **HikariCP** - Connection pooling

### 🧠 AI & ML Components
- 🤖 **BERT** - Intent classification (Intent NLU)
- 🏷️ **NER (Named Entity Recognition)** - Entity extraction
- 📊 **Milvus** - Vector similarity search for RAG
- 🔤 **Word Embeddings** - Text representations
- 📝 **LLM Integration** - Large Language Model support
- 💬 **Chatbot** - Conversational AI with dialogue management

### 🐳 DevOps & Infrastructure
- 🐳 **Docker** - Containerization (6 services)
- 🎼 **Docker Compose** - Service orchestration
- 🔄 **Git & GitHub** - Version control
- 📦 **Maven** - Dependency management
- 📮 **Postman** - API testing & documentation
- 🔐 **Environment variables** - Configuration management

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-Based Access Control (RBAC)
- ✅ OAuth2 support
- ✅ Secure password hashing (BCrypt)
- ✅ Multi-user session management
- ✅ Token introspection & logout

### 👥 User Management
- ✅ User registration & profile management
- ✅ User addresses (billing, shipping)
- ✅ User preferences & settings
- ✅ Soft delete functionality
- ✅ Audit trails (created/updated timestamps)
- ✅ User notifications system

### 🚴 Product Management
- ✅ Bike categories (Mountain, City, Road, Kids, Accessories)
- ✅ Product catalog with detailed specifications
- ✅ Product images & descriptions
- ✅ Price management (base, discount)
- ✅ Stock management & availability
- ✅ Product ratings & reviews (5-star system)
- ✅ Search & filtering with Elasticsearch ready

### 🛒 Shopping & Orders
- ✅ Shopping cart management
- ✅ Multi-item order placement
- ✅ Order status workflow (Pending → Confirmed → Shipped → Delivered)
- ✅ Auto-generated order numbers
- ✅ Order tracking & history
- ✅ Cancellation handling
- ✅ Refund management

### 💳 Payment System
- ✅ Multiple payment methods (Cash, Card, Bank Transfer, VNPay, MoMo, ZaloPay)
- ✅ Payment status tracking
- ✅ Transaction history
- ✅ Refund processing
- ✅ Payment gateway ready

### 🎟️ Promotions & Discounts
- ✅ Coupon system
- ✅ Percentage & fixed amount discounts
- ✅ Date-based validity
- ✅ Minimum order amount conditions
- ✅ Usage tracking & limits
- ✅ Stacking rules

### 💬 AI Chatbot ⭐
- ✅ Natural Language Understanding (NLU) with BERT
- ✅ Intent classification (5+ intents)
- ✅ Named Entity Recognition (NER)
- ✅ Multi-turn conversation management
- ✅ Context-aware responses
- ✅ RAG (Retrieval Augmented Generation) with Milvus
- ✅ FAQ database integration
- ✅ Sentiment analysis
- ✅ Conversation history tracking
- ✅ Real-time message handling

### 📊 Analytics & Reporting
- 🚧 Dashboard with key metrics
- 🚧 Sales analytics & trends
- 🚧 Revenue reports
- 🚧 Occupancy & availability tracking
- 🚧 Export to PDF/CSV

---

## 🔑 Key Metrics

- **7 Modules** - Modular monolithic architecture
- **35+ API Endpoints** - RESTful API
- **25+ Database Tables** - Normalized schema
- **9 Flyway Migrations** - Version control
- **6 Docker Services** - Complete stack
- **5 Database Schemas** - Module organization
- **RBAC** - Role-based access control

---

## 🛠️ Setup & Installation

### Prerequisites
- ☕ **Java 17+** (OpenJDK or Oracle JDK)
- 📦 **Maven 3.8+** (or use included wrapper)
- 🐘 **PostgreSQL 16** (or use Docker)
- 📱 **Node.js 18+** and **npm 9+**
- 🐳 **Docker** & **Docker Compose** (recommended)
- 🔧 **Git**

---

### 🐳 Database Setup (Option 1: Docker - Recommended)

```bash
# Navigate to backend directory
cd backend

# Start PostgreSQL + Redis + Milvus + Backend
docker-compose up -d

# Check container status
docker-compose ps

# View backend logs
docker-compose logs -f backend

# Services available:
# - Backend API: http://localhost:8080/api/v1
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - Milvus: localhost:19530
# - MinIO Console: http://localhost:9001
```

**Database Credentials:**
- Host: `postgres` (docker network)
- Port: `5432`
- Database: `ebike_db`
- Username: `ebike_user`
- Password: `ebike_password_123`

---

### 🐘 Database Setup (Option 2: Manual PostgreSQL)

```bash
# Install PostgreSQL 16
# For Ubuntu/Debian:
sudo apt update
sudo apt install postgresql-16 postgresql-contrib-16

# For macOS (using Homebrew):
brew install postgresql@16

# Start PostgreSQL service
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql
postgres=# CREATE DATABASE ebike_db;
postgres=# CREATE USER ebike_user WITH PASSWORD 'ebike_password_123';
postgres=# GRANT ALL PRIVILEGES ON DATABASE ebike_db TO ebike_user;
postgres=# \q
```

---

### ⚙️ Backend Setup (Spring Boot with Modules)

```bash
# Navigate to backend directory
cd backend

# Create .env file
cat > .env << EOF
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ebike_db
SPRING_DATASOURCE_USERNAME=ebike_user
SPRING_DATASOURCE_PASSWORD=ebike_password_123

# Flyway
SPRING_FLYWAY_ENABLED=true
SPRING_FLYWAY_LOCATIONS=classpath:db/migration

# Redis
SPRING_REDIS_HOST=redis
SPRING_REDIS_PORT=6379
SPRING_REDIS_PASSWORD=redis_password_123

# Milvus
MILVUS_HOST=milvus
MILVUS_PORT=19530

# JWT
APP_JWT_SECRET=your-secret-key-here-minimum-256-bits-required
APP_JWT_EXPIRATION=86400000

# ML Models
ML_MODELS_PATH=/app/ml-models
EOF

# Install dependencies
./mvnw clean install -DskipTests

# Run the application
./mvnw spring-boot:run

# Or with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend available at:** `http://localhost:8080/api/v1`

---

### 🎨 Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd packages/web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Frontend available at:** `http://localhost:5173`

---

### 📱 Mobile Setup (React Native + Expo)

```bash
# Navigate to mobile directory
cd packages/mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

---

### 🖥️ Desktop Setup (Electron + React)

```bash
# Navigate to desktop directory
cd packages/desktop

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🚀 Development Commands

### Backend Development

```bash
# Build project
./mvnw clean build

# Run tests
./mvnw test

# Run specific module tests
./mvnw test -Dtest=com.ebike.auth.*

# Format code
./mvnw spotless:apply

# Check code quality
./mvnw checkstyle:check

# Run with debug mode
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Check code quality
npm run lint

# Format code
npm run format
```

### Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Restart specific service
docker-compose restart backend

# Remove volumes (WARNING: deletes data!)
docker-compose down -v
```

### Database Commands

```bash
# Connect to PostgreSQL
psql -h localhost -p 5432 -U ebike_user -d ebike_db

# Run migrations manually
./mvnw flyway:migrate

# Check Flyway history
./mvnw flyway:info

# Backup database
pg_dump -U ebike_user -d ebike_db > backup.sql

# Restore database
psql -U ebike_user -d ebike_db < backup.sql
```

---

## 📊 Project Structure

```
e-bike-multiplatform/
│
├─ backend/                          (Spring Boot with Modules)
│  ├─ src/main/java/com/ebike/
│  │  ├─ auth-module/               (Auth & JWT)
│  │  ├─ product-module/            (Products & Catalog)
│  │  ├─ order-module/              (Orders & Payments)
│  │  ├─ chatbot-module/            (AI Chatbot - LLM + RAG)
│  │  ├─ user-module/               (User Management)
│  │  ├─ shared/                    (Common Services)
│  │  └─ config/                    (Configuration)
│  ├─ src/main/resources/
│  │  ├─ db/migration/              (9 Flyway migrations)
│  │  ├─ ml-models/                 (BERT, NER)
│  │  └─ application-*.properties   (Config)
│  ├─ docker-compose.yml            (Service orchestration)
│  ├─ Dockerfile                    (Multi-stage build)
│  ├─ pom.xml                       (Maven dependencies)
│  └─ .env                          (Environment config)
│
├─ packages/
│  ├─ web/                          (React + Vite)
│  │  ├─ src/
│  │  ├─ public/
│  │  └─ package.json
│  ├─ mobile/                       (React Native + Expo)
│  │  ├─ src/
│  │  └─ package.json
│  └─ desktop/                      (Electron + React)
│      ├─ src/
│      └─ package.json
│
├─ docs/                            (Documentation)
├─ .gitignore
├─ README.md                        (This file)
└─ package.json                     (Root workspace)
```

---

## 🏗️ Architecture Patterns

### Design Patterns Used
- ✅ **Module Pattern** - Separated modules by feature
- ✅ **Layered Architecture** - Controller → Service → Repository
- ✅ **DTO Pattern** - Request/Response data transfer
- ✅ **Builder Pattern** - Entity construction
- ✅ **Aspect-Oriented Programming** - Cross-cutting concerns
- ✅ **Dependency Injection** - Loose coupling
- ✅ **Strategy Pattern** - Payment strategies
- ✅ **Observer Pattern** - Event-driven architecture

### Code Quality Measures
- ✅ **SOLID Principles** - Clean architecture
- ✅ **Separation of Concerns** - Modular design
- ✅ **Type Safety** - Enums for statuses
- ✅ **Null Safety** - @NonNull annotations
- ✅ **Transaction Management** - @Transactional
- ✅ **Exception Handling** - Centralized error handling
- ✅ **Logging** - Comprehensive with Slf4j
- ✅ **Validation** - Bean Validation

### Database Best Practices
- ✅ **Indexes** - Query optimization
- ✅ **Soft Delete** - Data preservation
- ✅ **Audit Trail** - Created/Updated timestamps
- ✅ **Relationships** - Foreign keys
- ✅ **Constraints** - Data integrity
- ✅ **Connection Pooling** - HikariCP

---

## 🚀 Deployment

### Production Checklist

#### Backend
- [ ] Change `ddl-auto` to `validate`
- [ ] Set `show-sql` to `false`
- [ ] Use strong JWT secret (64+ chars)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Setup database backup schedule
- [ ] Configure log rotation
- [ ] Setup monitoring & alerting
- [ ] Enable rate limiting
- [ ] Configure firewall rules

#### Frontend
- [ ] Run production build: `npm run build`
- [ ] Configure environment variables
- [ ] Setup CDN for assets
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Setup error tracking (Sentry)
- [ ] Configure caching headers

### Deployment Options

**Backend:**
- AWS EC2 / Azure VM
- Docker containers (any cloud)
- Railway / Render
- Heroku

**Frontend:**
- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Database:**
- AWS RDS PostgreSQL
- Azure Database
- Railway
- Supabase

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check Java version
java -version  # Should be 17+

# Check PostgreSQL connection
psql -h localhost -U ebike_user -d ebike_db

# Check Docker containers
docker-compose ps

# View detailed logs
docker-compose logs backend
```

**Database connection errors:**
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database `ebike_db` exists
- Check Docker networking

**Frontend build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node -v  # Should be 18+
```

**Migration errors:**
```bash
# Check Flyway status
./mvnw flyway:info

# Reset migrations (development only!)
./mvnw flyway:clean
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork and clone**
   ```bash
   git clone https://github.com/your-org/e-bike-system.git
   cd e-bike-system
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make changes**
   - Follow code style
   - Write tests
   - Update docs

4. **Commit changes**
   ```bash
   git commit -m 'feat: Add AmazingFeature'
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/AmazingFeature
   ```

### Commit Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Refactoring
- `test:` - Tests
- `chore:` - Dependencies

---

## 📊 Project Status

### ✅ Completed
- [x] Module-based backend architecture
- [x] Authentication & RBAC
- [x] Product management
- [x] Order system
- [x] Payment framework
- [x] Chatbot with NLU & RAG
- [x] Database schema (25+ tables)
- [x] Flyway migrations
- [x] Docker setup

### 🚧 In Progress
- [ ] Frontend UI (React)
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] File upload

### 📋 Planned
- [ ] Real-time chat
- [ ] Video tutorials
- [ ] Mobile app (full)
- [ ] Advanced analytics
- [ ] AI recommendations
- [ ] Multi-language support

---

## 📚 Documentation

- [Backend Setup Guide](./docs/BACKEND_SETUP.md)
- [Module Architecture](./docs/MODULES.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Docker Setup](./docs/DOCKER.md)
- [Chatbot Integration](./docs/CHATBOT.md)

---

## 📜 License

Developed for **educational purposes** as part of the **Software Architecture** course at **IUH**.

**© 2024-2025 E-Bike Development Team. All Rights Reserved.**

---

## 📞 Contact & Support

### Development Team
- 👨‍💻 **Team Lead**: [GitHub Profile](https://github.com/username)
- 📧 **Email**: [project-email@iuh.edu.vn]

### Resources
- 🔗 **GitHub**: [e-bike-system](https://github.com/org/e-bike-system)
- 📝 **Issue Tracker**: [Report issues](https://github.com/org/e-bike-system/issues)
- 📚 **Wiki**: [Documentation](https://github.com/org/e-bike-system/wiki)

### Institution
- 🏫 **University**: Industrial University of Ho Chi Minh City (IUH)
- 📚 **Course**: Software Architecture
- 📅 **Year**: 2025

---

## 🙏 Acknowledgments

- Spring Boot & Spring Framework
- React & TypeScript communities
- PostgreSQL & Milvus teams
- HuggingFace (ML models)
- All open-source contributors
- IUH Faculty of Information Technology

---

<div align="center">

### ⭐ Star this repository if you find it helpful! ⭐

**Made with ❤️ by E-Bike Development Team**

**🚴‍♂️ Building the future of e-commerce, one commit at a time 🚴‍♀️**

</div>

