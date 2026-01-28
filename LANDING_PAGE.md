# Landing Page Documentation

## Overview
A modern, professional landing page built with Next.js 16, TypeScript, Tailwind CSS 4, and Framer Motion animations. Features a beautiful bluish theme with smooth animations and a component-based architecture.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Components Structure

### `/app/page.tsx`
Main landing page that orchestrates all sections.

### `/core/components/landing/`

#### 1. **Navigation.tsx**
- Sticky navigation bar with scroll effects
- Responsive mobile menu
- Smooth background blur on scroll
- CTA buttons

#### 2. **Hero.tsx**
- Eye-catching hero section with animated background
- Main headline with gradient text
- CTA buttons
- Phone mockup with invitation preview
- Floating animations

#### 3. **Features.tsx**
- 6 feature cards with icons
- Hover animations and effects
- Staggered entrance animations
- Gradient accents

#### 4. **HowItWorks.tsx**
- 3-step process explanation
- Gradient background with decorative elements
- Connected step indicators
- Icon animations on hover

#### 5. **Testimonials.tsx**
- 3 customer testimonials
- Star ratings
- Statistics section
- Hover lift effects

#### 6. **CTA.tsx**
- Call-to-action section
- Animated background elements
- Trust indicators
- Newsletter signup

#### 7. **Footer.tsx**
- Multi-column footer layout
- Social media links
- Newsletter subscription
- Contact information

## Features

### Animations
- Smooth scroll behavior
- Entrance animations with Framer Motion
- Hover effects on cards and buttons
- Floating background elements
- Staggered animations for lists
- Scale and translate transforms

### Design Elements
- **Color Scheme**: Blue, Indigo, Purple gradients
- **Typography**: Geist Sans font family
- **Spacing**: Consistent padding and margins
- **Shadows**: Layered shadows for depth
- **Borders**: Rounded corners throughout
- **Glassmorphism**: Backdrop blur effects

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg
- Responsive grid layouts
- Mobile navigation menu
- Flexible typography scaling

## Running the Project

```bash
# Navigate to invitation directory
cd invitation

# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Customization

### Colors
Update the gradient colors in each component or modify the Tailwind config for global changes.

### Content
Edit the content arrays in each component:
- `features` array in Features.tsx
- `steps` array in HowItWorks.tsx
- `testimonials` array in Testimonials.tsx
- `footerLinks` in Footer.tsx

### Animations
Adjust Framer Motion properties:
- `initial`: Starting state
- `animate`: End state
- `transition`: Animation timing
- `whileHover`: Hover effects
- `whileInView`: Scroll-triggered animations

## Performance Optimizations
- Server-side rendering with Next.js
- Optimized images and assets
- Lazy loading with viewport detection
- Minimal JavaScript bundle
- CSS-in-JS with Tailwind

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements
- Add pricing section
- Template gallery
- Blog integration
- Multi-language support
- Dark mode toggle
- Video backgrounds
- Parallax scrolling effects
