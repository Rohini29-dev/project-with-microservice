# 🛒 E-Commerce Microservices Platform

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-State_Management-764ABC?logo=redux&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Message_Broker-FF6600?logo=rabbitmq&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?logo=redis&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-2B84EA)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-blueviolet)

A full-stack **E-Commerce Microservices Platform** built using Node.js, Express.js, React, Redux, and MongoDB. The project follows a microservices architecture, separating core business functionalities into independent services.

It includes user authentication, product management, shopping cart, order processing, Razorpay payment integration, seller analytics, notifications, and an AI-powered assistant. RabbitMQ enables asynchronous communication between services, while Redis supports authentication-related functionality and caching where implemented.

## 🚀 Features

### 🔐 Authentication Service
- User registration and login
- JWT-based authentication
- Role-based authorization for buyers and sellers
- User profile management
- Address management
- Logout and token blacklist functionality using Redis

### 📦 Product Service
- Create, view, update, and delete products
- Product listing and product details
- Seller-specific product management
- Product image upload and management

### 🛒 Cart Service
- Add products to the shopping cart
- Update product quantities
- Remove cart items
- Retrieve cart details

### 📋 Order Service
- Create and manage orders
- Update delivery addresses
- Cancel orders
- View order details and order status

### 💳 Payment Service
- Razorpay payment gateway integration
- Payment verification
- Payment status management
- Payment-related event handling

### 📧 Notification Service
- Email notifications using Nodemailer
- Payment and order-related notifications
- Event-driven communication through RabbitMQ

### 📊 Seller Dashboard Service
- Seller dashboard and statistics
- Revenue analytics
- Product metrics
- Order insights

### 🤖 AI Buddy Service
- AI-powered assistant
- Intelligent query handling
- Real-time communication capabilities

### ⚛️ Frontend
- React-based user interface
- Redux for centralized state management
- Protected routes and seller-specific access
- Product browsing and shopping cart
- Checkout and order management
- Seller dashboard and product management
- Toast notifications and form handling

## 🏗️ Architecture

The platform separates business functionality into independent backend services. Services communicate through HTTP APIs where appropriate and RabbitMQ for asynchronous event-driven workflows.

```text
                      ┌──────────────────────┐
                      │    React Frontend    │
                      │   Redux State Mgmt    │
                      └───────────┬──────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │     Backend Services    │
                    └─────────────────────────┘
                                  │
          ┌───────────┬───────────┼───────────┐
          ▼           ▼           ▼           ▼
      ┌────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
      │  Auth  │ │ Product │ │  Cart   │ │  Order  │
      └────┬───┘ └────┬────┘ └────┬────┘ └────┬────┘
           │          │           │           │
           └──────────┴───────────┴───────────┘
                                  │
                                  ▼
                         ┌────────────────┐
                         │    RabbitMQ    │
                         └───────┬────────┘
                                 │
                  ┌──────────────┼─────────────┐
                  ▼              ▼             ▼
             ┌─────────┐  ┌────────────┐ ┌──────────────┐
             │ Payment │  │Notification│ │Seller        │
             │ Service │  │  Service   │ │Dashboard     │
             └─────────┘  └────────────┘ └──────────────┘

                    ┌──────────────────┐
                    │    AI Buddy      │
                    │   AI Assistant   │
                    └──────────────────┘

       Supporting Technologies: MongoDB, Redis, Razorpay
```

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| State Management | Redux, Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Messaging | RabbitMQ |
| Caching / Token Management | Redis |
| Authentication | JWT, Role-Based Authorization |
| Payments | Razorpay |
| Email Notifications | Nodemailer |
| API Communication | Axios |
| Real-Time Communication | Socket.IO |
| AI Integration | LangGraph, Gemini |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
project-with-microservice/
│
├── auth/                 # Authentication service
├── product/              # Product management service
├── cart/                 # Shopping cart service
├── order/                # Order management service
├── payment/              # Payment service
├── notification/         # Email and event notifications
├── seller-dashboard/     # Seller analytics service
├── ai-buddy/             # AI assistant service
├── frontend/             # React + Redux application
│
└── README.md
```

## ⚙️ Prerequisites

Before running the project, make sure you have:

- Node.js and npm installed
- MongoDB connection (local or cloud)
- Redis running
- RabbitMQ running
- Razorpay account credentials for payment integration
- Gemini API credentials for AI functionality

Some features may require additional service-specific environment variables.

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Rohini29-dev/project-with-microservice.git

cd project-with-microservice
```

