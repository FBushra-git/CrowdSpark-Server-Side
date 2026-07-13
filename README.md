# CrowdSpark Server

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens)

CrowdSpark Server is the TypeScript Express API behind CrowdSpark, a full-stack crowdfunding platform with role-based dashboards, campaign moderation, credit-based contributions, creator withdrawals, notifications, reports, image uploads, and Google login support.

This repository is designed to show backend product thinking: not just routes, but complete platform workflows with authentication, authorization, state transitions, validation, data modeling, and deployment-ready configuration.

## Live Project

| Resource | Link |
| --- | --- |
| Client App | https://crowdspark-client-side.vercel.app |
| API Health Route | `/api/health` on the deployed server |
| Client Repository | https://github.com/FBushra-git/CrowdSpark-Client-Side |
| Server Repository | https://github.com/FBushra-git/CrowdSpark-Server-Side |

Opening `/` on the API may show `Cannot GET /`. That is expected for an API-only backend. Use `/api/health` to verify the deployment.

## Backend Highlights

- TypeScript Express API with modular route boundaries
- MongoDB persistence through Mongoose models
- JWT authentication and role-based authorization middleware
- Google ID token verification using `google-auth-library`
- Password hashing with bcryptjs
- Zod request validation for auth workflows
- CORS allowlist designed for local and deployed clients
- Campaign lifecycle: draft creation, admin approval, rejection, suspension, and updates
- Contribution lifecycle: supporter credit deduction, creator review, approval, raised-credit update, or refund
- Withdrawal lifecycle: creator request, minimum threshold validation, admin approval/rejection, and notification
- Payment history combining purchases and withdrawals into one timeline
- Notification system with optional email delivery support
- imgBB upload endpoint with memory storage and file validation
- Demo data seeding controlled by environment variables

## System Flow

```text
Client Request
  -> Express route
  -> JWT authentication middleware
  -> Role authorization middleware
  -> Request validation / business rules
  -> Mongoose model operation
  -> Notification or side effect when needed
  -> Sanitized JSON response
```

## Business Workflow

```text
Supporter buys credits
  -> credits are added to account
  -> supporter contributes to campaign
  -> credits are held while contribution is pending

Creator reviews contribution
  -> approved: campaign amountRaised increases and creator raisedCredits increase
  -> rejected: supporter receives credits back

Creator requests withdrawal
  -> server validates minimum 200 raised credits
  -> admin reviews request
  -> approved: creator raisedCredits decrease
  -> rejected: request is closed without deducting credits

Admin moderates platform
  -> approves campaigns
  -> rejects or suspends campaigns
  -> handles reports and withdrawal requests
  -> manages user records
```

## Tech Stack

| Area | Tools |
| --- | --- |
| Runtime | Node.js |
| API Framework | Express 5 |
| Language | TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, Google OAuth token verification |
| Validation | Zod |
| Uploads | multer memory storage, imgBB API |
| Payments | Stripe-ready payment structure, simulated checkout flow |
| Notifications | MongoDB notifications, SendGrid-compatible email helper |
| Deployment | Vercel serverless API configuration |

## API Surface

| Domain | Routes |
| --- | --- |
| Health | `GET /api/health` |
| Auth | `/api/auth/register`, `/api/auth/login`, `/api/auth/google`, `/api/auth/me` |
| Campaigns | Public listings, detail view, creator management, admin approval/rejection |
| Contributions | Supporter contribution history, creator pending queue, approval/rejection |
| Payments | Credit purchase simulation, payment stats, combined transaction history |
| Withdrawals | Creator withdrawal requests, admin pending queue, approve/reject actions |
| Notifications | User notifications, unread counts, read-state updates |
| Reports | Suspicious campaign reporting and admin review |
| Uploads | imgBB image upload endpoint |
| Admin | Platform stats, users, campaign moderation, operational routes |

## Data Model Overview

| Model | Purpose |
| --- | --- |
| User | Identity, role, credits, raised credits, auth provider, profile image |
| Campaign | Campaign details, creator ownership, funding goal, raised amount, status, updates |
| Contribution | Supporter donation intent, creator review status, refund/approval state |
| Payment | Credit purchase records and transaction metadata |
| Withdrawal | Creator cash-out requests and admin decision state |
| Notification | In-app notifications with optional email delivery metadata |
| Report | User-submitted campaign reports for admin review |

## Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@crowdspark.dev` | `Admin@12345` |
| Creator | `creator@crowdspark.dev` | `Creator@12345` |
| Supporter | `supporter@crowdspark.dev` | `Supporter@12345` |

## Environment Variables

Create `Server-Side/.env`:

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

For production CORS, set the deployed client URL:

```env
CLIENT_URL=https://crowdspark-client-side.vercel.app
```

Multiple origins can be supplied as a comma-separated list.

```env
CLIENT_URL=http://localhost:3000,https://crowdspark-client-side.vercel.app
```

## Local Development

```bash
npm install
npm run dev
```

Health check:

```text
http://localhost:5000/api/health
```

## Production Build

```bash
npm run build
npm run start
```

## Advanced Implementation Notes

- Role-based authorization is enforced server-side, not only through frontend route hiding.
- Contribution approval is modeled as a state transition, allowing the system to refund supporters when creators reject a contribution.
- Withdrawals are protected by business rules so creators cannot request more than their raised credit balance.
- Campaign deletion handles approved contribution cleanup and supporter refunds.
- Public campaign listing uses aggregation with filtering, sorting, pagination, and total counts in one query pipeline.
- The API returns sanitized auth responses so password hashes are never exposed to the client.
- CORS is configured with a strict allowlist while still supporting local development and deployed Vercel origins.

## Companion Frontend

The frontend repository provides the Next.js App Router client, Google OAuth UI, dashboard interfaces, campaign explorer, analytics views, image upload flows, and role-specific user experience.

Client repo: https://github.com/FBushra-git/CrowdSpark-Client-Side
