# Component Library Guide

This guide covers the component system used in the NARA boilerplate, including shadcn/ui components, custom components, and best practices for building and extending the UI.

---

## 🎨 Component System Overview

The NARA boilerplate uses a **hybrid component approach**:

- **shadcn/ui** - Copy-paste components built on Radix UI primitives
- **Custom Components** - Project-specific components
- **Feature Components** - Components tied to specific features

```
/app/components/
├── /ui/                    # shadcn/ui components (Radix + Tailwind)
│   ├── button.tsx         # Primitive components
│   ├── card.tsx           # Layout components  
│   ├── dialog.tsx         # Overlay components
│   └── ...
├── mode-switcher.tsx      # Custom shared components
└── /[feature]/            # Feature-specific components (in /features/)
```

---

## 🧩 shadcn/ui Components

### Installation and Usage

The project comes with shadcn/ui pre-configured. To add new components:

```bash
bunx --bun shadcn@latest add [component-name]

# Examples:
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add card  
bunx --bun shadcn@latest add dialog
```

### Core Components Reference

#### **Button**

```tsx
import { Button } from "~/components/ui/button"

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// Custom styling
<Button className="w-full">Full Width</Button>
```

#### **Card**

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### **Dialog**

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### **Form Components**

```tsx
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

// Input with label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>

// Textarea
<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Enter your message" />
</div>

// Select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### **Data Display**

```tsx
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { Separator } from "~/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

// Badge
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// Progress
<Progress value={33} className="w-full" />

// Separator
<div>
  <p>Section 1</p>
  <Separator className="my-4" />
  <p>Section 2</p>
</div>

// Avatar
<Avatar>
  <AvatarImage src="/avatars/01.png" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### **Navigation**

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb"

// Tabs
<Tabs defaultValue="tab1" className="w-full">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
</Tabs>

// Breadcrumb
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Components</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Advanced Components

#### **Data Table**

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge variant={user.active ? "default" : "secondary"}>
            {user.active ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### **Command Menu**

```tsx
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Dashboard</CommandItem>
      <CommandItem>Settings</CommandItem>
      <CommandItem>Profile</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

---

## 🎨 Custom Components

### Theme Switcher

The boilerplate includes a custom mode switcher component:

```tsx
import { ModeSwitcher } from "~/components/mode-switcher"

// Usage
<ModeSwitcher />
```

**Implementation:**

```tsx
// app/components/mode-switcher.tsx
import { Theme, useTheme } from "remix-themes"
import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"

export function ModeSwitcher() {
  const [theme, setTheme] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.SYSTEM)}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 📱 Responsive Design Patterns

### Breakpoint System

TailwindCSS provides a mobile-first breakpoint system:

```tsx
// Mobile-first responsive design
<div className="
  grid 
  grid-cols-1      // 1 column on mobile
  md:grid-cols-2   // 2 columns on tablet
  lg:grid-cols-3   // 3 columns on desktop
  gap-4
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Mobile-Specific Components

```tsx
// Use mobile hook for conditional rendering
import { useMobile } from "~/hooks/use-mobile"

export function ResponsiveLayout() {
  const isMobile = useMobile()
  
  return (
    <div>
      {isMobile ? (
        <MobileNavigation />
      ) : (
        <DesktopNavigation />
      )}
    </div>
  )
}
```

### Responsive Typography

```tsx
// Responsive text sizing
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
  Responsive Heading
</h1>

<p className="text-sm md:text-base lg:text-lg text-muted-foreground">
  Responsive paragraph text
