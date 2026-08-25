# 🛒 E-Commerce Microservices Platform

A full-stack **E-Commerce application built using a Microservices Architecture** with Node.js, Express.js, MongoDB, Redis, RabbitMQ and React.js.

The platform provides separate services for authentication, products, cart, orders, payments, notifications and seller management.

---

## 🚀 Features

### 👤 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes
* Role-based authorization
* User profile management
* Address management
* Seller authorization

### 🛍️ Product Management

* Create products
* Update products
* Delete products
* Get all products
* Get product details
* Product image upload
* Seller-specific product management

### 🛒 Cart

* Add products to cart
* Update product quantity
* Remove products from cart
* Get current user's cart

### 📦 Orders

* Create orders
* Get user's orders
* Get order details
* Cancel orders
* Update shipping address
* Seller order management

### 💳 Payments

* Razorpay payment integration
* Create payment orders
* Verify Razorpay payments
* Payment status handling

### 📧 Notifications

* Email notifications
* RabbitMQ-based asynchronous communication
* Payment notification events
* Product-related notifications

### ⚡ Performance & Communication

* Redis integration
* RabbitMQ message broker
* Independent microservices
* REST API communication between services

---

# 🏗️ Microservices Architecture

The backend is divided into multiple independent services.

```text
                         ┌──────────────────┐
                         │   React Frontend │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   API Gateway    │
                         │      :3000       │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
      │ Auth Service│      │   Product   │      │ Cart Service│
      │    :3000    │      │   Service   │      │    :3002    │
      └─────────────┘      │    :3001    │      └─────────────┘
                           └─────────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
      │Order Service│      │   Payment   │      │ Notification│
      │    :3003    │      │   Service   │      │   Service   │
      └─────────────┘      │    :3004    │      └─────────────┘
                           └──────┬──────┘
                                  │
                                  ▼
                            ┌───────────┐
                            │ Razorpay  │
                            └───────────┘

                  ┌──────────────────────┐
                  │      RabbitMQ        │
                  │ Message Broker       │
                  └──────────────────────┘

                  ┌──────────────────────┐
                  │        Redis         │
                  │      Caching         │
                  └──────────────────────┘

                  ┌──────────────────────┐
                  │      MongoDB         │
                  │       Atlas          │
                  └──────────────────────┘
```

---

# 📦 Services

| Service              | Responsibility                                 |
| -------------------- | ---------------------------------------------- |
| Auth Service         | Registration, login, JWT authentication, users |
| Product Service      | Product CRUD and product images                |
| Cart Service         | Shopping cart management                       |
| Order Service        | Order creation and order management            |
| Payment Service      | Razorpay payment processing                    |
| Notification Service | Email notifications                            |
| Seller Service       | Seller-specific operations                     |
| API Gateway          | Routes requests to appropriate services        |

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* React Hook Form
* CSS
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Cookie Parser

## Microservices & Infrastructure

* Redis
* RabbitMQ
* Nodemailer
* Razorpay
* ImageKit
* Docker *(planned/development environment)*

## Development Tools

* Git
* GitHub
* Postman
* VS Code

---

# 📁 Project Structure

```text
project-with-microservice/
│
├── auth-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   └── server.js
│
├── product-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
│
├── cart-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── order-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── payment-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── notification-service/
│   ├── consumers/
│   ├── services/
│   ├── templates/
│   └── server.js
│
├── seller-service/
│   ├── controllers/
│   ├── routes/
│   └── server.js
│
└── README.md
```

> Folder names can be adjusted according to the final structure of the repository.

---

# 🔐 Authentication Flow

The application uses **JWT authentication**.

```text
User
 │
 │ Register / Login
 ▼
Auth Service
 │
 │ Validate credentials
 ▼
JWT Token
 │
 ▼
Client
 │
 │ Authenticated Request
 ▼
Protected Service
 │
 ▼
JWT Verification
 │
 ▼
Authorized Request
```

Passwords are securely hashed using **bcrypt** before being stored in the database.

---

# 💳 Payment Flow

The application uses **Razorpay** for online payments.

```text
User
 │
 ▼
Checkout
 │
 ▼
Order Service
 │
 ▼
Payment Service
 │
 ▼
Create Razorpay Order
 │
 ▼
Razorpay Checkout
 │
 ▼
Payment
 │
 ▼
Payment Verification
 │
 ▼
Order Updated
 │
 ▼
RabbitMQ Event
 │
 ▼
Notification Service
 │
 ▼
Email Notification
```

---

# 📨 RabbitMQ Communication

RabbitMQ is used for **asynchronous communication between services**.

