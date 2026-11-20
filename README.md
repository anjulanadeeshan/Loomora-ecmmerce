<div align="center">
  <img src="frontend/src/assets/frontend_assets/loomora_black.png" alt="Loomora logo" width="220" />

  # Loomora — Full-Stack Fashion E-Commerce

  A modern fashion storefront and administration platform built with React, Node.js, Express, MongoDB Atlas, Cloudinary, and Brevo.

  [Live Store](https://loomora-web.netlify.app) · [Admin Login](https://loomora-web.netlify.app/admin/login) · [Source Code](https://github.com/anjulanadeeshan/Loomora-ecmmerce)
</div>

---

## Overview

Loomora is a full-stack e-commerce portfolio project that combines a responsive customer shopping experience with a protected administration workspace. Customers can discover products, manage a shopping bag, place orders, track fulfilment, and submit feedback. Administrators can manage the catalogue, orders, customers, and storefront feedback from a dedicated dashboard.

The frontend is deployed on Netlify. The backend runs in a Docker container on a VPS behind Nginx with HTTPS, while MongoDB Atlas, Cloudinary, and Brevo provide managed data, media, and email services.

## Live Links

| Resource | URL |
| --- | --- |
| Customer storefront | [loomora-web.netlify.app](https://loomora-web.netlify.app) |
| Admin login | [loomora-web.netlify.app/admin/login](https://loomora-web.netlify.app/admin/login) |
| Backend API | [54.36.38.116.sslip.io](https://54.36.38.116.sslip.io) |
| GitHub repository | [anjulanadeeshan/Loomora-ecmmerce](https://github.com/anjulanadeeshan/Loomora-ecmmerce) |

### Admin Demo Access

The production administrator password is intentionally **not stored in this public repository**. Admin access can create, update, and remove catalogue data and can change order and feedback states.

```text
Admin URL: https://loomora-web.netlify.app/admin/login
Email: Available from the project maintainer
Password: Available from the project maintainer
```

For a public portfolio demonstration, create a separate restricted demo account before publishing credentials. Never place the values from `backend/.env` in source control or documentation.

## Features

### Customer Experience

- Responsive fashion storefront for desktop and mobile
- Product search, category/type filters, and price sorting
- Product details, available sizes, related products, and bestsellers
- Shopping bag with quantity controls and calculated totals
- Checkout with delivery information and payment-method selection
- User registration, login, profile images, and JWT sessions
- Password visibility and email-based password recovery
- Customer order history and fulfilment tracking
- Ratings and written feedback for delivered orders
- Newsletter subscription and unsubscribe support

### Administration

- Protected administrator authentication and routes
- Dashboard statistics for revenue, orders, products, and customers
- Product creation, editing, removal, sizes, categories, and bestseller state
- Cloudinary product-image uploads
- Searchable and filterable order management
- Payment and fulfilment status controls
- Registered-customer directory
- Feedback approval, rejection, and removal
- Responsive admin navigation for mobile screens

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, React Router, Tailwind CSS 4, Vite, Axios, React Toastify |
| Backend | Node.js, Express 5, Mongoose, Multer |
| Database | MongoDB Atlas |
| Authentication | JSON Web Tokens, bcrypt |
| Media storage | Cloudinary |
| Email | Brevo transactional email API |
| Deployment | Netlify, Docker, VPS, Nginx, HTTPS |

## Architecture

```mermaid
flowchart LR
    U[Customer / Admin] --> N[Netlify]
    N --> F[React + Tailwind Frontend]
    F -->|HTTPS / REST API| X[Nginx Reverse Proxy]
    X --> D[Dockerized Node.js + Express API]
    D --> M[(MongoDB Atlas)]
    D --> C[Cloudinary]
    D --> B[Brevo Email API]
```

### Data and Media Flow

1. React sends authenticated requests to the Express REST API.
2. Express validates requests and uses Mongoose to store application data in MongoDB Atlas.
3. Product and profile images are uploaded through Multer and sent to Cloudinary.
4. Cloudinary returns hosted image URLs, which are stored with the related MongoDB documents.
5. Brevo sends password-reset verification codes and newsletter welcome emails.

## Project Structure

```text
Ecommerce/
├── backend/
│   ├── config/          # MongoDB, Cloudinary and email configuration
│   ├── controllers/     # Authentication, products, orders and feedback logic
│   ├── middleware/      # JWT authorization and file uploads
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST API routes
│   ├── scripts/         # Catalogue synchronization utilities
│   ├── compose.yaml     # Production Docker service
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── config/
│       ├── context/
│       ├── pages/
│       └── services/
└── README.md
```

## Local Development

### Prerequisites

- Node.js 22 or a compatible current LTS release
- npm
- MongoDB Atlas database
- Cloudinary account
- Brevo account with a verified sender

### 1. Clone the Repository

```bash
git clone https://github.com/anjulanadeeshan/Loomora-ecmmerce.git
cd Loomora-ecmmerce
```

### 2. Configure the Backend

```bash
cd backend
npm ci
```

Copy the production example to a local environment file:

```bash
cp env.production.example .env
```

Update `backend/.env` with your own values:

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=4000

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER/loomora_ecommerce
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET

ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=REPLACE_WITH_A_STRONG_PASSWORD

BREVO_API_KEY=REPLACE_WITH_YOUR_BREVO_API_KEY
EMAIL_FROM_ADDRESS=verified-sender@example.com
EMAIL_FROM_NAME=Loomora

CLOUDINARY_CLOUD_NAME=REPLACE_WITH_YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=REPLACE_WITH_YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=REPLACE_WITH_YOUR_CLOUDINARY_API_SECRET

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
CORS_ORIGINS=
```

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

### 3. Configure the Frontend

Open a second terminal:

```bash
cd frontend
npm ci
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Available Scripts

### Frontend

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

### Backend

```bash
npm run dev           # Start with Nodemon
npm start             # Start the production server
npm run seed:preview  # Preview catalogue synchronization
npm run seed          # Apply catalogue synchronization
```

## API Summary

| Area | Base path | Purpose |
| --- | --- | --- |
| Users | `/api/user` | Registration, login, admin login, password recovery, profiles, and statistics |
| Products | `/api/product` | Catalogue listing and admin CRUD operations |
| Orders | `/api/order` | Checkout, customer orders, status updates, and statistics |
| Feedback | `/api/feedback` | Customer reviews and admin moderation |
| Newsletter | `/api/newsletter` | Subscription and unsubscribe workflow |

Protected endpoints require a JWT in the `token` request header. Administrator endpoints additionally validate the admin role.

## Production Deployment

### Frontend — Netlify

1. Set the Netlify base directory to `frontend`.
2. Use `npm run build` as the build command.
3. Publish the `frontend/dist` directory.
4. Configure `VITE_API_URL` with the HTTPS backend URL.

### Backend — Docker and VPS

The backend includes a production `Dockerfile` and `compose.yaml`. The service binds to `127.0.0.1:4000`, applies resource limits, restarts automatically, and provides a health check.

```bash
cd backend
docker compose up -d --build
docker compose ps
docker compose logs -f loomora-api
```

Nginx terminates HTTPS and proxies API traffic to the local container. Production CORS should allow only the Netlify storefront and explicitly trusted origins.

## Security Notes

- Passwords are hashed with bcrypt.
- Authentication tokens expire and are verified on protected routes.
- Admin routes are protected separately from customer routes.
- Secrets belong only in ignored `.env` files or deployment environment settings.
- Never commit MongoDB credentials, Cloudinary secrets, Brevo keys, JWT secrets, or administrator passwords.
- Rotate any credential immediately if it appears in Git history, logs, screenshots, or documentation.

## Developer

**Anjula Nadeeshan**

- GitHub: [@anjulanadeeshan](https://github.com/anjulanadeeshan)
- Live project: [Loomora](https://loomora-web.netlify.app)

## License

The backend package currently declares the ISC license. Add a root `LICENSE` file before distributing the complete project under a specific license.
