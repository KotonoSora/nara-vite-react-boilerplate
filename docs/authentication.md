# Authentication System

This boilerplate includes a complete authentication and authorization system built with React Router v7, Drizzle ORM, and Cloudflare D1.

## Features

- ✅ User registration and login
- ✅ Secure password hashing using Web Crypto API
- ✅ Session-based authentication with secure cookies
- ✅ Role-based authorization (user/admin)
- ✅ Protected routes and middleware
- ✅ Responsive authentication UI components
- ✅ Database schema with users and sessions tables

## Quick Start

### 1. Database Setup

The authentication system uses SQLite/D1 with the following tables:

- `users` - User accounts with email, password hash, name, and role
- `sessions` - Session management for authentication state

Run migrations:
```bash
npm run db:migrate
```

### 2. Authentication Routes

The following routes are available:

- `/login` - User sign in
- `/register` - User registration  
- `/dashboard` - Protected user dashboard
- `/admin` - Protected admin panel (admin role required)
- `/action/logout` - Logout action

### 3. Usage Examples

#### Protected Route Example

```tsx
// app/routes/protected.tsx
import { requireUserId } from "~/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  // Route is now protected - redirects to login if not authenticated
  return { userId };
}
```

#### Role-Based Authorization

```tsx
// app/routes/admin-only.tsx
import { getUserById } from "~/features/auth/services/user.server";
import { requireUserId } from "~/sessions.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await getUserById(context.db, userId);
  
  if (user?.role !== "admin") {
    throw new Response("Access denied", { status: 403 });
  }
  
  return { user };
}
```

#### Using Auth in Components

```tsx
import { useOptionalAuth } from "~/features/auth/hooks/use-auth";

export function Navigation() {
  const auth = useOptionalAuth();
  
  return (
    <nav>
      {auth?.isAuthenticated ? (
        <div>Welcome, {auth.user?.name}!</div>
      ) : (
        <Link to="/login">Sign In</Link>
      )}
    </nav>
  );
}
```

## Architecture

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### File Structure

```
app/
├── features/auth/
│   ├── components/
│   │   ├── login-form.tsx      # Login form component
│   │   ├── register-form.tsx   # Registration form component
│   │   └── navigation.tsx      # Auth-aware navigation
│   ├── hooks/
│   │   └── use-auth.tsx        # Authentication hooks
│   └── services/
│       └── user.server.ts      # User CRUD operations
├── lib/
│   └── auth.ts                 # Password hashing utilities
├── routes/
│   ├── login.tsx               # Login page
│   ├── register.tsx            # Registration page
│   ├── dashboard.tsx           # Protected user dashboard
│   ├── admin.tsx               # Protected admin panel
│   └── action.logout.ts        # Logout action
└── sessions.server.tsx         # Session management
```

### Security Features

- **Secure Password Hashing**: Uses Web Crypto API SHA-256 hashing
- **HTTP-Only Cookies**: Session cookies are HTTP-only and secure
- **CSRF Protection**: Forms use React Router's built-in CSRF protection
- **Role-Based Access**: Server-side role checking for protected routes
- **Session Expiry**: 30-day session expiration with automatic cleanup

## API Reference

### User Service Functions

```tsx
// Create a new user
await createUser(db, {
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
  role: "user" // optional, defaults to "user"
});

// Authenticate user login
const user = await authenticateUser(db, email, password);

// Get user by ID or email
const user = await getUserById(db, userId);
const user = await getUserByEmail(db, email);
```

### Session Management

```tsx
// Create user session (login)
return createUserSession(userId, "/dashboard");

// Get current user ID from request
const userId = await getUserId(request);

// Require authentication (throws if not logged in)
const userId = await requireUserId(request);

// Logout user
return logout(request);
```

## Testing

The authentication system includes:

1. **Registration Flow**: Users can create accounts with email/password
2. **Login Flow**: Users can sign in with their credentials  
3. **Protected Routes**: Unauthorized access redirects to login
4. **Role Authorization**: Admin-only areas check user roles
5. **Session Management**: Secure cookie-based sessions
6. **Logout**: Proper session cleanup on logout

## Production Considerations

When deploying to production:

1. **Environment Variables**: Set secure session secrets
2. **Database**: Use Cloudflare D1 for production database
3. **HTTPS**: Ensure secure cookie transmission
4. **Rate Limiting**: Consider adding rate limiting for login attempts
5. **Password Policy**: Implement stronger password requirements as needed

## Customization

The authentication system is designed to be flexible and extensible:

- **Password Hashing**: Easily switch to bcrypt or other methods
- **Session Storage**: Can be configured for different backends
- **User Fields**: Add additional user profile fields to schema
- **Roles**: Extend role system with more granular permissions
- **UI Components**: Customize forms and styling to match your design