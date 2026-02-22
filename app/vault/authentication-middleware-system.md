---
title: "Authentication Middleware System"
description: "User authentication flow, session management, and authorization patterns"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["authentication", "middleware", "auth-flow", "sessions", "authorization"]
---

# Authentication Middleware System

## Overview

The NARA authentication system provides comprehensive user authentication, session management, and authorization through a middleware-based architecture integrated with React Router's request context system.

## Architecture

### Middleware Structure

Located in `app/middleware/auth.ts`:

```typescript
import { createContext } from 'react-router'
import type { MiddlewareFunction } from 'react-router'
import type { User } from '~/database/schema'

export type AuthContextType = {
  userId: string | null
  user: User | null
}

export const AuthContext = createContext<AuthContextType>()

export const authMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  // 1. Extract user ID from session/token
  const { getUserId } = await import('~/lib/authentication/server/authenticate.server')
  
  // 2. Fetch user data if ID exists
  const { getUserById } = await import('~/lib/authentication/server/user.server')

  const { db } = context
  const userId = await getUserId(request)
  const user = userId && db ? await getUserById(db, userId) : null

  // 3. Attach auth context to request
  context.set(AuthContext, { userId, user })

  return await next()
}
```

## Authentication Flow

### 1. User Login

```typescript
// Route: action.login.ts
import { redirect } from 'react-router'
import type { Route } from './+types/action.login'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Invalid password')
})

export const action = async ({ request, context }: Route.ActionArgs) => {
  if (request.method !== 'POST') {
    return null
  }

  const formData = await request.formData()
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten() }
  }

  // Verify credentials
  const { verifyCredentials } = await import('~/lib/authentication/server/authenticate.server')
  const { db } = context
  
  const user = await verifyCredentials(
    db,
    parsed.data.email,
    parsed.data.password
  )

  if (!user) {
    return { error: 'Invalid credentials' }
  }

  // Create session
  const { createSession } = await import('~/lib/authentication/server/session.server')
  const session = await createSession(user.id)

  // Return redirect with session cookie
  return redirect('/dashboard', {
    headers: {
      'Set-Cookie': session.cookie
    }
  })
}
```

### 2. Session Management

```typescript
// lib/authentication/server/session.server.ts

interface Session {
  userId: string
  token: string
  expiresAt: Date
  cookie: string
}

export async function createSession(userId: string): Promise<Session> {
  const token = generateSecureToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  // Store in database or Redis
  await storeSession({
    userId,
    token,
    expiresAt
  })

  const cookie = serialize('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  })

  return { userId, token, expiresAt, cookie }
}

export async function getSession(request: Request): Promise<Session | null> {
  const cookies = parseCookies(request.headers.get('Cookie'))
  const token = cookies.session

  if (!token) {
    return null
  }

  // Validate token against database
  const session = await validateSession(token)
  return session
}
```

### 3. User Context Access

Access authenticated user in any component:

```typescript
import { useContext } from 'react'
import { AuthContext } from '~/middleware/auth'

export function Dashboard() {
  const { user, userId } = useContext(AuthContext)

  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>User ID: {userId}</p>
    </div>
  )
}
```

## Authentication Methods

### Email/Password

Standard email and password authentication:

```typescript
import { hashPassword, verifyPassword } from '~/lib/authentication/crypto'

export async function registerUser(
  db: Database,
  email: string,
  password: string,
  name: string
) {
  // Check if user exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (existing) {
    throw new Error('User already exists')
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const user = await db.insert(users).values({
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash: hashedPassword,
    createdAt: new Date()
  }).returning()

  return user[0]
}

export async function verifyCredentials(
  db: Database,
  email: string,
  password: string
) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (!user) {
    return null
  }

  const valid = await verifyPassword(password, user.passwordHash)
  
  if (!valid) {
    return null
  }

  return user
}
```

### OAuth2 (Google, GitHub, etc.)

Third-party authentication:

```typescript
import { OAuthClient } from '~/lib/authentication/oauth'

export const googleOAuthClient = new OAuthClient({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: `${process.env.APP_URL}/auth/callback/google`
})

// Handle OAuth callback
export const action = async ({ request }: Route.ActionArgs) => {
  const { code } = Object.fromEntries(new URL(request.url).searchParams)

  const token = await googleOAuthClient.getToken(code)
  const profile = await googleOAuthClient.getUserProfile(token)

  // Find or create user
  let user = await db.query.users.findFirst({
    where: eq(users.email, profile.email)
  })

  if (!user) {
    user = await db.insert(users).values({
      id: crypto.randomUUID(),
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      authProvider: 'google',
      authId: profile.id
    }).returning()
  }

  // Create session and redirect
  const session = await createSession(user[0].id)
  return redirect('/dashboard', {
    headers: { 'Set-Cookie': session.cookie }
  })
}
```

## Authorization & Permissions

### Role-Based Access Control (RBAC)

```typescript
export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user'
}

// Check role in middleware
export const requireRole = (allowedRoles: UserRole[]) => {
  return async ({ request, context }, next) => {
    const { user } = context.get(AuthContext)

    if (!user || !allowedRoles.includes(user.role)) {
      return new Response('Forbidden', { status: 403 })
    }

    return await next()
  }
}

// Usage in routes
export const middleware = [
  authMiddleware,
  requireRole([UserRole.Admin, UserRole.Moderator])
]
```

