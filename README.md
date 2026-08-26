
# Real-Time Event Ticket Booking System

A backend system for event ticket booking built with **Node.js and Express.js**, featuring **JWT-based authentication, admin event management, MongoDB database integration, Redis-based 5-minute seat locking, real-time seat availability updates using Socket.IO, ticket booking and booking history, Razorpay payment order creation and signature verification, automatic email booking confirmation, booking cancellation with refunds, Swagger API documentation, and deployment on Render**

See the complete project documentation:
 **[View Detailed Documentation](./docs/PROJECT_DOCUMENTATION.md)**


## Features

- User Registration & Login
- JWT Authentication
- Event Management
- Seat Generation & Management
- Real-Time Seat Locking using Redis
- Real-Time Seat Updates using Socket.IO
- Ticket Booking
- Razorpay Payment Integration
- Payment Verification
- Email Booking Confirmation
- Booking History
- Booking Cancellation & Refund
- Admin Booking Management
- Swagger API Documentation
- Backend Deployment on Render


## Tech Stack

- Backend : Node.js , Express.js
- Database : MongoDB, MongoDB Atlas
- Real-Time & Caching : Redis , Socket.IO
- Payment : Razorpay
- Authentication : JWT
- Email : Nodemailer
- Documentation : Swagger
- Tools : Postman , Git & GitHub
- Deployment : Render

## API Documentation
[Click for API Documentation — Swagger](https://real-time-event-ticket-booking-system.onrender.com/api-docs)

## Live Backend
[Click to View Live Demo](https://real-time-event-ticket-booking-system.onrender.com)


# Installation

#### 1. Clone the repository

```bash
git clone https://github.com/drishti-gupta0704/real-time-event-ticket-booking-system.git
cd real-time-event-ticket-booking-system
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Create a `.env` file

Create a file named `.env` in the root directory and add:

```env
PORT=4000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

REDIS_URL=your_redis_url

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_app_password
```

Replace the placeholder values with your own credentials.

#### 4. Start the server

```bash
node server.js
```

The server will run at:

```text
http://localhost:4000
```

#### 5. API Documentation

Open Swagger:

```text
http://localhost:4000/api-docs
```
