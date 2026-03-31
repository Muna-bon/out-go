# Out-Go

A modern, responsive frontend application for activity discovery, event management, and activity pairings, built with React and Vite.

## 🚀 Currently Present Features
* **User Interfaces**:
  * **Authentication**: Login, Signup, and Profile management flows.
  * **Discover & Categories**: Browse features (`/discover`, `/category/:slug`) with category-based filtering.
  * **Activities & Events**: View activity details, confirm bookings, browse events, and create new activities (`/create`).
  * **Social / Pairings**: A dedicated feature to "Find a Partner" (`/find-partner`), view "My Pairings" (`/my-pairings`), and manage personal activities (`/my-activities`).
  * **Vendor Management**: Specialized flows for vendors including Vendor Signup, Vendor Dashboard, and a public directory of Vendors.
  * **Static & Info Pages**: Home (`/`), How it Works, Privacy Policy, Terms of Service, and a customized 404 Not Found page.
* **Design & Architecture**: Client-side routing with `react-router-dom`, complete with light/dark theme support and responsive components built from Radix UI primitives.

## 🛠 Tech Stack (Stackset)
* **Core Framework**: Vite + React 18
* **Language**: TypeScript
* **Routing**: React Router DOM (`v6`)
* **Styling & UI Components**: 
  * Tailwind CSS (`v3.4`)
  * Radix UI Base Components (Accordion, Dialog, Hover Card, Select, Tabs, etc.)
  * Icons via `lucide-react`
  * Complex animations via `framer-motion` and `tailwindcss-animate`
  * Additional UI helpers: `embla-carousel-react`, `react-day-picker`, `sonner` (toasts), and `vaul`
* **Forms & Validation**: `react-hook-form` paired with `zod` schema definitions.
* **Data Management**: `@tanstack/react-query` configured for robust frontend state and API handling.

## 🚧 Missing Features & Future Enhancements
* **Backend API & Database**: The platform does not currently include a backend. Transitioning mocked integrations to a live API (Node.js/Express, Python, Go, or BaaS like Supabase) with a real database (PostgreSQL/MongoDB) is vital.
* **Real-Time Partner Matching**: Implementing WebSockets (e.g., Socket.io) to enable real-time updates when users find or accept activity partners ("Pairings").
* **Payment Integration**: Connecting a service like Stripe or Paystack to handle activity booking fees, event ticket purchases, or vendor subscriptions within the App.
* **Production Authentication**: Currently mock-based or UI-only. Requires integration with an identity provider (e.g., NextAuth/Auth.js, Clerk, Firebase Auth) to securely secure the User and Vendor dashboards.
* **Vendor Uploads**: Media upload facilities (AWS S3, Cloudinary) to allow vendors to upload banner images or photos for their newly created activities.
* **Notifications Engine**: Adding transactional emails (e.g., booking confirmations) and push notifications to alert users of upcoming events or successful partner matches.
