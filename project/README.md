# Grocery Ordering System

## Introduction

This project is a full-stack web application simulating a grocery store system. It allows store owners to manage inventory and place orders to suppliers, while suppliers can manage their offered products and incoming orders.

---

## Frontend Structure (React)

- `components/` - Reusable UI components (SignUp, SignIn, SupplierOrders, etc.)
- `hooks/` - Custom hooks including authentication logic (`useAuth`)
- `shared-theme/` - UI theme configuration (light/dark mode)
- `App.js` - Main application with route definitions
- `index.js` - Entry point for React app

---

## Backend Structure (Node.js + Express)

- `routes/` - Express route handlers:
  - `suppliers.js` – Supplier registration, login
  - `orders.js` – Create, update, and list orders
  - `products.js` – Supplier product management
  - `store.js` – Store-side purchasing logic
  - `inventory.js` – Inventory tracking and updates
- `utils/db.js` – MySQL connection configuration
- `app.js` – Main Express server setup

---

## How to Run

### 1. Clone the repository
```bash
git clone https://github.com/your-username/grocery-orders-system.git
cd grocery-orders-system
```

### 2. Install and start the backend
```bash
cd server
npm install
npm start
```
The backend server will start on: `http://localhost:3001`

### 3. Install and start the frontend
```bash
cd ../client
npm install
npm start
```
The frontend application will run on: `http://localhost:3000`

## Backend Routes (Express API)

### `/api/suppliers`
- `POST /api/suppliers` — Register a new supplier and optional product list
- `POST /api/suppliers/signin` — Supplier login using phone and password
- `GET /api/suppliers` — Get all registered suppliers

### `/api/products`
- `GET /api/products/:supplierId` — Get all products for a specific supplier

### `/api/orders`
- `POST /api/orders` — Create a new order with selected products
- `GET /api/orders` — Retrieve all orders, optionally filtered by `supplier_id`
- `PUT /api/orders/:id` — Update the status of a specific order

### `/api/store`
- `POST /api/store/purchase` — Simulate a store purchase, update inventory, and auto-order from suppliers when needed

### `/api/inventory`
- `GET /api/inventory` — View the current inventory levels
- `PUT /api/inventory` — Update the minimum required quantity for inventory items
- `POST /api/inventory` — Add a new item to the inventory

## Frontend Pages (React Routes)

### `/` – Home Page
- Entry point to the app
- Includes navigation buttons to sign up as a supplier or act as a grocery store owner

### `/signUp` – Supplier Registration
- Form to register a new supplier
- Includes company details and product list input

### `/signIn` – Supplier Login
- Form to authenticate a supplier using phone and password

### `/supplierOrders` – Supplier Orders Dashboard
- Displays all orders received by the logged-in supplier
- Allows the supplier to update order status (e.g., mark as "in process")

### `/order` – Store Owner Ordering Page
- View current inventory
- Purchase items manually
- Triggers auto-ordering if inventory falls below the minimum threshold

### `/showOrders` – Store Order History
- Displays a list of all orders placed from the store side

### `/inventory` – Inventory Settings
- Allows the store owner to update the minimum required quantities for inventory items
- Add new inventory items
