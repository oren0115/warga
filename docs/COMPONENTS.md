# 🧩 Component Documentation

## Overview

This document provides detailed information about the component library used in the PKM Frontend application.

## 📁 Component Structure

### Common Components (`src/components/common/`)

#### Core Components

**BottomNavigation**
- **Purpose**: Mobile bottom navigation bar
- **Props**: None (uses context for user state)
- **Usage**: Automatically shows different navigation based on user role

**ErrorBoundary**
- **Purpose**: Catches JavaScript errors in component tree
- **Props**: 
  - `children`: ReactNode
  - `fallback?`: ReactNode (custom error UI)
  - `onError?`: (error: Error, errorInfo: ErrorInfo) => void
- **Usage**: Wrap components that might throw errors

**ErrorState**
- **Purpose**: Displays error messages with retry option
- **Props**:
  - `message`: string
  - `onRetry?`: () => void
  - `title?`: string
  - `retryText?`: string
- **Usage**: Show when API calls fail or errors occur

**LoadingSpinner**
- **Purpose**: Loading indicator component
- **Props**:
  - `message?`: string
  - `size?`: 'sm' | 'md' | 'lg'
- **Usage**: Show during data fetching

**PageHeader**
- **Purpose**: Consistent page header with title and actions
- **Props**:
  - `title`: string
  - `subtitle?`: string
  - `icon?`: ReactNode
  - `userName?`: string
  - `showNotification?`: boolean
  - `onNotificationClick?`: () => void
  - `rightAction?`: ReactNode
- **Usage**: Standard header for all pages

**PageLayout**
- **Purpose**: Main page layout wrapper
- **Props**:
  - `children`: ReactNode
  - `className?`: string
- **Usage**: Wrap page content

#### Data Display Components

**FeeCard**
- **Purpose**: Display fee information with payment options
- **Props**:
  - `fee`: Fee object
  - `onPay`: (feeId: string) => void
  - `onView?`: (feeId: string) => void
  - `showDueDate?`: boolean
  - `showPaymentButton?`: boolean
- **Usage**: Display individual fee items

**PaymentCard**
- **Purpose**: Display payment information
- **Props**:
  - `payment`: Payment object
  - `onView?`: (paymentId: string) => void
- **Usage**: Display payment history items

**StatsCard**
- **Purpose**: Display statistics with icon and description
- **Props**:
  - `title`: string
  - `value`: string | number
  - `description?`: string
  - `icon?`: ReactNode
  - `variant?`: 'success' | 'warning' | 'error' | 'info' | 'custom'
- **Usage**: Dashboard statistics display

**StatusBadge**
- **Purpose**: Display status with color coding
- **Props**:
  - `status`: string
  - `variant?`: 'default' | 'success' | 'warning' | 'error'
- **Usage**: Show payment status, user status, etc.

#### State Components

**EmptyState**
- **Purpose**: Display when no data is available
- **Props**:
  - `title`: string
  - `description?`: string
  - `icon?`: ReactNode
  - `type?`: 'info' | 'success' | 'warning' | 'error' | 'custom'
  - `action?`: ReactNode
- **Usage**: Show when lists are empty

### Admin Components (`src/components/admin/`)

**AdminStatsCard**
- **Purpose**: Enhanced stats card for admin dashboard
- **Props**:
  - `title`: string
  - `value`: string | number
  - `description?`: string
  - `icon`: ReactNode
  - `iconBgColor?`: string
  - `iconTextColor?`: string
  - `trend?`: { value: number; isPositive: boolean }
- **Usage**: Admin dashboard statistics

**UserManagementModal**
- **Purpose**: Modal for creating/editing users
- **Props**:
  - `isOpen`: boolean
  - `onClose`: () => void
  - `onUserUpdated`: () => void
  - `user?`: User object
  - `mode`: 'create' | 'edit' | 'view'
- **Usage**: User management operations

**ErrorStats**
- **Purpose**: Display error statistics for development
- **Props**: None (uses error context)
- **Usage**: Development mode error monitoring

### UI Components (`src/components/ui/`)

These are base UI components built with Radix UI primitives and styled with Tailwind CSS.

**Button**
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: default, sm, lg, icon
- **Usage**: All interactive buttons

**Card**
- **Components**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Usage**: Content containers

**Input**
- **Types**: text, email, password, number
- **Usage**: Form inputs

**Badge**
- **Variants**: default, secondary, destructive, outline
- **Usage**: Status indicators, labels

**Dialog**
- **Components**: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
- **Usage**: Modal dialogs

## 🎨 Styling Guidelines

### Tailwind CSS Classes

**Colors**
- Primary: `green-600`, `green-700`
- Secondary: `blue-600`, `blue-700`
- Success: `green-500`, `green-100`
- Warning: `yellow-500`, `yellow-100`
- Error: `red-500`, `red-100`
- Info: `blue-500`, `blue-100`

**Spacing**
- Consistent spacing using Tailwind scale
- `p-4`, `m-4` for standard spacing
- `space-y-4` for vertical spacing
- `gap-4` for flex/grid gaps

**Typography**
- Headings: `text-xl`, `text-2xl`, `text-3xl`
- Body: `text-sm`, `text-base`
- Weights: `font-medium`, `font-semibold`, `font-bold`

## 🔧 Component Development

### Creating New Components

1. **Create component file** in appropriate folder
2. **Define TypeScript interface** for props
3. **Use Tailwind CSS** for styling
4. **Export from index.ts** for clean imports
5. **Add to documentation**

### Component Template

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  // Define props here
  className?: string;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn('base-classes', className)}>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### Best Practices

1. **Props Interface**: Always define TypeScript interfaces
2. **Default Props**: Use default parameters for optional props
3. **ClassName Merging**: Use `cn()` utility for className merging
4. **Accessibility**: Include proper ARIA attributes
5. **Responsive**: Design mobile-first
6. **Consistent**: Follow established patterns

## 📱 Responsive Design

### Breakpoints
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

### Responsive Classes
- `sm:` - Tablet and up
- `md:` - Desktop and up
- `lg:` - Large desktop and up

### Mobile-First Approach
- Design for mobile first
- Add larger screen styles with prefixes
- Test on actual devices

## 🧪 Testing Components

### Component Testing
- Test component rendering
- Test prop handling
- Test user interactions
- Test accessibility

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## 📚 Resources

- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
