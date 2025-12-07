# 🚗 Vehicle Rental System - Backend API

This Project Provides Complete solution for managing vehicle rentals, user accounts, bookings, and role-based authentication and A robust RESTFUL API backend built with Node.js, TypeScript, Express.js, and PostgreSQL.

## Credentials for Testing

- Admin User:
  - Email: admin@admin.com
  - Password: adminpassword
- Customer User:
  - Email: jony@customer.com
  - Password: customerpassword1

## Live Link

[Live API](https://assaignment-2-nu.vercel.app)

## API Prefix

`/api/v1`

## ⭐ Project Overview

This project is a modular, scalable, and production-ready REST API built using Node.js, TypeScript, Express, and PostgreSQL. It provides essential features for a vehicle rental system, including:

- Vehicle inventory management
- Customer account and profile management
- Booking creation, cancellation & returns
- JWT-based authentication
- Role-based authentication and authorization (Admin and Customer roles)

---

## 🛠️ Technology Stack

| Category   | Technology                    | Usage                            |
| ---------- | ----------------------------- | -------------------------------- |
| Runtime    | Node.js (TypeScript)          | Backend runtime                  |
| Framework  | Express.js                    | Web framework                    |
| Database   | PostgreSQL                    | Database management              |
| Query      | ( pg)                         | Database querying                |
| Security   | bcrypt, JWT                   | Password hashing, authentication |
| Validation | Zod (Recommended)             | Input validation                 |
| Dev Tools  | ts-node-dev, eslint, prettier | Development tools                |
| Deployment | Vercel                        | Deployment platform              |

---

## 🚀 Features

### 🔐 Authentication & Authorization

- User registration and login with JWT authentication
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (Admin and Customer roles)

### 👥 User Management

- CRUD operations for user accounts
- Profile management (view and update profile)
- All users have roles: Admin or Customer.
- All Customers List viewable by Admins.
- Unique email for each user account.
- Role-based access control for sensitive operations.
- Role Management: Assign and manage only Admin.
- Admins can manage all user accounts.
- Can not Delete if user has active bookings.

### 🚗 Vehicle Management

- CRUD operations for vehicle inventory
- Vehicle availability status tracking
- Vehicle Type: Car, Bike, Van, SUV.
- Real-time tracking of vehicle status (available, booked).
- Unique vehicle Registration Number for each vehicle.
- Admins can manage the vehicle inventory.
- Customers can view available vehicles.

### 📅 Booking Management

- Bookings Create and automatic automatic price calculation based on vehicle rental duration.
- Vehicle Booking: Customers can book available vehicles.
- Booking Cancellation: Customers can cancel bookings before the rental start date.
- Automatic Vehicle availability Update.
- Mark vehicle as returned only by Admins or (Automatic after booking end date with vercel cron job every midnight).
- Role-based booking visibility (Admins can view all bookings, Customers can view their own bookings).

### 🔄 Business Logic

- Validate user inputs for all operations.
- Validate booking dates (start date must be before end date).
- Ensure vehicle availability before confirming bookings.
- Automatic price calculation based on rental duration and vehicle type.
- Prevent deletion of users with active bookings.
- API Response standardization with appropriate HTTP status codes and messages.

## 📁 Project Structure (Feature-Based Modular Architecture)

```
src/
│
├── app/
│ ├── modules/
│ │ ├── auth/
│ │ │ ├── auth.route.ts
│ │ │ ├── auth.controller.ts
│ │ │ ├── auth.service.ts
│ │ │ ├── auth.validation.ts
│ │ │ └── auth.interface.ts
│ │ │
│ │ ├── users/
│ │ │ ├── user.route.ts
│ │ │ ├── user.controller.ts
│ │ │ ├── user.service.ts
│ │ │ ├── user.validation.ts
│ │ │ └── user.interface.ts
│ │ │
│ │ ├── vehicles/
│ │ │ ├── vehicle.route.ts
│ │ │ ├── vehicle.controller.ts
│ │ │ ├── vehicle.service.ts
│ │ │ ├── vehicle.validation.ts
│ │ │ └── vehicle.interface.ts
│ │ │
│ │ ├── bookings/
│ │ │ ├── booking.route.ts
│ │ │ ├── booking.controller.ts
│ │ │ ├── booking.service.ts
│ │ │ ├── booking.validation.ts
│ │ │ └── booking.interface.ts
│ │ ├── routes
│ │ │ └── index.ts
│ │
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.ts
│ │ ├── validateRequest.ts
│ │ └── globalErrorHandler.ts
│ │
│ ├── errors/
│ │ ├── ApiError.ts
│ │ └── handleZodError.ts
│ │
│ └── app.ts
│
├── config/
│ ├── index.ts
│ └── db.ts
│
├── shared/
│ ├── jwtHelpers.ts
│ └── bcryptHelpers.ts
│
├── utils/
│ ├── calculatePrice.ts
│ └── dateUtils.ts
│
├── server.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🌐 API Endpoints

### 🔑 Authentication

| Method | Endpoint              | Access | Description         |
| ------ | --------------------- | ------ | ------------------- |
| POST   | `/api/v1/auth/signup` | Public | Register a new user |
| POST   | `/api/v1/auth/signin` | Public | Login & receive JWT |

### 👥 User Management

| Method | Endpoint                | Access      | Description                                                      |
| ------ | ----------------------- | ----------- | ---------------------------------------------------------------- |
| GET    | `/api/v1/users`         | Admin       | View all users                                                   |
| PUT    | `/api/v1/users/:userId` | Admin / Own | Admin update any user role and customer update their own profile |
| DELETE | `/api/v1/users/:userId` | Admin       | Delete user (only if no active bookings)                         |

### 🚗 Vehicle Management

| Method | Endpoint                      | Access | Description      |
| ------ | ----------------------------- | ------ | ---------------- |
| POST   | `/api/v1/vehicles`            | Admin  | Add new vehicle  |
| GET    | `/api/v1/vehicles`            | Public | Get all vehicles |
| GET    | `/api/v1/vehicles/:vehicleId` | Public | Get vehicle      |
| PUT    | `/api/v1/vehicles/:vehicleId` | Admin  | Update vehicle   |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin  | Delete vehicle   |

### 📅 Booking Management

| Method | Endpoint                      | Access         | Description    |
| ------ | ----------------------------- | -------------- | -------------- |
| POST   | `/api/v1/bookings`            | Customer/Admin | Create booking |
| GET    | `/api/v1/bookings`            | Customer/Admin | View bookings  |
| PUT    | `/api/v1/bookings/:bookingId` | Customer/Admin | Cancel/Return  |

---

## 🚀 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/monir6163/assaignment-2.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd assaignment-2
   ```
3. **Install dependencies:**
   ```bash
   npm install or yarn install
   ```
4. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   NODE_DEV=development
   PORT=5000
   BCRYPT_SALT_ROUNDS=10
   JWT_SECKRET_TOKEN=your_jwt_secret_key
   JWT_EXPIRE_IN=1d
   CRON_JOB_SECRET=your_cron_job_secret
   DATABASE_URL=your_postgresql_connection_string
   ```
5. **Run the development server:**
   ```bash
   npm run dev or yarn dev
   ```
6. **Access the API:**
   Open your browser or API client and navigate to `http://localhost:5000/api/v1/` to access the API endpoints.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

For any inquiries or support, please contact [Email](mailto:monirhossain6163@gmail.com).

---

## 👨‍💻 Author

** Monir Hossain** - [Linkedin](https://www.linkedin.com/in/monirweb)
