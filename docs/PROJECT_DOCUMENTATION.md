
# Project Documentation — Real-Time Event Ticket Booking System

## 1. Project Overview

A backend system for event ticket booking built with **Node.js, Express.js, MongoDB, Redis, Socket.IO, and Razorpay**.

The system supports user authentication, event management, real-time seat locking, ticket booking, online payment, email confirmation, cancellation, and refunds.

---

## 2. System Workflow

```text
Register / Login
      ↓
View Events
      ↓
Select Seats
      ↓
Lock Seats for 5 Minutes
      ↓
Create Booking
      ↓
Create Razorpay Order
      ↓
Complete Payment
      ↓
Verify Payment
      ↓
Booking Confirmed
      ↓
Email Confirmation
```

---

## 3. Authentication

The system uses **JWT authentication**.

* Users can register and log in.
* Passwords are hashed before storage.
* Login generates a JWT token.
* Protected APIs require the JWT token.
* Admin APIs use an additional admin middleware.

---

## 4. Event Management

Admins can:

* Create events
* Update events
* Delete events
* Manage event details and seat capacity

Users can:

* View all events
* View individual events
* Search events

---

## 5. Seat Management

Each event has individually generated seats.

Every seat has one of three statuses:

```text
Available → Locked → Booked
```

Admins can generate seats for an event, while users can view seat availability.

---

## 6. Redis Seat Locking

**Redis** is used for temporary seat locking.

When a user selects a seat:

* The seat is locked for **5 minutes**.
* Redis stores the lock and its owner.
* Another user cannot book a seat locked by someone else.
* If the booking is not completed, the lock expires and the seat becomes available.

This helps prevent **double booking**.

---

## 7. Socket.IO

**Socket.IO** provides real-time seat updates.

When seats are:

* Locked
* Unlocked
* Booked

connected clients receive the updated seat information without refreshing the page.

---

## 8. Booking Flow

Before creating a booking, the system verifies:

* Event exists
* Seats exist
* Seats belong to the selected event
* Seats are not already booked
* Seats are locked by the current user

After validation:

* A pending booking is created.
* Seats are marked as booked.
* Event available-seat count is decreased.
* Redis seat locks are removed.

---

## 9. Razorpay Payment Flow

The system uses **Razorpay** for online payments.

```text
Create Booking
      ↓
Create Razorpay Order
      ↓
Complete Payment
      ↓
Verify Razorpay Signature
      ↓
Payment = Paid
      ↓
Booking = Confirmed
```

The Razorpay order ID and payment ID are stored with the booking.

---

## 10. Email Confirmation

After successful payment verification, an email is sent to the user.

The email contains:

* Event details
* Booking ID
* Selected seats
* Total amount
* Payment status

---

## 11. Cancellation & Refund

Users can cancel eligible bookings.

For paid bookings:

```text
Cancel Booking
      ↓
Razorpay Refund
      ↓
Seats → Available
      ↓
Available Seats ↑
      ↓
Booking → Cancelled
```

The payment status is updated to `refunded`.

---

## 12. Database Models

The application uses MongoDB with Mongoose.

### User

Stores user account and authentication information.

### Event

Stores event details such as title, venue, date, price, and available seats.

### Seat

Stores seat number, event reference, and seat status.

### Booking

Stores user, event, selected seats, total amount, booking status, and payment information.

---

## 13. API Structure

### Authentication

```text
/api/auth
```

Register, login, and profile APIs.

### Events

```text
/api/events
```

Event creation, viewing, searching, updating, and deletion.

### Seats

```text
/api/seats
```

Seat generation and seat availability.

### Seat Locking

```text
/api/seat-lock
```

Temporary seat locking.

### Bookings

```text
/api/bookings
```

Booking creation, booking history, booking details, and cancellation.

### Payments

```text
/api/payments
```

Razorpay order creation and payment verification.

### Email

```text
/api/email
```

Email-related functionality.

---

## 14. Deployment

The backend is deployed on **Render**.

Live Backend:

https://real-time-event-ticket-booking-system.onrender.com

Swagger API Documentation:

https://real-time-event-ticket-booking-system.onrender.com/api-docs

Environment variables are used for sensitive credentials such as:

* MongoDB connection
* JWT secret
* Redis URL
* Razorpay credentials
* Email credentials

---

## 15. Architechture Diagram 

                    USER
                     │
                     ▼
              Register / Login
                     │
                     ▼
                View Events
                     │
                     ▼
               Select Event
                     │
                     ▼
               View Seats
                     │
                     ▼
             Select Available Seats
                     │
                     ▼
            Lock Seats in Redis
                (5 minutes)
                     │
                     ▼
              Create Booking
                     │
                     ▼
          Create Razorpay Order
                     │
                     ▼
             Make Payment
                     │
                     ▼
        Verify Razorpay Signature
                     │
             ┌───────┴───────┐
             │               │
          SUCCESS          FAILED
             │               │
             ▼               ▼
       Booking Confirmed   Payment Failed
             │
             ▼
       Seats → Booked
             │
             ▼
      Email Confirmation
             │
             ▼
       Booking History


Cancellation flow: 


             Confirmed Booking
                     │
                     ▼
              Cancel Booking
                     │
                     ▼
             Payment Paid?
                /       \
              YES        NO
               │          │
               ▼          │
        Razorpay Refund   │
               │          │
               └────┬─────┘
                    ▼
             Seats → Available
                    │
                    ▼
       Event Available Seats ↑
                    │
                    ▼
          Booking → Cancelled


Real-time seat flow :


                  User selects seat
                           │
                           ▼
                     Redis Lock
                           │
                           ▼
            Socket.IO → Notify users
                           │
                           ▼
                  Seat → LOCKED
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
             Payment Success   5 min expires
                    │             │
                    ▼             ▼
              Seat → BOOKED   Seat → AVAILABLE