### Permission-Based Access

```typescript
interface Permission {
  id: string
  name: string
  description: string
}

// Check specific permission
export function hasPermission(user: User, permissionName: string): boolean {
  return user.permissions.some(p => p.name === permissionName)
}

// Use in component
export function DeleteButton({ resourceId }) {
  const { user } = useContext(AuthContext)

  if (!hasPermission(user, 'delete_resource')) {
    return null
  }

  return <button onClick={() => deleteResource(resourceId)}>Delete</button>
}
```

## Logout

```typescript
// Route: action.logout.ts
import { redirect } from 'react-router'
import type { Route } from './+types/action.logout'

export const action = async ({ request, context }: Route.ActionArgs) => {
  if (request.method !== 'POST') {
    return null
  }

  // Get current session
  const { getSession } = await import('~/lib/authentication/server/session.server')
  const session = await getSession(request)

  if (session) {
    // Invalidate session
    await invalidateSession(session.token)
  }

  // Clear session cookie
  const cookie = serialize('session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/'
  })

  return redirect('/login', {
    headers: { 'Set-Cookie': cookie }
  })
}
```

## Protected Routes

### Client-Side Protection

```typescript
import { Navigate } from 'react-router'
import { useContext } from 'react'
import { AuthContext } from '~/middleware/auth'

export function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Usage
export function DashboardRoute() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
```

### Server-Side Protection

```typescript
import type { Route } from './+types/dashboard'

export const loader = ({ context }: Route.LoaderArgs) => {
  const { user } = context.get(AuthContext)

  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }

  return { user }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <div>Welcome, {loaderData.user.name}!</div>
}
```

## Password Reset

```typescript
// Request password reset
export async function requestPasswordReset(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (!user) {
    // Don't reveal if email exists (security best practice)
    return
  }

  // Generate reset token
  const token = generateSecureToken()
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

  await db.insert(passwordResets).values({
    userId: user.id,
    token,
    expiresAt
  })

  // Send email with reset link
  await sendPasswordResetEmail(email, token)
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string) {
  // Find valid reset record
  const reset = await db.query.passwordResets.findFirst({
    where: and(
      eq(passwordResets.token, token),
      gt(passwordResets.expiresAt, new Date())
    )
  })

  if (!reset) {
    throw new Error('Invalid or expired token')
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword)

  // Update user password
  await db.update(users)
    .set({ passwordHash: hashedPassword })
    .where(eq(users.id, reset.userId))

  // Delete reset record
  await db.delete(passwordResets)
    .where(eq(passwordResets.id, reset.id))
}
```

## Two-Factor Authentication (2FA)

```typescript
import { TOTP } from 'otpauth'

export async function enableTwoFA(userId: string) {
  const secret = new TOTP({
    issuer: 'NARA',
    label: `NARA (${userId})`
  }).secret

  // Generate QR code
  const qrCode = new TOTP({ secret }).toDataURL()

  // Store secret (encrypted)
  await db.update(users)
    .set({ twoFactorSecret: encrypt(secret) })
    .where(eq(users.id, userId))

  return { qrCode, secret }
}

export async function verifyTwoFA(userId: string, code: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  if (!user?.twoFactorSecret) {
    return false
  }

  const secret = decrypt(user.twoFactorSecret)
  const totp = new TOTP({ secret })

  return totp.validate(code) !== null
}
```

## Session Security

### CSRF Protection

```typescript
import { csrf } from '~/lib/authentication/csrf'

// Generate CSRF token
export const loader = () => {
  const token = csrf.generate()
  return { csrfToken: token }
}

// Validate in actions
export const action = async ({ request }) => {
  const formData = await request.formData()
  const token = formData.get('_csrf')

  if (!csrf.validate(token)) {
    throw new Response('Invalid CSRF token', { status: 403 })
  }

  // Process form
}
```

### CORS Configuration

```typescript
// Worker setup
app.use('*', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
```

## Best Practices

1. **Use HTTPS only** - Never transmit credentials over HTTP
2. **Hash passwords** - Use bcrypt or similar (never plain text)
3. **Secure cookies** - Set HttpOnly, Secure, SameSite flags
4. **Validate on server** - Never trust client-side validation
5. **Implement CSRF protection** - Use tokens for state-changing operations
6. **Rate limit** - Prevent brute force attacks
7. **Session timeout** - Auto-logout after inactivity
8. **Implement 2FA** - For sensitive accounts
9. **Log auth events** - Track login/logout for security
10. **Keep sessions short** - Use refresh tokens for renewal

## Security Checklist

- [ ] Passwords hashed with strong algorithm (bcrypt, Argon2)
- [ ] HTTPS/TLS encryption enabled
- [ ] Session cookies HttpOnly and Secure
- [ ] CSRF tokens for POST/PUT/DELETE
- [ ] Rate limiting on login attempts
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection headers (CSP, X-Frame-Options)
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

---

The authentication system provides a secure, flexible foundation for user identity and authorization across the NARA application.