</p>
```

---

## 🎯 Component Best Practices

### 1. **Component Composition**

Prefer composition over large, monolithic components:

```tsx
// ❌ Large, inflexible component
function UserProfile({ user, showActions, showBadge, variant }) {
  return (
    <div className={`user-profile ${variant}`}>
      <img src={user.avatar} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        {showBadge && <Badge>{user.role}</Badge>}
        {showActions && (
          <div>
            <Button>Edit</Button>
            <Button>Delete</Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ Composable components
function UserProfile({ children }) {
  return <div className="flex items-center space-x-4">{children}</div>
}

function UserAvatar({ src, alt }) {
  return <Avatar><AvatarImage src={src} alt={alt} /></Avatar>
}

function UserInfo({ name, email }) {
  return (
    <div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-muted-foreground">{email}</p>
    </div>
  )
}

// Usage
<UserProfile>
  <UserAvatar src={user.avatar} alt={user.name} />
  <UserInfo name={user.name} email={user.email} />
  <Badge>{user.role}</Badge>
  <div className="flex space-x-2">
    <Button size="sm">Edit</Button>
    <Button size="sm" variant="outline">Delete</Button>
  </div>
</UserProfile>
```

### 2. **TypeScript Interfaces**

Always define clear interfaces for component props:

```tsx
interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'user' | 'moderator'
    avatar?: string
  }
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
  showActions?: boolean
  className?: string
}

export function UserCard({ 
  user, 
  onEdit, 
  onDelete, 
  showActions = false,
  className 
}: UserCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      {/* Component implementation */}
    </Card>
  )
}
```

### 3. **Error Boundaries**

Wrap components in error boundaries for better UX:

```tsx
import { ErrorBoundary } from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-destructive">Something went wrong</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={resetErrorBoundary} className="mt-4">
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}

// Wrap components that might fail
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <ComplexComponent />
</ErrorBoundary>
```

### 4. **Loading States**

Provide clear loading states:

```tsx
import { Skeleton } from "~/components/ui/skeleton"

function UserCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

function UserCard({ user, loading }: UserCardProps) {
  if (loading) return <UserCardSkeleton />
  
  return (
    <Card>
      {/* Component implementation */}
    </Card>
  )
}
```

### 5. **Accessibility**

Ensure components are accessible:

```tsx
// Proper ARIA labels and semantic HTML
<Button
  aria-label="Delete user account"
  aria-describedby="delete-description"
  onClick={handleDelete}
>
  <Trash2 className="h-4 w-4" />
  <span className="sr-only">Delete</span>
</Button>

// Focus management
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
    </DialogHeader>
    <p id="delete-description">
      This action cannot be undone.
    </p>
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={onConfirm} autoFocus>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🎨 Styling Guidelines

### 1. **TailwindCSS Utilities**

Use Tailwind utilities for consistent spacing and sizing:

```tsx
// Consistent spacing scale
<div className="p-4 m-2 space-y-4">     // Padding, margin, vertical space
<div className="px-6 py-3">             // Horizontal/vertical padding
<div className="mt-8 mb-4">             // Margin top/bottom

// Consistent sizing
<div className="w-full h-64">           // Full width, fixed height
<div className="max-w-2xl mx-auto">     // Max width with auto margins
```

### 2. **CSS Variables and Custom Properties**

Use CSS variables for theming:

```css
/* app/app.css */
:root {
  --brand-primary: 220 14% 93%;
  --brand-secondary: 220 13% 91%;
  --custom-spacing: 1.5rem;
}

.dark {
  --brand-primary: 220 13% 18%;
  --brand-secondary: 215 14% 34%;
}
```

```tsx
// Use in components
<div className="bg-[hsl(var(--brand-primary))]">
  Custom themed background
</div>
```

### 3. **Component Variants with CVA**

Use `class-variance-authority` for component variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive",
        warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps extends VariantProps<typeof alertVariants> {
  className?: string
  children: React.ReactNode
}

export function Alert({ className, variant, children, ...props }: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

---

## 🧪 Testing Components

### Component Testing with React Testing Library

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { UserCard } from './user-card'

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user' as const
}

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard user={mockUser} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
  
  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<UserCard user={mockUser} onEdit={onEdit} showActions />)
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith('1')
  })
})
```

### Visual Testing

For visual regression testing, consider tools like:
- **Storybook** for component documentation
- **Chromatic** for visual testing
- **Percy** for screenshot testing

---

## 📚 Component Documentation

### Documenting Components

Create clear documentation for custom components:

```tsx
/**
 * UserCard displays user information in a card format
 * 
 * @param user - User object containing id, name, email, and role
 * @param onEdit - Callback function called when edit button is clicked
 * @param onDelete - Callback function called when delete button is clicked
 * @param showActions - Whether to show edit/delete action buttons
 * @param className - Additional CSS classes to apply
 * 
 * @example
 * ```tsx
 * <UserCard 
 *   user={user} 
 *   onEdit={handleEdit}
 *   showActions={true}
 * />
 * ```
 */
export function UserCard({ user, onEdit, onDelete, showActions, className }: UserCardProps) {
  // Implementation
}
```

---

This component system provides a solid foundation for building consistent, accessible, and maintainable user interfaces in the NARA boilerplate.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.