# RentalHub MERN Stack

This project has been upgraded to a full MERN stack application.

- Frontend: React (Vite) in `rentalhub-react/`
- Backend: Node.js + Express + MongoDB in `server/`

## Prerequisites
- Node.js 18+
- MongoDB running locally (defaults to mongodb://127.0.0.1:27017)

## Setup

1) Backend
- Copy `server/.env.example` to `server/.env` and adjust if needed

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rentalhub
JWT_SECRET=supersecretchangeme
CORS_ORIGIN=http://localhost:5173
```

- Install and run backend
```
cd server
npm install
npm run dev
```
The API starts on http://localhost:5000

- Seed an admin user (development only)
Use a REST client or curl to create an admin user for testing:
```
curl -X POST http://localhost:5000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rentalhub.com","password":"admin123"}'
```
The response contains a JWT token and user. You can then log in from the Admin UI.

- Seed sample cars (requires admin token)
```
# Replace TOKEN below with the token from seed-admin response
curl -X POST http://localhost:5000/api/cars/seed \
  -H "Authorization: Bearer TOKEN"
```

2) Frontend
- Install and run frontend
```
cd rentalhub-react
npm install
npm run dev
```
Vite runs on http://localhost:5173 and proxies `/api` calls to the backend at http://localhost:5000

## Key Integrations
- `rentalhub-react/src/api/client.js` centralizes API calls, token storage, and admin actions
- Auth
  - Signup: `POST /api/auth/signup`
  - Login: `POST /api/auth/login`
  - Me: `GET /api/auth/me` (requires Bearer token)
- Cars
  - List cars: `GET /api/cars`
  - Seed cars: `POST /api/cars/seed` (admin only)
- Bookings
  - Create booking: `POST /api/bookings` (requires Bearer token)
- Admin
  - List bookings: `GET /api/admin/bookings` (admin only)
  - Approve booking: `PATCH /api/admin/bookings/:id/approve` (admin only)
  - Reject booking: `PATCH /api/admin/bookings/:id/reject` (admin only)

## Pages Updated
- `Login.jsx` and `Signup.jsx` now use backend auth and store JWT
- `booking.jsx` creates bookings via API; requires login
- `AdminLogin.jsx` authenticates via backend and verifies admin flag
- `AdminDashboard.jsx` fetches and manages bookings via backend (admin-only)
- `Fleet.jsx` fetches cars from backend with a graceful fallback to static data

## Notes
- In production, make sure to set secure secrets and origins in `server/.env` and deploy Node and React accordingly.
- Razorpay integration remains front-end only for demo; for real payments, add server-side order creation and verification.
