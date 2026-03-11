# InvitationList Page Redesign Plan

## Overview
Redesign the host invitation list page to match a professional, elegant aesthetic using the existing design system with refined UI/UX improvements.

---

## Current Design Analysis

### Strengths to Retain
- Functional grid layout (3-column on desktop)
- Basic card structure with hover effects
- Create new invitation button
- Loading states with skeleton

### Areas for Improvement
1. **Background**: Basic gray-50 is too plain
2. **Cards**: Lack visual depth and refinement
3. **Typography**: No use of Playfair Display (brand font)
4. **Color Palette**: Over-relies on violet; should use elegant greens (#4A7C59, #7BAE7F)
5. **Empty State**: Dashed border card is generic
6. **Header**: Too minimal, lacks sophistication
7. **Information Hierarchy**: Missing key data (guest counts, status, etc.)
8. **Animations**: Basic scale/opacity only

---

## Redesign Specifications

### 1. Page Layout & Background
- **Background**: Use elegant cream/off-white gradient (`#F7F5F0` → `#EDF2EC`)
- **Container**: Max-width 1200px with refined spacing
- **Page padding**: More generous (px-8 py-12 on desktop)

### 2. Header Redesign
```
┌─────────────────────────────────────────────────────────────┐
│  Logo/Brand          Welcome, {name}           [Sign Out]  │
│  ─────────────────────────────────────────────────────────  │
│  Your Celebrations                              [+ Create] │
└─────────────────────────────────────────────────────────────┘
```
- Add subtle bottom border with gradient accent line
- Use Playfair Display for "Your Celebrations" heading
- Welcome message in secondary styling

### 3. Invitation Card Redesign
```
┌─────────────────────────────────────────┐
│  🌿 EVENT BADGE          ⚙️ SETTINGS   │
│                                         │
│  ✨ Invitation Title                    │
│  Hosted by {name}                       │
│                                         │
│  📅 Jan 15, 2026 • 2:00 PM              │
│  👥 24 guests • ✓ 18 confirmed          │
│                                         │
│  [View Dashboard →]                     │
└─────────────────────────────────────────┘
```

**Card Specifications:**
- **Background**: White (#FFFFFF)
- **Border**: Subtle 1px (#E8E4DC)
- **Border Radius**: 24px (already set)
- **Shadow**: `var(--shadow-card)` → 0 4px 24px rgba(0,0,0,0.07)
- **Hover Shadow**: `var(--shadow-hover)` → 0 12px 40px rgba(0,0,0,0.13)
- **Accent Bar**: Left border 4px using green (#4A7C59)
- **Corner Decoration**: Subtle botanical/leaf pattern or gradient

### 4. "Create New" Card Enhancement
- Replace dashed border with elegant illustration/icon
- Use gradient background on hover (#F7F5F0 → #EDF2EC)
- Add subtle "+" icon with scale animation
- Better copy: "Create New Celebration" instead of "Create New Invitation"

### 5. Information Enhancements
- Add guest count indicator with icons
- Add status badge (Draft, Published, Past)
- Display first event date prominently
- Add "last edited" timestamp

### 6. Animations & Interactions
- **Card hover**: Lift with shadow increase + subtle rotation
- **Entrance**: Staggered fade-in for cards
- **Button hover**: Subtle glow effect
- **Settings icon**: Rotate on hover

### 7. Color Palette Application
| Element | Color |
|---------|-------|
| Primary accent | #4A7C59 (Forest Green) |
| Secondary accent | #7BAE7F (Sage Green) |
| Highlight | #E07B5A (Coral) |
| Background gradient | #F7F5F0 → #EDF2EC |
| Card border | #E8E4DC |
| Text primary | #1A1A1A |
| Text secondary | #5A5A5A |

---

## Component Structure Changes

```tsx
// New Section: Stats Bar (optional)
<StatsBar 
  totalInvitations={invitations.length}
  upcomingCount={upcomingEvents}
  totalGuests={totalGuests}
/>

// New Card Element: Status Badge
<StatusBadge status="published" />

// New Card Element: Guest Count
<GuestCounter confirmed={18} total={24} />
```

---

## Implementation Priority

### Phase 1 - Visual Foundation
1. Update background and container styling
2. Redesign header with brand typography
3. Apply green accent palette

### Phase 2 - Card Improvements  
4. Enhance card visual design
5. Add accent border and decorations
6. Improve typography hierarchy

### Phase 3 - Feature Enhancements
7. Add guest count display
8. Add status indicators
9. Refine animations

---

## Acceptance Criteria

- [ ] Page uses elegant cream/green color scheme
- [ ] Header displays with Playfair Display font
- [ ] Cards have left accent border (green)
- [ ] Cards show guest count and event date
- [ ] Hover effects are smooth and professional
- [ ] Empty/create card is visually distinct
- [ ] Responsive on mobile devices
- [ ] Loading states remain functional
