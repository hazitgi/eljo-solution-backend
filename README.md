# Full Stack Application with Nest.js, React.js, and MySQL

This repository contains a full-stack application built with Nest.js for the backend, React.js for the frontend, and MySQL for the database.

## 📋 Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-name>
```

### 2. Start the Database
From the root directory, run:
```bash
docker-compose up -d
```

This will start MySQL container with the following configuration:
- Port: 3306
- Database name: app_db
- Root password: rootpassword
- User: app_user
- Password: app_password

### 3. Backend Setup (Nest.js)
Navigate to the backend directory:
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the development server
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### 4. Frontend Setup (React.js)
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
├── docker-compose.yml
├── backend/
│   ├── src/
│   ├── test/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
└── README.md
```

## ⚙️ Environment Variables

### Backend (.env)
```
# Server Configuration
PORT=
APP_URL=

# Database Configuration
DB_NAME=
DB_PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=
JWT_EXPIRATION=

# Email Configuration (NodeMailer)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 🐳 Docker Compose Configuration

Create a `docker-compose.yml` in the root directory:
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: app_mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: app_db
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 🛠️ Development

### Backend Commands
```bash
# Run in development
npm run start:dev

# Run tests
npm run test

# Build for production
npm run build

# Run in production
npm run start:prod
```

### Frontend Commands
```bash
# Run in development
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 📝 API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when running the backend server (using Swagger).

## 🧪 Testing

### Backend Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Backend
1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Run the application:
```bash
npm run start:prod
```

### Frontend
1. Build the application:
```bash
npm run build
```

2. Serve the contents of the `dist` directory using a static file server

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 🐛 Known Issues

- List any known issues or limitations here
- Include workarounds if available

## 📮 Support

For support, please open an issue in the repository or contact the maintainers.

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)
