# Multi-User Inventory Management API

A **multi-tenant inventory system** where vendors can spin up their own stores, manage products, invite staff, and process customer orders—all with role-based access control and JWT authentication.

---

## 🚀 Features

- **User Authentication & Roles**  
  - `Admin`, `Vendor`, `Staff` roles  
  - JWT-based login & protected routes  
- **Store Management**  
  - Vendors create & update their own store  
  - Invite staff via email with one-time tokens  
- **Product Catalog**  
  - CRUD products (name, SKU, price, stock, threshold, category)  
  - Vendor- and store-scoped  
- **Order Processing**  
  - Place orders against a store  
  - Stock validation & automatic quantity decrement  
  - View, update status (`pending`, `processing`, `shipped`, `delivered`, `cancelled`), delete  
- **Security Hardening**  
  - Helmet, CORS, rate-limiting, input sanitization  
- **Email Invites**  
  - Nodemailer + SendGrid/Ethereal for staff invites  

---

## 📦 Installation

```bash
# clone & enter
git clone https://github.com/Over-knight/Multi-User-Inventory.git
cd Multi-User-Inventory

# install deps
npm install

# for local dev
npm run dev


**##🔧 Environment Variables**
# Server
PORT=6000
MONGO_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your_jwt_secret_here

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (SendGrid example)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxx-your-key
FROM_EMAIL="Inventory App" <no-reply@yourdomain.com>

# Frontend URL (for invite links)
FRONTEND_URL=http://localhost:3000


  ## 🔑 Authentication
Authorization: Bearer <JWT_TOKEN>


Register
arduino
Copy
Edit
POST /api/auth/register
Content-Type: application/json

{
  "name": "Acme Vendor",
  "email": "vendor@acme.com",
  "password": "securePass123",
  "role": "vendor"            # or "admin"
}
Response 201 Created

json
Copy
Edit
{ "message": "User registered successfully" }
Login
pgsql
Copy
Edit
POST /api/auth/login
Content-Type: application/json

{ "email": "vendor@acme.com", "password": "securePass123" }
Response 200 OK

json
Copy
Edit
{ 
  "token": "<JWT_TOKEN>",
  "user": { "_id": "...", "name": "Acme Vendor", "email": "...", "role": "vendor" }
}
**##🏪 Store Management**
Create Store
pgsql
Copy
Edit
POST /api/stores
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "storeName": "Acme Gadgets",
  "description": "Electronics & Accessories",
  "address": "123 Main St.",
  "phone": "+1234567890"
}
Response 201 Created → store object

Invite Staff
bash
Copy
Edit
POST /api/stores/:storeId/invite
Authorization: Bearer <JWT>
Content-Type: application/json

{ "email": "staff@example.com" }
Response 200 OK

json
Copy
Edit
{ 
  "message": "Invitation created and email sent",
  "inviteLink": "http://localhost:3000/invite/accept?token=abcdef..."
}
Accept Invite
bash
Copy
Edit
POST /api/stores/invite/accept
Content-Type: application/json

{
  "token": "abcdef...",
  "name": "Staff Member",
  "password": "staffPass123"
}
Response 200 OK

json
Copy
Edit
{
  "message": "Invite accepted—now a staff member!",
  "token": "<JWT>",
  "user": { "id": "...", "name": "Staff Member", "email": "...", "role": "staff" }
}
**##📦 Product Catalog (Vendor & Staff)**
All endpoints below require Authorization: Bearer <JWT> and vendor/staff role.

Create Product
bash
Copy
Edit
POST /api/products
Content-Type: application/json

{
  "name":        "Ergonomic Keyboard",
  "price":       49.99,
  "sku":         "KB-ERG-001",
  "description": "Backlit mechanical keyboard",
  "quantity":    50,
  "threshold":   5,
  "category":    "<CategoryId>",
  "store":       "<StoreId>"
}
Response 201 Created → product object

Get All Products
bash
Copy
Edit
GET /api/products
Response 200 OK → [ {...}, {...} ]

Get Single Product
bash
Copy
Edit
GET /api/products/:id
Response 200 OK → product object

Update Product
bash
Copy
Edit
PUT /api/products/:id
Content-Type: application/json

{ "price": 44.99, "quantity": 60 }
Response 200 OK → updated product

Delete Product
bash
Copy
Edit
DELETE /api/products/:id
Response 200 OK

json
Copy
Edit
{ "message": "Product deleted successfully" }
**##🛒 Order Processing (Vendor & Staff)**
Create Order
bash
Copy
Edit
POST /api/orders
Content-Type: application/json

{
  "storeId":        "<StoreId>",
  "items": [
    { "product": "<ProductId>", "quantity": 2 }
  ],
  "customerName":   "Jane Doe",
  "customerEmail":  "jane@doe.com",
  "customerPhone":  "+1234567890"
}
Response 201 Created → order object (with totalAmount)

Get Orders for a Store
bash
Copy
Edit
GET /api/orders?storeId=<StoreId>
Response 200 OK → [ {...}, {...} ]

Get Single Order
bash
Copy
Edit
GET /api/orders/:id
Response 200 OK → order object

Update Order Status
bash
Copy
Edit
PUT /api/orders/:id
Content-Type: application/json

 "status": "shipped" 
Response 200 OK → updated order

Delete Order
bash
Copy
Edit
DELETE /api/orders/:id
Response 200 OK

json
Copy
Edit
 "message": "Order deleted successfully" 
##**📚 Development & Tooling**
bash
Copy
Edit
# TypeScript & compile
npm install --save-dev typescript ts-node nodemon @types/node @types/express

# Validation & utils
npm install zod express-rate-limit helmet cors express-mongo-sanitize

# Authentication
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken

# Database
npm install mongoose @types/mongoose

# Email
npm install nodemailer @types/nodemailer

# Testing (optional)
npm install --save-dev jest ts-jest supertest mongodb-memory-server @types/jest @types/supertest

Built with ❤️ by Over-knight
