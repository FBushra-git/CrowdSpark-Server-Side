# CrowdSpark Server

CrowdSpark Server is the TypeScript Express and MongoDB API for the CrowdSpark crowdfunding platform. It manages authentication, role-based authorization, campaigns, contributions, withdrawals, payments, notifications, reports, admin controls, image uploads, and demo data seeding.

## Live Links

- Client live site: Coming soon after deployment
- Server live API: Coming soon after deployment
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

- TypeScript Express API for a production-ready crowdfunding platform.
- MongoDB and Mongoose models for users, campaigns, contributions, withdrawals, payments, notifications, and reports.
- JWT authentication with protected route middleware.
- Role-based authorization for Supporter, Creator, and Admin routes.
- Secure bcrypt password hashing and sanitized user responses.
- Google token verification endpoint for optional social login.
- Campaign APIs for public approved listings, advanced filtering, campaign details, creator campaign creation, creator campaign management, and admin moderation.
- Contribution APIs for supporter donations, paginated contribution history, creator pending-review queues, approval, rejection, refunds, and raised-credit updates.
- Payment APIs for credit purchase simulation, payment stats, and combined purchase/withdrawal history.
- Withdrawal APIs for creator requests, minimum credit validation, admin pending queue, approval, rejection, and creator notifications.
- Admin APIs for platform stats, user listing, role updates, and user removal.
- Notification APIs for user-specific notification lists, unread counts, and read status updates.
- Report APIs for suspicious campaign reports and admin review.
- imgBB upload endpoint using multer memory storage with image type and size validation.
- SendGrid-compatible email notification utility with graceful fallback when keys are not configured.
- Demo data seeding controlled by `SEED_DEMO_DATA=true`.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod
- multer
- Axios
- SendGrid-compatible email API

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
JWT_SECRET=replace_with_long_secret_at_least_32_characters
CLIENT_URL=http://localhost:3000
IMGBB_API_KEY=replace_with_imgbb_key
STRIPE_SECRET_KEY=replace_with_stripe_secret
ADMIN_EMAIL=admin@crowdspark.dev
ADMIN_PASSWORD=Admin@12345
ADMIN_NOTIFICATION_EMAIL=admin@crowdspark.dev
SEED_DEMO_DATA=false
GOOGLE_CLIENT_ID=replace_with_google_web_client_id
GOOGLE_CLIENT_SECRET=replace_with_google_client_secret
SENDGRID_API_KEY=replace_with_sendgrid_key
SENDGRID_FROM_EMAIL=no-reply@crowdspark.dev
```
