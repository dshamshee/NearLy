# NearLy — Local Services on Demand

**Expert help, just a tap away.**

NearLy connects customers with local professionals in real time. Customers search by trade, location, and budget; workers receive requests, navigate to jobs, and share live location while en route. The product pairs a **Next.js** web app with a **Socket.IO** tracking service and a **MongoDB** data layer.

---

## Table of Contents

- [Overview](#overview)
- [What’s in this repository](#whats-in-this-repository)
- [Architecture](#architecture)
- [User roles](#user-roles)
- [Professions & search](#professions--search)
- [Features](#features)
- [Major flows](#major-flows)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Deployment notes](#deployment-notes)
- [Booking & tracking flow](#booking--tracking-flow-end-to-end)
- [License](#license)

---

## Overview

NearLy is a **two-part platform**:

1. **`nearly`** (this folder) — Next.js application: marketing pages, authentication, customer and worker dashboards, profiles, payments, feedback, and REST-style API routes plus **Server Actions** for server-side work.
2. **`nearlyTracking`** (sibling folder in the repo root) — Node/Express server with **Socket.IO** for booking handshakes, accept/reject, live location broadcasts, and related real-time events.

Both services use the **same MongoDB database** (via Mongoose). The web app connects to the tracking server as a **Socket.IO client** for live updates.

---

## What’s in this repository

| Area | Purpose |
|------|---------|
| **Marketing** | Landing, About, Services, Contact (public) |
| **Auth** | Login, signup with email verification, forgot/reset password |
| **Customers** | Dashboard (search, nearby workers, booking UI), profile, payment page after bookings |
| **Workers** | Dashboard (availability, incoming requests, navigation/out-for-service flow), profile view/edit, stats and booking history |
| **Shared** | Feedback/ratings for workers, public profile links, theme (light/dark), responsive layout |

Route groups separate customer (`/c/...`) and worker (`/w/...`) experiences. Authentication and role checks are implemented in NextAuth and related server logic so each role uses the appropriate dashboards and APIs.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NearLy Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────────┐ │
│   │      nearly      │         │       nearlyTracking         │ │
│   │  (Next.js App)   │◄───────►│  (Express + Socket.IO)       │ │
│   │   (dev default)  │ Socket  │   (separate process)         │ │
│   └────────┬─────────┘   .IO   └──────────────┬───────────────┘ │
│            │                                  │                 │
│            └───────────────┬──────────────────┘                 │
│                            │                                    │
│                            ▼                                    │
│                   ┌─────────────────┐                           │
│                   │     MongoDB     │                           │
│                   └─────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

- **HTTP**: Next.js handles pages, API routes, and server actions.
- **Real-time**: The tracking server holds active worker sockets and booking state, and pushes events to the right clients.
- **Maps**: Map and geocoding features rely on a maps provider (loaded on the client where required).

---

## User roles

- **CUSTOMER** — Search, request bookings, track workers, pay, leave feedback, manage profile.
- **WORKER** — Toggle availability, receive requests, navigate, update job status, manage profile and earnings-related views.
- **ADMIN** — Represented in the user model for future or internal use; the main UX focuses on customers and workers.

---

## Professions & search

Supported trades include (among others): **Electrician**, **Plumber**, **Carpenter**, **Painter**, **Cleaner**, **Mason**, **Pipe fitter**, **Welder**, **General labour**, **A/C technician**, and **Other** (custom text).

**Nearby workers** are resolved with a **geospatial** query: workers must be **active**, have a **completed profile**, and fall within a **fixed radius** (on the order of a few kilometers) of the customer’s search point.

---

## Features

### Customers

- **Search & filters** — Profession, price expectations, description, and location (with geolocation and address lookup where enabled).
- **Nearby workers** — List professionals matching criteria inside the search radius.
- **Booking requests** — Send a request to a chosen worker; wait for accept/reject in real time.
- **Live tracking** — Map view of the worker while they are navigating to you.
- **Status updates** — Real-time phases such as en route, arrived, and service progression (driven by worker actions and the tracking server).
- **Price negotiation** — If a worker rejects, adjust the offered price and retry (same or different worker, per UI flow).
- **Payments** — Checkout integrated with a third-party payment provider (orders in **INR**); payment records stored per booking.
- **Profiles & history** — Customer profile, booking list, and “recent professionals” style summaries where implemented.

### Workers

- **Availability** — Go active or inactive to control whether booking requests arrive.
- **Incoming requests** — Job details (address, profession, description) delivered in real time.
- **Accept / reject** — Respond through the socket flow; customers see the outcome immediately.
- **Out for service & navigation** — Start navigation; location updates are broadcast on an interval while en route.
- **Arrival & completion** — Arrival detection uses distance thresholds; countdown and completion steps finish the on-site phase.
- **Profile** — Profession, experience, service charge, proficiency, optional verification fields, reviews, and avatar.
- **Stats & bookings** — Recent bookings, ratings, and dashboard cards for activity.

### Shared & platform

- **Authentication** — Email/password and optional **Google** sign-in; sessions use **NextAuth.js** with role-aware behavior.
- **Account security** — Email verification on signup; forgot-password and reset-password flows with email delivery.
- **Feedback** — Star rating and comments for workers after interactions (via dedicated flow).
- **Contact** — Public contact channel for inquiries (implemented in-app).
- **UI** — Radix UI primitives, Tailwind CSS, motion/animation, toasts, dark/light theme.

---

## Major flows

1. **Signup** — User requests a verification code, confirms email, then completes signup; worker and customer records are created according to role.
2. **Login** — Credentials or OAuth; role determines default dashboard (`/c/dashboard` vs `/w/dashboard`).
3. **Find & book** — Server action loads nearby workers; customer selects one and emits a booking request over Socket.IO; tracking server notifies the worker.
4. **Job execution** — Accept/reject, navigation, location streaming, arrival, and completion are coordinated through socket events and persisted booking state.
5. **Payment** — Server creates payment orders; client opens the provider checkout; webhooks/API routes finalize and store payment status linked to bookings (including optional QR-related helpers where present).
6. **Feedback** — Customer submits rating/comment for a worker on the feedback route.

---

## Tech stack

### `nearly` (Next.js)

| Category | Technologies |
|----------|--------------|
| Framework | Next.js 16, React 19 |
| Auth | NextAuth.js, bcrypt, JWT callbacks |
| Database | Mongoose |
| Real-time client | socket.io-client |
| Maps | Google Maps JS API loader, React Google Maps components |
| Forms & validation | react-hook-form, Zod |
| UI | Radix UI, Tailwind CSS 4, Motion, Sonner, Lucide / Tabler icons |
| State | Zustand (with persistence for client stores) |
| Email | Resend, React Email templates |
| Payments | Razorpay SDK (client) + server-side order creation |
| Media | Cloud-hosted images (e.g. avatars) via upload API |

### `nearlyTracking` (Express)

| Category | Technologies |
|----------|--------------|
| Runtime | Node.js or Bun |
| Server | Express 5 |
| Real-time | Socket.IO 4 |
| Database | Mongoose (shared models/concerns with the app DB) |
| Config | Environment-based configuration (no secrets committed) |

---

## Project structure

```
<repo-root>/
├── nearly/                      # Next.js web application (this project)
│   ├── app/
│   │   ├── (auth)/              # login, signup, forgot/reset password
│   │   ├── c/                   # customer dashboard, profile, payment
│   │   ├── w/                   # worker dashboard, profile, edit
│   │   ├── api/                 # REST handlers (auth, worker, payment, upload, etc.)
│   │   ├── about|contact|services/
│   │   ├── feedback/
│   │   └── page.tsx             # landing
│   ├── actions/                 # Server Actions (bookings, workers, payments, …)
│   ├── components/              # Maps, search, cards, layout, UI primitives
│   ├── models/                  # Mongoose models (User, Worker, Customer, Booking, …)
│   ├── store/                   # Zustand stores
│   ├── types/, zod/, helpers/
│   ├── utils/                   # DB connection, socket React context, …
│   └── scripts/                 # e.g. coordinate migration utilities
│
└── nearlyTracking/              # Socket.IO + Express server
    ├── server.ts
    ├── model/                   # Active workers / active bookings in memory + DB
    ├── config/
    └── container tooling (Docker, etc.) where present
```

---

## Getting started

### Prerequisites

- **Node.js** 18+ or **Bun**
- **MongoDB** (self-hosted or managed)
- Accounts/keys for **maps**, **OAuth** (if using Google login), **email sending**, **payments**, and **media hosting** — all supplied via your own configuration (never commit secrets).

### Install

```bash
cd nearly
npm install   # or: bun install
```

```bash
cd ../nearlyTracking
npm install   # or: bun install
```

### Configuration

Create environment files **only on your machine or host**. You will need values for: database connectivity, authentication secrets, OAuth client credentials (if used), email delivery, payment provider keys, maps API access, media upload credentials, and the public origin of the web app for CORS on the tracking server. **Do not commit `.env` files** or paste secrets into documentation.

### Run locally

Start the **tracking server** first (see `nearlyTracking` for the exact entry command — typically running the TypeScript server with your preferred runner).

Then start the **Next.js app**:

```bash
cd nearly
npm run dev     # or: bun dev
```

Open the URL printed in the terminal (default for Next.js is port **3000**). Ensure the client is configured to reach your tracking server’s URL and port in your environment.

---

## Deployment notes

- **Next.js** — Suitable for Vercel or any Node host: `next build` / `next start`. Set environment variables in the host’s dashboard.
- **Tracking server** — Can run in Docker or a process manager; expose the Socket.IO port and configure **CORS** so only your deployed web origin can connect.
- **Database** — Use a production MongoDB deployment with backups and network access restricted to your apps.

Do **not** embed API keys, database URIs, or provider secrets in the README or source control.

---

## Booking & tracking flow (end-to-end)

1. Customer searches by profession, location, and price → runs **find nearby workers** (geospatial + filters).
2. Customer selects a worker → emits a **booking request** over Socket.IO.
3. Tracking server records the active booking and notifies the worker.
4. Worker **accepts** or **rejects** → customer receives the result in real time.
5. Worker goes **out for service** / starts navigation → status updates propagate; **location** broadcasts on a timer.
6. Worker **arrives** (proximity-based) → customer sees arrival; service can move to **done** / completed states per your rules.
7. **Payment** may run after the flow when a charge is due (order creation → provider checkout → confirmation stored).

Exact event names and distance thresholds are defined in application code (`nearlyTracking` and client stores).

---

## License

ISC
