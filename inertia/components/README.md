# Sonner Toast Documentation

Sonner is a minimal toast library for React that provides a beautiful and customizable toast notification system.

## Installation

```bash
npm install sonner
# or
yarn add sonner
# or
pnpm add sonner
```

## Basic Usage

```tsx
import { Toaster, toast } from 'sonner'

function App() {
  return (
    <>
      <Toaster />
      <button onClick={() => toast('Hello World')}>Show Toast</button>
    </>
  )
}
```

## Toaster Component Props

The `Toaster` component accepts the following props:

### Position
```tsx
position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
```
Controls the position of the toast notifications. Default: `'bottom-right'`

### Theme
```tsx
theme?: 'light' | 'dark' | 'system'
```
Sets the theme of the toast notifications. Default: `'light'`

### Rich Colors
```tsx
richColors?: boolean
```
Enables rich colors for different toast types. Default: `false`

### Duration
```tsx
duration?: number
```
Sets the default duration (in milliseconds) for toast notifications. Default: `4000`

### Visible Toasts
```tsx
visibleToasts?: number
```
Controls the maximum number of visible toasts. Default: `3`

### Expand
```tsx
expand?: boolean
```
Makes toasts expand by default. Default: `false`

### Close Button
```tsx
closeButton?: boolean
```
Shows a close button on all toasts. Default: `false`

### Hotkey
```tsx
hotkey?: string[]
```
Sets the keyboard shortcut to focus the toast container. Default: `['altKey', 'KeyT']`

### Gap
```tsx
gap?: number
```
Sets the gap between toasts in pixels. Default: `14`

### Offset
```tsx
offset?: string | number | {
  top?: string | number
  right?: string | number
  bottom?: string | number
  left?: string | number
}
```
Sets the offset from the viewport edges. Default: `'24px'`

### Mobile Offset
```tsx
mobileOffset?: string | number | {
  top?: string | number
  right?: string | number
  bottom?: string | number
  left?: string | number
}
```
Sets the offset from the viewport edges on mobile devices. Default: `'16px'`

### Direction
```tsx
dir?: 'rtl' | 'ltr' | 'auto'
```
Sets the text direction. Default: `'auto'`

### Swipe Directions
```tsx
swipeDirections?: ('top' | 'right' | 'bottom' | 'left')[]
```
Controls which directions can be used to swipe and dismiss toasts.

### Icons
```tsx
icons?: {
  success?: React.ReactNode
  info?: React.ReactNode
  warning?: React.ReactNode
  error?: React.ReactNode
  loading?: React.ReactNode
  close?: React.ReactNode
}
```
Custom icons for different toast types and the close button.

### Toast Options
```tsx
toastOptions?: {
  className?: string
  descriptionClassName?: string
  style?: React.CSSProperties
  cancelButtonStyle?: React.CSSProperties
  actionButtonStyle?: React.CSSProperties
  duration?: number
  closeButton?: boolean
  unstyled?: boolean
  classNames?: {
    toast?: string
    title?: string
    description?: string
    loader?: string
    closeButton?: string
    cancelButton?: string
    actionButton?: string
    success?: string
    error?: string
    info?: string
    warning?: string
    loading?: string
    default?: string
    content?: string
    icon?: string
  }
  closeButtonAriaLabel?: string
}
```
Default options for all toasts.

### Container Aria Label
```tsx
containerAriaLabel?: string
```
Sets the aria-label for the toast container. Default: `'Notifications'`

## Example with Custom Configuration

```tsx
import { Toaster, toast } from 'sonner'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        theme="dark"
        richColors
        duration={5000}
        visibleToasts={5}
        expand={true}
        closeButton
        hotkey={['altKey', 'KeyT']}
        gap={20}
        offset="32px"
        mobileOffset="24px"
        dir="ltr"
        swipeDirections={['left', 'right']}
        icons={{
          success: <CheckIcon />,
          error: <ErrorIcon />,
          loading: <LoadingIcon />
        }}
        toastOptions={{
          className: 'my-toast',
          duration: 3000,
          style: { background: '#333' }
        }}
        containerAriaLabel="Custom Notifications"
      />
      <button onClick={() => toast('Hello World')}>Show Toast</button>
    </>
  )
}
```

## Toast Types

The library supports the following toast types:
- `normal`
- `action`
- `success`
- `info`
- `warning`
- `error`
- `loading`
- `default`

## License

MIT 