### 2. Install Backend Dependencies

Install dependencies separately for each service.

```bash
cd auth
npm install

cd ../product
npm install

cd ../cart
npm install

cd ../order
npm install

cd ../payment
npm install

cd ../notification
npm install

cd ../seller-dashboard
npm install

cd ../ai-buddy
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in each service directory according to the variables used by that service.

Example configuration:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RABBITMQ_URL=your_rabbitmq_connection_url
REDIS_URL=your_redis_connection_url
```

Additional variables may be required for Razorpay, Gemini, ImageKit, email credentials, and other integrations.

**Important:** These variables are examples, not a complete universal configuration. Check each service's code to determine its exact environment variable names. Never commit real credentials or `.env` files to GitHub.

## ▶️ Running the Project

Start MongoDB, Redis, and RabbitMQ first, then run each backend service in a separate terminal.

For each backend service:

```bash
npm run dev
```

If the service does not define a development script, use the script configured in its `package.json`.

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

### Default Backend Ports

| Service | Port |
|---|---:|
| Auth | 3000 |
| Product | 3001 |
| Cart | 3002 |
| Order | 3003 |
| Payment | 3004 |
| AI Buddy | 3005 |
| Notification | 3006 |
| Seller Dashboard | 3007 |

Verify the ports against your service configuration if you have changed them.

## 🔄 Event-Driven Workflow

### Order and Payment Workflow

```text
Customer
   │
   ▼
Order Service
   │
   ▼
RabbitMQ
   │
   ▼
Payment / Related Consumers
   │
   ├──► Notification Service
   │
   └──► Seller Dashboard Service
```

The exact sequence depends on the events published and consumed by each service.

### Payment Notification Workflow

```text
Payment Result
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

## 🔗 API Overview

The following are examples of the API routes used by the platform. Confirm request methods and payloads in the individual service route files before testing.

### Authentication Service — Port 3000

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Retrieve authenticated user information |
| POST | `/api/auth/logout` | Log out |

### Product Service — Port 3001

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | Retrieve products |
| POST | `/api/products` | Create a product |

Update and delete endpoints depend on the route definitions and authorization middleware.

### Cart Service — Port 3002

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/carts` | Add or update cart data, according to the implemented route |

### Other Services

- **Order Service:** Order creation, cancellation, address updates, and order retrieval.
- **Payment Service:** Payment creation and verification.
- **Notification Service:** Event-driven email notifications.
- **Seller Dashboard Service:** Seller statistics and analytics.
- **AI Buddy Service:** AI assistant functionality.

For complete API documentation, refer to the routes and controllers inside each service.

## 🔒 Security Considerations

- JWT-based authentication
- Role-based access control
- Protected frontend routes
- Redis-backed token blacklist functionality
- Environment variables for secrets and service credentials
- Separate backend services for individual business responsibilities

Security also depends on the configuration of each service, validation rules, and production deployment settings.

## 📈 Project Highlights

- Designed a distributed e-commerce application using microservices architecture.
- Separated authentication, products, carts, orders, payments, notifications, seller analytics, and AI functionality.
- Implemented event-driven communication using RabbitMQ.
- Integrated Redux for frontend state management.
- Integrated Razorpay for payment processing.
- Used Redis for authentication-related functionality and caching where implemented.
- Developed buyer and seller workflows.
- Integrated an AI-powered assistant using Gemini and LangGraph.

## 🔮 Future Enhancements

- Docker containerization
- CI/CD pipeline
- Cloud deployment
- Centralized monitoring and logging
- API documentation using Swagger
- Automated integration and end-to-end testing
- Improved fault tolerance and service observability

## 👩‍💻 Author

**Rohini Bharsakle**

- GitHub: https://github.com/Rohini29-dev
- LinkedIn: https://linkedin.com/in/rohini-bharsakle-a46220417

---

⭐ If you find this project useful, consider giving the repository a star.
