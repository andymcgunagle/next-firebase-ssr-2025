# Next Firebase SSR 2025

I’ve worked with Firebase for many years and have a solid grasp of its client-side patterns. But as Next.js continues to push toward server rendering and server components, I’ve been trying to figure out how Firebase fits into these newer paradigms.

At the moment, the Firebase community still seems uncertain about how to approach these patterns. The official docs and most community examples tend to offer fragmented or half-baked solutions that don’t hold up in real-world use.

My hope is that Firebase will eventually provide an authentication solution that integrates into Next.js as seamlessly as Clerk. Until then, this repo is my attempt to bridge that gap.

## Features

- 🔒 Secure authentication using Firebase session cookies
- ⚡ Full support for Next.js server components, SSR, and API routes
- 🔥 Firebase integration (Auth, Firestore, Storage, etc.)
- 🛡️ Middleware for protected routes
- 🧑‍💻 Example code for both public and protected pages

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/andymcgunagle/next-firebase-ssr-2025.git
cd next-firebase-ssr-2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase project credentials and secrets. You will need:
   - Open `.env.example` and copy all the environment variable names and descriptions.
   - Fill in the values in your `.env` file according to your Firebase project settings and any other required secrets.

### 4. Configure Firebase

- Make sure your Firebase project has Authentication enabled (Email/Password, Google, etc.).
- Set up Firestore, Storage, and any other services you plan to use.
- Update the security rules in the `firebase/` directory as needed.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## How It Works

- Upon signing in, the client exchanges the Firebase ID token for a session cookie via a secure API route.
- The session cookie is stored as an HTTP-only cookie, accessible to the server for SSR, API routes, and middleware.
- Protected routes and API endpoints verify the session cookie and provide user context server-side.
- Sign-out clears the session cookie.

## Project Structure

- `src/app/` – Next.js app directory (routes, layouts, pages)
- `src/components/` – React components (auth buttons, providers)
- `src/lib/` – Firebase and utility libraries (actions, constants, firebase config, navigation, schemas, security, utils)
- `src/middleware.ts` – Middleware for route protection
- `src/styles/` – CSS styles and utilities
- `src/types/` – Shared TypeScript types
- `firebase/` – Firebase rules and configuration

## Deployment

- Configure your environment variables in your deployment platform (Vercel, etc.).
- Deploy using your preferred method (e.g., `vercel deploy`).
