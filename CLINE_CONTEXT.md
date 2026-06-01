# Cline Context - Project K

> **Quick reference for Cline when continuing this project on a new PC**

## Project Summary

**Name**: Project K - Nikolaus Booking System Prototype  
**Started**: 2026-04-24  
**Status**: ✅ Complete and functional  
**Type**: Clickable front-end prototype (no backend)

## What This Project Is

A fully functional booking system prototype for Nikolaus/Krampus visits organized by a Kolping family. This is a **demonstration/stakeholder tool**, not a production system.

### Technology Stack
- **Frontend**: Pure HTML/CSS/JavaScript
- **No Backend**: All logic runs in browser
- **No Database**: Uses in-memory state and mock data
- **Design**: Kolping branding (Orange #f05a00, Black, White)

### Key Features Implemented
1. ✅ 5-screen user booking flow
2. ✅ Admin dashboard with mock data
3. ✅ Dynamic duration calculation (20/40/60 min based on children count)
4. ✅ Realistic slot availability simulation (17:00-20:00, 20-min intervals)
5. ✅ Mobile-responsive design
6. ✅ Form validation
7. ✅ Professional, clean UI (no Christmas kitsch)

## File Structure

```
Project_K/
├── src/
│   ├── index.html      # Complete 6-screen application (415 lines)
│   ├── styles.css      # Kolping design system (650 lines)
│   ├── app.js          # Application logic (460 lines)
│   └── README.md       # Technical documentation
│
├── docs/
│   ├── STAKEHOLDER_GUIDE.md   # Presentation guide for reviewers
│   └── .gitkeep
│
├── deliverables/
│   ├── SHARING_GUIDE.md                   # How to distribute prototype
│   ├── Nikolaus-Booking-Prototype.zip     # Ready-to-share package
│   └── .gitkeep
│
├── README.md              # Project overview and objectives
├── TASKS_LOG.md          # Complete work history and decisions
├── TRANSFER_GUIDE.md     # How to move between PCs
└── CLINE_CONTEXT.md      # This file
```

## Design Requirements (CRITICAL)

**Color Palette**:
- Primary: Orange `#f05a00` (buttons, highlights, active states ONLY)
- Secondary: Black/Dark Grey `#2c2c2c` (text, structure)
- Background: White `#ffffff`

**Design Philosophy**:
- ✅ Clean, minimal, professional
- ✅ Friendly but structured (association style)
- ✅ Modern sans-serif typography
- ✅ Large spacing, clear sections
- ❌ NO Christmas kitsch (no snowflakes, no cartoons, no red/green)

## Business Logic

### Duration Calculation
```javascript
1-3 children   → 20 minutes
4-6 children   → 40 minutes
7+ children    → 60 minutes
```

### Time Slots
- **Available times**: 17:00 - 20:00
- **Interval**: 20 minutes (17:00, 17:20, 17:40, etc.)
- **Dates**: December 5 & 6, 2026

### Slot Availability Patterns
Simulates realistic booking behavior:
- Early slots (17:00-18:00): 30% available (popular)
- Peak time (18:00-19:00): 20% available (most booked)
- Late slots (19:00-20:00): 50% available (better availability)

## User Flow

1. **Landing** → Event info, dates, CTA button
2. **Form** → Family data + children count (triggers duration calc)
3. **Slots** → Visual slot picker with availability indicators
4. **Confirm** → Review all details before booking
5. **Success** → Confirmation with next steps
6. **Admin** → Hidden dashboard (URL + #admin)

## Admin Features

- View all bookings (8-12 mock entries)
- Filter by date (Dec 5 or 6)
- Search by name/address
- Assign teams (Team 1, 2, 3)
- Track Word document receipt (checkbox)
- Internal notes per booking

## Important Context for Modifications

### What This Prototype Does
- ✅ Demonstrates complete UX flow
- ✅ Simulates realistic slot constraints
- ✅ Shows stakeholders the intended experience
- ✅ Mobile-responsive and touch-friendly

### What This Prototype Does NOT Do
- ❌ No real backend/API
- ❌ No data persistence (refreshes on reload)
- ❌ No email sending (simulated)
- ❌ No authentication (admin open)
- ❌ No real-time availability checks
- ❌ No file downloads (alert only)

### Critical Constraints
1. **Must remain functional without backend**
2. **All changes must maintain Kolping design**
3. **Orange used ONLY for CTAs and highlights**
4. **No Christmas decorations or themes**
5. **Keep mobile-first responsive**

## Testing the Prototype

1. Open `src/index.html` in browser
2. Complete booking flow:
   - Click "Termin buchen"
   - Fill form with test data
   - Select children (watch duration update)
   - Pick available slot
   - Review confirmation
   - See success page
3. Test admin: Add `#admin` to URL
4. Test mobile: Resize browser or use DevTools

## Common Tasks You Might Be Asked

### Adding New Features
- Read `src/app.js` for state management structure
- Follow existing patterns for consistency
- Update `styles.css` using Kolping colors
- Test on mobile after changes

### Modifying Design
- Colors defined in `:root` in `styles.css`
- Use `var(--primary-orange)` for orange
- Check responsive breakpoints (@media queries)
- Maintain professional, clean aesthetic

### Changing Business Logic
- Duration calc: `app.calculateDuration()` in `app.js`
- Slot generation: `app.generateTimeSlots()`
- Availability: `app.getSlotAvailability()`
- All logic is client-side JavaScript

### Adding Content
- German language throughout
- Professional, clear communication
- No marketing fluff, just facts
- Check existing text for tone

## File Reading Priority

When asked to work on this project, read in this order:

1. **This file** (CLINE_CONTEXT.md) - Overview
2. **README.md** - Project objectives and features
3. **TASKS_LOG.md** - Work history and decisions made
4. **src/README.md** - Technical implementation details

Then read specific files based on task:
- Modifying UI? → Read `src/styles.css`
- Changing logic? → Read `src/app.js`
- Understanding flow? → Read `src/index.html`

## Key Decisions Made

1. **No backend by design** - Stakeholder demo tool only
2. **Kolping colors strict** - Orange only for highlights
3. **Mock data included** - 8-12 bookings for demo
4. **Slot simulation** - Realistic patterns, not random
5. **Mobile-first** - Touch-friendly from start
6. **German language** - Target audience
7. **Professional tone** - Association, not consumer app

## Stakeholder Feedback Context

**Purpose**: Demonstrate booking flow before building real system

**Questions to address**:
- Is the flow intuitive?
- Do slot constraints make sense?
- Is admin dashboard sufficient?
- What about cancellations? (not in scope)
- How to handle conflicts? (production concern)

**Known Limitations** (by design):
- Temporary data only
- No routing optimization
- No team calendars
- No conflict resolution
- No authentication

## Version History

- **v1.0** (2026-04-24): Initial prototype complete
  - All screens implemented
  - Admin dashboard functional
  - Ready for stakeholder review
  - Shareable via ZIP or OneDrive

## Next Steps (If Continuing Development)

**If moving to production**:
1. Backend API design
2. Database schema
3. Authentication system
4. Email notifications
5. Real-time availability
6. Conflict resolution
7. Team calendar integration

**If improving prototype**:
1. Add more mock scenarios
2. Enhance admin filtering
3. Add print/export features
4. Improve mobile UX
5. Add more instructions

## Quick Commands

**Test prototype**:
```bash
start src/index.html
```

**Create new share package**:
```powershell
Compress-Archive -Path "src\*" -DestinationPath "deliverables\Nikolaus-Booking-Prototype.zip" -Force
```

**View project structure**:
```bash
tree /F
```

## Contact

**Project Owner**: Timothy Kaufmann  
**AI Assistant**: Cline (Claude 3.5 Sonnet)  
**Organization**: Kolping family  

---

## For Cline: Quick Start Prompt

When you first load this project on a new PC, I (the user) might say:

```
"This is Project K that we worked on before. 
Please review CLINE_CONTEXT.md to understand the project."
```

Your response should include:
1. Acknowledge you've read the context
2. Summarize the project (Nikolaus booking prototype)
3. Confirm current status (complete and functional)
4. Ask what I'd like to work on next

**You should NOT**:
- Assume you need to rebuild anything
- Suggest major architecture changes
- Recommend adding backend (it's intentionally front-end only)
- Change the Kolping design colors

**Remember**: This is a demonstration tool, not a production system. Keep it simple, functional, and focused on stakeholder presentation.

---

*Last Updated: 2026-04-29*  
*For use with Cline AI Assistant on multiple PCs*