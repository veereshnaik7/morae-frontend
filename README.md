# Task Management App - Frontend

Live URL: https://morae-frontend.vercel.app/

## Overview

This is the frontend for a Task Management App. Users can register, verify their account, log in, manage their profile, and perform task operations such as creating, editing, deleting, filtering, and marking tasks as completed.

The frontend is built using React with TypeScript and styled with Tailwind CSS.

## Features

- User registration
- User login
- Email verification flow
- Forgot password and reset password flow
- Protected routes
- Task dashboard
- Create new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Filter tasks by status
- Paginated task listing
- Responsive dashboard layout
- Toast notifications for API responses
- Axios API integration
- JWT authentication handled through backend cookies

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Vite
- Lucide React icons

## Project Setup

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```


## Folder Structure

```txt
src/
  app/
    hooks.ts
    store.ts
  components/
    ProtectedRoute.tsx
    ToastProvider.tsx
  features/
    api.ts
    auth/
      authApi.ts
      authSlice.ts
  pages/
    auth/
      Login.tsx
      Register.tsx
      VerifyUser.tsx
      ForgotPassword.tsx
      ResetPassword.tsx
    Dashboard/
      Dashboard.tsx
      Tasks.tsx
      Profile.tsx
```

## Main Routes

- `/login` - User login
- `/register` - User registration
- `/verify-user` - Email OTP verification
- `/forgot-password` - Request password reset OTP
- `/reset-password` - Reset password
- `/tasks` - Main task dashboard
- `/profile` - User profile page

## API Integration

The frontend communicates with the backend using Axios. Authentication is handled using JWT cookies from the backend.

Main frontend API features:

- Login and register
- Restore user session
- Logout
- Create task
- Get paginated tasks
- Update task
- Delete task
- Change password
- Update profile

## Deployment

The frontend is deployed on Vercel.

Live app:

```txt
https://morae-frontend.vercel.app/
```

## Assignment Requirements Covered

- React with TypeScript
- Axios API calls
- Login and Register authentication
- JWT-based protected flow
- Task list UI
- Add task
- Edit task
- Delete task
- Mark task as completed
- Filter by Pending / Completed
- Responsive UI using Tailwind CSS