For example:

```text
Payment Service
      │
      │ PAYMENT_COMPLETE
      ▼
   RabbitMQ
      │
      ▼
Notification Service
      │
      ▼
 Send Email
```

This keeps notification processing separate from the main payment request.

---

# ⚡ Redis

Redis is used as an in-memory data store and can be used for:

* Caching
* Faster data access
* Reducing repeated database queries
* Temporary data storage

---

# 🖼️ Image Upload

Product images are uploaded using **Multer** and stored using an external image storage service.

The product service handles:

```text
Client
  │
  ▼
Multer
  │
  ▼
Image Processing
  │
  ▼
Image Storage
  │
  ▼
Product Database
```

---

# 🔌 API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Cart

```http
GET    /api/carts
POST   /api/carts
PUT    /api/carts/:id
DELETE /api/carts/:id
```

## Orders

```http
POST /api/orders
GET  /api/orders/me
GET  /api/orders/:id
PUT  /api/orders/:id
```

## Payments

```http
POST /api/payments/create/:orderId
POST /api/payments/verify
```

> Exact endpoints may vary depending on the final route configuration in each service.

---

# ⚙️ Environment Variables

Each service should have its own `.env` file.

Example:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

REDIS_URL=your_redis_connection_string

RABBITMQ_URL=your_rabbitmq_connection_string

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_key_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

For the notification service:

```env
EMAIL_USER=your_email
EMAIL_CLIENT_ID=your_client_id
EMAIL_CLIENT_SECRET=your_client_secret
EMAIL_REFRESH_TOKEN=your_refresh_token
```

**Never commit `.env` files or API secrets to GitHub.**

---

# 🏃‍♀️ Running the Project Locally

## 1. Clone the repository

```bash
git clone https://github.com/Rohini29-dev/project-with-microservice.git
```

## 2. Move into the project

```bash
cd project-with-microservice
```

## 3. Install dependencies

Install dependencies separately for each service:

```bash
npm install
```

If every service has its own `package.json`, run:

```bash
cd auth-service
npm install
```

and repeat for the other services.

## 4. Configure environment variables

Create `.env` files for the required services and add your:

* MongoDB URI
* JWT secret
* Redis configuration
* RabbitMQ configuration
* Razorpay credentials
* ImageKit credentials
* Email credentials

## 5. Start the services

Start each service according to its configured script.

Example:

```bash
npm run dev
```

---

# 🧪 API Testing

The APIs can be tested using **Postman**.

Recommended testing flow:

```text
Register
   ↓
Login
   ↓
Get Current User
   ↓
Create Product
   ↓
Get Products
   ↓
Add Product to Cart
   ↓
Checkout
   ↓
Create Order
   ↓
Create Payment
   ↓
Verify Payment
   ↓
Receive Notification
```

---

# 🔒 Security

The project implements several security practices:

* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* Role-based authorization
* Environment variables for secrets
* Input validation
* Authentication middleware
* Secure payment verification

---

# 🎯 Why Microservices?

This project uses a microservices architecture to separate business responsibilities.

Instead of maintaining one large backend application:

```text
                 Monolithic
                     │
       ┌─────────────┴─────────────┐
       │ Auth Product Cart Order   │
       │ Payment Notification      │
       └───────────────────────────┘
```

The application separates these responsibilities:

```text
Auth ──────────────── Service
Products ──────────── Service
Cart ───────────────── Service
Orders ─────────────── Service
Payments ───────────── Service
Notifications ─────── Service
Seller ─────────────── Service
```

This makes individual services easier to maintain, scale and develop independently.

---

# 📈 Future Improvements

* Dockerize all microservices
* Add Kubernetes deployment
* Implement centralized API Gateway
* Improve Redis caching strategy
* Add service health monitoring
* Add automated CI/CD pipeline
* Add comprehensive unit and integration tests
* Deploy services to AWS
* Add logging and monitoring
* Improve fault tolerance and retry mechanisms

---

# 👩‍💻 Author

**Rohini Bharsakle**

Backend Developer | Node.js | Express.js | MongoDB | Microservices

GitHub:
https://github.com/Rohini29-dev

---

# ⭐ Project Highlights

This project demonstrates practical experience with:

* Microservices Architecture
* REST APIs
* Node.js & Express.js
* MongoDB & Mongoose
* JWT Authentication
* Redis
* RabbitMQ
* Razorpay Payment Gateway
* Email Notifications
* Image Upload
* Role-Based Authorization
* React.js Frontend
* Git & GitHub

---

## 📌 License

This project is created for learning, development and portfolio purposes.
