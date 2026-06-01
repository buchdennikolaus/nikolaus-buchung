# Nikolaus Booking System - Clickable Prototype

A fully functional front-end prototype for booking Nikolaus visits, designed for the Kolping family organization.

## Features

### User Flow
1. **Landing Page** - Event overview and available dates
2. **Family Data Form** - Contact information with dynamic duration calculation
3. **Time Slot Selection** - Interactive slot booking with availability indicators
4. **Confirmation** - Review booking details before submission
5. **Success** - Booking confirmation with next steps

### Admin Dashboard
- View all bookings in a sortable table
- Filter by date
- Search by name or address
- Assign teams to visits
- Track Word document receipt
- Add internal notes

## How to Use

### Run the Prototype
1. Open `index.html` in a web browser
2. The landing page will appear automatically

### Complete a Booking
1. Click "Termin buchen" on landing page
2. Fill in family contact details
3. Enter number of children (duration calculated automatically)
4. Select an available time slot (Dec 5 or Dec 6)
5. Review and confirm booking details
6. View success page with confirmation

### Access Admin Dashboard
- Navigate to `index.html#admin` in the browser
- OR append `#admin` to the URL while viewing the prototype

## Design Guidelines

### Colors
- **Primary**: Orange (#f05a00) - used for buttons, highlights, and active states
- **Secondary**: Black/Dark Grey (#2c2c2c) - text and structure
- **Background**: White (#ffffff) - clean, professional look

### Style Philosophy
- Clean, minimal, professional
- No Christmas kitsch (no snowflakes, cartoons)
- Friendly but structured (association/organization style)
- Sans-serif typography for modern readability
- Large spacing and clear sections

## Technical Details

### Duration Logic
- 1-3 children → 20 minutes
- 4-6 children → 40 minutes
- 7+ children → 60 minutes

### Time Slots
- Available times: 17:00 - 20:00
- Interval: 20 minutes
- Simulated availability:
  - **Available**: Slot can be booked
  - **Limited**: Few spots remaining (shown with yellow border)
  - **Full**: Fully booked (disabled)

### Slot Availability Simulation
The prototype simulates realistic booking patterns:
- Early slots (17:00-18:00): More popular, 30% available
- Peak time (18:00-19:00): Most booked, 20% available  
- Late slots (19:00-20:00): Better availability, 50% available

## Mock Data

The admin dashboard includes 8-12 pre-generated mock bookings to demonstrate functionality:
- Random German names and addresses
- Mixed dates (Dec 5 & 6)
- Various time slots
- Different numbers of children
- Random team assignments and document status

## Browser Compatibility

Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

- **Mobile-first** approach
- Optimized for screens from 320px to 1920px
- Touch-friendly interface elements
- Adaptive grid layouts

## Limitations (By Design)

This is a **clickable prototype**, not a production system:

### Not Included
- ❌ No backend or API integration
- ❌ No real data persistence
- ❌ No authentication/authorization
- ❌ No email sending functionality
- ❌ No actual file downloads
- ❌ No real-time slot availability checking

### Simulated Features
- ✅ State management (in-memory only)
- ✅ Form validation (HTML5)
- ✅ Mock data generation
- ✅ Realistic UI/UX flow
- ✅ Interactive elements

## Purpose

This prototype is designed to:
1. Demonstrate the booking flow to stakeholders
2. Validate UI/UX design decisions
3. Gather feedback before development
4. Showcase realistic slot constraints
5. Align expectations on system behavior

## Files Structure

```
src/
├── index.html      # Main HTML with all screens
├── styles.css      # Complete styling (Kolping design)
├── app.js          # Application logic and state management
└── README.md       # This file
```

## Next Steps for Production

If moving to production, consider:
1. Backend API for booking management
2. Database for persistent storage
3. Email notification system
4. User authentication for admin access
5. Real-time slot availability
6. Payment integration (if needed)
7. Calendar integration
8. PDF/Word template generation
9. SMS notifications
10. Conflict resolution for overlapping bookings

## Support

For questions or modifications, contact the project owner: Timothy Kaufmann

---

**Version**: 1.0  
**Date**: 2026-04-24  
**Status**: Prototype Complete