# 🛒 E-Commerce Microservices Platform

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Message%20Broker-orange)
![Redis](https://img.shields.io/badge/Redis-Cache-red)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-purple)
![Microservices](https://img.shields.io/badge/Architecture-Microservices-success)

A production-oriented E-Commerce backend built using **Microservices Architecture**. The system consists of independent services communicating asynchronously through **RabbitMQ**, enabling scalability, maintainability, and fault isolation.

---

## 🚀 Key Features

### Authentication Service

* User Registration
* User Login
* JWT Authentication
* Address Management
* Role-Based Authorization

### Product Service

* Create Product
* Update Product
* Delete Product
* Product Listing
* Seller Product Management

### Cart Service

* Add Items to Cart
* Update Quantity
* Remove Items
* View Cart

### Order Service

* Create Orders
* Update Delivery Address
* Cancel Orders
* Order Tracking

### Payment Service

* Razorpay Integration
* Payment Verification
* Payment Status Updates

### Notification Service

* Payment Success Emails
* Order Notifications
* Event-Based Messaging

### Seller Dashboard Service

* Revenue Analytics
* Product Metrics
* Order Insights
* Seller Statistics

### AI Buddy Service

* AI-powered Assistant
* Real-Time User Interaction
* Intelligent Query Handling

---

# 🏗️ Architecture

```text
                        ┌─────────────┐
                        │    Client   │
                        └──────┬──────┘
                               │
                               ▼

 ┌─────────────────────────────────────────────────┐
 │                 API Services                    │
 └─────────────────────────────────────────────────┘

     │           │          │          │
     ▼           ▼          ▼          ▼

 ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
 │ Auth   │ │Product │ │ Cart   │ │ Order  │
 └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘
      │          │          │          │
      └──────────┴──────────┴──────────┘
                       │
                       ▼

               ┌─────────────┐
               │ RabbitMQ    │
               └──────┬──────┘
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼

 ┌────────┐    ┌──────────────┐   ┌───────────┐
 │Payment │    │Notification  │   │ Seller DB │
 └────────┘    └──────────────┘   └───────────┘

                      │
                      ▼

                ┌─────────┐
                │ AI Buddy│
                └─────────┘
```

---

# 🛠️ Tech Stack

| Category       | Technologies        |
| -------------- | ------------------- |
| Backend        | Node.js, Express.js |
| Database       | MongoDB             |
| Messaging      | RabbitMQ            |
| Cache          | Redis               |
| Authentication | JWT                 |
| Payments       | Razorpay            |
| Email          | Nodemailer          |
| Testing        | Jest                |
| Architecture   | Microservices       |

---

# 📂 Project Structure

```text
project-with-microservice/

├── auth/
├── product/
├── cart/
├── order/
├── payment/
├── notification/
├── seller-dashboard/
├── ai-buddy/
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Rohini29-dev/project-with-microservice.git

cd project-with-microservice
```

---

## Install Dependencies

Install dependencies inside each service:

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

---

## Environment Variables

Create `.env` file inside each service.

Example:

```env
PORT=3000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

RABBITMQ_URL=your_rabbitmq_url
```

---

# ▶️ Running Services

Start each service individually:

```bash
npm run dev
```

or

```bash
npm start
```

---

# 📡 Event Flow

### Order Created

```text
User
 ↓
Order Service
 ↓
RabbitMQ
 ↓
Payment Service
 ↓
Notification Service
 ↓
Seller Dashboard Service
```

### Payment Completed

```text
Payment Success
 ↓
RabbitMQ Event
 ↓
Notification Service
 ↓
Send Email
```

---

# 🔗 Sample API Endpoints

## Authentication

### Register User

```http
POST /api/auth/register
```

Request:

```json
{
  "fullName": "Rohini",
  "email": "rohini@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "User Registered"
}
```

---

### Login

```http
POST /api/auth/login
```

---

## Product

### Create Product

```http
POST /api/products
```

---

### Get Products

```http
GET /api/products
```

---

## Cart

### Add To Cart

```http
POST /api/cart/add
```

---

## Order

### Create Order

```http
POST /api/orders
```

---

## Payment

### Create Payment

```http
POST /api/payment/create
```

---

# 🧪 Testing

Run tests inside any service:

```bash
npm test
```

Example:

```bash
cd auth
npm test
```

---

# 📈 Project Highlights

* Built 8 independent microservices.
* Implemented event-driven communication using RabbitMQ.
* Integrated Razorpay payment gateway.
* Added Redis caching support.
* Designed scalable service-oriented architecture.
* Created AI-powered assistant service.
* Implemented seller analytics dashboard.
* Wrote automated tests using Jest.

---

# 🔮 Future Enhancements

* Docker Containerization
* AWS Deployment
* CI/CD Pipeline
* Monitoring & Logging
* Frontend Dashboard
* Kubernetes Orchestration

---

# 👩‍💻 Author

**Rohini Bharsakle**

GitHub:
https://github.com/Rohini29-dev

---

⭐ If you found this project useful, consider giving it a star.
