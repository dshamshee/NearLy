# NearLy — Local Services on Demand

**Expert help, just a tap away.**

NearLy connects customers with verified local professionals in real time. Whether it's a plumbing emergency, an electrical fix, or general labor—help is just around the corner. We bring the speed and convenience of ride-sharing to home services: open the app, drop a pin, and find skilled workers in your immediate vicinity ready to tackle the job.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Services Provided](#services-provided)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

---

## Overview

NearLy is a **two-part platform**:

1. **nearly** — A Next.js web application for customers and workers (dashboards, search, booking, live tracking)
2. **nearlyTracking** — A real-time tracking server (Express + Socket.IO) that orchestrates booking requests, accept/reject flows, and live location updates

Both applications share a **MongoDB** database and communicate in real time via **Socket.IO**.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NearLy Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────┐         ┌──────────────────────────────┐ │
│   │      nearly      │         │       nearlyTracking         │ │
│   │  (Next.js App)   │◄───────►│  (Express + Socket.IO)       │ │
│   │   Port: 3000     │ Socket  │       Port: 4000             │ │
│   └────────┬─────────┘   .IO   └──────────────┬───────────────┘ │
│            │                                   │                 │
│            └───────────────┬───────────────────┘                 │
│                            │                                     │
│                            ▼                                     │
│                   ┌─────────────────┐                            │
│                   │     MongoDB     │                            │
│                   └─────────────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Services Provided

NearLy supports the following **professions**:

| Profession | Description |
|------------|-------------|
| Electrician | Electrical repairs and installations |
| Plumber | Plumbing services |
| Carpenter | Carpentry and woodwork |
| Painter | Painting services |
| Cleaner | Cleaning services |
| Mason | Masonry and construction |
| Pipe Fitter | Piping and fitting |
| Welder | Welding services |
| Labour | General labor |
| A/C Technician | Air conditioning repair and maintenance |
| Other | Custom profession (user-specified) |

---

## Features

### For Customers

- **Search & Find** — Search by profession, price range, description, and location (geolocation + reverse geocoding)
- **Nearby Workers** — Find professionals within ~5 km radius who are active and have completed profiles
- **Booking Requests** — Send booking requests to selected workers; wait for accept/reject in real time
- **Live Tracking** — See worker location on a map while they're en route
- **Status Updates** — Real-time notifications: worker on the way, arrived, service started
- **Price Negotiation** — If rejected, increase price and retry with the same or different worker

### For Workers

- **Availability Toggle** — Go active/inactive to receive booking requests
- **Incoming Requests** — Receive job details (address, profession, description) in real time
- **Accept/Reject** — Accept or reject bookings via socket
- **Out for Service** — Start navigation; location shared every 5 seconds with the customer
- **Arrival Confirmation** — "Arrived" when within ~50 m; 5-second countdown; "Done" to finish
- **Profile Management** — Edit profession, experience, service charge, and other details

### Shared

- **Authentication** — Credentials + Google OAuth; role-based access (CUSTOMER, WORKER, ADMIN)
- **Maps** — Google Maps for customer/worker locations and directions
- **Responsive UI** — Radix UI, Tailwind CSS, dark/light theme support

---

## Tech Stack

### nearly (Next.js)

| Category | Technologies |
|----------|---------------|
| Framework | Next.js 16, React 19 |
| Auth | NextAuth.js 4, bcryptjs, jsonwebtoken |
| Database | Mongoose 9 |
| Real-time | socket.io-client |
| Maps | @googlemaps/js-api-loader, @vis.gl/react-google-maps |
| Forms | react-hook-form, @hookform/resolvers, Zod |
| UI | Radix UI, Tailwind CSS 4, Motion, Sonner |
| State | Zustand |
| Email | Resend, @react-email/render |

### nearlyTracking (Express)

| Category | Technologies |
|----------|---------------|
| Runtime | Node.js / Bun |
| Server | Express 5 |
| Real-time | Socket.IO 4 |
| Database | Mongoose 9 |
| Config | dotenv |

---

## Project Structure

```
e:\NearLy App\
├── nearly/                    # Next.js web application
│   ├── app/
│   │   ├── c/dashboard/       # Customer dashboard
│   │   ├── w/dashboard/       # Worker dashboard
│   │   ├── api/               # API routes
│   │   ├── login/             # Auth pages
│   │   └── ...
│   ├── actions/               # Server actions (findNearbyWorkers, etc.)
│   ├── components/            # UI components (Map, Searching, NearbyWorkers, etc.)
│   ├── models/                # Mongoose models (Worker, Booking, User)
│   ├── store/                 # Zustand stores (useWorkerStore)
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Socket context, DB connection
│   └── zod/                   # Validation schemas
│
├── nearlyTracking/            # Real-time tracking server
│   ├── server.ts              # Express + Socket.IO server
│   ├── model/                 # ActiveWorkers, ActiveBookings
│   ├── config/                # DB connection
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun**
- **MongoDB** (local or Atlas)
- **Google Maps API Key** (for maps and geocoding)
- **Google OAuth credentials** (optional, for social login)

### 1. Clone and install

```bash
# Install nearly (Next.js app)
cd nearly
bun install   # or npm install

# Install nearlyTracking (tracking server)
cd ../nearlyTracking
bun install   # or npm install
```

### 2. Configure environment variables

Create `.env` files in both `nearly/` and `nearlyTracking/` as needed.

### 3. Run the applications

**Terminal 1 — Tracking server:**
```bash
cd nearlyTracking
bun run server.ts   # or: node server.ts (if using Node)
```

**Terminal 2 — Next.js app:**
```bash
cd nearly
bun dev
```

- **Web app:** [http://localhost:3000](http://localhost:3000)
- **Tracking server:** [http://localhost:4000](http://localhost:4000)

---

## Deployment

### nearly (Next.js)

- **Vercel** (recommended): Connect repo, set env vars, deploy
- **Manual:** `next build` then `next start`

### nearlyTracking (Docker)

```bash
cd nearlyTracking
docker-compose up -d
```

The tracking server runs on port **4000** inside the container. Ensure `NEARLY_CLIENT_URL` points to your production Next.js URL.

---

## Booking Flow (End-to-End)

1. **Customer** searches by profession, location, and price → clicks "Find Professionals"
2. **nearly** calls `findNearbyWorkers()` → returns workers within ~5 km, active, with completed profiles
3. **Customer** selects a worker → emits `send-booking-request` via Socket.IO
4. **nearlyTracking** creates/updates `ActiveBookings`, emits `incoming-request` to the worker
5. **Worker** accepts or rejects → `accept-booking` / `reject-booking`
6. **nearlyTracking** updates status, emits `booking-confirmed` or `booking-rejected` to the customer
7. **Worker** clicks "Out for Service" → `start-navigation`
8. **nearlyTracking** sets status to `in-transit`, emits `worker-started-navigation` to the customer
9. **Worker** shares location every 5 seconds → `update-location`
10. **nearlyTracking** emits `location-broadcast` to the customer (map updates in real time)
11. **Worker** arrives (within ~50 m) → "Arrived" → `confirm-reached`
12. **nearlyTracking** sets status to `completed`, emits `worker-arrived` to the customer
13. **Service complete**

---

## License

ISC
