# Project Structure Documentation

## Overview
This project follows a modular, scalable structure for a luxury fashion/textile brand website built with React, TypeScript, and Vite.

## Folder Organization

### `/src`
Main source code directory

#### `/constants`
Centralized configuration and constant values:
- Navigation items
- Animation configurations
- Breakpoints
- Cursor settings
- Scroll thresholds

#### `/types`
TypeScript type definitions and interfaces:
- Animation configurations
- Component state interfaces
- Custom types

#### `/hooks`
Custom React hooks:
- `useScrollAnimation` - Scroll detection and callbacks
- `useCursor` - Custom cursor animation logic
- `useSmoothScroll` - Lenis smooth scroll setup

#### `/utils`
Utility functions:
- `animations.ts` - GSAP animation helpers
- Animation timeline creation
- Scroll trigger animations

#### `/components`
Reusable components:
- `Navbar.tsx` - Navigation bar with responsive menu
- `CustomCursor.tsx` - Custom cursor animation
- `index.ts` - Barrel export for clean imports

#### `/sections`
Page sections/views:
- `Home.tsx` - Hero section
- `CollectionsShowcase.tsx` - Collections display
- `Heritage.tsx` - Brand heritage section
- `Craftsmanship.tsx` - Craftsmanship section
- `Gallery.tsx` - Image gallery
- `Contact.tsx` - Contact section
- `index.ts` - Barrel export for clean imports

### Root Files
- `App.tsx` - Main application component
- `main.tsx` - React entry point
- `index.css` - Global styles

## Naming Conventions

### Files
- Components: PascalCase (e.g., `Navbar.tsx`)
- Utilities: camelCase (e.g., `animations.ts`)
- Hooks: camelCase with 'use' prefix (e.g., `useCursor.ts`)
- Constants: UPPERCASE_SNAKE_CASE within files
- Types: PascalCase (e.g., `NavbarState`)

### Exports
- Use barrel exports (`index.ts`) for easier imports
- Import from directories rather than specific files when possible

## Import Examples

### Before (Old Structure)
```typescript
import { useEffect } from 'react'
import Lenis from 'lenis'
// Many manual imports
```

### After (New Structure)
```typescript
import { useSmoothScroll } from './hooks'
import { NAVIGATION_ITEMS } from './constants'
import { createAnimationTimeline } from './utils'
```

## Benefits

1. **Scalability** - Easy to add new features without cluttering existing files
2. **Maintainability** - Clear separation of concerns
3. **Reusability** - Hooks and utilities can be used across components
4. **Type Safety** - Centralized types prevent duplication
5. **Consistency** - Constants are defined in one place
6. **Readability** - Clean imports and logical organization
