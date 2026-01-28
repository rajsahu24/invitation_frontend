# Quick Start Guide

## Getting Started

### 1. Install Dependencies
```bash
cd invitation
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The landing page will be available at: `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
npm start
```

## What's Included

✅ **Modern Landing Page** with bluish theme
✅ **7 Reusable Components**:
   - Navigation (sticky header)
   - Hero (main banner)
   - Features (6 feature cards)
   - How It Works (3-step process)
   - Testimonials (customer reviews)
   - CTA (call-to-action)
   - Footer (links & newsletter)

✅ **Smooth Animations** using Framer Motion
✅ **Fully Responsive** design
✅ **TypeScript** for type safety
✅ **Tailwind CSS 4** for styling
✅ **Component-based** architecture

## Project Structure

```
invitation/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── core/
│   └── components/
│       ├── landing/          # Landing page sections
│       │   ├── Navigation.tsx
│       │   ├── Hero.tsx
│       │   ├── Features.tsx
│       │   ├── HowItWorks.tsx
│       │   ├── Testimonials.tsx
│       │   ├── CTA.tsx
│       │   └── Footer.tsx
│       └── ui/               # Reusable UI components
│           └── LoadingSpinner.tsx
└── package.json
```

## Customization Tips

### Change Colors
Edit the gradient classes in components:
```tsx
// From blue to your color
from-blue-600 to-indigo-600
// To
from-green-600 to-teal-600
```

### Update Content
Modify the content arrays in each component file.

### Add New Sections
Create new components in `core/components/landing/` and import them in `app/page.tsx`.

## Next Steps

1. Customize the content to match your brand
2. Add your own images and logos
3. Connect the CTA buttons to your authentication flow
4. Add analytics tracking
5. Deploy to Vercel or your preferred hosting

## Need Help?

Check out the detailed documentation in `LANDING_PAGE.md`
