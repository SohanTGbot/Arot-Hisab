# Product Requirements Document (PRD)
## Arot Hisab - Fish Wholesale Market Calculator

---

## Document Information
**Product Name:** Arot Hisab  
**Version:** 1.0  
**Date:** February 11, 2026  
**Status:** Draft  
**Owner:** Product Team  

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Problem Statement](#problem-statement)
4. [Target Users](#target-users)
5. [Product Objectives](#product-objectives)
6. [Feature Specifications](#feature-specifications)
7. [Technical Requirements](#technical-requirements)
8. [UI/UX Requirements](#ui-ux-requirements)
9. [Platform Specifications](#platform-specifications)
10. [Data Structure](#data-structure)
11. [Security & Compliance](#security-compliance)
12. [Monetization Model](#monetization-model)
13. [Success Metrics](#success-metrics)
14. [Timeline & Milestones](#timeline-milestones)
15. [Appendix](#appendix)

---

## 1. Executive Summary

**Arot Hisab** is a specialized digital calculation platform designed for fish wholesale markets (মাছের আড়ত) in West Bengal, India. The platform automates complex financial calculations involved in fish trading, reducing errors and improving efficiency for market operators who currently rely on manual calculators and paper ledgers.

### Key Highlights
- **Market:** Fish wholesale market (Arot) operators in West Bengal, India
- **Solution:** Automated calculation system with bilingual support (Bengali/English)
- **Value Proposition:** Eliminates calculation errors, saves time, and simplifies bookkeeping
- **Platforms:** Web, Android, iOS with Admin Panel
- **Business Model:** Free with optional donations

---

## 2. Product Overview

### 2.1 What is Arot Hisab?

Arot Hisab is a specialized calculator and record-keeping system tailored for fish wholesale markets. It automates the complex calculation process involved in fish trading transactions, which includes:

1. Recording gross weight (Mot Ojon)
2. Applying standard 5% weight deduction
3. Calculating value based on per kg rate (Dor)
4. Adding 2% commission for the market operator
5. Maintaining transaction records with buyer/seller information

### 2.2 Product Vision

To become the essential digital tool for fish wholesale market operators across West Bengal, making their daily operations faster, more accurate, and less stressful.

### 2.3 Core Value Proposition

**For fish market operators who** struggle with complex manual calculations in noisy, fast-paced environments,  
**Arot Hisab is a** specialized calculation platform  
**that** automates all transaction calculations with bilingual support  
**unlike** traditional calculators and paper ledgers  
**our solution** eliminates errors, saves time, and works in their native language.

---

## 3. Problem Statement

### 3.1 User Pain Points

**Who faces this problem:**
- Fish wholesale market (মাছের আড়ত) owners
- Market operators/accountants (যারা হিসাব করে)
- Transaction managers in fish trading hubs

**What exactly is painful:**
1. **Complex Calculations:** Multi-step calculations (gross weight → net weight → rate multiplication → commission addition) performed manually
2. **High-Pressure Environment:** Calculations must be done quickly in noisy, chaotic market conditions
3. **Language Barrier:** Standard calculators are in English, but ledgers are maintained in Bengali
4. **Error Risk:** Manual calculations prone to human error, leading to financial disputes
5. **Steep Learning Curve:** New operators struggle to understand the calculation process
6. **Record Keeping:** Manual ledger maintenance is time-consuming and difficult to reference

**Why current solutions are inadequate:**
- **Manual Calculators:** Require operator to remember multi-step formula, prone to errors
- **No Automation:** Each step must be manually calculated and recorded
- **Language Mismatch:** Tools don't support Bengali interface
- **No History:** Previous transactions difficult to reference
- **Training Issues:** New staff need extensive training to perform calculations correctly

### 3.2 Impact of Problem

- Financial losses due to calculation errors
- Customer disputes over incorrect amounts
- Slow transaction processing during peak hours
- Difficulty in training new staff
- Poor record-keeping leading to accounting issues

---

## 4. Target Users

### 4.1 Primary User Persona

**Name:** Arot Malik (Market Owner/Operator)

**Demographics:**
- **Age Range:** 18-60+ years
- **Location:** West Bengal, India (primarily rural and semi-urban areas)
- **Profession:** Fish wholesale market owner/operator
- **Income Level:** ₹500-1,000 per day (₹15,000-30,000 per month)
- **Education:** Varied (from primary to graduate level)
- **Language:** Bengali (primary), basic English understanding
- **Tech Literacy:** Low to Medium

**Behavioral Characteristics:**
- Works 6-10 hours daily in market environment
- Handles 20-50+ transactions per day
- Familiar with basic mobile phone usage
- Prefers simple, intuitive interfaces
- Values speed and accuracy
- May have vision challenges (older users)

**Goals:**
- Complete calculations quickly and accurately
- Avoid customer disputes
- Maintain proper records
- Train new staff easily
- Reduce mental stress during busy hours

**Pain Points:**
- Struggles with complex multi-step calculations
- Makes errors under pressure
- Difficulty reading small text
- Hard to keep track of multiple transactions
- Language barrier with English interfaces

### 4.2 Secondary Users

1. **Market Assistants/Helpers**
   - Age: 18-35
   - Learning calculation processes
   - Need simple, guided interface

2. **Fish Farmers/Suppliers**
   - Want transparent calculation visibility
   - Need to verify transaction amounts

3. **Wholesale Buyers**
   - Want clear pricing breakdown
   - Need transaction receipts

---

## 5. Product Objectives

### 5.1 Primary Objectives

1. **Eliminate Calculation Errors:** Reduce calculation errors to near-zero through automation
2. **Increase Transaction Speed:** Process transactions 50% faster than manual methods
3. **Improve User Adoption:** Achieve 80% daily active usage among registered users
4. **Enhance Record-Keeping:** Enable digital record-keeping for all transactions
5. **Bilingual Support:** Provide seamless Bengali and English interfaces

### 5.2 Success Criteria

- 1,000+ registered users within 6 months of launch
- Average 30+ transactions per user per day
- <5% error rate in calculations (system + user input)
- 4+ star rating on app stores
- 70%+ user retention after 30 days

---

## 6. Feature Specifications

### 6.1 Core Features (MVP)

#### Feature 1: Automated Calculation Engine

**What it does:**
Automatically calculates fish transaction amounts based on two user inputs:
1. Gross Weight (Mot Ojon) - in kg and grams
2. Rate per kg (Dor) - in rupees

**Calculation Logic:**

**Step 1:** Net Weight Calculation (5% Deduction)
- **Method A (Total Weight Deduction):** Deduct 5% from total weight including grams
  - Formula: `Net Weight = Gross Weight × 0.95`
  - Example: 15.700 kg → 14.915 kg

- **Method B (Kg Only Deduction):** Deduct 5% from kg only, then add grams
  - Formula: `Net Weight = (kg × 0.95) + grams`
  - Example: 15.700 kg → (15 × 0.95) + 0.700 = 14.950 kg

**Step 2:** Base Amount Calculation
- Formula: `Base Amount = Net Weight × Rate per kg`
- Example: 12.85 kg × ₹110 = ₹1,413.50

**Step 3:** Final Amount with Commission
- Formula: `Final Amount = Base Amount × 1.02`
- Example: ₹1,413.50 × 1.02 = ₹1,441.77

**User Input:**
- Column 2: Gross Weight (Mot Ojon) - *REQUIRED*
- Column 4: Rate per kg (Dor) - *REQUIRED*
- Column 1: Seller Name - *OPTIONAL*
- Column 7: Buyer Name/Address - *OPTIONAL*

**Auto-Calculated Output:**
- Column 3: Net Weight (after 5% deduction)
- Column 5: Base Amount (Net Weight × Rate)
- Column 6: Final Amount (Base Amount + 2% commission)

**User Benefits:**
- Zero calculation errors
- Instant results
- Transparent calculation breakdown
- No need to remember formulas
- Reduced mental workload

**Priority:** P0 (Must Have for MVP)

---

#### Feature 2: Transaction Record Table

**What it does:**
Displays transaction data in a structured table format with 7 columns

**Table Structure:**

| Column | Field Name | Type | Input Method | Example |
|--------|-----------|------|--------------|---------|
| 1 | Seller Name | Text | Optional Manual | BADAL BABU |
| 2 | Gross Weight | Number (kg.grams) | **Required Manual** | 13.500 kg |
| 3 | Net Weight (5% deducted) | Number | **Auto-calculated** | 12.850 kg |
| 4 | Rate per kg | Number (₹) | **Required Manual** | ₹110 |
| 5 | Base Amount | Currency | **Auto-calculated** | ₹1,413.50 |
| 6 | Final Amount (2% added) | Currency | **Auto-calculated** | ₹1,441.77 |
| 7 | Buyer Name/Address | Text | Optional Manual | Nirupam Mandal (Bamanghata) |

**Features:**
- Add new row button
- Delete row option
- Edit existing rows
- Clear all rows
- Export to PDF/Excel
- Save transaction history

**User Benefits:**
- Organized record-keeping
- Easy to review past transactions
- Digital backup of all deals
- Quick reference for disputes
- Professional transaction logs

**Priority:** P0 (Must Have for MVP)

---

#### Feature 3: Bilingual Interface (Bengali/English)

**What it does:**
Allows users to switch between Bengali and English languages throughout the application

**Implementation:**
- Language toggle switch in header (EN | বাংলা)
- All UI text, labels, buttons in both languages
- Number display in both Bengali and English numerals (optional setting)
- Date/time in Bengali and English formats
- Help text and instructions in both languages

**Language Coverage:**
- Interface labels and buttons
- Field names and placeholders
- Error messages
- Success notifications
- Help documentation
- Settings and preferences

**Default Language:** Bengali (based on user location/browser settings)

**User Benefits:**
- Work in native language
- Better comprehension
- Reduced errors from misunderstanding
- Accessible to non-English speakers
- Professional Bengali interface

**Priority:** P0 (Must Have for MVP)

---

#### Feature 4: Adjustable Font Size

**What it does:**
Allows users to increase or decrease font size across the entire application

**Implementation:**
- Font size controls in settings/header
- Three size options: Small, Medium (default), Large
- Or continuous slider: 12px - 24px
- Persists user preference
- Applies to all text: labels, inputs, table data, buttons

**Visual Indicators:**
- Clear A- / A+ buttons
- Preview of size change
- Current size highlighted

**User Benefits:**
- Better readability for older users
- Reduces eye strain
- Accommodates vision challenges
- Customized comfort level
- Professional accessibility

**Priority:** P0 (Must Have for MVP)

---

#### Feature 5: Built-in Calculator

**What it does:**
Provides an on-screen numeric keypad for easy data entry, especially on mobile devices

**Calculator Layout (4×5 Grid):**

```
[  C  ] [ ⌫  ] [  %  ] [  /  ]
[  7  ] [  8  ] [  9  ] [  *  ]
[  4  ] [  5  ] [  6  ] [  -  ]
[  1  ] [  2  ] [  3  ] [  +  ]
[  0  ] [ 00  ] [  .  ] [  =  ]
```

**Button Functions:**

**Number Buttons:**
- 0-9: Standard digits
- 00: Quick double zero entry
- . (decimal): For gram entry (e.g., 13.500 kg)

**Operator Buttons:**
- +: Addition
- -: Subtraction
- *: Multiplication
- /: Division
- %: Percentage

**Control Buttons:**
- C: Clear all (reset current input)
- ⌫ (Backspace): Delete last digit
- =: Calculate result (for manual calculations)

**Features:**
- Touch-friendly large buttons (min 48×48px)
- Haptic feedback on press (mobile)
- Visual press animation
- Sound feedback (optional, toggle in settings)
- Number entry directly into active field
- Can be toggled on/off based on user preference

**User Benefits:**
- Faster mobile data entry
- No need to switch keyboard
- Reduces typos
- Familiar interface for calculator users
- Works offline

**Priority:** P1 (Should Have for MVP)

---

### 6.2 Secondary Features (Post-MVP)

#### Feature 6: Deduction Method Selection

**What it does:**
Allows user to choose between two methods of 5% weight deduction:
- Method A: Deduct 5% from total weight (kg + grams)
- Method B: Deduct 5% from kg only, then add grams

**Implementation:**
- Toggle/dropdown in settings or per transaction
- Clearly labeled options with examples
- Default method set in user profile
- Visual explanation of each method

**Priority:** P1

---

#### Feature 7: Transaction History

**What it does:**
Saves all past transactions with search and filter capabilities

**Features:**
- Date-wise transaction log
- Search by seller/buyer name
- Filter by date range
- Filter by amount range
- Sort by any column
- Export filtered results
- Total calculations for filtered data

**Priority:** P1

---

#### Feature 8: Daily Summary Report

**What it does:**
Generates end-of-day summary with total transactions, weights, and amounts

**Report Contents:**
- Total number of transactions
- Total gross weight
- Total net weight
- Total base amount
- Total commission earned
- Average transaction size
- Buyer-wise breakdown
- Seller-wise breakdown

**Export Options:**
- PDF format
- Excel format
- Share via WhatsApp
- Print

**Priority:** P2

---

#### Feature 9: User Profiles

**What it does:**
Allows saving of frequently used seller/buyer names and addresses

**Features:**
- Quick-select from saved contacts
- Auto-fill names and addresses
- Edit/delete saved profiles
- Import from phone contacts (mobile)

**Priority:** P2

---

#### Feature 10: Offline Mode

**What it does:**
Allows basic calculation functionality without internet connection

**Features:**
- Local storage of transactions
- Sync when connection restored
- Offline calculation works fully
- Queue transactions for server sync

**Priority:** P2

---

### 6.3 Feature Prioritization Matrix

| Feature | Priority | Complexity | User Impact | MVP Status |
|---------|----------|------------|-------------|------------|
| Automated Calculation Engine | P0 | Medium | Critical | ✅ Yes |
| Transaction Record Table | P0 | Medium | Critical | ✅ Yes |
| Bilingual Interface | P0 | Medium | High | ✅ Yes |
| Adjustable Font Size | P0 | Low | High | ✅ Yes |
| Built-in Calculator | P1 | Low | Medium | ⚠️ Consider |
| Deduction Method Selection | P1 | Low | Medium | ❌ Post-MVP |
| Transaction History | P1 | High | High | ❌ Post-MVP |
| Daily Summary Report | P2 | Medium | Medium | ❌ Post-MVP |
| User Profiles | P2 | Medium | Low | ❌ Post-MVP |
| Offline Mode | P2 | High | Medium | ❌ Post-MVP |

---

## 7. Technical Requirements

### 7.1 Technology Stack

**Frontend:**
- **Web:** React.js with TypeScript
- **Mobile:** React Native (cross-platform for Android & iOS)
- **UI Framework:** Tailwind CSS + Shadcn/ui
- **State Management:** Redux Toolkit or Zustand
- **Forms:** React Hook Form with Zod validation

**Backend:**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **API:** Supabase REST API / GraphQL
- **Real-time:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (for exports, backups)

**Admin Panel:**
- **Framework:** React.js with TypeScript
- **UI:** Shadcn/ui + Tailwind CSS
- **Dashboard:** Recharts for analytics

**DevOps:**
- **Hosting (Web):** Vercel or Netlify
- **Mobile Distribution:** Google Play Store, Apple App Store
- **Version Control:** Git (GitHub/GitLab)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry for error tracking
- **Analytics:** Google Analytics 4

### 7.2 Performance Requirements

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Page Load Time | <2 seconds | <3 seconds |
| Calculation Response | Instant (<100ms) | <500ms |
| Transaction Save | <1 second | <2 seconds |
| API Response Time | <500ms | <1 second |
| Mobile App Size | <15 MB | <25 MB |
| Offline Availability | 100% for calculations | N/A |

### 7.3 Scalability Requirements

- Support 10,000+ concurrent users
- Handle 100,000+ transactions per day
- Database growth: 1M+ records capacity
- Auto-scaling based on traffic
- CDN for static assets

### 7.4 Browser & Device Support

**Web Browsers:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile OS:**
- Android 8.0+ (API level 26+)
- iOS 13.0+

**Screen Sizes:**
- Mobile: 360px - 428px
- Tablet: 768px - 1024px
- Desktop: 1280px+

### 7.5 Internationalization (i18n)

**Languages:**
- Bengali (primary)
- English (secondary)

**Implementation:**
- react-i18next for web
- i18n-js for React Native
- RTL support (if needed in future)
- Date/number localization
- Currency formatting (₹ INR)

### 7.6 Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators on all interactive elements
- Alt text for images
- Semantic HTML
- Font size adjustability (125%-200%)
- Touch target size (minimum 44×44px)

---

## 8. UI/UX Requirements

### 8.1 Design Principles

1. **Simplicity First:** Clean, uncluttered interface with minimal cognitive load
2. **Age-Inclusive:** Designed for users aged 18-60+ with varying tech literacy
3. **Mobile-First:** Optimized for mobile devices as primary use case
4. **Bilingual Native:** Equal quality experience in both Bengali and English
5. **Error-Prevention:** Design prevents common mistakes before they happen
6. **Instant Feedback:** Immediate visual response to all user actions

### 8.2 Visual Design System

**Color Palette:**

*Light Mode:*
- Primary: #2563eb (Blue) - CTAs, active states
- Secondary: #10b981 (Green) - success, positive values
- Background: #ffffff (White)
- Surface: #f9fafb (Light gray)
- Text Primary: #111827 (Near black)
- Text Secondary: #6b7280 (Gray)
- Border: #e5e7eb (Light gray)
- Error: #ef4444 (Red)

*Dark Mode:*
- Primary: #3b82f6 (Lighter blue)
- Secondary: #34d399 (Lighter green)
- Background: #0f172a (Dark blue-gray)
- Surface: #1e293b (Slate)
- Text Primary: #f1f5f9 (Off-white)
- Text Secondary: #94a3b8 (Light gray)
- Border: #334155 (Dark gray)
- Error: #f87171 (Light red)

**Typography:**

*Font Families:*
- Bengali: 'Noto Sans Bengali', sans-serif
- English: 'Inter', 'system-ui', sans-serif
- Numbers: Tabular nums for alignment

*Font Sizes:*
- H1: 32px / 2rem (clamp 28px-36px)
- H2: 24px / 1.5rem (clamp 20px-28px)
- H3: 20px / 1.25rem (clamp 18px-24px)
- Body: 16px / 1rem (clamp 14px-18px)
- Small: 14px / 0.875rem (clamp 12px-16px)
- Button: 16px / 1rem (clamp 14px-18px)

*Adjustable Sizes:*
- Small Mode: Base font × 0.875
- Medium Mode: Base font × 1 (default)
- Large Mode: Base font × 1.25

**Spacing System:**
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Consistent padding/margins using scale

**Border Radius:**
- Small: 4px (inputs, small buttons)
- Medium: 8px (cards, main buttons)
- Large: 12px (modals, major containers)
- Full: 9999px (pills, badges)

**Shadows:**
- Small: `0 1px 2px rgba(0, 0, 0, 0.05)`
- Medium: `0 4px 6px rgba(0, 0, 0, 0.07)`
- Large: `0 10px 15px rgba(0, 0, 0, 0.1)`
- Glassmorphism: `backdrop-filter: blur(10px)` with semi-transparent background

### 8.3 Component Specifications

#### Input Fields

**Specifications:**
- Height: 48px minimum (touch-friendly)
- Padding: 12px 16px
- Border: 1px solid, 2px on focus
- Border radius: 8px
- Font size: 16px (prevents zoom on iOS)
- Clear button (×) for quick reset
- Label above input (always visible)
- Placeholder text in lighter color
- Error state with red border + message below
- Success state with green border (after validation)

**States:**
- Default: Light border
- Hover: Slightly darker border
- Focus: Primary color border, shadow
- Filled: Keep border, show clear button
- Error: Red border + error message
- Disabled: Grayed out, not clickable

#### Buttons

**Primary Button:**
- Background: Primary color
- Text: White
- Height: 48px minimum
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 600
- Hover: Slightly darker background
- Active: Scale down 98%
- Disabled: Grayed out, 50% opacity
- Loading: Spinner + disabled state

**Secondary Button:**
- Background: Transparent
- Border: 1px primary color
- Text: Primary color
- Same size as primary
- Hover: Light background tint

**Icon Buttons:**
- Square: 44×44px minimum
- Circular for single icons
- Clear tap area
- Hover: Background tint
- Ripple effect on press (mobile)

#### Table/Data Grid

**Desktop View:**
- Full 7-column table
- Fixed header on scroll
- Zebra striping (alternate row colors)
- Row hover state (light background)
- Editable cells with inline edit
- Delete button per row
- Auto-calculated cells highlighted (subtle tint)

**Mobile View:**
- Card-based layout (one transaction per card)
- Collapsible details
- Swipe actions (delete, edit)
- Large touch targets

**Column Headers:**
- Bold text
- Sort indicators (if sortable)
- Tooltip with explanation
- Sticky on scroll

#### Calculator Component

**Layout:**
- 4 columns × 5 rows grid
- Equal-sized buttons
- Minimum 56×56px per button (mobile)
- 2px gap between buttons
- Contained in card/modal

**Button Styling:**
- Number buttons: White/light background
- Operator buttons: Primary color tint
- Clear/Delete: Warning color tint
- Equals: Success color
- Press animation: Scale 95%
- Ripple effect on touch
- Sound/haptic feedback (optional)

### 8.4 Interaction Design

**Animations:**
- Fade in: 200ms ease-in
- Slide in: 300ms ease-out
- Button press: 100ms
- Page transitions: 400ms
- Skeleton loading for data fetch
- Smooth number count-up for calculated values

**Hover Effects:**
- Color change: 150ms
- Background tint: 200ms
- Shadow elevation: 200ms
- Scale: 200ms
- Cursor: pointer on interactive elements

**Touch Interactions:**
- Tap: Immediate visual feedback
- Long press: Secondary actions (mobile)
- Swipe: Navigate, delete (cards)
- Pull to refresh: Transaction list
- Pinch to zoom: Not needed (use font size)

**Loading States:**
- Skeleton screens for initial load
- Spinner for button actions
- Progress bar for file operations
- Shimmer effect for placeholder content

### 8.5 Responsive Design

**Mobile (360px - 767px):**
- Single column layout
- Full-width inputs and buttons
- Card-based transaction display
- Bottom navigation bar
- Floating action button for new transaction
- Stack table columns vertically in cards

**Tablet (768px - 1023px):**
- Two-column layout where appropriate
- Wider inputs (max-width: 600px)
- Side navigation possible
- Table can show 4-5 key columns
- Remaining columns in expandable detail

**Desktop (1024px+):**
- Centered layout (max-width: 1440px)
- Full table view with all columns
- Sidebar navigation
- Multi-column forms
- Keyboard shortcuts enabled
- Hover states prominent

**Breakpoints:**
```
mobile: 640px
tablet: 768px
desktop: 1024px
wide: 1280px
ultrawide: 1536px
```

### 8.6 Theme System

**Light Mode (Default):**
- High contrast for readability
- White backgrounds
- Dark text
- Soft shadows
- Suitable for bright environments

**Dark Mode:**
- Reduced eye strain in low light
- Dark backgrounds (#0f172a)
- Light text (#f1f5f9)
- Elevated components lighter than background
- Reduced brightness overall
- Toggle in header/settings
- System preference detection
- Persisted in user settings

**Theme Toggle:**
- Sun/Moon icon
- Smooth transition (300ms)
- Remembers user preference
- Accessible keyboard shortcut

### 8.7 Glassmorphism Implementation

**Effect:**
- Semi-transparent background: `rgba(255, 255, 255, 0.1)` (dark mode)
- Backdrop blur: `blur(10px)`
- Border: 1px solid `rgba(255, 255, 255, 0.2)`
- Subtle shadow for depth
- Used for modals, cards, overlays

**Usage:**
- Calculator overlay
- Modal dialogs
- Floating cards
- Navigation bars (optional)
- Toast notifications

### 8.8 Accessibility Features

**Visual:**
- Font size controls (75% - 150%)
- High contrast mode option
- Color blind friendly palette
- Focus indicators (3px outline)
- Skip to main content link

**Keyboard Navigation:**
- Tab order logical and consistent
- Escape closes modals
- Enter submits forms
- Arrow keys navigate tables
- Keyboard shortcuts documented

**Screen Readers:**
- Semantic HTML elements
- ARIA labels on all controls
- ARIA live regions for dynamic content
- Alt text for all images
- Descriptive link text

**Touch:**
- Minimum 44×44px tap targets
- Adequate spacing (8px minimum)
- Visual press feedback
- No hover-only interactions
- Prevent accidental taps (confirmation for destructive actions)

---

## 9. Platform Specifications

### 9.1 Website (Web Application)

**URL Structure:**
- Production: `https://arothisab.com`
- Staging: `https://staging.arothisab.com`
- Development: `http://localhost:3000`

**Pages:**
1. Landing Page (public)
2. Features Page (public)
3. Pricing/Donation Page (public)
4. Login Page
5. Sign Up Page
6. Dashboard (main calculation interface)
7. Transaction History
8. Settings/Profile
9. Help/Documentation
10. About Us
11. Contact Us
12. Privacy Policy
13. Terms of Service

**Progressive Web App (PWA):**
- Installable on desktop and mobile
- Offline functionality
- Push notifications (optional)
- App-like experience
- Add to home screen prompt

**SEO Requirements:**
- Meta tags for all pages
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Bengali and English language tags
- Local business schema
- Fast page load (<2s)

### 9.2 Android Application

**Platform Requirements:**
- Minimum SDK: Android 8.0 (API 26)
- Target SDK: Latest stable (API 34+)
- Architecture: ARM64, ARMv7
- Size: <15 MB download

**Google Play Store:**
- Package name: `com.arothisab.app`
- Category: Business / Productivity
- Content rating: Everyone
- Supported languages: Bengali, English
- Screenshots: 8 required (Bengali and English)
- Feature graphic
- Privacy policy URL

**Android-Specific Features:**
- Adaptive icon
- Splash screen
- System theme detection
- Share functionality
- File picker integration
- Local notifications
- Background sync (optional)

**Permissions Required:**
- Storage (for export files)
- Internet (for data sync)
- Optional: Contacts (for buyer/seller import)

### 9.3 iOS Application

**Platform Requirements:**
- Minimum iOS: 13.0
- Target iOS: Latest stable (iOS 17+)
- Architecture: ARM64 (iPhone), Universal (iPad)
- Size: <15 MB download

**Apple App Store:**
- Bundle ID: `com.arothisab.app`
- Category: Business / Productivity
- Age rating: 4+
- Supported languages: Bengali, English
- Screenshots: Required for all device sizes
- Privacy policy URL
- App preview video (optional)

**iOS-Specific Features:**
- Adaptive icon
- Launch screen
- Dark mode support
- Share sheet integration
- Files app integration
- Siri shortcuts (future)
- Widgets (future)

**Permissions Required:**
- Storage/Files (for exports)
- Network (for data sync)
- Optional: Contacts (for import)

### 9.4 Admin Panel

**Purpose:**
Centralized management interface for system administrators

**Access:**
- URL: `https://admin.arothisab.com`
- Authentication: Supabase Auth with admin role
- Multi-factor authentication required

**Features:**

**User Management:**
- View all registered users
- Search/filter users
- View user activity logs
- Enable/disable accounts
- Reset user passwords
- View user statistics

**Analytics Dashboard:**
- Total users (daily, weekly, monthly)
- Active users
- Total transactions
- Revenue metrics (donations)
- Geographic distribution
- Device/platform usage
- Feature usage statistics
- User retention metrics

**Content Management:**
- Update help documentation
- Manage announcements
- Update FAQ
- Edit static pages
- Manage translations

**System Configuration:**
- Feature flags (enable/disable features)
- Maintenance mode toggle
- Rate limiting settings
- Default settings management
- API key management

**Support:**
- View user feedback/support tickets
- Respond to user queries
- Bug reports dashboard

**Reports:**
- Export user data
- Transaction reports
- Usage analytics
- Error logs
- Performance metrics

**Security:**
- Audit logs
- Failed login attempts
- Role-based access control
- IP whitelisting
- Session management

---

## 10. Data Structure

### 10.1 Database Schema (Supabase/PostgreSQL)

#### Table: `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique user identifier |
| created_at | timestamp | NOT NULL, DEFAULT now() | Account creation time |
| email | varchar(255) | UNIQUE | User email |
| phone | varchar(15) | UNIQUE | User phone number |
| full_name | varchar(100) | NOT NULL | User's full name |
| password_hash | varchar(255) | NOT NULL | Hashed password |
| language_preference | varchar(2) | DEFAULT 'bn' | 'bn' or 'en' |
| theme_preference | varchar(10) | DEFAULT 'light' | 'light' or 'dark' |
| font_size | varchar(10) | DEFAULT 'medium' | 'small', 'medium', 'large' |
| deduction_method | varchar(1) | DEFAULT 'A' | 'A' or 'B' |
| is_active | boolean | DEFAULT true | Account status |
| last_login | timestamp | NULL | Last login time |
| email_verified | boolean | DEFAULT false | Email verification status |
| phone_verified | boolean | DEFAULT false | Phone verification status |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_phone` on `phone`

---

#### Table: `transactions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique transaction ID |
| user_id | uuid | FOREIGN KEY users(id) | Owner of transaction |
| created_at | timestamp | NOT NULL, DEFAULT now() | Transaction time |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update time |
| seller_name | varchar(100) | NULL | Seller/supplier name |
| gross_weight_kg | numeric(10,3) | NOT NULL | Gross weight in kg |
| net_weight_kg | numeric(10,3) | NOT NULL | Net weight after deduction |
| deduction_method | varchar(1) | NOT NULL | 'A' or 'B' |
| rate_per_kg | numeric(10,2) | NOT NULL | Rate per kg in rupees |
| base_amount | numeric(12,2) | NOT NULL | Net weight × Rate |
| commission_percent | numeric(5,2) | DEFAULT 2.00 | Commission percentage |
| final_amount | numeric(12,2) | NOT NULL | With commission added |
| buyer_name | varchar(100) | NULL | Buyer name |
| buyer_address | text | NULL | Buyer address |
| notes | text | NULL | Additional notes |
| is_deleted | boolean | DEFAULT false | Soft delete flag |

**Indexes:**
- `idx_transactions_user_id` on `user_id`
- `idx_transactions_created_at` on `created_at DESC`
- `idx_transactions_seller` on `seller_name`
- `idx_transactions_buyer` on `buyer_name`

**Triggers:**
- `update_updated_at`: Auto-update `updated_at` on row change

---

#### Table: `saved_contacts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique contact ID |
| user_id | uuid | FOREIGN KEY users(id) | Owner of contact |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation time |
| contact_type | varchar(10) | NOT NULL | 'seller' or 'buyer' |
| name | varchar(100) | NOT NULL | Contact name |
| address | text | NULL | Contact address |
| phone | varchar(15) | NULL | Contact phone |
| notes | text | NULL | Additional notes |

**Indexes:**
- `idx_contacts_user_id` on `user_id`
- `idx_contacts_name` on `name`

---

#### Table: `daily_summaries`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique summary ID |
| user_id | uuid | FOREIGN KEY users(id) | User |
| date | date | NOT NULL | Summary date |
| total_transactions | integer | DEFAULT 0 | Count of transactions |
| total_gross_weight | numeric(12,3) | DEFAULT 0 | Sum of gross weights |
| total_net_weight | numeric(12,3) | DEFAULT 0 | Sum of net weights |
| total_base_amount | numeric(15,2) | DEFAULT 0 | Sum of base amounts |
| total_commission | numeric(15,2) | DEFAULT 0 | Sum of commissions |
| total_final_amount | numeric(15,2) | DEFAULT 0 | Sum of final amounts |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation time |

**Unique Constraint:** `(user_id, date)`

**Indexes:**
- `idx_summaries_user_date` on `(user_id, date DESC)`

---

#### Table: `donations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique donation ID |
| user_id | uuid | FOREIGN KEY users(id) | Donor user |
| created_at | timestamp | NOT NULL, DEFAULT now() | Donation time |
| amount | numeric(10,2) | NOT NULL | Donation amount |
| payment_method | varchar(50) | NULL | Payment method |
| transaction_id | varchar(100) | NULL | External transaction ID |
| status | varchar(20) | DEFAULT 'pending' | 'pending', 'completed', 'failed' |
| message | text | NULL | Donor message |

**Indexes:**
- `idx_donations_user_id` on `user_id`
- `idx_donations_created_at` on `created_at DESC`

---

#### Table: `feedback`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique feedback ID |
| user_id | uuid | FOREIGN KEY users(id) | User who submitted |
| created_at | timestamp | NOT NULL, DEFAULT now() | Submission time |
| type | varchar(20) | NOT NULL | 'bug', 'feature', 'support', 'other' |
| subject | varchar(200) | NOT NULL | Feedback subject |
| description | text | NOT NULL | Detailed description |
| status | varchar(20) | DEFAULT 'open' | 'open', 'in_progress', 'resolved', 'closed' |
| priority | varchar(10) | DEFAULT 'medium' | 'low', 'medium', 'high' |
| admin_notes | text | NULL | Admin response |

**Indexes:**
- `idx_feedback_user_id` on `user_id`
- `idx_feedback_status` on `status`

---

#### Table: `settings`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique setting ID |
| key | varchar(100) | UNIQUE, NOT NULL | Setting key |
| value | jsonb | NOT NULL | Setting value |
| description | text | NULL | Setting description |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update |

**Global Settings:**
- System maintenance mode
- Feature flags
- Default commission rate
- Supported languages
- App version info

---

### 10.2 Row Level Security (RLS) Policies

**Supabase RLS enabled on all tables**

**users table:**
- Users can read only their own record
- Users can update only their own record
- Admin can read/update all users

**transactions table:**
- Users can read only their own transactions
- Users can create transactions for themselves
- Users can update/delete only their own transactions
- Admin can read all transactions

**saved_contacts table:**
- Users can read only their own contacts
- Users can create/update/delete only their own contacts

**daily_summaries table:**
- Users can read only their own summaries
- System generates summaries (admin role)

**donations, feedback:**
- Users can read/create only their own records
- Admin can read all records

**settings:**
- All users can read
- Only admin can update

### 10.3 Data Relationships

```
users (1) ──────────────────> (N) transactions
users (1) ──────────────────> (N) saved_contacts
users (1) ──────────────────> (N) daily_summaries
users (1) ──────────────────> (N) donations
users (1) ──────────────────> (N) feedback
```

### 10.4 Data Validation Rules

**Gross Weight:**
- Minimum: 0.001 kg
- Maximum: 10,000 kg
- Precision: 3 decimal places
- Format: XX.XXX

**Rate per kg:**
- Minimum: ₹0.01
- Maximum: ₹10,000
- Precision: 2 decimal places
- Format: XXXX.XX

**Calculated Fields:**
- Auto-calculated, not directly editable
- Recalculated on input change
- Rounded to 2 decimal places

**Text Fields:**
- Names: 1-100 characters, UTF-8 support
- Addresses: 0-500 characters
- Notes: 0-1000 characters
- Trim whitespace
- Sanitize HTML

**Email:**
- Valid email format
- Lowercase normalized
- Unique constraint

**Phone:**
- Indian format: +91XXXXXXXXXX
- 10 digits required
- Unique constraint

### 10.5 Data Retention Policy

**Active Transactions:**
- Retained indefinitely
- Users can delete (soft delete)

**Deleted Transactions:**
- Soft delete (is_deleted = true)
- Permanently delete after 90 days
- Admin can restore within 90 days

**Daily Summaries:**
- Retained for 2 years
- Archived after 2 years

**User Accounts:**
- Active: Retained indefinitely
- Inactive (no login 365+ days): Email notification, then deactivate after 30 days
- Deleted accounts: Data retained 30 days, then permanently deleted

**Logs:**
- Error logs: 90 days
- Audit logs: 1 year
- Analytics: Aggregated indefinitely

### 10.6 Backup Strategy

**Automated Backups:**
- Full database backup: Daily at 2:00 AM IST
- Incremental backup: Every 6 hours
- Backup retention: 30 days
- Geographic redundancy: Multi-region

**Point-in-Time Recovery:**
- Available for 30 days
- Can restore to any point

**Export Options:**
- Users can export their own data anytime
- Format: JSON, CSV, Excel
- Includes all transactions and contacts

---

## 11. Security & Compliance

### 11.1 Authentication

**Methods:**
- Email + Password
- Phone + OTP (future)
- Google OAuth
- Apple Sign-In (iOS only)

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No common passwords (check against breach database)

**Account Security:**
- Email verification required
- Password reset via email
- Account lockout after 5 failed attempts (15-minute cooldown)
- Session timeout: 30 days (remember me) or 24 hours (default)
- Secure session storage
- HTTPS only

### 11.2 Authorization

**User Roles:**
1. **User (Default):** Access own data, create transactions
2. **Admin:** Full access, user management, system settings
3. **Support:** Read-only access, can respond to feedback

**Permission Model:**
- Role-based access control (RBAC)
- Granular permissions per table
- Supabase RLS policies enforce permissions
- API endpoints validate roles

### 11.3 Data Security

**Encryption:**
- In-transit: TLS 1.3 (HTTPS)
- At-rest: AES-256 encryption (Supabase default)
- Passwords: bcrypt hashing (cost factor 12)
- Sensitive data: Additional encryption layer

**API Security:**
- Rate limiting: 100 requests/minute per user
- API key rotation
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize inputs)
- CSRF protection

**Client-Side Security:**
- Content Security Policy (CSP)
- Secure cookie flags (HttpOnly, Secure, SameSite)
- No sensitive data in localStorage
- Sanitize user inputs before display

### 11.4 Privacy

**Data Collection:**
- Collect only necessary data
- Clear privacy policy
- User consent required
- No third-party data sharing without consent

**User Rights:**
- Access their data
- Export their data
- Delete their account and data
- Opt-out of analytics
- Control over data sharing

**Cookies:**
- Essential cookies only (session)
- Analytics cookies (optional, user consent)
- Cookie banner for GDPR compliance

### 11.5 Compliance

**Indian Data Protection:**
- Digital Personal Data Protection Act compliance (once enacted)
- Data stored in India (if required)
- User consent management

**International Standards:**
- GDPR-ready (for future expansion)
- WCAG 2.1 Level AA accessibility
- OWASP Top 10 security practices

**Payment Compliance:**
- PCI DSS compliance (for donations via payment gateway)
- Secure payment processing
- No credit card storage on our servers

### 11.6 Monitoring & Incident Response

**Security Monitoring:**
- Failed login attempts tracking
- Unusual activity detection
- Error logging and alerting
- Uptime monitoring
- Performance monitoring

**Incident Response:**
- Security incident playbook
- Breach notification within 72 hours
- User communication plan
- Regular security audits
- Penetration testing (annually)

---

## 12. Monetization Model

### 12.1 Free Access Model

**Core Philosophy:**
All features are 100% free for all users, forever.

**Rationale:**
- Target users have limited income (₹500-1,000/day)
- Charging fees would exclude majority of target market
- Social impact goal: Help small business owners
- Build goodwill and user base first

### 12.2 Voluntary Donation System

**Donation Page Features:**

**Why Donate Section:**
- Explain development and maintenance costs
- Show impact of donations (server costs, new features)
- Transparency in fund usage
- Success stories from users

**Donation Options:**
- One-time donation
- Amounts: ₹50, ₹100, ₹200, ₹500, Custom amount
- No minimum amount
- Payment methods:
  - UPI (PhonePe, Google Pay, Paytm)
  - Debit/Credit Card
  - Net Banking
  - International cards (future)

**Donation Benefits (Non-exclusive):**
- Public thank you (if donor consents)
- Badge on profile (optional)
- Name in "Supporters" page (optional)
- No feature restrictions based on donations
- All donors treated equally regardless of amount

**Transparency:**
- Monthly expense report published
- How donations are used
- Development roadmap

**User Communication:**
- Subtle donation prompt after 10 successful transactions
- Monthly newsletter mentions donation option
- In-app banner (dismissible, non-intrusive)
- No aggressive prompting or guilt tactics

### 12.3 Alternative Revenue (Future Consideration)

**Potential Future Revenue Streams:**
1. **Premium Features (Freemium):**
   - Advanced analytics
   - Bulk export options
   - Priority support
   - Multi-user accounts (for larger operations)
   - **Note:** Only if user base grows and demands these

2. **B2B Services:**
   - White-label solution for fish market associations
   - Integration with accounting software
   - API access for third-party developers

3. **Advertising (Last Resort):**
   - Only non-intrusive, relevant ads
   - Only if donations insufficient
   - User opt-out available

**Important:** Any future monetization must not compromise core free access or user experience.

### 12.4 Cost Structure

**Monthly Operating Costs (Estimated):**
- Supabase hosting: ~$25-50/month (scales with users)
- Vercel/Netlify hosting: Free tier initially, ~$20/month if needed
- Domain & SSL: ~$15/year
- Google Play Console: $25 one-time
- Apple Developer Program: $99/year
- Error monitoring (Sentry): Free tier initially
- Analytics: Free (Google Analytics)
- **Total:** ~$100-150/month + $125/year one-time

**Development Costs:**
- Initial development: Volunteer/owner-developed (no cost)
- Ongoing maintenance: 5-10 hours/month (owner time)
- Future paid development: Only if donations support it

**Break-Even:**
- Need ~50 donors at ₹100/month average
- Or 25 donors at ₹200/month
- Realistic target: 100 active users, 10% donate = 10 donors

---

## 13. Success Metrics

### 13.1 Key Performance Indicators (KPIs)

**User Acquisition:**
- New registrations per week: Target 50+
- Organic vs. paid acquisition ratio: 80/20
- Geographic distribution: 70%+ from West Bengal
- Cost per acquisition: <₹50 (if paid marketing)

**User Engagement:**
- Daily Active Users (DAU): Target 60% of registered users
- Transactions per user per day: Target 30+
- Average session duration: 15+ minutes
- Features used per session: 3+

**User Retention:**
- Day 1 retention: 70%+
- Day 7 retention: 50%+
- Day 30 retention: 40%+
- Monthly churn rate: <15%

**Product Usage:**
- Calculation accuracy: 99.9%+
- Transaction completion rate: 95%+
- Feature adoption rate: 70% for core features
- Language preference: 80%+ Bengali

**Technical Performance:**
- App crash rate: <0.5%
- API error rate: <1%
- Page load time: <2 seconds (95th percentile)
- Server uptime: 99.5%+

**User Satisfaction:**
- App store rating: 4.5+ stars
- Net Promoter Score (NPS): 50+
- Support ticket resolution time: <24 hours
- Feature request implementation: 10+ per quarter

**Business Metrics:**
- Monthly donations: Target ₹5,000+
- Donation conversion rate: 10% of active users
- Average donation amount: ₹150+
- Cost coverage: 80%+ of operating costs

### 13.2 Success Milestones

**Phase 1: Launch (Month 1-3)**
- 500+ registered users
- 10,000+ transactions processed
- 4.0+ app store rating
- <5% crash rate
- 50% DAU rate

**Phase 2: Growth (Month 4-6)**
- 2,000+ registered users
- 50,000+ transactions processed
- 4.3+ app store rating
- Feature parity across web/mobile
- First paid donations received

**Phase 3: Expansion (Month 7-12)**
- 5,000+ registered users
- 200,000+ transactions processed
- 4.5+ app store rating
- Break-even on operating costs
- Community of 100+ active donors

**Long-Term (Year 2+)**
- 20,000+ registered users
- 1M+ transactions processed
- Market leader in fish wholesale calculation tools
- Expansion to other states in India
- API for third-party integrations

### 13.3 Measurement & Analytics

**Tools:**
- Google Analytics 4 (web and mobile)
- Firebase Analytics (mobile)
- Supabase Analytics (database queries)
- Sentry (error tracking)
- Custom dashboard (admin panel)

**Tracking Events:**

**User Events:**
- Sign up (method: email/google/apple)
- Login
- Language change
- Theme change
- Font size change

**Transaction Events:**
- Transaction created
- Transaction edited
- Transaction deleted
- Calculation method changed
- Export transaction

**Feature Events:**
- Calculator used
- Contact saved
- Donation initiated
- Donation completed
- Feedback submitted

**Technical Events:**
- App crash
- API error
- Page load time
- Session duration
- Network errors

**Business Events:**
- Donation received
- Support ticket created
- Feature request submitted
- User referral (future)

### 13.4 A/B Testing

**Test Priorities:**
1. Onboarding flow optimization
2. Donation page variants
3. Language toggle placement
4. Calculator vs. keyboard input preference
5. Theme default (light vs. dark)

**Testing Framework:**
- Firebase Remote Config
- Google Optimize (web)
- Statistical significance: 95%+
- Minimum sample size: 1,000 users per variant
- Test duration: 2 weeks minimum

### 13.5 Reporting Cadence

**Daily:**
- Active users
- Transactions count
- Error rate
- Crash reports

**Weekly:**
- User acquisition
- Retention metrics
- Feature usage
- Support tickets

**Monthly:**
- Comprehensive KPI review
- Financial report (costs vs. donations)
- Product roadmap adjustment
- User feedback summary

**Quarterly:**
- Strategic review
- Major feature launches
- Market expansion planning
- Budget allocation

---

## 14. Timeline & Milestones

### 14.1 Development Phases

#### Phase 1: MVP Development (Weeks 1-8)

**Week 1-2: Planning & Design**
- Finalize PRD
- Create detailed wireframes
- Design system setup
- Database schema design
- Tech stack setup

**Week 3-4: Core Development**
- Authentication system
- Basic UI components
- Calculation engine
- Database setup
- API endpoints

**Week 5-6: Feature Development**
- Transaction table
- Auto-calculation
- Bilingual support
- Font size adjustment
- Dark/Light theme

**Week 7: Testing & Refinement**
- Unit testing
- Integration testing
- User acceptance testing (UAT)
- Bug fixes
- Performance optimization

**Week 8: Launch Preparation**
- App store submissions
- Documentation
- Marketing materials
- Beta testing with real users
- Final QA

**Deliverables:**
- Functional web application
- Android app (beta)
- iOS app (beta)
- Basic admin panel
- Documentation

---

#### Phase 2: Launch & Feedback (Weeks 9-12)

**Week 9: Soft Launch**
- Limited release (100 users)
- Monitor usage patterns
- Gather initial feedback
- Fix critical bugs

**Week 10-11: Iteration**
- Implement feedback
- Improve UX based on data
- Optimize performance
- Enhance features

**Week 12: Public Launch**
- Full release on all platforms
- Marketing push
- Press release
- Community outreach

**Deliverables:**
- Stable v1.0 release
- App store listings
- Launch marketing materials
- User documentation

---

#### Phase 3: Growth & Enhancement (Months 4-6)

**Month 4:**
- Transaction history feature
- Export functionality (PDF/Excel)
- Calculator component enhancement
- Performance optimization

**Month 5:**
- Saved contacts feature
- Daily summary reports
- Enhanced analytics
- Bug fixes and stability

**Month 6:**
- Offline mode
- Advanced settings
- User profiles
- Feature polish

**Deliverables:**
- v1.5 with enhanced features
- Improved performance
- Expanded documentation
- User case studies

---

#### Phase 4: Expansion (Months 7-12)

**Month 7-9:**
- Multi-user support (for larger operations)
- WhatsApp integration for sharing
- Voice input (Bengali)
- Regional language expansion

**Month 10-12:**
- API for third-party integration
- Widget for quick access
- Advanced analytics dashboard
- Premium features (optional)

**Deliverables:**
- v2.0 major release
- API documentation
- Partnership integrations
- Market expansion

---

### 14.2 Resource Requirements

**Team (Minimum):**
- 1 Full-stack Developer (React/React Native/Supabase)
- 1 UI/UX Designer (part-time)
- 1 QA Tester (part-time)
- 1 Bengali translator (part-time)
- 1 Product Manager/Owner

**Optional:**
- 1 Marketing specialist
- 1 Support staff (as user base grows)

**Tools & Services:**
- Design: Figma (free tier)
- Development: VS Code, Git, GitHub
- Project management: Linear/Notion
- Communication: Slack/Discord
- Testing: Playwright, Jest, React Testing Library

### 14.3 Risk Mitigation

**Technical Risks:**
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Supabase downtime | High | Low | Multiple backups, status monitoring |
| App store rejection | High | Medium | Follow guidelines strictly, pre-review |
| Calculation errors | Critical | Low | Extensive testing, user verification |
| Poor performance | Medium | Medium | Performance monitoring, optimization |
| Security breach | Critical | Low | Security audit, best practices |

**Business Risks:**
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | User research, iterative improvement |
| Insufficient donations | Medium | High | Cost optimization, alternative revenue |
| Competition | Medium | Low | Unique features, local focus |
| Regulatory changes | Medium | Low | Legal compliance, flexibility |

**Operational Risks:**
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Developer unavailability | High | Medium | Documentation, knowledge sharing |
| Support overload | Medium | Medium | Self-service docs, community forum |
| Server costs exceed budget | High | Medium | Usage monitoring, tier upgrades |

---

## 15. Appendix

### 15.1 Glossary

**Bengali Terms:**
- **Macher Arot (মাছের আড়ত):** Fish wholesale market
- **Mot Ojon (মোট ওজন):** Gross weight
- **Bad Ojon:** Weight deduction
- **Dor (দর):** Rate/price per kg
- **Malik:** Owner

**Technical Terms:**
- **PWA:** Progressive Web App
- **RLS:** Row Level Security
- **API:** Application Programming Interface
- **MVP:** Minimum Viable Product
- **KPI:** Key Performance Indicator
- **DAU:** Daily Active Users

### 15.2 References

**Design Resources:**
- Material Design: https://m3.material.io/
- Tailwind CSS: https://tailwindcss.com/
- Shadcn/ui: https://ui.shadcn.com/
- Noto Sans Bengali Font: https://fonts.google.com/noto/specimen/Noto+Sans+Bengali

**Technical Documentation:**
- Supabase: https://supabase.com/docs
- React: https://react.dev/
- React Native: https://reactnative.dev/
- Next.js: https://nextjs.org/docs

**Standards:**
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- OWASP Top 10: https://owasp.org/www-project-top-ten/

### 15.3 Wireframes Reference

*(To be added in separate design document)*

**Key Screens:**
1. Landing Page
2. Login/Signup
3. Dashboard (Main Calculation Interface)
4. Transaction Table
5. Settings
6. Donation Page
7. Mobile Views

### 15.4 Calculation Examples

**Example 1: Method A (Total Weight Deduction)**

Input:
- Gross Weight: 15.700 kg
- Rate: ₹120 per kg

Calculation:
1. Net Weight = 15.700 × 0.95 = 14.915 kg
2. Base Amount = 14.915 × 120 = ₹1,789.80
3. Final Amount = 1,789.80 × 1.02 = ₹1,825.60

**Example 2: Method B (Kg Only Deduction)**

Input:
- Gross Weight: 15.700 kg (15 kg + 700 grams)
- Rate: ₹120 per kg

Calculation:
1. Kg after deduction = 15 × 0.95 = 14.25 kg
2. Net Weight = 14.25 + 0.700 = 14.950 kg
3. Base Amount = 14.950 × 120 = ₹1,794.00
4. Final Amount = 1,794.00 × 1.02 = ₹1,829.88

**Difference:** Method B yields ₹4.28 more in this example

### 15.5 Competitive Analysis

**Direct Competitors:**
- None identified (niche market)

**Indirect Competitors:**
- Generic calculators (Google Calculator, phone calculator)
- Excel/spreadsheet apps
- Accounting apps (not specialized)

**Competitive Advantages:**
- Purpose-built for fish wholesale market
- Automated multi-step calculations
- Bilingual interface (Bengali native)
- Free forever model
- Mobile-optimized for market environment
- No learning curve for calculations

### 15.6 User Feedback Channels

**In-App:**
- Feedback form
- Rating prompt (after 7 days of use)
- Bug report option

**External:**
- Email: support@arothisab.com
- WhatsApp: +91-XXXXXXXXXX (future)
- Facebook page (future)
- App store reviews

**Community:**
- User forum (future)
- Telegram group (future)
- YouTube tutorials (future)

### 15.7 Legal Pages

**Required:**
1. Privacy Policy
2. Terms of Service
3. Cookie Policy
4. Refund Policy (for donations)
5. GDPR Compliance Statement (future)

**Templates:** Use Termly or similar service for generation

### 15.8 Marketing Strategy (High-Level)

**Pre-Launch:**
- Create landing page
- Build email list
- Social media presence
- Local market outreach

**Launch:**
- Press release (Bengali media)
- Social media campaign
- Word-of-mouth in markets
- Free workshops/demos

**Post-Launch:**
- User testimonials
- Case studies
- Referral program
- Content marketing (blog posts about fish trade)

**Channels:**
- Facebook (primary)
- WhatsApp groups
- Local fish market associations
- Agricultural extension offices
- YouTube tutorials

### 15.9 Support Strategy

**Self-Service:**
- FAQ page
- Video tutorials
- Step-by-step guides
- Troubleshooting docs

**Assisted Support:**
- Email support (response within 24 hours)
- In-app chat (future)
- Phone support (future, for premium/large users)

**Community Support:**
- User forum
- Peer-to-peer help
- Power user program

### 15.10 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-11 | Initial PRD draft | Product Team |

---

## Document Approval

**Prepared by:** [Product Manager Name]  
**Reviewed by:** [Technical Lead Name]  
**Approved by:** [Stakeholder Name]  
**Date:** February 11, 2026

---

**Next Steps:**
1. Review and approve PRD
2. Create detailed wireframes and mockups
3. Set up development environment
4. Begin Phase 1 development
5. Schedule weekly check-ins

---

*End of Product Requirements Document*