# Capstone Room Reservation System

This project is a **room reservation platform** built using **Next.js 15**, **React 19**, **TypeScript**, **PostgreSQL**, **Tailwind CSS**, and **Vercel AI SDK**. It provides a seamless experience for users to search, book, and manage room reservations in real-time, with admin controls, availability tracking, and robust backend logic.

---

## 🌟 Main Features

- **Room Booking System**

  - Search and browse available rooms
  - Real-time availability calendar
  - Make, view, and manage reservations

- **Admin Dashboard**

  - Add, update, or remove rooms
  - View recent and pending reservations
  - Approve or reject reservations

- **Comprehensive Calendar View**

  - Filter by date, room, and status
  - Interactive calendar with detailed tooltips and modals

- **Authentication and Authorization**

  - Session-based auth using middleware
  - Role-based access for admins and users

- **AI-Powered Chat (Vercel AI SDK)**

  - Streamed chat responses
  - Multi-step interactions with external model providers

- **Modern UI**
  - Responsive design with Tailwind CSS
  - Shadcn UI and Radix UI components
  - Optimized Web Vitals and accessibility

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://your-repo-url.git
cd your-repo-folder
```

### 2. Install dependencies

```bash
npm install --force
# or
yarn install --force
# or
pnpm install --force
```

### 3. Configure environment

Create a `.env.local` file with your settings (e.g., database connection, API keys).

Example:

```
DATABASE_URL=postgres://user:password@localhost:5432/yourdb
NEXTAUTH_SECRET=your-secret
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Access the app at [http://localhost:3000](http://localhost:3000).

---

## 💻 Usage Examples

### 🌐 User Workflow

- Visit the landing page → Search for rooms → Select date/time → Book room → Await admin approval → Receive notification.

### 🛡️ Admin Workflow

- Login → Access dashboard → View pending requests → Approve/reject bookings → Manage room data.

### 📅 Calendar View

- Go to the **Calendar** section → Filter by room or date → Click on events to view reservation details.

### 🧩 AI Chat Usage

- Navigate to the **Chat** section → Start typing your queries → Receive live-streamed AI responses.

---

## 📦 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI, Radix UI
- **Backend:** PostgreSQL, Node.js
- **AI:** Vercel AI SDK (OpenAI integration)
- **DevOps:** Docker, Vercel Deployments

---

## 📄 Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Lint code
npm run test       # Run Jest unit tests
```

## 🧪 Testing

Run `npm test` to execute Jest unit tests. The initial suite covers utility functions.

---

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel AI SDK](https://vercel.com/docs/ai-sdk)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
