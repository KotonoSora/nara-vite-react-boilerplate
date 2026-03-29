---
title: "Package @kotonosora/ui System Deep Dive"
description: "Comprehensive UI component library with 40+ components, styling system, and usage patterns"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["ui", "components", "tailwind", "design-system"]
---

# @kotonosora/ui System Deep Dive

## Overview

`@kotonosora/ui` is a comprehensive React component library featuring **40+ production-ready UI components** built with TypeScript, styled with Tailwind CSS, and designed for accessibility and consistency.

## Package Information

- **Name**: `@kotonosora/ui`
- **Version**: 0.0.1
- **Type**: React component library (published to workspace)
- **Location**: `packages/ui/`
- **Dependencies**:
  - `react`, `react-dom` (19.2.4)
  - `@tailwindcss/vite` (4.2.0)
  - `lucide-react` (0.563.0) - Icon library
  - `recharts` (2.15.4) - Chart components
  - `@types/react`, `@types/react-dom`

## Component Library Structure

### Exported Components (40+)

The package exports individual components via granular export paths in `package.json`:

```json
"exports": {
  "./components/ui/accordion": "./src/components/ui/accordion.tsx",
  "./components/ui/alert-dialog": "./src/components/ui/alert-dialog.tsx",
  "./components/ui/button": "./src/components/ui/button.tsx",
  // ... 37 more components
}
```

### Component Categories

#### **Form Components**

- `button` - Clickable action element
- `input` - Text input field
- `input-otp` - One-time password input
- `input-group` - Grouped input controls
- `checkbox` - Boolean checkbox
- `radio-group` - Mutually exclusive options
- `select` - Dropdown selection
- `switch` - Toggle switch
- `label` - Form field label

#### **Dialog & Modal Components**

- `dialog` - Modal dialog
- `alert-dialog` - Alert confirmation
- `drawer` - Slide-out panel
- `popover` - Floating content box
- `hover-card` - Hover-triggered card

#### **Navigation Components**

- `breadcrumb` - Navigation trail
- `menubar` - Application menu bar
- `navigation-menu` - Navigation structure
- `pagination` - Page navigation
- `tabs` - Tabbed content

#### **Display Components**

- `card` - Content container
- `alert` - Alert/notification box
- `badge` - Small label/status
- `avatar` - User avatar/image
- `skeleton` - Loading placeholder
- `empty` - Empty state visual
- `item` - List item wrapper

#### **Data Components**

- `chart` - Chart rendering
- `table` - Data table (via @tanstack/react-table)
- `progress` - Progress bar
- `slider` - Range slider

#### **Layout Components**

- `separator` - Visual divider
- `scroll-area` - Scrollable content
- `resizable` - Resizable panels
- `sidebar` - Side navigation panel
- `sheet` - Sheet modal variant

#### **Utility Components**

- `button-group` - Grouped buttons
- `field` - Form field wrapper
- `command` - Command palette
- `context-menu` - Right-click menu
- `dropdown-menu` - Menu dropdown
- `kbd` - Keyboard key display
- `spinner` - Loading spinner
- `sonner` - Toast notifications
- `aspect-ratio` - Aspect ratio container
- `carousel` - Image carousel
- `collapsible` - Collapsible content

## Usage Patterns

### Basic Import

```typescript
// Import specific component
import { Button } from '@kotonosora/ui/components/ui/button'
import { Card } from '@kotonosora/ui/components/ui/card'

// Use in component
export function Dashboard() {
  return (
    <Card>
      <h2>Dashboard</h2>
      <Button>Click me</Button>
    </Card>
  )
}
```

### Form Components

```typescript
import { useForm } from 'react-hook-form'
import { Button } from '@kotonosora/ui/components/ui/button'
import { Input } from '@kotonosora/ui/components/ui/input'
import { Label } from '@kotonosora/ui/components/ui/label'

export function LoginForm() {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  )
}
```

### Dialog Components

```typescript
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@kotonosora/ui/components/ui/dialog'
import { Button } from '@kotonosora/ui/components/ui/button'

export function DeleteConfirm() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <h2>Confirm Deletion</h2>
        <p>Are you sure?</p>
        <Button onClick={() => handleDelete()}>
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  )
}
```

### Toast Notifications

```typescript
import { Toaster, toast } from '@kotonosora/ui/components/ui/sonner'

export function Notifications() {
  useEffect(() => {
    Toaster() // Add once at app root
  }, [])

  const notify = () => {
    toast.success('Operation successful!')
    toast.error('Something went wrong')
    toast.loading('Processing...')
  }

  return <Button onClick={notify}>Notify</Button>
}
```

