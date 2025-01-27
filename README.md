# Project Documentation

## **Overview**
This project demonstrates a complete system with separate **backend APIs** and a **frontend**. The system allows users to:
1. **Sign up** and **sign in** to the platform.
2. Receive a welcome email with a randomly generated password upon sign-up.
3. Access a dashboard showing the number of registered cars in the system after logging in.
4. Perform CRUD operations for:
   - **Categories** (e.g., Bus, Sedan, SUV, Hatchback, etc.)
   - **Cars**, with fields like category, color, model, make, and registration number.
5. Utilize data tables for sorting and pagination.
6. Ensure the system is secure with **XSS protection** and **JWT-based authentication**.
7. Validate data on both the **frontend** and **backend** for all create and update operations.

---

## **Features**

### **Authentication**
- **Sign-Up:**
  - Users register with their email.
  - A welcome email is sent to the user with a randomly generated password.
- **Sign-In:**
  - Users log in with their email and password.
  - JWT is used for session management and authentication.

### **Dashboard**
- Displays the total number of registered cars in the system.

### **Categories CRUD**
- Users can:
  - Create new categories (e.g., Bus, Sedan, SUV).
  - View a paginated and sortable list of categories.
  - Update existing categories.
  - Delete categories.

### **Cars CRUD**
- Users can:
  - Add cars by selecting a category from a dropdown and providing details (color, model, make, registration number).
  - View, update, and delete cars using data tables with sorting and pagination.

### **Security**
- **XSS Protection:** Inputs are sanitized to prevent cross-site scripting attacks.
- **JWT Authentication:** All protected routes require a valid JWT token.

### **Validation**
- Frontend and backend validation are implemented for create and update modules to ensure data integrity and security.

---

## **Technologies Used**

### **Frontend**
- **React.js**: For building the user interface.
- **React Data Table Component**: For displaying paginated and sortable data tables.

### **Backend**
- **Node.js**: Backend server.
- **Express.js**: Framework for API creation.
- **MongoDB**: Database for storing user, category, and car data.
- **Mongoose**: ORM for MongoDB.
- **Nodemailer**: For sending welcome emails.
- **bcrypt.js**: For password hashing.
- **jsonwebtoken (JWT)**: For authentication.
- **express-validator**: For backend data validation.
- **xss**: For input sanitization and XSS protection.

---

## **Setup Instructions**

### **Backend Setup**
1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone <repository_url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   SMTP_USER=<your_email>
   SMTP_PASS=<your_email_password>
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### **Frontend Setup**
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```

### **Accessing the Application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## **Endpoints**

### **Authentication**
- `POST /api/auth/signup`: User registration and email sending.
- `POST /api/auth/login`: User login and token generation.

### **Dashboard**
- `GET /api/cars/count`: Returns the total number of registered cars.

### **Categories**
- `POST /api/categories`: Create a category.
- `GET /api/categories`: Retrieve paginated and sortable list of categories.
- `PUT /api/categories/:id`: Update a category.
- `DELETE /api/categories/:id`: Delete a category.

### **Cars**
- `POST /api/cars`: Create a car.
- `GET /api/cars`: Retrieve paginated and sortable list of cars.
- `PUT /api/cars/:id`: Update a car.
- `DELETE /api/cars/:id`: Delete a car.

---

## **Security Features**
1. **XSS Protection:**
   - Backend uses the `xss` library to sanitize user inputs.
   - Frontend inputs are sanitized before submission.
2. **JWT Authentication:**
   - Protected routes require a valid JWT token for access.

---

## **Validation**
- **Frontend Validation:**
  - Form fields for creating and updating cars and categories are validated for required inputs and correct formats.
- **Backend Validation:**
  - `express-validator` ensures all fields are properly validated and sanitized.

---



