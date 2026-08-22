# GlobeTrotter Frontend Enhancement Specification & Task Tracker

## 1. Vision & Design Principles
- **Modern & Minimalist**: Clean, contemporary design with breathing room, tailored typography (Geist/Inter), neutral color foundations with vibrant teal/emerald travel accents.
- **Consistency**: Unified button styles, card shadows, responsive layouts, and consistent spacing across all 13 routes.
- **Micro-interactions**: Smooth transitions, drag-to-reorder feedback, instant filter updates, and interactive charts.
- **Reliability & Offline-Readiness**: Full support for both live backend and rich mock data engine.

---

## 2. All 13 Core Routes & Screen Inventory

| Route | Page Component | Status / Scope |
|:---|:---|:---|
| `1. /`, `/login`, `/signup` | `AuthModal.jsx` / `Login.jsx` / `Signup.jsx` | Unified auth toggle, brand hero, validation |
| `2. /dashboard` | `Dashboard.jsx` | Personalized welcome, quick stats, trip cards, destination carousel, budget highlights |
| `3. /trips` | `MyTrips.jsx` & `TripCard.jsx` | Full trip management, search/sort filters, delete modal, share button |
| `4. /trips/create`, `/trips/new` | `CreateTrip.jsx` | Focused multi-step form, date validation, cover photo upload & presets |
| `5. /trips/:id/itinerary`, `/trips/:id/edit` | `ItineraryBuilder.jsx` | Split layout, drag-to-reorder stops, expandable activity cards, quick add |
| `6. /trips/:id/view`, `/trips/:id` | `ItineraryView.jsx` | Toggleable Calendar & Day-by-Day view modes, cost breakdowns, share link |
| `7. /cities/search`, `/cities` | `CitySearch.jsx` | Real-time discovery, region & vibe filters, cost tier slider, comparison tray |
| `8. /activities/search`, `/activities` | `ActivitySearch.jsx` | Contextual activity discovery, category filters, duration/cost, quick-view modal |
| `9. /trips/:id/budget` | `Budget.jsx` | Pie chart by category, daily bar chart, overbudget alerts, inline threshold editing |
| `10. /trips/:id/timeline` | `Timeline.jsx` | Interactive day/span calendar, hour-by-hour view, drag reorder between days |
| `11. /trips/:id/share`, `/share/:shareId` | `PublicShare.jsx` | Read-only public itinerary, social sharing triggers, copy trip duplicate flow |
| `12. /profile` | `Profile.jsx` | User settings, avatar upload, timezone & language, saved wishlist destinations |
| `13. /admin/analytics`, `/admin` | `AdminDashboard.jsx` | Platform stats, user growth, top cities/activities rankings, service health |

---

## 3. Phased Execution Roadmap

- `[ ]` **Enhancement Phase 1: Route Aliases, Design System & Layout Polish**
  - Update `App.jsx` to support all 13 canonical URL paths and aliases (e.g. `/trips/create`, `/trips/:id/itinerary`, `/trips/:id/view`, `/trips/:id/share`, `/admin/analytics`)
  - Add Breadcrumbs and Context Navigation for nested trip pages

- `[ ]` **Enhancement Phase 2: Itinerary Builder (`/trips/:id/itinerary` & `/trips/:id/edit`)**
  - Two-panel split layout: left navigation of stops, main canvas for stop & activity editing
  - Stop management: add stop, drag-to-reorder stops, date pickers
  - Activity management: add activity, category tagging, cost/duration inputs, inline removal

- `[ ]` **Enhancement Phase 3: Itinerary View (`/trips/:id/view` & `/trips/:id`)**
  - Multi-mode display: Toggle between **Calendar View** (color-coded grid) and **Day-by-Day List View**
  - Cost rollup badges, export/print view, share quick action, edit button

- `[ ]` **Enhancement Phase 4: Contextual Activity Discovery (`/activities/search` & `/activities`)**
  - City/stop header context with filter controls (Sightseeing, Food, Adventure, Transport, Stay)
  - Cost range slider, duration filter, search input
  - Activity cards with Add to Stop button and quick-view detail modal

- `[ ]` **Enhancement Phase 5: Trip Budget & Cost Breakdown (`/trips/:id/budget`)**
  - Summary KPI cards: Total estimated cost, average cost/day, remaining budget
  - Visual charts: Recharts Pie chart (by category) and Bar chart (by day)
  - Overbudget alerts with warning badges
  - Currency selector (USD, EUR, GBP, JPY, INR) and inline daily budget adjustments

- `[ ]` **Enhancement Phase 6: Interactive Timeline & Calendar (`/trips/:id/timeline`)**
  - Full trip span interactive timeline calendar
  - Expandable day cards with scheduled activities
  - Hour-by-hour vertical day itinerary view
  - Drag-and-drop reorder across days

- `[ ]` **Enhancement Phase 7: Public Itinerary & Social Sharing (`/trips/:id/share` & `/share/:shareId`)**
  - Read-only public showcase with trip cover, cities visited summary, and budget rollup
  - "Copy This Trip" duplicate action for logged-in travelers
  - 1-click social sharing (Twitter/X, Facebook, WhatsApp, Email, Native Clipboard)
  - Interactive view counter

- `[ ]` **Enhancement Phase 8: Final UI/UX Consistency, Polish & Micro-Animations**
  - Verify seamless navigation across all 13 routes
  - Polish empty states, loading skeletons, tooltips, and toast feedback
  - Final production build verification and clean merge into `main`