## Styling System

### Tailwind CSS Integration

All components use Tailwind CSS utility classes. Customization via Tailwind config:

```js
// tailwind.config.js (or tailwind.config.ts)
export default {
  theme: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

### CSS Variables for Theming

Components use CSS variables for dynamic theming:

```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #f3f4f6;
  --border-radius: 0.5rem;
}
```

### Building Custom Components

Extend components with Tailwind:

```typescript
import { Button } from '@kotonosora/ui/components/ui/button'
import { clsx } from 'clsx'

export function CustomButton({ variant = 'default', ...props }) {
  return (
    <Button
      className={clsx(
        variant === 'danger' && 'bg-red-500 hover:bg-red-600',
        variant === 'success' && 'bg-green-500 hover:bg-green-600',
      )}
      {...props}
    />
  )
}
```

## Component API Reference

### Button Component

```typescript
import { Button } from '@kotonosora/ui/components/ui/button'

<Button
  variant="default" | "secondary" | "outline" | "ghost" | "danger"
  size="default" | "sm" | "lg" | "icon"
  disabled={boolean}
  type="button" | "submit" | "reset"
  onClick={() => {}}
>
  Click me
</Button>
```

### Input Component

```typescript
import { Input } from '@kotonosora/ui/components/ui/input'

<Input
  type="text" | "email" | "password" | ...
  placeholder="Enter text..."
  disabled={false}
  value={value}
  onChange={handleChange}
/>
```

### Card Component

```typescript
import { Card, CardContent, CardHeader, CardFooter } from '@kotonosora/ui/components/ui/card'

<Card>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Dialog Components

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@kotonosora/ui/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <DialogClose asChild>
        <Button>Close</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Accessibility

All components follow WAI-ARIA guidelines:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper semantic HTML and ARIA labels
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliance

Example accessible form:

```typescript
import { Label } from '@kotonosora/ui/components/ui/label'
import { Input } from '@kotonosora/ui/components/ui/input'

export function AccessibleForm() {
  return (
    <>
      <Label htmlFor="email">
        Email <span aria-label="required">*</span>
      </Label>
      <Input
        id="email"
        type="email"
        aria-required="true"
        aria-describedby="email-hint"
      />
      <span id="email-hint">We'll never share your email.</span>
    </>
  )
}
```

## Integration with Other Packages

### With Blog Package

```typescript
import { Button } from '@kotonosora/ui/components/ui/button'
import { Card } from '@kotonosora/ui/components/ui/card'
import { BlogPost } from '@kotonosora/blog'

export function BlogPostCard({ post }) {
  return (
    <Card>
      <BlogPost post={post} />
      <Button>Read More</Button>
    </Card>
  )
}
```

### With Calendar Package

```typescript
import { Button } from '@kotonosora/ui/components/ui/button'
import { Calendar } from '@kotonosora/calendar'

export function SchedulingUI() {
  return (
    <>
      <Calendar onChange={setDate} />
      <Button>Schedule Event</Button>
    </>
  )
}
```

## Type Safety

All components are fully typed with TypeScript:

```typescript
// Props are fully typed
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {}

// Usage is type-checked
<Button variant="invalid-variant" /> // ❌ TypeScript error
<Button variant="default" />         // ✅ Type-safe
```

## Performance Considerations

### Code Splitting

Components are granularly exported so only imported components are bundled:

```typescript
// Only button.tsx is included in bundle
import { Button } from "@kotonosora/ui/components/ui/button";
// If you import another component, only that is added
import { Dialog } from "@kotonosora/ui/components/ui/dialog";
```

### Lazy Loading Components

```typescript
import { lazy, Suspense } from 'react'
import { Spinner } from '@kotonosora/ui/components/ui/spinner'

const HeavyDialog = lazy(() => import('@kotonosora/ui/components/ui/dialog'))

export function MyComponent() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyDialog />
    </Suspense>
  )
}
```

## Testing Components

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@kotonosora/ui/components/ui/button'

describe('Button', () => {
  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

## Best Practices

1. **Use Semantic Components**: Choose components that match your use case (Button vs Link)
2. **Prop Drilling Minimization**: Use context for theme/language when needed
3. **Accessibility First**: Always add labels, descriptions, and ARIA attributes
4. **Consistent Styling**: Follow Tailwind design tokens across your app
5. **Compose Over Customize**: Build custom components from base components
6. **Test Interactive Behavior**: Test form interactions and dialogs

---

This comprehensive UI package provides a solid foundation for building consistent, accessible, and type-safe React applications across the NARA ecosystem.
