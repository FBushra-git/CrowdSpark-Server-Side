# CrowdSpark Server

CrowdSpark Server is the TypeScript Express and MongoDB API for the CrowdSpark crowdfunding platform. It manages authentication, role-based access, campaigns, contributions, withdrawals, payments, notifications, reports, and demo data seeding.

## Live Links

- Client live site: Coming soon
- Server live API: Coming soon
- Client repository: https://github.com/FBushra-git/CrowdSpark-Client-Side
- Server repository: https://github.com/FBushra-git/CrowdSpark-Server-Side

## Demo Credentials

- Admin email: admin@crowdspark.dev
- Admin password: Admin@12345
- Creator email: creator@crowdspark.dev
- Creator password: Creator@12345
- Supporter email: supporter@crowdspark.dev
- Supporter password: Supporter@12345

## Key Features

- TypeScript Express API designed for a production-ready MERN-style crowdfunding platform.
- MongoDB and Mongoose data layer for users, campaigns, contributions, withdrawals, payments, notifications, and reports.
- JWT authentication with protected route middleware.
- Role-based authorization middleware for Supporter, Creator, and Admin access rules.
- Registration flow assigns default credits based on role: Supporters receive 50 credits and Creators receive 20 credits.
- Secure password hashing with bcryptjs.
- Campaign API supports approved campaign listing, campaign details, creator campaign creation, and admin status updates.
- Contribution API supports supporter contributions and creator approval or rejection workflows.
- Withdrawal API supports creator withdrawal requests and admin payment-success updates.
- Payment API includes a dummy payment endpoint that can be replaced or expanded with Stripe payment intents.
- Notification API returns user-specific notifications sorted for dashboard display.
- Report API supports supporter fraud reports and admin report review.
- imgBB upload route is prepared for profile and campaign image hosting.
- Demo seed data can be enabled with `SEED_DEMO_DATA=true` without overwriting existing real records.
- Environment variables keep MongoDB, JWT, Stripe, and imgBB credentials out of source control.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- Zod
- multer
- Axios
- Stripe SDK

## Local Setup

```bash
npm install
copy .env.example .env
npm run dev
```

The API health route is available at `http://localhost:5000/api/health`.

## Environment Variables

```env
PORT=5000
MONGODB_URI=replace_with_mongodb_connection_string
JWT_SECRET=replace_with_long_secret
CLIENT_URL=http://localhost:3000
IMGBB_API_KEY=replace_with_imgbb_key
STRIPE_SECRET_KEY=replace_with_stripe_secret
ADMIN_EMAIL=admin@crowdspark.dev
ADMIN_PASSWORD=Admin@12345
SEED_DEMO_DATA=false
```
