# 🛒 Full Stack E-Commerce Application (MERN)

A complete **Full-Stack MERN E-Commerce Platform** with a **Customer Frontend**, **Admin Dashboard**, and a **secure Backend API**.  
This project includes authentication, product management, image uploads, cart, orders, and online payments.

---

## 🌐 Live Project Links
https://e-commerce-application-neon-delta.vercel.app/


## 🚀 Features

### 👤 User (Frontend)
- User authentication (Login / Register)
- Product listing & filtering
- Product search
- Add to cart & remove from cart
- Place orders
- Secure checkout with Razorpay / Stripe
- Order confirmation
- Responsive design

### 🛠️ Admin Dashboard
- Admin authentication
- Add, edit, delete products
- Upload product images via Cloudinary
- Manage user orders
- Update order status (Processing, Shipped, Delivered, Cancelled)
- Dashboard analytics

### 🔐 Backend API
- JWT authentication
- Secure REST APIs
- Role-based access (User / Admin)
- MongoDB database integration
- Cloudinary image storage
- Payment gateway integration
- Secure CORS configuration

---

## 🧑‍💻 Tech Stack

### Frontend & Admin
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary
- Stripe / Razorpay
- Multer
- Cors
- Dotenv

### Deployment
- **Frontend & Admin:** Vercel  
- **Backend:** Render  
- **Database:** MongoDB Atlas  
- **Image Storage:** Cloudinary

---

## 📂 Project Structure

```bash
E-commerce-application/
│
├── frontend/     # Customer Website (React + Vite)
├── admin/        # Admin Dashboard (React + Vite)
└── backend/      # Node.js + Express API
```
---

🏃 How to Run Locally
1️⃣ Clone the Repository
```bash
git clone https://github.com/Priyesh-Jain24/E-commerce-application.git
cd E-commerce-application
```

2️⃣ Backend Setup
```bash
cd backend
npm install
npm start
```

3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
---

⚙️ Environment Variables
To run this project, you will need to add the following environment variables to your .env files.


Backend (backend/.env)
```bash
PORT=10000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

# Cloudinary Config
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Frontend & Admin (.env.production / .env.local)
```bash
VITE_API_BASE_URL=
VITE_RAZORPAY_KEY_ID=
```



👨‍💻 Author
Priyesh Jain

GitHub: Priyesh-Jain24

📝 License
This project is licensed under the MIT License.

